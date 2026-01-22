// Lovable Cloud Function: Import products into Shopify from a Shopify-style CSV export.
//
// Expects JSON body: { csv: string, dryRun?: boolean }
// Uses Shopify Admin REST API via SHOPIFY_ACCESS_TOKEN.

type Json = Record<string, unknown>;

function json(status: number, body: Json) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    },
  });
}

function normalizeBoolean(v: string | undefined) {
  return (v ?? "").trim().toLowerCase() === "true";
}

function toNumber(v: string | undefined) {
  const n = Number((v ?? "").trim());
  return Number.isFinite(n) ? n : null;
}

// Minimal CSV parser supporting quoted fields with commas and newlines.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let i = 0;
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };

  const pushRow = () => {
    // Avoid trailing empty row
    if (row.length === 1 && row[0] === "") {
      row = [];
      return;
    }
    rows.push(row);
    row = [];
  };

  while (i < text.length) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        const next = text[i + 1];
        if (next === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += c;
      i += 1;
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }

    if (c === ",") {
      pushField();
      i += 1;
      continue;
    }

    if (c === "\n") {
      pushField();
      pushRow();
      i += 1;
      continue;
    }

    if (c === "\r") {
      // Ignore CR (Windows newlines)
      i += 1;
      continue;
    }

    field += c;
    i += 1;
  }

  // flush
  pushField();
  if (row.length) pushRow();

  return rows;
}

