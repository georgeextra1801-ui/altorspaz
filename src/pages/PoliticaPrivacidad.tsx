import { InfoPageLayout } from "@/components/InfoPageLayout";

export default function PoliticaPrivacidad() {
  return (
    <InfoPageLayout title="Política de Privacidad" subtitle="Última actualización: abril 2026">
      <p>
        En <strong>Altor</strong> respetamos tu privacidad y protegemos tus datos personales
        conforme a la Ley 1581 de 2012 de Colombia.
      </p>
      <h2>Datos que recolectamos</h2>
      <ul>
        <li>Nombre, documento, correo, teléfono y dirección de envío.</li>
        <li>Historial de compras y preferencias de navegación.</li>
        <li>Datos de pago procesados de forma segura por Bold y Shopify.</li>
      </ul>
      <h2>Uso de los datos</h2>
      <ul>
        <li>Procesar pedidos y entregas.</li>
        <li>Mejorar nuestro catálogo y experiencia de usuario.</li>
        <li>Enviar comunicaciones de marketing (solo si te suscribes).</li>
      </ul>
      <h2>Tus derechos</h2>
      <p>
        Puedes solicitar acceso, rectificación o eliminación de tus datos escribiendo a{" "}
        <a href="mailto:pedidos@spazaltor.com.co">pedidos@spazaltor.com.co</a>.
      </p>
      <h2>Cookies</h2>
      <p>Usamos cookies para mejorar la experiencia y para analítica con Meta Pixel.</p>
    </InfoPageLayout>
  );
}
