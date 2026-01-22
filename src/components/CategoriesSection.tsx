import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Mujeres",
    href: "/mujeres",
    description: "Licras, tops y conjuntos",
    gradient: "from-accent/90 to-spaz-green/70"
  },
  {
    name: "Hombres",
    href: "/hombres",
    description: "Ropa deportiva premium",
    gradient: "from-primary/90 to-spaz-green/60"
  },
  {
    name: "Niños",
    href: "/ninos",
    description: "Moda deportiva infantil",
    gradient: "from-spaz-green/80 to-accent/70"
  },
  {
    name: "Ofertas",
    href: "/ofertas",
    description: "Hasta 50% de descuento",
    gradient: "from-accent to-spaz-green/80"
  }
];

export const CategoriesSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl mb-4">COMPRAR POR CATEGORÍA</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encuentra la ropa deportiva perfecta para cada miembro de tu familia
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="font-display text-2xl md:text-3xl text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm mb-4">{category.description}</p>
                <div className="flex items-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explorar
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
