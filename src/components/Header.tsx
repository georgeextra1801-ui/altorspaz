import { Link, useLocation } from "react-router-dom";
import { Search, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartDrawer } from "@/components/CartDrawer";
import altorLogo from "@/assets/altor-logo.png";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface MenuCategory {
  title: string;
  items: { name: string; href: string }[];
}

interface NavItem {
  name: string;
  href: string;
  megaMenu?: MenuCategory[];
}

const navLinks: NavItem[] = [
  { 
    name: "Mujeres", 
    href: "/mujeres",
    megaMenu: [
      {
        title: "Novedades",
        items: [
          { name: "Novedades Ropa", href: "/mujeres?filter=novedades-ropa" },
          { name: "Novedades Accesorios", href: "/mujeres?filter=novedades-accesorios" },
          { name: "Todo Novedades", href: "/mujeres?filter=novedades" },
        ]
      },
      {
        title: "Ropa",
        items: [
          { name: "Camisetas", href: "/mujeres?filter=camisetas" },
          { name: "Tops", href: "/mujeres?filter=tops" },
          { name: "Leggings", href: "/mujeres?filter=leggings" },
          { name: "Shorts", href: "/mujeres?filter=shorts" },
          { name: "Chaquetas", href: "/mujeres?filter=chaquetas" },
        ]
      },
      {
        title: "Destacados",
        items: [
          { name: "Lo más vendido", href: "/mujeres?filter=bestsellers" },
          { name: "Sostenibilidad", href: "/mujeres?filter=sostenible" },
          { name: "Ofertas", href: "/ofertas?genero=mujeres" },
        ]
      }
    ]
  },
  { 
    name: "Hombres", 
    href: "/hombres",
    megaMenu: [
      {
        title: "Novedades",
        items: [
          { name: "Novedades Ropa", href: "/hombres?filter=novedades-ropa" },
          { name: "Novedades Accesorios", href: "/hombres?filter=novedades-accesorios" },
          { name: "Todo Novedades", href: "/hombres?filter=novedades" },
        ]
      },
      {
        title: "Ropa",
        items: [
          { name: "Camisetas", href: "/hombres?filter=camisetas" },
          { name: "Shorts", href: "/hombres?filter=shorts" },
          { name: "Pantalones", href: "/hombres?filter=pantalones" },
          { name: "Chaquetas", href: "/hombres?filter=chaquetas" },
          { name: "Sudaderas", href: "/hombres?filter=sudaderas" },
        ]
      },
      {
        title: "Destacados",
        items: [
          { name: "Lo más vendido", href: "/hombres?filter=bestsellers" },
          { name: "Sostenibilidad", href: "/hombres?filter=sostenible" },
          { name: "Ofertas", href: "/ofertas?genero=hombres" },
        ]
      }
    ]
  },
  { 
    name: "Niños", 
    href: "/ninos",
    megaMenu: [
      {
        title: "Por edad",
        items: [
          { name: "Bebés (0-3 años)", href: "/ninos?edad=bebes" },
          { name: "Niños (4-8 años)", href: "/ninos?edad=pequenos" },
          { name: "Niños (9-14 años)", href: "/ninos?edad=grandes" },
        ]
      },
      {
        title: "Ropa",
        items: [
          { name: "Camisetas", href: "/ninos?filter=camisetas" },
          { name: "Shorts", href: "/ninos?filter=shorts" },
          { name: "Conjuntos", href: "/ninos?filter=conjuntos" },
          { name: "Chaquetas", href: "/ninos?filter=chaquetas" },
        ]
      },
      {
        title: "Destacados",
        items: [
          { name: "Lo más vendido", href: "/ninos?filter=bestsellers" },
          { name: "Ofertas", href: "/ofertas?genero=ninos" },
        ]
      }
    ]
  },
  {
    name: "Deporte",
    href: "#",
    megaMenu: [
      {
        title: "Deportes de equipo",
        items: [
          { name: "Fútbol", href: "/?deporte=futbol" },
          { name: "Baloncesto", href: "/?deporte=baloncesto" },
          { name: "Voleibol", href: "/?deporte=voleibol" },
          { name: "Tenis", href: "/?deporte=tenis" },
        ]
      },
      {
        title: "Fitness",
        items: [
          { name: "Gym", href: "/?deporte=gym" },
          { name: "Yoga", href: "/?deporte=yoga" },
          { name: "Crossfit", href: "/?deporte=crossfit" },
          { name: "Pilates", href: "/?deporte=pilates" },
        ]
      },
      {
        title: "Outdoor",
        items: [
          { name: "Running", href: "/?deporte=running" },
          { name: "Ciclismo", href: "/?deporte=ciclismo" },
          { name: "Senderismo", href: "/?deporte=senderismo" },
          { name: "Trail", href: "/?deporte=trail" },
        ]
      },
      {
        title: "Otros deportes",
        items: [
          { name: "Patinaje", href: "/?deporte=patinaje" },
          { name: "Natación", href: "/?deporte=natacion" },
          { name: "Skate", href: "/?deporte=skate" },
          { name: "Golf", href: "/?deporte=golf" },
        ]
      }
    ]
  },
  { 
    name: "Ofertas", 
    href: "/ofertas",
    megaMenu: [
      {
        title: "Por género",
        items: [
          { name: "Ofertas Mujeres", href: "/ofertas?genero=mujeres" },
          { name: "Ofertas Hombres", href: "/ofertas?genero=hombres" },
          { name: "Ofertas Niños", href: "/ofertas?genero=ninos" },
        ]
      },
      {
        title: "Por descuento",
        items: [
          { name: "Hasta 30% OFF", href: "/ofertas?descuento=30" },
          { name: "Hasta 50% OFF", href: "/ofertas?descuento=50" },
          { name: "Hasta 70% OFF", href: "/ofertas?descuento=70" },
        ]
      },
      {
        title: "Destacados",
        items: [
          { name: "Última oportunidad", href: "/ofertas?filter=ultima-oportunidad" },
          { name: "Temporada anterior", href: "/ofertas?filter=temporada-anterior" },
        ]
      }
    ]
  },
];

