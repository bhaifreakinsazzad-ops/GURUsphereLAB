/**
 * Client-side certificate generator (HTML5 Canvas, no deps).
 * Renders a 1200x800 PNG with themed border + gold accents.
 */

export type CertificateTheme = "gold" | "green" | "blue";

export interface CertificateData {
  name: string;
  subject: string;
  score: number;
  total: number;
  rankTitle: string;
  date?: string;
  practice?: boolean;
}

const THEMES: Record<
  CertificateTheme,
  { border: string; accent: string; bg1: string; bg2: string; label: string }
> = {
  gold:  { border: "#C8A24B", accent: "#E5C56E", bg1: "#0d1f17", bg2: "#0a1812", label: "Royal Gold" },
  green: { border: "#2EA88A", accent: "#7CE0BE", bg1: "#0a1a14", bg2: "#06120e", label: "Emerald" },
  blue:  { border: "#3D7DD8", accent: "#7BB1F5", bg1: "#0a1322", bg2: "#06101c", label: "Midnight Blue" },
};

export function getThemeMeta(theme: CertificateTheme) {
  return THEMES[theme];
}

export const CERT_THEMES: { id: CertificateTheme; label: string; swatch: string }[] = [
  { id: "gold",  label: "Gold",  swatch: THEMES.gold.border },
  { id: "green", label: "Green", swatch: THEMES.green.border },
  { id: "blue",  label: "Blue",  swatch: THEMES.blue.border },
];

export function renderCertificate(
  canvas: HTMLCanvasElement,
  data: CertificateData,
  theme: CertificateTheme = "gold",
) {
  const W = 1200;
  const H = 800;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const t = THEMES[theme];

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, t.bg1);
  grad.addColorStop(1, t.bg2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle diagonal pattern
  ctx.strokeStyle = t.accent + "10";
  ctx.lineWidth = 1;
  for (let i = -H; i < W; i += 28) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + H, H);
    ctx.stroke();
  }

  // Outer border
  ctx.strokeStyle = t.border;
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, W - 60, H - 60);
  // Inner thin border
  ctx.strokeStyle = t.accent;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(50, 50, W - 100, H - 100);

  // Corner ornaments
  const corners: [number, number][] = [
    [50, 50], [W - 50, 50], [50, H - 50], [W - 50, H - 50],
  ];
  ctx.strokeStyle = t.border;
  ctx.lineWidth = 3;
  corners.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Top wordmark
  ctx.fillStyle = t.accent;
  ctx.font = "600 18px 'Space Grotesk', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("GURU'SPHERE LAB · THE SCHOOL THAT NEVER CLOSES", W / 2, 110);

  // Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 56px 'Space Grotesk', Georgia, serif";
  ctx.fillText(data.practice ? "Practice Certificate" : "Certificate of Excellence", W / 2, 200);

  // Bengali subtitle
  ctx.fillStyle = t.accent;
  ctx.font = "400 24px 'Noto Sans Bengali', serif";
  ctx.fillText(data.practice ? "অনুশীলন সনদ" : "শ্রেষ্ঠত্বের সনদ", W / 2, 240);

  // Divider
  ctx.strokeStyle = t.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 100, 270);
  ctx.lineTo(W / 2 + 100, 270);
  ctx.stroke();

  // "Awarded to"
  ctx.fillStyle = "#cbd5d1";
  ctx.font = "400 22px 'Space Grotesk', sans-serif";
  ctx.fillText("This is to certify that", W / 2, 330);

  // Name
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 64px Georgia, 'Space Grotesk', serif";
  ctx.fillText(data.name || "Anonymous Learner", W / 2, 410);

  // Underline under name
  ctx.strokeStyle = t.accent;
  ctx.lineWidth = 1;
  const nameWidth = Math.min(ctx.measureText(data.name || "Anonymous Learner").width + 80, W - 200);
  ctx.beginPath();
  ctx.moveTo(W / 2 - nameWidth / 2, 430);
  ctx.lineTo(W / 2 + nameWidth / 2, 430);
  ctx.stroke();

  // Achievement text
  ctx.fillStyle = "#cbd5d1";
  ctx.font = "400 22px 'Space Grotesk', sans-serif";
  ctx.fillText(
    data.practice
      ? "has completed a practice round in"
      : "has demonstrated exceptional mastery in",
    W / 2,
    480,
  );

  // Subject
  ctx.fillStyle = t.accent;
  ctx.font = "700 38px 'Space Grotesk', sans-serif";
  ctx.fillText(data.subject, W / 2, 530);

  // Score row
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 26px 'Space Grotesk', sans-serif";
  const pct = Math.round((data.score / Math.max(data.total, 1)) * 100);
  ctx.fillText(`Score: ${data.score} / ${data.total}  ·  ${pct}%  ·  Rank: ${data.rankTitle}`, W / 2, 590);

  // Footer line
  ctx.strokeStyle = t.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(150, 680);
  ctx.lineTo(W - 150, 680);
  ctx.stroke();

  // Date (left) + signature (right)
  const dateStr = data.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  ctx.textAlign = "left";
  ctx.fillStyle = "#a4b3ad";
  ctx.font = "400 16px 'Space Grotesk', sans-serif";
  ctx.fillText(`Issued: ${dateStr}`, 150, 710);

  ctx.textAlign = "right";
  ctx.fillStyle = "#a4b3ad";
  ctx.fillText("Verified by GURU'sphere Lab", W - 150, 710);

  // Practice watermark
  if (data.practice) {
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-Math.PI / 8);
    ctx.fillStyle = t.accent + "14";
    ctx.font = "900 180px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PRACTICE", 0, 60);
    ctx.restore();
  }
}

export function downloadCertificate(canvas: HTMLCanvasElement, filename: string) {
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.replace(/[^a-z0-9-_]+/gi, "_") + ".png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
