import { AttestationGenerator } from "@/features/doc-gen/components/attestation-generator";
import { PosterDesigner } from "@/features/doc-gen/components/poster-designer";
import { DocGenShell } from "@/features/doc-gen/components/doc-gen-shell";

type AdminWorkspaceProps = {
  embedded?: boolean;
};

export function AdminWorkspace({ embedded = true }: AdminWorkspaceProps) {
  return (
    <DocGenShell
      embedded={embedded}
      attestations={<AttestationGenerator />}
      affiches={<PosterDesigner />}
    />
  );
}
