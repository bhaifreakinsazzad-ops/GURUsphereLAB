/**
 * Share helpers — uses Web Share API with file when available,
 * falls back to clipboard text.
 */

export async function shareCertificate(
  blob: Blob,
  filename: string,
  text: string,
): Promise<"shared" | "downloaded" | "copied"> {
  const file = new File([blob], filename, { type: blob.type });
  const nav = navigator as Navigator & {
    canShare?: (data: { files?: File[] }) => boolean;
    share?: (data: { files?: File[]; title?: string; text?: string }) => Promise<void>;
  };

  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: "GURU'sphere Certificate", text });
      return "shared";
    } catch {
      // user cancelled or share failed — fall through
    }
  }

  // Fallback 1: download the file
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    return "downloaded";
  } catch {
    /* ignore */
  }

  // Fallback 2: copy text
  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "copied";
  }
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png"): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("canvas blob failed"))), type);
  });
}
