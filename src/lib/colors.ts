// Map Spanish color names to CSS colors
export const colorMap: Record<string, string> = {
  // Basic colors
  "Negro": "#000000",
  "Blanco": "#FFFFFF",
  "Rojo": "#DC2626",
  "Azul": "#2563EB",
  "Azul Marino": "#1E3A5F",
  "Azul Rey": "#4169E1",
  "Azul Cielo": "#87CEEB",
  "Verde": "#22C55E",
  "Verde Militar": "#4B5320",
  "Verde Esmeralda": "#50C878",
  "Amarillo": "#EAB308",
  "Naranja": "#F97316",
  "Morado": "#9333EA",
  "Púrpura": "#7C3AED",
  "Rosa": "#EC4899",
  "Fucsia": "#FF00FF",
  "Gris": "#6B7280",
  "Gris Oscuro": "#374151",
  "Gris Claro": "#D1D5DB",
  "Café": "#8B4513",
  "Marrón": "#A0522D",
  "Beige": "#F5F5DC",
  "Coral": "#FF7F50",
  "Turquesa": "#40E0D0",
  "Vino": "#722F37",
  "Borgoña": "#800020",
  "Terracota": "#E2725B",
  "Mostaza": "#FFDB58",
  "Oliva": "#808000",
  "Salmón": "#FA8072",
  "Lila": "#C8A2C8",
  "Lavanda": "#E6E6FA",
  "Menta": "#98FF98",
  "Aqua": "#00FFFF",
  "Cian": "#00FFFF",
  "Magenta": "#FF00FF",
  "Dorado": "#FFD700",
  "Plateado": "#C0C0C0",
  "Crema": "#FFFDD0",
  "Nude": "#E3BC9A",
  "Chocolate": "#7B3F00",
  // Default fallback will be handled in the component
};

export const isColorOption = (optionName: string): boolean => {
  const colorKeywords = ['color', 'colour', 'colores'];
  return colorKeywords.some(keyword => 
    optionName.toLowerCase().includes(keyword)
  );
};

export const getColorValue = (colorName: string): string | null => {
  // Try exact match first
  if (colorMap[colorName]) {
    return colorMap[colorName];
  }
  
  // Try case-insensitive match
  const lowerName = colorName.toLowerCase();
  for (const [key, value] of Object.entries(colorMap)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }
  
  // Try partial match
  for (const [key, value] of Object.entries(colorMap)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return value;
    }
  }
  
  return null;
};
