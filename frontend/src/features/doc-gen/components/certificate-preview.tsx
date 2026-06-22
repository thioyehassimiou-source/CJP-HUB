import { Icon } from "@/components/ui/icon";
import { CERTIFICATE_QR, SIGNATURE_IMAGE } from "@/features/doc-gen/data/attestation-data";

export function CertificatePreview({
  memberName,
  training,
  issueDate,
  certificateNumber,
}: {
  memberName: string;
  training: string;
  issueDate: string;
  certificateNumber?: string;
}) {
  const formattedDate = new Date(issueDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const refNumber = certificateNumber || "REF: #AT-2026-05829";

  return (
    <div className="cert-shadow relative flex aspect-[1/1.414] w-[600px] flex-col overflow-hidden rounded-sm border-[12px] border-primary bg-white">
      <div className="pointer-events-none absolute inset-4 border border-outline-variant/30" />
      <div className="pointer-events-none absolute inset-8 border-4 border-double border-primary/10" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#0f172a 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="flex items-start justify-between px-12 pt-16">
        <div className="flex items-center gap-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary text-white">
            <Icon name="school" className="text-[32px]" filled />
          </div>
          <div>
            <h5 className="text-xl font-bold leading-none tracking-tight text-primary">CJP HUB</h5>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Excellence académique
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] text-outline">{refNumber}</p>
          <p className="font-mono text-[10px] uppercase text-outline">DATE: {formattedDate}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center space-y-lg px-16 text-center">
        <h4 className="font-serif text-[42px] italic leading-tight text-primary">
          Attestation de Réussite
        </h4>
        <div className="h-px w-24 bg-outline-variant" />
        <div className="space-y-sm">
          <p className="text-body-md text-on-surface-variant">Le comité académique certifie que</p>
          <h3 className="font-serif text-[32px] font-bold text-primary transition-transform duration-200">
            {memberName}
          </h3>
          <p className="text-body-md text-on-surface-variant">
            a validé avec succès l&apos;ensemble des modules de la formation
          </p>
          <h4 className="border-b border-secondary/20 bg-secondary-container/10 px-lg py-sm text-headline-md font-bold text-secondary transition-transform duration-200">
            {training}
          </h4>
        </div>
        <div className="h-px w-16 bg-outline-variant" />
        <p className="max-w-[400px] text-sm leading-relaxed text-on-surface-variant">
          Délivré en reconnaissance des compétences exceptionnelles démontrées lors du parcours
          pédagogique intensif du Club des Jeunes Programmeurs.
        </p>
      </div>

      <div className="flex items-end justify-between px-12 pb-16">
        <div className="space-y-md">
          <p className="text-[10px] font-bold uppercase text-primary">
            Signature du responsable
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Signature"
            className="h-12 w-32 object-contain opacity-80 mix-blend-multiply"
            src={SIGNATURE_IMAGE}
            crossOrigin="anonymous"
          />
          <p className="text-[11px] font-label-md">Directeur des Formations CJP</p>
        </div>
        <div className="flex flex-col items-center gap-xs">
          <div className="rounded-sm border border-outline-variant bg-white p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="QR Code de vérification" className="h-20 w-20" src={CERTIFICATE_QR} crossOrigin="anonymous" />
          </div>
          <p className="font-mono text-[8px] uppercase text-outline">Scannez pour vérifier</p>
        </div>
      </div>
    </div>
  );
}
