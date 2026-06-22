import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, QrCode, ExternalLink, Loader2 } from "lucide-react";
import { fetchCampaigns, createCampaign, type Campaign } from "@/lib/api/campaigns";
import { CjpButton } from "@/components/cjp/cjp-button";
import { fetchFormations } from "@/lib/api/formations";

export function CampaignAdminPanel() {
  const [campaigns, setCampaigns] = useState<(Campaign & { _count: { participants: number } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [requiredScans, setRequiredScans] = useState(1);
  const [selectedFormation, setSelectedFormation] = useState("");
  const [formations, setFormations] = useState<any[]>([]);

  useEffect(() => {
    loadCampaigns();
    fetchFormations().then(data => setFormations(data.formations)).catch(console.error);
  }, []);

  const loadCampaigns = () => {
    setLoading(true);
    fetchCampaigns()
      .then((data) => setCampaigns(data.campaigns))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCampaign({
        name,
        formationId: selectedFormation || undefined,
        requiredScans: Number(requiredScans)
      });
      setIsCreating(false);
      setName("");
      setSelectedFormation("");
      setRequiredScans(1);
      loadCampaigns();
    } catch (_error) {
      alert("Erreur lors de la création de la campagne");
    }
  };

  return (
    <div className="cjp-card-dark p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--cjp-gold)] flex items-center gap-2">
            <QrCode className="h-5 w-5" /> Fast-Pass & Certificats
          </h2>
          <p className="text-sm text-[var(--cjp-text-muted)] mt-1">Gérez les émargements digitaux sans papier.</p>
        </div>
        <CjpButton onClick={() => setIsCreating(!isCreating)} className="!py-2 !px-4 !text-xs">
          {isCreating ? "Annuler" : <><Plus className="mr-2 h-4 w-4" /> Nouvelle Campagne</>}
        </CjpButton>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-8 bg-[var(--cjp-black)] p-4 rounded-xl border border-[var(--cjp-border)]">
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Créer une campagne de certification</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[var(--cjp-text-muted)]">Nom de la campagne</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: FODR-4 Nodejs"
                required
                className="rounded-lg border border-[var(--cjp-border)] bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-[var(--cjp-gold)]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[var(--cjp-text-muted)]">Formation associée</label>
              <select
                value={selectedFormation}
                onChange={(e) => setSelectedFormation(e.target.value)}
                className="rounded-lg border border-[var(--cjp-border)] bg-[var(--cjp-black)] px-3 py-2 text-sm text-white outline-none focus:border-[var(--cjp-gold)]"
              >
                <option value="">-- Aucune --</option>
                {formations.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[var(--cjp-text-muted)]">Nombre de jours requis</label>
              <input
                type="number"
                min="1"
                max="10"
                value={requiredScans}
                onChange={(e) => setRequiredScans(Number(e.target.value))}
                className="rounded-lg border border-[var(--cjp-border)] bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-[var(--cjp-gold)]"
              />
            </div>
            <div className="flex items-end">
              <CjpButton type="submit" className="w-full justify-center !py-2">Générer</CjpButton>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-[var(--cjp-gold)]" /></div>
      ) : campaigns.length === 0 ? (
        <p className="text-center text-sm text-[var(--cjp-text-muted)] py-4">Aucune campagne en cours.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--cjp-border)] text-xs uppercase text-[var(--cjp-text-muted)]">
              <tr>
                <th className="pb-3 pr-4 font-semibold">Campagne</th>
                <th className="pb-3 pr-4 font-semibold">Formation</th>
                <th className="pb-3 pr-4 font-semibold">Présents</th>
                <th className="pb-3 pr-4 font-semibold text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cjp-border)]">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="py-3 pr-4">
                    <Link to={`/dashboard/campaigns/${camp.id}`} className="font-medium text-white hover:text-[var(--cjp-gold)] flex items-center gap-2">
                      {camp.name} <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-[var(--cjp-text-muted)]">{camp.formation?.title || "N/A"}</td>
                  <td className="py-3 pr-4 font-mono text-[var(--cjp-gold)]">{camp._count.participants} scannés</td>
                  <td className="py-3 pr-4 text-right">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                      camp.status === "OPEN" ? "bg-green-950/50 text-green-400" : "bg-red-950/50 text-red-400"
                    }`}>
                      {camp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
