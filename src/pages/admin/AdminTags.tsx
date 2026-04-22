import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SPORT_TAGS = [
  "running", "ciclismo", "gym", "crossfit", "yoga", "futbol",
  "basket", "tenis", "natacion", "boxeo", "mma", "trekking",
  "escalada", "parapente", "skate", "surf",
];

const SYSTEM_TAGS = [
  { tag: "carrusel_home", desc: "Aparece en carrusel de ofertas del home y en /ofertas." },
  { tag: "destacado", desc: "Producto destacado en la grilla." },
  { tag: "nuevo", desc: "Marca como novedad (badge)." },
];

export default function AdminTags() {
  return (
    <div>
      <h1 className="text-3xl font-display tracking-wide mb-2">Etiquetas (Tags)</h1>
      <p className="text-muted-foreground mb-6">
        Referencia de tags reconocidos por el storefront. Edítalos en el admin de Shopify.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Deportes (filtro home)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {SPORT_TAGS.map((t) => (
                <Badge key={t} variant="secondary" className="text-sm">{t}</Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Usados por el filtro de deporte. Asígnalos en cada producto en Shopify.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {SYSTEM_TAGS.map((t) => (
              <div key={t.tag} className="border-b pb-2 last:border-0">
                <Badge>{t.tag}</Badge>
                <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
