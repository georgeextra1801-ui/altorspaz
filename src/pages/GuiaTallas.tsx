import { InfoPageLayout } from "@/components/InfoPageLayout";

const sizes = [
  { size: "S", chest: "86-91", waist: "71-76", hip: "91-96" },
  { size: "M", chest: "91-96", waist: "76-81", hip: "96-101" },
  { size: "L", chest: "96-101", waist: "81-86", hip: "101-106" },
  { size: "XL", chest: "101-106", waist: "86-91", hip: "106-111" },
  { size: "2XL", chest: "106-112", waist: "91-97", hip: "111-117" },
  { size: "3XL", chest: "112-118", waist: "97-103", hip: "117-123" },
];

export default function GuiaTallas() {
  return (
    <InfoPageLayout title="Guía de Tallas" subtitle="Encuentra tu talla ideal (cm)">
      <p>Mide sobre tu cuerpo con cinta flexible y compara con la tabla.</p>
      <div className="overflow-x-auto not-prose my-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="p-3 text-left">Talla</th>
              <th className="p-3 text-left">Pecho (cm)</th>
              <th className="p-3 text-left">Cintura (cm)</th>
              <th className="p-3 text-left">Cadera (cm)</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((s) => (
              <tr key={s.size} className="border-b">
                <td className="p-3 font-semibold">{s.size}</td>
                <td className="p-3">{s.chest}</td>
                <td className="p-3">{s.waist}</td>
                <td className="p-3">{s.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Cómo medir</h2>
      <ul>
        <li><strong>Pecho:</strong> en la parte más ancha, bajo las axilas.</li>
        <li><strong>Cintura:</strong> en la parte más estrecha del torso.</li>
        <li><strong>Cadera:</strong> en la parte más ancha de los glúteos.</li>
      </ul>
    </InfoPageLayout>
  );
}
