import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ArrowRight } from "lucide-react";
import { CjpPublicLayout } from "@/components/cjp/cjp-public-layout";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";

export function FastPassPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [generatedPass, setGeneratedPass] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length >= 8) {
      setGeneratedPass(phoneNumber.trim());
    }
  };

  return (
    <CjpPublicLayout variant="dark">
      <section className="cjp-container py-16 md:py-24">
        <div className="mx-auto max-w-xl text-center">
          <CjpDisplayTitle bold="Votre Pass" light=" Numérique" />
          <p className="mt-4 text-[var(--cjp-text-muted)]">
            Entrez votre numéro de téléphone pour générer votre QR Code de présence. Présentez ce QR Code au responsable logistique à la sortie de la salle.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-md">
          {!generatedPass ? (
            <div className="cjp-card-dark p-8">
              <form onSubmit={handleGenerate} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-[var(--cjp-text-muted)] uppercase tracking-wider">
                    Numéro de Téléphone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Ex: 622 00 00 00"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-[var(--cjp-white)] outline-none focus:border-[var(--cjp-gold)]"
                    required
                  />
                </div>
                <button type="submit" className="btn-cjp w-full justify-center">
                  Générer mon Pass <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </form>
            </div>
          ) : (
            <div className="cjp-card-dark flex flex-col items-center p-10 text-center border-[var(--cjp-gold)]/50">
              <div className="rounded-2xl bg-white p-4 shadow-[0_0_30px_rgba(245,166,35,0.15)]">
                <QRCodeSVG 
                  value={JSON.stringify({ phone: generatedPass })} 
                  size={200}
                  level="H"
                  fgColor="#000000"
                  bgColor="#ffffff"
                  includeMargin={true}
                />
              </div>
              <h3 className="mt-8 text-2xl font-bold text-[var(--cjp-gold)] tracking-widest">{generatedPass}</h3>
              <p className="mt-4 text-sm text-[var(--cjp-text-muted)]">
                Montrez cet écran au responsable à la porte. Une fois scanné, votre présence sera validée.
              </p>
              <button 
                onClick={() => setGeneratedPass(null)}
                className="mt-8 text-xs font-semibold text-[var(--cjp-text-muted)] hover:text-white underline underline-offset-4"
              >
                Changer de numéro
              </button>
            </div>
          )}
        </div>
      </section>
    </CjpPublicLayout>
  );
}
