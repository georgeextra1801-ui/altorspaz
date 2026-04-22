import AdminCrearCliente from "@/pages/admin/AdminCrearCliente";

export default function ShopifyCrearCliente() {
  return (
    <div>
      <h2 className="font-display text-2xl mb-4">Crear cliente (Shopify)</h2>
      <AdminCrearCliente embedded />
    </div>
  );
}