function uniq<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  // Store domain is not sensitive; keep it in code for reliability.
  const SHOP = "web-project-hub-rvqbw.myshopify.com";
  const ADMIN_TOKEN = Deno.env.get("SHOPIFY_ACCESS_TOKEN") ?? "";
  const API_VERSION = "2025-07";

  if (!ADMIN_TOKEN) {
    return json(500, {
      error: "Missing SHOPIFY_ACCESS_TOKEN secret",
    });
  }

  let body: { csv?: string; dryRun?: boolean; sourceUrl?: string };
  try {
    body = (await req.json()) as { csv?: string; dryRun?: boolean; sourceUrl?: string };
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  let csvText = body.csv;
  if ((!csvText || typeof csvText !== "string") && body.sourceUrl) {
    try {
      const res = await fetch(body.sourceUrl);
      if (!res.ok) return json(400, { error: `Failed to fetch sourceUrl: HTTP ${res.status}` });
      csvText = await res.text();
    } catch (e) {
      return json(400, { error: `Failed to fetch sourceUrl: ${String(e)}` });
    }
  }

  // Fallback: bundled CSV file (useful for one-off imports).
  if (!csvText || typeof csvText !== "string") {
    try {
      const fileUrl = new URL("./products_export_1.csv", import.meta.url);
      csvText = await Deno.readTextFile(fileUrl.pathname);
    } catch {
      // ignore
    }
  }

  if (!csvText || typeof csvText !== "string") return json(400, { error: "Missing csv or sourceUrl" });

  const dryRun = Boolean(body.dryRun);

  const rows = parseCsv(csvText);
  if (rows.length < 2) return json(400, { error: "CSV has no data rows" });

  const header = rows[0].map((h, idx) => {
    const cleaned = (h ?? "").trim();
    return idx === 0 ? cleaned.replace(/^\uFEFF/, "") : cleaned;
  });

  const index = (name: string) => header.indexOf(name);

  const idx = {
    handle: index("Handle"),
    title: index("Title"),
    bodyHtml: index("Body (HTML)"),
    vendor: index("Vendor"),
    type: index("Type"),
    tags: index("Tags"),
    published: index("Published"),
    opt1Name: index("Option1 Name"),
    opt1Value: index("Option1 Value"),
    opt2Name: index("Option2 Name"),
    opt2Value: index("Option2 Value"),
    opt3Name: index("Option3 Name"),
    opt3Value: index("Option3 Value"),
    sku: index("Variant SKU"),
    grams: index("Variant Grams"),
    invTracker: index("Variant Inventory Tracker"),
    invQty: index("Variant Inventory Qty"),
    invPolicy: index("Variant Inventory Policy"),
    fulfillment: index("Variant Fulfillment Service"),
    price: index("Variant Price"),
    compareAt: index("Variant Compare At Price"),
    requiresShipping: index("Variant Requires Shipping"),
    taxable: index("Variant Taxable"),
    imgSrc: index("Image Src"),
    imgPosition: index("Image Position"),
    imgAlt: index("Image Alt Text"),
    seoTitle: index("SEO Title"),
    seoDescription: index("SEO Description"),
    status: index("Status"),
  };

  const required = [idx.handle, idx.title, idx.bodyHtml, idx.vendor, idx.type, idx.tags, idx.opt1Name, idx.opt1Value, idx.sku, idx.price, idx.imgSrc];
  if (required.some((n) => n < 0)) {
    return json(400, {
      error: "CSV header missing required columns",
      headerSample: header.slice(0, 40),
      missing: Object.entries(idx)
        .filter(([, v]) => v < 0)
        .map(([k]) => k),
    });
  }

  type Row = Record<keyof typeof idx, string>;
  const dataRows: Row[] = rows
    .slice(1)
    .filter((r) => (r[idx.handle] ?? "").trim().length > 0)
    .map((r) => {
      const out = {} as Row;
      (Object.keys(idx) as Array<keyof typeof idx>).forEach((k) => {
        out[k] = (r[idx[k]] ?? "").trim();
      });
      return out;
    });

  const handles = uniq(dataRows.map((r) => r.handle));

  const endpoint = (path: string) => `https://${SHOP}/admin/api/${API_VERSION}${path}`;

  const created: Array<{ handle: string; productId?: number; skipped?: boolean; error?: string }> = [];

  for (const handle of handles) {
    const rowsForHandle = dataRows.filter((r) => r.handle === handle);
    const base = rowsForHandle.find((r) => r.title) ?? rowsForHandle[0];

    const optionNames = [base.opt1Name, base.opt2Name, base.opt3Name].filter(Boolean);

    const variants = rowsForHandle
      .filter((r) => Boolean(r.sku) || Boolean(r.price))
      .map((r) => {
        const inventory_management = r.invTracker.toLowerCase() === "shopify" ? "shopify" : null;
        const inventory_quantity = toNumber(r.invQty);
        const grams = toNumber(r.grams);

        return {
          option1: r.opt1Value || null,
          option2: r.opt2Value || null,
          option3: r.opt3Value || null,
          price: r.price || "0",
          compare_at_price: r.compareAt || null,
          sku: r.sku || null,
          grams: grams ?? undefined,
          taxable: normalizeBoolean(r.taxable),
          requires_shipping: normalizeBoolean(r.requiresShipping),
          inventory_management,
          inventory_policy: r.invPolicy || "deny",
          fulfillment_service: r.fulfillment || "manual",
          ...(inventory_management && inventory_quantity !== null ? { inventory_quantity } : {}),
        };
      });

    const images = rowsForHandle
      .filter((r) => Boolean(r.imgSrc))
      .map((r) => ({
        src: r.imgSrc,
        position: toNumber(r.imgPosition) ?? undefined,
        alt: r.imgAlt || undefined,
      }))
      // de-dupe by src
      .filter((img, i, arr) => arr.findIndex((x) => x.src === img.src) === i);

    const tags = base.tags
      ? base.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .join(", ")
      : "";

    const payload = {
      product: {
        title: base.title,
        body_html: base.bodyHtml,
        vendor: base.vendor || undefined,
        product_type: base.type || undefined,
        tags: tags || undefined,
        handle,
        status: (base.status || "active").toLowerCase(),
        published: normalizeBoolean(base.published),
        options: optionNames.map((name) => ({ name })),
        variants,
        images,
        metafields_global_title_tag: base.seoTitle || undefined,
        metafields_global_description_tag: base.seoDescription || undefined,
      },
    };

    if (dryRun) {
      created.push({ handle, skipped: true });
      continue;
    }

    try {
      const res = await fetch(endpoint("/products.json"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ADMIN_TOKEN,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let parsed: any = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        // ignore
      }

      if (!res.ok) {
        const msg = parsed?.errors ? JSON.stringify(parsed.errors) : text;
        created.push({ handle, error: `HTTP ${res.status}: ${msg}` });
      } else {
        created.push({ handle, productId: parsed?.product?.id });
      }

      // Basic rate limiting safety
      await sleep(350);
    } catch (e) {
      created.push({ handle, error: String(e) });
    }
  }

  const okCount = created.filter((c) => c.productId).length;
  const errCount = created.filter((c) => c.error).length;

  return json(200, {
    shop: SHOP,
    handles: handles.length,
    created: okCount,
    errors: errCount,
    results: created,
  });
});
