import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { Award, Download, Loader2, ArrowLeft } from "lucide-react";
import { CjpPublicLayout } from "@/components/cjp/cjp-public-layout";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { fetchOpenCampaigns, claimCertificate } from "@/lib/api/campaigns";
import { ApiClientError } from "@/lib/api/client";

export function ClaimCertificatePage() {
  const [campaigns, setCampaigns] = useState<{ id: string; name: string; formation: { title: string } | null; event: { title: string } | null }[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [step, setStep] = useState<"auth" | "info" | "success">("auth");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const [certificateData, setCertificateData] = useState<{
    success: boolean;
    participant: { firstName: string; lastName: string; phoneNumber: string; claimed: boolean };
    campaign: { name: string; formation: { title: string } | null; event: { title: string } | null };
  } | null>(null);

  useEffect(() => {
    fetchOpenCampaigns()
      .then((data) => {
        setCampaigns(data.campaigns);
        if (data.campaigns.length > 0) setSelectedCampaign(data.campaigns[0].id);
      })
      .catch(() => setError("Impossible de charger les événements ouverts."))
      .finally(() => setLoading(false));
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !selectedCampaign) return;
    setError("");
    setStep("info");
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    try {
      const result = await claimCertificate({
        campaignId: selectedCampaign,
        phoneNumber,
        firstName,
        lastName,
        email,
      });
      setCertificateData(result);
      setStep("success");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Erreur lors de la réclamation");
      if (err instanceof ApiClientError && err.message.includes("numéro de téléphone n'a pas été enregistré")) {
        setStep("auth");
      }
    } finally {
      setProcessing(false);
    }
  };

  const generateCertificatePDF = () => {
    if (!certificateData) return;
    setProcessing(true);

    const { participant, campaign } = certificateData;
    const fullName = `${participant.firstName} ${participant.lastName}`;
    const formationTitle = campaign.formation?.title || campaign.name;

    // Load the certificate background image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/brand/events/certificat_base.png";

    img.onload = () => {
      // A4 Landscape dimensions in mm
      const pdfWidth = 297;
      const pdfHeight = 210;

      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

      // Draw the background image (full page)
      pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);

      // --- Overlay the dynamic name ---
      // Position calibrated from the sample certificate
      // The name appears centered, roughly at 47% from top
      const nameY = 99; // mm from top
      const centerX = pdfWidth / 2;

      // Use a script-like font for the name
      pdf.setFont("times", "bolditalic");
      pdf.setFontSize(42);
      pdf.setTextColor(0, 0, 0);
      pdf.text(fullName, centerX, nameY, { align: "center" });

      // --- Overlay the certification paragraph ---
      const paraY = 120; // mm from top
      pdf.setFont("times", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(50, 50, 50);

      const today = new Date();
      const dateStr = today.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

      const paragraph = `Nous, C.J.P, certifions que ${fullName} a suivi et complété avec succès la formation intitulée "${formationTitle}", organisée par le Club des Jeunes Programmeurs.`;

      // Word wrap the paragraph
      const lines = pdf.splitTextToSize(paragraph, 230);
      pdf.text(lines, centerX, paraY, { align: "center" });

      // Save
      pdf.save(`Certificat_CJP_${participant.firstName}_${participant.lastName}.pdf`);
      setProcessing(false);
    };

    img.onerror = () => {
      // Fallback: generate without background image
      const pdfWidth = 297;
      const pdfHeight = 210;
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const centerX = pdfWidth / 2;

      // White background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, pdfHeight, "F");

      // Gold border
      pdf.setDrawColor(197, 143, 37);
      pdf.setLineWidth(2);
      pdf.rect(8, 8, pdfWidth - 16, pdfHeight - 16);
      pdf.setLineWidth(0.5);
      pdf.rect(12, 12, pdfWidth - 24, pdfHeight - 24);

      // Title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(36);
      pdf.setTextColor(197, 143, 37);
      pdf.text("CERTIFICAT", centerX, 55, { align: "center" });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(16);
      pdf.setTextColor(100, 100, 100);
      pdf.text("De formation", centerX, 66, { align: "center" });

      // Line separator
      pdf.setDrawColor(197, 143, 37);
      pdf.setLineWidth(0.8);
      pdf.line(centerX - 60, 72, centerX + 60, 72);

      // Name
      pdf.setFont("times", "bolditalic");
      pdf.setFontSize(38);
      pdf.setTextColor(0, 0, 0);
      pdf.text(fullName, centerX, 92, { align: "center" });

      // Another separator
      pdf.setLineWidth(0.5);
      pdf.line(centerX - 60, 98, centerX + 60, 98);

      // Paragraph
      pdf.setFont("times", "normal");
      pdf.setFontSize(12);
      pdf.setTextColor(50, 50, 50);
      const paragraph = `Nous, C.J.P, certifions que ${fullName} a suivi et complété avec succès la formation intitulée "${formationTitle}", organisée par le Club des Jeunes Programmeurs.`;
      const lines = pdf.splitTextToSize(paragraph, 220);
      pdf.text(lines, centerX, 112, { align: "center" });

      // Footer
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(9);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Club des Jeunes Programmeurs — Université de Labé", centerX, 190, { align: "center" });

      pdf.save(`Certificat_CJP_${firstName}_${lastName}.pdf`);
      setProcessing(false);
    };
  };

  return (
    <CjpPublicLayout variant="dark">
      <section className="cjp-container py-16 md:py-24">
        <div className="mx-auto max-w-xl text-center">
          <CjpDisplayTitle bold="Réclamer" light=" Mon Certificat" />
          <p className="mt-4 text-[var(--cjp-text-muted)]">
            Téléchargez votre certificat de formation officiel CJP.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-md">
          {error && (
            <div className="mb-6 rounded-lg border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-300 text-center">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--cjp-gold)]" />
            </div>
          ) : step === "auth" ? (
            <div className="cjp-card-dark p-8">
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[var(--cjp-text-muted)] uppercase tracking-wider">
                    Formation
                  </label>
                  <select
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    className="rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-[var(--cjp-white)] outline-none focus:border-[var(--cjp-gold)]"
                    required
                  >
                    {campaigns.length === 0 && <option value="">Aucune campagne disponible</option>}
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[var(--cjp-text-muted)] uppercase tracking-wider">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="Le numéro que vous avez présenté à la porte"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-[var(--cjp-white)] outline-none focus:border-[var(--cjp-gold)]"
                    required
                  />
                  <p className="text-xs text-[var(--cjp-text-muted)]">
                    Le numéro que vous avez utilisé lors de l'émargement.
                  </p>
                </div>
                <button type="submit" disabled={campaigns.length === 0} className="btn-cjp w-full justify-center mt-2">
                  Suivant
                </button>
              </form>
            </div>
          ) : step === "info" ? (
            <div className="cjp-card-dark p-8">
              <form onSubmit={handleClaimSubmit} className="flex flex-col gap-6">
                <div className="rounded-lg bg-[var(--cjp-gold)]/10 text-[var(--cjp-gold)] p-3 text-sm border border-[var(--cjp-gold)]/20">
                  Numéro vérifié : <span className="font-mono font-bold">{phoneNumber}</span>
                </div>
                <p className="text-sm text-[var(--cjp-text-muted)]">
                  Veuillez entrer votre nom <strong className="text-white">exactement</strong> comme il
                  doit apparaître sur le certificat.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[var(--cjp-text-muted)] uppercase tracking-wider">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ex: Aminatou"
                      className="rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-[var(--cjp-white)] outline-none focus:border-[var(--cjp-gold)]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[var(--cjp-text-muted)] uppercase tracking-wider">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ex: Diallo"
                      className="rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-[var(--cjp-white)] outline-none focus:border-[var(--cjp-gold)]"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-[var(--cjp-text-muted)] uppercase tracking-wider">
                    Email (Optionnel)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Optionnel"
                    className="rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-4 py-3 text-[var(--cjp-white)] outline-none focus:border-[var(--cjp-gold)]"
                  />
                </div>
                <div className="flex justify-between gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setStep("auth")}
                    className="flex items-center gap-1 text-sm text-[var(--cjp-text-muted)] hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> Retour
                  </button>
                  <button type="submit" disabled={processing} className="btn-cjp flex-1 justify-center">
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Vérification...
                      </span>
                    ) : (
                      "Obtenir mon Certificat"
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="cjp-card-dark p-8 text-center border-[var(--cjp-gold)]/30">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--cjp-gold)]/10">
                <Award className="h-10 w-10 text-[var(--cjp-gold)]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Félicitations !</h3>
              <p className="text-sm text-[var(--cjp-text-muted)] mb-8">
                Votre certificat pour{" "}
                <span className="text-[var(--cjp-gold)] font-semibold">
                  {certificateData?.campaign.formation?.title || certificateData?.campaign.name}
                </span>{" "}
                est prêt à être téléchargé.
              </p>

              <button
                onClick={generateCertificatePDF}
                disabled={processing}
                className="btn-cjp w-full justify-center group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Préparation du fichier...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                      Télécharger le PDF
                    </>
                  )}
                </span>
              </button>

              <p className="mt-6 text-xs text-[var(--cjp-text-muted)]">
                Le fichier sera enregistré directement dans votre téléphone.
              </p>
            </div>
          )}
        </div>
      </section>
    </CjpPublicLayout>
  );
}
