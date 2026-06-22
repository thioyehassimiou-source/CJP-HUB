import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { scanPass } from "@/lib/api/campaigns";
import { ApiClientError } from "@/lib/api/client";

export function ScannerPage() {
  const { token } = useParams<{ token: string }>();
  const [scanResult, setScanResult] = useState<{ type: "success" | "error"; message: string; phone?: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Only init scanner if we don't have a processing state going on
    if (!token || isProcessing) return;

    let scanner: Html5QrcodeScanner | null = null;

    const onScanSuccess = async (decodedText: string) => {
      if (scanner) scanner.pause(true);
      setIsProcessing(true);
      setScanResult(null);

      try {
        const data = JSON.parse(decodedText);
        if (!data.phone) throw new Error("Format QR Invalide");

        const result = await scanPass(token, data.phone);
        setScanResult({ type: "success", message: result.message, phone: data.phone });
      } catch (error) {
        setScanResult({
          type: "error",
          message: error instanceof ApiClientError ? error.message : "Erreur de lecture QR",
        });
      } finally {
        setIsProcessing(false);
        setTimeout(() => {
          setScanResult(null);
          if (scanner) scanner.resume();
        }, 2500);
      }
    };

    scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
    scanner.render(onScanSuccess, () => {});

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [token, isProcessing]);

  return (
    <div className="min-h-screen bg-[var(--cjp-black)] text-[var(--cjp-white)] py-12 px-4">
      <div className="mx-auto w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">Scanner CJP</h1>
        <p className="text-sm text-[var(--cjp-text-muted)] mb-8">
          Visez le QR Code "Fast-Pass" de l'étudiant
        </p>

        <div className="relative overflow-hidden rounded-2xl bg-[var(--cjp-gray)] border border-[var(--cjp-border)] shadow-xl min-h-[300px]">
          <div id="reader" className="w-full [&_video]:object-cover" />
          
          {/* Overlay state */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-10">
              <Loader2 className="h-10 w-10 animate-spin text-[var(--cjp-gold)]" />
            </div>
          )}

          {scanResult && !isProcessing && (
            <div className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm z-10 ${
              scanResult.type === "success" ? "bg-green-950/90 text-green-400" : "bg-red-950/90 text-red-400"
            }`}>
              {scanResult.type === "success" ? (
                <CheckCircle2 className="h-16 w-16 mb-4" />
              ) : (
                <XCircle className="h-16 w-16 mb-4" />
              )}
              <h3 className="text-xl font-bold">{scanResult.message}</h3>
              {scanResult.phone && <p className="mt-2 text-white font-mono">{scanResult.phone}</p>}
            </div>
          )}
        </div>
        
        <p className="mt-8 text-xs text-[var(--cjp-text-muted)]">
          Le scan se réactive automatiquement après chaque validation.
        </p>
      </div>
    </div>
  );
}
