import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import altorLogo from "@/assets/altor-logo.png";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="bg-accent">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-4xl mb-2 text-accent-foreground">
              ÚNETE A LA COMUNIDAD ALTOR
            </h3>
            <p className="text-accent-foreground/80 mb-6">
              Suscríbete y recibe ofertas exclusivas, novedades y un 10% de descuento en tu primera compra.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input 
                placeholder="Tu correo electrónico" 
                className="bg-white text-foreground border-0"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap">
                Suscribirse
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img src={altorLogo} alt="Altor" className="h-12 w-auto brightness-0 invert" />
            <p className="text-primary-foreground/70 text-sm">
              Ropa deportiva de alta calidad para colombianísimas que buscan rendimiento y estilo.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="font-display text-xl mb-4">CATEGORÍAS</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/mujeres" className="hover:text-accent transition-colors">Mujeres</Link></li>
              <li><Link to="/hombres" className="hover:text-accent transition-colors">Hombres</Link></li>
              <li><Link to="/ninos" className="hover:text-accent transition-colors">Niños</Link></li>
              <li><Link to="/ofertas" className="hover:text-accent transition-colors">Ofertas</Link></li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h4 className="font-display text-xl mb-4">INFORMACIÓN</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/sobre-nosotros" className="hover:text-accent transition-colors">Sobre Nosotros</Link></li>
              <li><Link to="/envios" className="hover:text-accent transition-colors">Envíos y Entregas</Link></li>
              <li><Link to="/devoluciones" className="hover:text-accent transition-colors">Devoluciones</Link></li>
              <li><Link to="/guia-tallas" className="hover:text-accent transition-colors">Guía de Tallas</Link></li>
              <li><Link to="/politica-privacidad" className="hover:text-accent transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-display text-xl mb-4">CONTACTO</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+57 300 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@altor.co</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Bogotá, Colombia</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
            <p>© 2026 Altor. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>PSE</span>
              <span>Nequi</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
