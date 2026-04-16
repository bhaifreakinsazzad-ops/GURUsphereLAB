import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

interface AudioContextType {
  muted: boolean;
  toggleMute: () => void;
  playSpark: () => void;
  ambientReady: boolean;
}

const AudioCtx = createContext<AudioContextType>({
  muted: true,
  toggleMute: () => {},
  playSpark: () => {},
  ambientReady: false,
});

/**
 * Tiny synthesized ambient + spark using WebAudio (zero file size, zero cost).
 * - Ambient: very soft drone (two detuned sines + slow LFO) — feels like wind through a vigil hall.
 * - Spark: a brief crackle for candle hover / button press.
 */
export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [muted, setMuted] = useState(true); // start muted (autoplay policies + respect)
  const [ambientReady, setAmbientReady] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const ambientNodesRef = useRef<{ stop: () => void } | null>(null);

  const ensureCtx = () => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    return ctxRef.current;
  };

  const startAmbient = () => {
    const ctx = ensureCtx();
    if (!ctx || !masterRef.current || ambientNodesRef.current) return;

    // Two detuned oscillators -> low-pass -> slow LFO on gain
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    o1.type = "sine"; o2.type = "sine";
    o1.frequency.value = 110;   // A2
    o2.frequency.value = 110.6; // detuned for shimmer

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 480;

    const ambGain = ctx.createGain();
    ambGain.gain.value = 0.07;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 0.04;
    lfo.connect(lfoGain);
    lfoGain.connect(ambGain.gain);

    o1.connect(lp);
    o2.connect(lp);
    lp.connect(ambGain);
    ambGain.connect(masterRef.current);

    o1.start(); o2.start(); lfo.start();
    ambientNodesRef.current = {
      stop: () => { try { o1.stop(); o2.stop(); lfo.stop(); } catch {} },
    };
    setAmbientReady(true);
  };

  const playSpark = () => {
    if (muted) return;
    const ctx = ensureCtx();
    if (!ctx || !masterRef.current) return;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(820, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    osc.connect(g);
    g.connect(masterRef.current);
    osc.start(now);
    osc.stop(now + 0.25);
  };

  const toggleMute = () => {
    const ctx = ensureCtx();
    if (!ctx || !masterRef.current) return;
    if (ctx.state === "suspended") ctx.resume();
    if (muted) {
      startAmbient();
      // Fade up
      const now = ctx.currentTime;
      masterRef.current.gain.cancelScheduledValues(now);
      masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, now);
      masterRef.current.gain.linearRampToValueAtTime(0.6, now + 1.2);
      setMuted(false);
    } else {
      const now = ctx.currentTime;
      masterRef.current.gain.cancelScheduledValues(now);
      masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, now);
      masterRef.current.gain.linearRampToValueAtTime(0, now + 0.6);
      setMuted(true);
    }
  };

  useEffect(() => {
    return () => {
      ambientNodesRef.current?.stop();
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  return (
    <AudioCtx.Provider value={{ muted, toggleMute, playSpark, ambientReady }}>
      {children}
    </AudioCtx.Provider>
  );
};

export const useAudio = () => useContext(AudioCtx);
