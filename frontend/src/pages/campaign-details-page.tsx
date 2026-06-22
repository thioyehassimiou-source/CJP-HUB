import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, Check, QrCode, Loader2 } from "lucide-react";
import { fetchCampaignDetails, type Campaign, type CampaignLink, type CampaignParticipant } from "@/lib/api/campaigns";
import { CjpDisplayTitle } from "@/components/cjp/cjp-display-title";
import { CjpDashboardShell } from "@/features/dashboard/components/cjp-dashboard-shell";
import { CjpDashboardPage } from "@/components/cjp/cjp-dashboard-page";

export function CampaignDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<(Campaign & { scannerLinks: CampaignLink[] }) | null>(null);
  const [participants, setParticipants] = useState<CampaignParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCampaignDetails(id)
        .then(data => {
          setCampaign(data.campaign);
          setParticipants(data.participants);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const copyToClipboard = (token: string) => {
    const url = `${window.location.origin}/scan/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(token);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  if (loading) return (
    <CjpDashboardShell>
      <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-[var(--cjp-gold)]" /></div>
    </CjpDashboardShell>
  );
  if (!campaign) return (
    <CjpDashboardShell>
      <div className="text-center p-20 text-red-400">Campagne introuvable</div>
    </CjpDashboardShell>
  );

  return (
    <CjpDashboardShell>
      <div className="space-y-8 pb-12">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="rounded-full bg-[var(--cjp-black)] p-2 text-[var(--cjp-text-muted)] hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <CjpDisplayTitle as="h1" bold="Campagne :" light={campaign.name} className="!text-3xl" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
        {/* Scanner Links */}
        <div className="cjp-card-dark p-6">
          <h2 className="mb-4 text-lg font-bold text-[var(--cjp-gold)] flex items-center gap-2">
            <QrCode className="h-5 w-5" /> Liens Scanners (Pour le responsable)
          </h2>
          <p className="text-sm text-[var(--cjp-text-muted)] mb-6">
            Envoyez ces liens au responsable logistique. Il n'a pas besoin de compte pour scanner.
          </p>
          <div className="space-y-4">
            {campaign.scannerLinks.map(link => (
              <div key={link.id} className="flex items-center justify-between bg-[var(--cjp-black)] p-4 rounded-xl border border-[var(--cjp-border)]">
                <div>
                  <div className="font-bold text-white">Scanner Jour {link.dayNumber}</div>
                  <div className="text-xs text-[var(--cjp-text-muted)] mt-1 font-mono">{window.location.origin}/scan/{link.token.slice(0,8)}...</div>
                </div>
                <button
                  onClick={() => copyToClipboard(link.token)}
                  className="p-2 rounded-lg bg-[var(--cjp-gray)] hover:bg-[var(--cjp-gold)] hover:text-black transition-colors"
                  title="Copier le lien complet"
                >
                  {copiedLink === link.token ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="cjp-card-dark p-6">
          <h2 className="mb-4 text-lg font-bold text-[var(--cjp-gold)]">Statistiques</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--cjp-black)] p-4 rounded-xl border border-[var(--cjp-border)] text-center">
              <div className="text-3xl font-bold text-white">{participants.length}</div>
              <div className="text-xs uppercase tracking-wider text-[var(--cjp-text-muted)] mt-1">Total Scannés</div>
            </div>
            <div className="bg-[var(--cjp-black)] p-4 rounded-xl border border-[var(--cjp-border)] text-center">
              <div className="text-3xl font-bold text-[var(--cjp-gold)]">{participants.filter(p => p.claimed).length}</div>
              <div className="text-xs uppercase tracking-wider text-[var(--cjp-text-muted)] mt-1">Certificats Générés</div>
            </div>
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div className="cjp-card-dark p-6">
        <h2 className="mb-4 text-lg font-bold text-[var(--cjp-gold)]">Liste des participants</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--cjp-border)] text-xs uppercase text-[var(--cjp-text-muted)]">
              <tr>
                <th className="pb-3 pr-4 font-semibold">Téléphone</th>
                <th className="pb-3 pr-4 font-semibold">Nom (Saisi)</th>
                <th className="pb-3 pr-4 font-semibold">Jours Scannés</th>
                <th className="pb-3 pr-4 font-semibold text-right">Statut Certificat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cjp-border)]">
              {participants.map((p) => (
                <tr key={p.phoneNumber} className="transition-colors hover:bg-white/[0.02]">
                  <td className="py-3 pr-4 font-mono text-[var(--cjp-gold)]">{p.phoneNumber}</td>
                  <td className="py-3 pr-4 text-white">
                    {p.firstName ? `${p.firstName} ${p.lastName}` : <span className="text-[var(--cjp-text-muted)] italic">Non saisi</span>}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="bg-[var(--cjp-gray)] px-2 py-1 rounded text-xs">
                      {p.scanCount} / {campaign.requiredScans}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    {p.claimed ? (
                      <span className="inline-flex items-center rounded-full bg-green-950/50 px-2 py-1 text-[10px] font-bold uppercase text-green-400">
                        Téléchargé
                      </span>
                    ) : p.scanCount >= campaign.requiredScans ? (
                      <span className="inline-flex items-center rounded-full bg-blue-950/50 px-2 py-1 text-[10px] font-bold uppercase text-blue-400">
                        Éligible
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-orange-950/50 px-2 py-1 text-[10px] font-bold uppercase text-orange-400">
                        Incomplet
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {participants.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[var(--cjp-text-muted)]">
                    Aucun étudiant scanné pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </CjpDashboardShell>
  );
}
