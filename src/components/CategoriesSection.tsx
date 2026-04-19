import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import mujeresImg from "@/assets/category-card-mujeres.jpg";
import hombresImg from "@/assets/category-card-hombres.jpg";
import ninosImg from "@/assets/category-card-ninos.jpg";
import ofertasImg from "@/assets/category-card-ofertas.jpg";

const categories = [
  {
    name: "Mujeres",
    href: "/mujeres",
    description: "Licras, tops y conjuntos",
    image: mujeresImg,
  },
  {
    name: "Hombres",
    href: "/hombres",
    description: "Ropa deportiva premium",
    image: hombresImg,
  },
  {
    name: "Niños",
    href: "/ninos",
    description: "Moda deportiva infantil",
    image: ninosImg,
  },
  {
    name: "Ofertas",
    href: "/ofertas",
    description: "Hasta 50% de descuento",
    image: ofertasImg,
  },
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
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                width={800}
                height={1024}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-colors duration-300" />

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
