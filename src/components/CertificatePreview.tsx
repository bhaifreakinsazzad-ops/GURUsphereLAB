import { useEffect, useRef, useState } from "react";
import { Download, Share2 } from "lucide-react";
import {
  CERT_THEMES,
  CertificateData,
  CertificateTheme,
  downloadCertificate,
  renderCertificate,
} from "@/lib/certificate";
import { canvasToBlob, shareCertificate } from "@/lib/share";
import { toast } from "@/hooks/use-toast";

interface Props {
  data: CertificateData;
  onDownload?: (info: { name: string; theme: CertificateTheme }) => void;
}

const CertificatePreview = ({ data, onDownload }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<CertificateTheme>("gold");
  const [name, setName] = useState(data.name || "");

  useEffect(() => {
    if (canvasRef.current) {
      renderCertificate(canvasRef.current, { ...data, name: name || "Anonymous Learner" }, theme);
    }
  }, [data, theme, name]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    downloadCertificate(
      canvasRef.current,
      `${name || "learner"}_${data.subject}_certificate`,
    );
    onDownload?.({ name: name || "Anonymous Learner", theme });
  };

  return (
    <div className="w-full">
      {/* Name input */}
      <div className="mb-4">
        <label className="block text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-2">
          Your Name on Certificate
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 40))}
          placeholder="e.g. Rafiq Hasan"
          className="w-full px-4 py-2.5 rounded-xl bg-muted/40 border border-border/60 text-foreground text-sm focus:outline-none focus:border-pathshala-gold transition-colors"
        />
      </div>

      {/* Theme toggle */}
      <div className="mb-4">
        <label className="block text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-2">
          Border Theme
        </label>
        <div className="flex gap-2">
          {CERT_THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all active:scale-[0.97] ${
                theme === t.id
                  ? "border-pathshala-gold bg-pathshala-gold/10 text-foreground"
                  : "border-border/60 text-muted-foreground hover:border-border"
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full ring-1 ring-border"
                style={{ background: t.swatch }}
              />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas preview */}
      <div className="rounded-xl overflow-hidden border border-border/60 bg-black/40 mb-4">
        <canvas
          ref={canvasRef}
          className="w-full h-auto block"
          style={{ aspectRatio: "1200 / 800" }}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleDownload}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.97]"
          style={{ background: "hsl(var(--pathshala-gold))", color: "hsl(var(--pathshala-deep))" }}
        >
          <Download size={16} /> Download PNG
        </button>
        <button
          onClick={async () => {
            if (!canvasRef.current) return;
            const blob = await canvasToBlob(canvasRef.current);
            const filename = `${(name || "learner").replace(/[^a-z0-9-_]+/gi, "_")}_${data.subject}_certificate.png`;
            const result = await shareCertificate(
              blob,
              filename,
              `I just earned a ${data.subject} certificate on GURU'sphere! 🎓`,
            );
            onDownload?.({ name: name || "Anonymous Learner", theme });
            toast({
              title: result === "shared" ? "Shared!" : result === "downloaded" ? "Downloaded for sharing" : "Caption copied",
              description: result === "shared" ? "Thanks for spreading the word." : "Attach the file to your post.",
            });
          }}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-pathshala-gold/40 font-semibold text-sm text-foreground hover:bg-pathshala-gold/10 transition-colors active:scale-[0.97]"
        >
          <Share2 size={16} /> Share
        </button>
      </div>
    </div>
  );
};

export default CertificatePreview;
