import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CertificatePreview } from "./certificate-preview";

export interface CertificateData {
  memberName: string;
  training: string;
  issueDate: string;
  certificateNumber?: string;
}

export async function exportCertificateToPDF(data: CertificateData, filename?: string) {
  // Create a hidden container
  const container = document.createElement("div");
  // Position it offscreen and ensure it has enough space
  container.style.position = "fixed";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  // The CertificatePreview is w-[600px] and aspect-[1/1.414], so height is ~848px
  container.style.width = "600px";
  container.style.height = "850px";
  document.body.appendChild(container);

  // Render the component
  const root = createRoot(container);
  
  // Wait for React to render
  await new Promise<void>((resolve) => {
    root.render(
      <div id="certificate-pdf-root">
        <CertificatePreview {...data} />
      </div>
    );
    // Give it some time to mount and load images
    setTimeout(resolve, 500);
  });

  const element = document.getElementById("certificate-pdf-root");
  if (!element) {
    document.body.removeChild(container);
    throw new Error("Failed to render certificate");
  }

  try {
    // Take snapshot
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true, // Allow external images
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    // Create PDF (A4 format)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename || `Certificat_${data.memberName.replace(/\s+/g, "_")}.pdf`);
  } finally {
    // Cleanup
    root.unmount();
    document.body.removeChild(container);
  }
}