export const Header = () => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      {/* Top bar - Envío gratis */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
        ENVÍO GRATIS EN PEDIDOS MAYORES A $200.000 COP
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col gap-6 mt-8">
                <Link to="/" className="flex items-center justify-center">
                  <img src={altorLogo} alt="Altor" className="h-12 w-auto" />
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`text-xl font-display tracking-wide py-2 border-b transition-colors hover:text-accent ${
                        location.pathname === link.href ? "text-accent" : ""
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={altorLogo} alt="Altor" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation with Mega Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-1">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.name}>
                  {link.megaMenu ? (
                    <>
                      <NavigationMenuTrigger 
                        className={cn(
                          "font-display text-lg tracking-wide bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
                          location.pathname === link.href && "text-accent"
                        )}
                      >
                        <Link to={link.href} className="hover:text-accent transition-colors">
                          {link.name}
                        </Link>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="bg-background border shadow-md rounded-none">
                        <div 
                          className={cn(
                            "flex gap-6 p-5",
                            link.megaMenu.length === 1 && "w-auto",
                            link.megaMenu.length === 2 && "w-auto",
                            link.megaMenu.length >= 3 && "w-auto"
                          )}
                        >
                          {link.megaMenu.map((category) => (
                            <div key={category.title} className="space-y-2 min-w-[140px]">
                              <h3 className="font-display text-sm tracking-wide text-foreground font-semibold border-b border-border pb-1">
                                {category.title}
                              </h3>
                              <ul className="space-y-0.5">
                                {category.items.map((item) => (
                                  <li key={item.name}>
                                    <NavigationMenuLink asChild>
                                      <Link
                                        to={item.href}
                                        className="text-xs text-muted-foreground hover:text-primary transition-colors block py-0.5"
                                      >
                                        {item.name}
                                      </Link>
                                    </NavigationMenuLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      className={cn(
                        "font-display text-lg tracking-wide transition-colors hover:text-accent px-4 py-2",
                        location.pathname === link.href && "text-accent"
                      )}
                    >
                      {link.name}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Buscar..." 
                  className="w-40 md:w-64"
                  autoFocus
                />
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>
            <CartDrawer />
          </div>
        </div>
      </div>
    </header>
  );
};
