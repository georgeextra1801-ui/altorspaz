import { InfoPageLayout } from "@/components/InfoPageLayout";

export default function Envios() {
  return (
    <InfoPageLayout title="Envíos y Entregas" subtitle="Cobertura nacional en Colombia">
      <h2>Cobertura</h2>
      <p>Realizamos envíos a todas las ciudades principales y municipios de Colombia.</p>
      <h2>Tiempos de entrega</h2>
      <ul>
        <li><strong>Bogotá:</strong> 1 a 2 días hábiles.</li>
        <li><strong>Ciudades principales:</strong> 2 a 4 días hábiles.</li>
        <li><strong>Municipios:</strong> 3 a 7 días hábiles.</li>
      </ul>
      <h2>Costos</h2>
      <p>
        Envío gratis en compras superiores a <strong>$150.000 COP</strong>. En compras menores
        el costo se calcula automáticamente según destino.
      </p>
      <h2>Pago contra entrega</h2>
      <p>Disponible en ciudades principales sujeto a verificación.</p>
      <h2>Contacto</h2>
      <p>Para seguimiento de pedidos: <a href="mailto:pedidos@spazaltor.com.co">pedidos@spazaltor.com.co</a></p>
    </InfoPageLayout>
  );
}
