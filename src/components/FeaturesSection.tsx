import { Truck, RefreshCw, Shield, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Envío Internacional",
    description: "Enviamos a todo el mundo con seguimiento"
  },
  {
    icon: RefreshCw,
    title: "Devoluciones Gratis",
    description: "30 días para cambios y devoluciones"
  },
  {
    icon: Shield,
    title: "Pago Seguro",
    description: "Tus datos siempre protegidos"
  },
  {
    icon: HeadphonesIcon,
    title: "Soporte 24/7",
    description: "Estamos aquí para ayudarte"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-12 bg-textured-light">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div key={feature.title} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                index % 2 === 0 ? 'bg-accent/10 text-accent' : 'bg-spaz-green/10 text-spaz-green'
              }`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
