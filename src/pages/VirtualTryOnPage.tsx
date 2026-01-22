import { useState, useRef, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Download,
  RefreshCw,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  X,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";

// Predefined garments catalog
const GARMENTS = [
  {
    id: "red_dress",
    name: "Vestido Rojo Elegante",
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop",
    prompt: "Un elegante vestido rojo de gala",
  },
  {
    id: "blue_shirt",
    name: "Camisa Azul Casual",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=600&fit=crop",
    prompt: "Una camisa azul casual de algodón",
  },
  {
    id: "leather_jacket",
    name: "Chaqueta de Cuero Negra",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop",
    prompt: "Una chaqueta de cuero negra estilo biker",
  },
  {
    id: "denim_skirt",
    name: "Falda Vaquera Moderna",
    imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj9a?w=400&h=600&fit=crop",
    prompt: "Una falda vaquera moderna de mezclilla",
  },
  {
    id: "white_blazer",
    name: "Blazer Blanco Formal",
    imageUrl: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=600&fit=crop",
    prompt: "Un blazer blanco formal de corte entallado",
  },
];

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const VirtualTryOnPage = () => {
  // State
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<string>("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cooldownIntervalRef = useRef<number | null>(null);

  // Get selected garment data
  const selectedGarmentData = GARMENTS.find((g) => g.id === selectedGarment);

  // Start cooldown timer
  const startCooldown = useCallback((seconds: number) => {
    setCooldownSeconds(seconds);
    if (cooldownIntervalRef.current) {
      window.clearInterval(cooldownIntervalRef.current);
    }
    cooldownIntervalRef.current = window.setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          if (cooldownIntervalRef.current) {
            window.clearInterval(cooldownIntervalRef.current);
            cooldownIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // File validation
  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato no válido", {
        description: "Solo se aceptan imágenes JPG y PNG",
      });
      return false;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Archivo muy grande", {
        description: `El tamaño máximo es ${MAX_FILE_SIZE_MB}MB`,
      });
      return false;
    }
    return true;
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setUserPhoto(e.target?.result as string);
      toast.success("Foto cargada correctamente");
    };
    reader.onerror = () => {
      toast.error("Error al leer el archivo");
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  // Clear user photo
  const clearUserPhoto = () => {
    setUserPhoto(null);
    setResultImage(null);
    setHasGenerated(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Main generation function
  const generarImagenDePrenda = async () => {
    // Preconditions
    if (!userPhoto) {
      toast.error("Sube tu foto primero");
      return;
    }
    if (!selectedGarmentData) {
      toast.error("Selecciona una prenda");
      return;
    }
    if (cooldownSeconds > 0) {
      toast.error("Espera un momento", {
        description: `Vuelve a intentar en ${cooldownSeconds}s`,
      });
      return;
    }

    setIsProcessing(true);
    setResultImage(null);

    try {
      const { data, error } = await supabase.functions.invoke("virtual-tryon", {
        body: {
          userPhotoBase64: userPhoto,
          productImageUrl: selectedGarmentData.imageUrl,
          productName: selectedGarmentData.name,
        },
      });

      // The function returns 200 with structured errors to avoid treating rate limits as crashes.
      if (data && typeof data === "object" && (data as any).ok === false) {
        const status = (data as any).status as number | undefined;
        const retryAfterSeconds =
          typeof (data as any).retryAfterSeconds === "number"
            ? (data as any).retryAfterSeconds
            : 60;

        if (status === 429) {
          startCooldown(Math.min(180, Math.max(30, retryAfterSeconds)));
        }

        throw new Error((data as any).error || "Error al procesar la imagen");
      }

      if (error) {
        const extractBodyFromFunctionsError = async (err: unknown) => {
          const maybe: any = err;
          const ctx: Response | undefined = maybe?.context;
          if (ctx) {
            try {
              return await ctx.clone().json();
            } catch {
              const t = await ctx.clone().text();
              try {
                return JSON.parse(t);
              } catch {
                return { error: t };
              }
            }
          }

          const msg = typeof maybe?.message === "string" ? maybe.message : "";
          const jsonMatch = msg.match(/(\{[\s\S]*\})\s*$/);
          if (jsonMatch?.[1]) {
            try {
              return JSON.parse(jsonMatch[1]);
            } catch {
              return null;
            }
          }
          return null;
        };

        // Handle HTTP errors (like 429)
        const maybeHttpError = error as unknown as {
          name?: string;
          message?: string;
          context?: Response;
        };

        const isHttpError =
          error instanceof FunctionsHttpError ||
          maybeHttpError?.name === "FunctionsHttpError";

        if (isHttpError) {
          const body = await extractBodyFromFunctionsError(error);
          const status =
            typeof body?.status === "number" ? body.status : undefined;
          const retryAfterSeconds =
            typeof body?.retryAfterSeconds === "number"
              ? body.retryAfterSeconds
              : 60;

          if (status === 429 || maybeHttpError.message?.includes("429")) {
            startCooldown(Math.min(180, Math.max(30, retryAfterSeconds)));
            throw new Error(
              body?.error ||
                "Demasiadas solicitudes. Intenta de nuevo en unos segundos."
            );
          }

          throw new Error(
            body?.error || maybeHttpError.message || "Error al procesar la imagen"
          );
        }

        throw new Error(
          (error as any)?.message || "Error al procesar la imagen"
        );
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResultImage(data.resultImage);
      setHasGenerated(true);
      toast.success("¡Imagen generada!", {
        description: "Así te quedaría la prenda",
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
    } catch (error) {
      console.error("Virtual try-on error:", error);
      toast.error("Error al generar la imagen", {
        description: error instanceof Error ? error.message : "Intenta de nuevo",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Download generated image
  const downloadImage = () => {
    if (!resultImage) return;

    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `probador-virtual-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Imagen descargada");
  };

  // Check if "Try On" button should be enabled
  const canTryOn = userPhoto && selectedGarment && !isProcessing && cooldownSeconds === 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-accent" />
            Probador Virtual
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sube tu foto y selecciona una prenda para ver cómo te quedaría.
            Nuestra IA generará una imagen realista en segundos.
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Photo Upload Panel */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  Sube tu Foto
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !userPhoto && fileInputRef.current?.click()}
                  className={`
                    relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer
                    ${isDragging ? "border-accent bg-accent/10" : "border-muted-foreground/25 hover:border-accent/50"}
                    ${userPhoto ? "aspect-[3/4]" : "aspect-[4/3]"}
                  `}
                >
                  {userPhoto ? (
                    <>
                      <img
                        src={userPhoto}
                        alt="Tu foto"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearUserPhoto();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-4">
                      <Upload className="h-12 w-12 mb-4" />
                      <p className="font-medium text-center">
                        Arrastra tu foto aquí
                      </p>
                      <p className="text-sm text-center mt-1">
                        o haz clic para explorar
                      </p>
                      <p className="text-xs mt-4 text-center">
                        JPG o PNG • Máximo {MAX_FILE_SIZE_MB}MB
                      </p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg, image/png"
                  className="hidden"
                  onChange={handleFileInputChange}
                />

                {!userPhoto && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Explorar archivos
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Garment Selection Panel */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Selecciona una Prenda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedGarment} onValueChange={setSelectedGarment}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Elige una prenda..." />
                  </SelectTrigger>
                  <SelectContent>
                    {GARMENTS.map((garment) => (
                      <SelectItem key={garment.id} value={garment.id}>
                        {garment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Selected garment preview */}
                {selectedGarmentData && (
                  <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                    <img
                      src={selectedGarmentData.imageUrl}
                      alt={selectedGarmentData.name}
                      className="w-20 h-24 object-cover rounded-lg bg-white"
                    />
                    <div>
                      <p className="font-medium">{selectedGarmentData.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Prenda seleccionada
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview and Actions */}
          <div className="space-y-6">
            {/* Preview Area */}
            <Card className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Vista Previa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[3/4] bg-secondary rounded-xl overflow-hidden flex items-center justify-center">
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                      <Loader2 className="h-12 w-12 animate-spin text-accent" />
                      <div className="text-center">
                        <p className="font-medium">Generando imagen...</p>
                        <p className="text-sm">Esto puede tomar unos segundos</p>
                      </div>
                    </div>
                  ) : resultImage ? (
                    <img
                      src={resultImage}
                      alt="Resultado del probador virtual"
                      className="w-full h-full object-contain bg-white"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                      <ImageIcon className="h-16 w-16 mb-4" />
                      <p className="font-medium">
                        Sube tu foto y selecciona una prenda para empezar
                      </p>
                      <p className="text-sm mt-2">
                        La imagen generada aparecerá aquí
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Primary Button - Try On */}
              <Button
                size="lg"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={generarImagenDePrenda}
                disabled={!canTryOn}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : cooldownSeconds > 0 ? (
                  `Espera ${cooldownSeconds}s`
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    ¡Probar Prenda!
                  </>
                )}
              </Button>

              {/* Secondary Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={generarImagenDePrenda}
                  disabled={!hasGenerated || isProcessing || cooldownSeconds > 0}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerar
                </Button>
                <Button
                  variant="secondary"
                  onClick={downloadImage}
                  disabled={!resultImage}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              </div>
            </div>

            {/* Tips Card */}
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="pt-4">
                <h4 className="font-medium text-sm mb-2">💡 Consejos para mejores resultados:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Usa una foto de cuerpo completo con buena iluminación</li>
                  <li>• Evita fondos muy complejos o con muchas personas</li>
                  <li>• Mantén una postura natural frente a la cámara</li>
                  <li>• Usa ropa ajustada para que la prenda virtual encaje mejor</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VirtualTryOnPage;
