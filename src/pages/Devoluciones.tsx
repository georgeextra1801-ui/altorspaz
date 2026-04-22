import { InfoPageLayout } from "@/components/InfoPageLayout";

export default function Devoluciones() {
  return (
    <InfoPageLayout title="Devoluciones y Cambios" subtitle="Tienes 30 días para cambiar de opinión">
      <h2>Política general</h2>
      <p>
        Aceptamos cambios y devoluciones dentro de los <strong>30 días</strong> posteriores a
        la entrega, siempre que la prenda esté sin uso, con etiquetas originales y empaque
        intacto.
      </p>
      <h2>Cómo solicitar un cambio</h2>
      <ol>
        <li>Escríbenos a <a href="mailto:pedidos@spazaltor.com.co">pedidos@spazaltor.com.co</a> con tu número de pedido.</li>
        <li>Te enviamos la guía de devolución.</li>
        <li>Recibimos la prenda y procesamos el cambio o reembolso en 5 días hábiles.</li>
      </ol>
      <h2>Productos no aplicables</h2>
      <ul>
        <li>Ropa interior y trajes de baño por higiene.</li>
        <li>Productos en oferta marcados como “venta final”.</li>
      </ul>
    </InfoPageLayout>
  );
}
