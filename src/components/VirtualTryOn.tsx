import { useEffect, useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";

interface VirtualTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productImageUrl: string;
}

export const VirtualTryOn = ({ isOpen, onClose, productName, productImageUrl }: VirtualTryOnProps) => {
  const [step, setStep] = useState<'capture' | 'processing' | 'result'>('capture');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const id = window.setInterval(() => {
      setCooldownSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [cooldownSeconds]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 960 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("No se pudo acceder a la cámara", {
        description: "Por favor permite el acceso a la cámara o sube una foto"
      });
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror the image for selfie mode
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setUserPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen es muy grande", {
          description: "Por favor usa una imagen menor a 5MB"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUserPhoto(e.target?.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const processVirtualTryOn = async () => {
    if (!userPhoto) return;
    if (cooldownSeconds > 0) {
      toast.error("Espera un momento", {
        description: `Vuelve a intentar en ${cooldownSeconds}s`,
      });
      return;
    }

    setStep('processing');
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('virtual-tryon', {
        body: {
          userPhotoBase64: userPhoto,
          productImageUrl: productImageUrl,
          productName: productName
        }
      });

      // The function returns 200 with structured errors to avoid treating rate limits as crashes.
      if (data && typeof data === "object" && (data as any).ok === false) {
        const status = (data as any).status as number | undefined;
        const retryAfterSeconds =
          typeof (data as any).retryAfterSeconds === "number"
            ? (data as any).retryAfterSeconds
            : 60;

        if (status === 429) {
          setCooldownSeconds(Math.min(180, Math.max(5, retryAfterSeconds)));
        }

        throw new Error((data as any).error || "Error al procesar la imagen");
      }

      if (error) {
        const extractBodyFromFunctionsError = async (err: unknown) => {
          const maybe: any = err;

          // supabase-js exposes the Response on FunctionsHttpError as `context` in many environments
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

          // Fallback: supabase-js often puts the JSON body at the end of the error message:
          // "Edge function returned 429: Error, { ...json... }"
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

        // Read the error body from the function when possible (e.g. 429 from Gemini).
        const maybeHttpError = error as unknown as {
          name?: string;
          message?: string;
          context?: Response;
        };

        const isHttpError =
          error instanceof FunctionsHttpError || maybeHttpError?.name === "FunctionsHttpError";

        if (isHttpError) {
          const body = await extractBodyFromFunctionsError(error);
          const status = typeof body?.status === "number" ? body.status : undefined;
          const retryAfterSeconds =
            typeof body?.retryAfterSeconds === "number" ? body.retryAfterSeconds : 60;

          if (status === 429 || maybeHttpError.message?.includes("429")) {
            setCooldownSeconds(Math.min(180, Math.max(5, retryAfterSeconds)));
            throw new Error(
              body?.error || "Demasiadas solicitudes. Intenta de nuevo en unos segundos."
            );
          }

          throw new Error(body?.error || maybeHttpError.message || "Error al procesar la imagen");
        }

        throw new Error(maybeHttpError?.message || "Error al procesar la imagen");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResultImage(data.resultImage);
      setStep('result');
      toast.success("¡Imagen generada!", {
        description: "Así te quedaría la prenda"
      });

    } catch (error) {
      console.error("Virtual try-on error:", error);
      toast.error("Error al generar la imagen", {
        description: error instanceof Error ? error.message : "Intenta de nuevo"
      });
      setStep('capture');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setStep('capture');
    setUserPhoto(null);
    setResultImage(null);
    stopCamera();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Probador Virtual
          </DialogTitle>
          <DialogDescription>
            {step === 'capture' && "Tómate una foto o sube una imagen para ver cómo te queda esta prenda"}
            {step === 'processing' && "Generando tu imagen..."}
            {step === 'result' && `Así te quedaría: ${productName}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Capture Step */}
          {step === 'capture' && (
            <>
              {/* Camera/Photo Area */}
              <div className="relative aspect-[3/4] bg-secondary rounded-xl overflow-hidden">
                {isCameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Guide overlay */}
                      <div className="w-48 h-64 border-2 border-white/50 rounded-full border-dashed" />
                    </div>
                  </>
                ) : userPhoto ? (
                  <img
                    src={userPhoto}
                    alt="Tu foto"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                    <Camera className="h-16 w-16" />
                    <p className="text-center px-4">
                      Activa la cámara o sube una foto tuya de cuerpo completo
                    </p>
                  </div>
                )}

                {userPhoto && !isCameraActive && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setUserPhoto(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Hidden canvas for capture */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Action Buttons */}
              <div className="flex gap-2">
                {!isCameraActive && !userPhoto && (
                  <>
                    <Button onClick={startCamera} className="flex-1" variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Usar Cámara
                    </Button>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1"
                      variant="outline"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Foto
                    </Button>
                  </>
                )}

                {isCameraActive && (
                  <>
                    <Button onClick={capturePhoto} className="flex-1 bg-accent hover:bg-accent/90">
                      <Camera className="h-4 w-4 mr-2" />
                      Capturar
                    </Button>
                    <Button onClick={stopCamera} variant="outline">
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {userPhoto && !isCameraActive && (
                  <>
                    <Button
                      onClick={processVirtualTryOn}
                      className="flex-1 bg-accent hover:bg-accent/90"
                      disabled={isProcessing || cooldownSeconds > 0}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {cooldownSeconds > 0 ? `Espera ${cooldownSeconds}s` : "Ver cómo me queda"}
                    </Button>
                    <Button onClick={() => setUserPhoto(null)} variant="outline">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              {/* Product Preview */}
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <img
                  src={productImageUrl}
                  alt={productName}
                  className="w-16 h-16 object-contain bg-white rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{productName}</p>
                  <p className="text-xs text-muted-foreground">Prenda a probar</p>
                </div>
              </div>
            </>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="aspect-[3/4] bg-secondary rounded-xl flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-accent" />
              <div className="text-center">
                <p className="font-medium">Generando tu imagen...</p>
                <p className="text-sm text-muted-foreground">Esto puede tomar unos segundos</p>
              </div>
            </div>
          )}

          {/* Result Step */}
          {step === 'result' && resultImage && (
            <>
              <div className="aspect-[3/4] bg-secondary rounded-xl overflow-hidden">
                <img
                  src={resultImage}
                  alt="Resultado del probador virtual"
                  className="w-full h-full object-contain bg-white"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={reset} className="flex-1" variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Probar otra foto
                </Button>
                <Button onClick={handleClose} className="flex-1 bg-accent hover:bg-accent/90">
                  Cerrar
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
