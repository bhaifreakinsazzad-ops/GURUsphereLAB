import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAudio } from "@/contexts/AudioContext";

const AudioToggle = () => {
  const { muted, toggleMute } = useAudio();
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 2500);
    const h = setTimeout(() => setShowHint(false), 9000);
    return () => { clearTimeout(t); clearTimeout(h); };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex items-end gap-3">
      <AnimatePresence>
        {showHint && muted && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10 }}
            className="hidden sm:block parchment-card px-4 py-2 text-sm handwritten"
            style={{ color: "hsl(var(--ink))" }}
          >
            Light the room — turn sound on 🕯️
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleMute}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={muted ? "Unmute ambient sound" : "Mute ambient sound"}
        className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md"
        style={{
          background: muted
            ? "linear-gradient(135deg, hsl(220 35% 10% / 0.85), hsl(220 35% 6% / 0.9))"
            : "linear-gradient(135deg, hsl(var(--candle) / 0.8), hsl(35 90% 50% / 0.9))",
          border: "1px solid hsl(var(--candle) / 0.4)",
          boxShadow: muted
            ? "0 4px 20px hsl(0 0% 0% / 0.5)"
            : "0 0 30px hsl(var(--candle) / 0.6), 0 4px 20px hsl(0 0% 0% / 0.5)",
          color: muted ? "hsl(var(--candle-soft))" : "hsl(220 50% 6%)",
        }}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </motion.button>
    </div>
  );
};

export default AudioToggle;
