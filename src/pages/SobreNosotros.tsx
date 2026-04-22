import { InfoPageLayout } from "@/components/InfoPageLayout";

export default function SobreNosotros() {
  return (
    <InfoPageLayout title="Sobre Nosotros" subtitle="Spaz Altor — Ropa deportiva colombiana">
      <p>
        En <strong>Altor</strong> diseñamos prendas deportivas pensadas para colombianísimas y
        colombianísimos que entrenan con propósito. Cada pieza combina materiales técnicos,
        cortes anatómicos y un estilo inconfundible.
      </p>
      <h2>Nuestra misión</h2>
      <p>
        Acompañar a deportistas y entusiastas del fitness con prendas que rinden tanto como
        ellos. Diseño nacional, calidad de exportación y precios justos.
      </p>
      <h2>Nuestros valores</h2>
      <ul>
        <li>Calidad por encima de todo.</li>
        <li>Producción local y responsable.</li>
        <li>Atención cercana al cliente.</li>
        <li>Innovación constante en telas y diseño.</li>
      </ul>
    </InfoPageLayout>
  );
}
