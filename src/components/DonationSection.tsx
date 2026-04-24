import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Copy, Check, MessageCircle, Sparkles, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ScrollReveal from "./ScrollReveal";
import Candle from "./Candle";
import { useAudio } from "@/contexts/AudioContext";

interface Donation {
  id: string;
  donor_name: string | null;
  amount: number;
  currency: string;
  method: string;
  message: string | null;
  created_at: string;
}

const PRESETS = [50, 100, 250, 500, 1000, 2500];

// Real BD payment endpoints — manual settlement, automatic-feeling UX
const METHODS = [
  {
    id: "bkash",
    label: "bKash",
    bn: "বিকাশ",
    number: "01778307704",
    type: "Personal",
    accent: "hsl(330 80% 55%)",
    bgGrad: "linear-gradient(135deg, hsl(330 80% 18%), hsl(330 70% 10%))",
  },
  {
    id: "nagad",
    label: "Nagad",
    bn: "নগদ",
    number: "01688833485",
    type: "Personal",
    accent: "hsl(20 90% 55%)",
    bgGrad: "linear-gradient(135deg, hsl(20 80% 18%), hsl(20 70% 10%))",
  },
  {
    id: "rocket",
    label: "Rocket",
    bn: "রকেট",
    number: "016779758453",
    type: "DBBL",
    accent: "hsl(280 70% 60%)",
    bgGrad: "linear-gradient(135deg, hsl(280 60% 20%), hsl(280 60% 10%))",
  },
] as const;

// WhatsApp number for confirmation (uses same bKash number as receiving line)
const CONFIRM_WHATSAPP = "8801778307704";

const genReference = () => {
  const ts = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Math.random().toString(36).toUpperCase().slice(-3);
  return `HW-${ts}${rand}`;
};

const DonationSection = () => {
  const { playSpark } = useAudio();
  const [amount, setAmount] = useState<number>(500);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [method, setMethod] = useState<string>("bkash");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [copied, setCopied] = useState<string | null>(null);

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reference, setReference] = useState("");

  const fetchDonations = async () => {
    const { data } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12);
    if (data) setDonations(data as Donation[]);
    const { data: all } = await supabase.from("donations").select("amount");
    if (all) setTotal(all.reduce((s: number, r: any) => s + Number(r.amount || 0), 0));
  };

  useEffect(() => { fetchDonations(); }, []);

  const finalAmount = custom.trim() ? Number(custom) : amount;
  const selected = useMemo(() => METHODS.find((m) => m.id === method)!, [method]);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      playSpark();
      toast({ title: "Copied ✓", description: `${text} — paste in your ${selected.label} app.` });
      setTimeout(() => setCopied(null), 1800);
    } catch {
      toast({ title: "Copy failed", description: "Long-press the number to copy it manually.", variant: "destructive" });
    }
  };

  const handlePledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalAmount || finalAmount < 10) {
      toast({ title: "Add an amount", description: "Minimum ৳10 to keep it meaningful.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    playSpark();
    const ref = genReference();
    const { error } = await supabase.from("donations").insert({
      donor_name: name.trim() || null,
      amount: finalAmount,
      currency: "BDT",
      method,
      message: message.trim() ? `[${ref}] ${message.trim()}` : `[${ref}]`,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Couldn't pledge", description: error.message, variant: "destructive" });
      return;
    }
    setReference(ref);
    setConfirmOpen(true);
    fetchDonations();
  };

  const buildWhatsappLink = () => {
    const msg =
      `🕯️ হাদির ইচ্ছা — Donation Confirmation\n` +
      `\nReference: ${reference}` +
      `\nAmount: ৳${finalAmount}` +
      `\nMethod: ${selected.label} (${selected.number})` +
      (name.trim() ? `\nName: ${name.trim()}` : "") +
      `\n\n(Sending screenshot of payment now)`;
    return `https://wa.me/${CONFIRM_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section id="donate" className="relative py-28 md:py-36 section-padding overflow-hidden">
      <div className="absolute inset-0 hero-gradient opacity-80" aria-hidden="true" />

      <div className="max-w-6xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-14">
            <div className="flex justify-center mb-6"><Candle size={56} /></div>
            <p className="bengali-text text-base md:text-lg mb-3" style={{ color: "hsl(var(--candle-soft))" }}>
              এই আলো বাঁচিয়ে রাখো
            </p>
            <h2
              className="text-4xl md:text-6xl tracking-tight italic font-medium mb-4"
              style={{ color: "hsl(var(--foreground))", fontFamily: "'Cormorant Garamond', serif" }}
            >
              Keep his <span className="handwritten not-italic text-gradient-candle">light burning</span>
            </h2>
            <p className="text-base md:text-lg max-w-2xl mx-auto font-light" style={{ color: "hsl(42 22% 75%)" }}>
              বাংলাদেশের জন্য এই platform চিরকাল ফ্রি — কিন্তু servers, domains আর curation-এর খরচ আছে।
              তাঁর নামে ছোট্ট একটি দান পরের শিক্ষার্থীর জন্য আলো জ্বালিয়ে রাখে।
            </p>
            {total > 0 && (
              <p className="mt-6 handwritten text-2xl text-gradient-candle">
                ৳{Math.round(total).toLocaleString()} pledged · {donations.length}+ candles lit
              </p>
            )}
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
          {/* Form */}
          <ScrollReveal>
            <form onSubmit={handlePledge} className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
              {/* Amount */}
              <div>
                <label className="text-xs tracking-[0.2em] uppercase sans block mb-3" style={{ color: "hsl(42 25% 60%)" }}>
                  Choose an amount · পরিমাণ বাছাই করো (BDT)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => { setAmount(p); setCustom(""); playSpark(); }}
                      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 sans"
                      style={{
                        background: !custom && amount === p
                          ? "linear-gradient(135deg, hsl(var(--candle)), hsl(35 90% 50%))"
                          : "hsl(220 30% 12%)",
                        color: !custom && amount === p ? "hsl(220 50% 6%)" : "hsl(var(--candle-soft))",
                        border: "1px solid hsl(var(--candle) / 0.25)",
                      }}
                    >
                      ৳{p}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={10}
                  inputMode="numeric"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="Or enter custom amount · নিজস্ব পরিমাণ"
                  className="w-full px-4 py-3 rounded-lg sans text-sm focus:outline-none focus:ring-2"
                  style={{
                    background: "hsl(220 30% 8% / 0.6)",
                    border: "1px solid hsl(var(--candle) / 0.2)",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </div>

              {/* Method picker */}
              <div>
                <label className="text-xs tracking-[0.2em] uppercase sans block mb-3" style={{ color: "hsl(42 25% 60%)" }}>
                  Payment method · কীভাবে পাঠাবে?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {METHODS.map((m) => {
                    const active = method === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => { setMethod(m.id); playSpark(); }}
                        className="flex flex-col items-center gap-1 px-3 py-3 rounded-lg text-sm font-semibold transition-all sans"
                        style={{
                          background: active ? m.bgGrad : "hsl(220 30% 10%)",
                          border: active ? `1px solid ${m.accent}` : "1px solid hsl(var(--candle) / 0.15)",
                          color: active ? "hsl(0 0% 100%)" : "hsl(var(--candle-soft))",
                          boxShadow: active ? `0 0 24px -6px ${m.accent}` : undefined,
                        }}
                      >
                        <span>{m.label}</span>
                        <span className="bengali-text text-[11px] opacity-80">{m.bn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected method — copy-to-clipboard payment card */}
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-5"
                style={{ background: selected.bgGrad, border: `1px solid ${selected.accent}` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] tracking-[0.22em] uppercase sans opacity-70" style={{ color: "hsl(0 0% 100%)" }}>
                      Send via {selected.label} · {selected.type}
                    </p>
                    <p className="bengali-text text-sm mt-0.5" style={{ color: "hsl(0 0% 100% / 0.85)" }}>
                      নিচের নম্বরে Send Money করো
                    </p>
                  </div>
                  <ShieldCheck size={18} style={{ color: selected.accent, filter: "brightness(1.4)" }} />
                </div>

                <div className="flex items-center gap-2">
                  <code
                    className="flex-1 px-4 py-3 rounded-lg text-lg font-bold tracking-wider sans select-all"
                    style={{ background: "hsl(220 50% 4% / 0.5)", color: "hsl(0 0% 100%)", border: "1px solid hsl(0 0% 100% / 0.1)" }}
                  >
                    {selected.number}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selected.number, "num")}
                    className="px-4 py-3 rounded-lg font-semibold sans text-sm transition-all active:scale-95 inline-flex items-center gap-1.5"
                    style={{ background: "hsl(0 0% 100%)", color: "hsl(220 50% 6%)" }}
                    aria-label={`Copy ${selected.label} number`}
                  >
                    {copied === "num" ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                  </button>
                </div>
              </motion.div>

              {/* Optional name + message */}
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name · তোমার নাম (optional)"
                  maxLength={80}
                  className="px-4 py-3 rounded-lg sans text-sm focus:outline-none focus:ring-2"
                  style={{ background: "hsl(220 30% 8% / 0.6)", border: "1px solid hsl(var(--candle) / 0.2)", color: "hsl(var(--foreground))" }}
                />
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="A short note for Hadi (optional)"
                  maxLength={280}
                  className="px-4 py-3 rounded-lg sans text-sm focus:outline-none focus:ring-2"
                  style={{ background: "hsl(220 30% 8% / 0.6)", border: "1px solid hsl(var(--candle) / 0.2)", color: "hsl(var(--foreground))" }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-4 rounded-xl font-semibold sans transition-all duration-300 active:scale-[0.97] glow-gold disabled:opacity-60 inline-flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, hsl(var(--candle)), hsl(35 90% 50%))", color: "hsl(220 50% 6%)" }}
              >
                <Heart size={18} fill="currentColor" />
                {submitting ? "Confirming..." : `Pledge ৳${finalAmount || 0} & light a candle`}
              </button>

              <p className="text-xs sans text-center bengali-text" style={{ color: "hsl(42 22% 60%)" }}>
                Pledge করার পর আমরা একটি reference code দেবো, যেটি দিয়ে তুমি WhatsApp-এ payment screenshot পাঠাবে।
                সাধারণত কয়েক মিনিটে confirm হয়ে যায়।
              </p>
            </form>
          </ScrollReveal>

          {/* Recent pledges */}
          <ScrollReveal delay={0.15}>
            <div className="glass-card rounded-2xl p-6 md:p-7">
              <h3
                className="text-2xl italic font-medium mb-1"
                style={{ color: "hsl(var(--candle-soft))", fontFamily: "'Cormorant Garamond', serif" }}
              >
                Candles lit by hearts
              </h3>
              <p className="text-xs sans tracking-wide mb-5" style={{ color: "hsl(42 22% 55%)" }}>
                Recent pledges in his memory · সাম্প্রতিক দান
              </p>
              <div className="space-y-3 max-h-[440px] overflow-y-auto pr-2">
                {donations.length === 0 && (
                  <p className="text-sm font-light italic" style={{ color: "hsl(42 22% 65%)" }}>
                    Be the first to keep his light burning.
                  </p>
                )}
                {donations.map((d) => {
                  // Strip [REF-XXX] prefix from public display
                  const cleanMsg = d.message?.replace(/^\[HW-[A-Z0-9]+\]\s*/, "").trim();
                  return (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg"
                      style={{ background: "hsl(220 30% 9% / 0.6)", border: "1px solid hsl(var(--candle) / 0.12)" }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="handwritten text-base" style={{ color: "hsl(var(--candle-soft))" }}>
                          {d.donor_name || "Anonymous · বেনামী"}
                        </span>
                        <span className="text-sm font-bold sans text-gradient-candle">
                          {d.currency === "BDT" ? "৳" : "$"}{Number(d.amount).toLocaleString()}
                        </span>
                      </div>
                      {cleanMsg && (
                        <p className="text-sm font-light italic" style={{ color: "hsl(42 22% 75%)" }}>
                          "{cleanMsg}"
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Confirmation modal — feels like an automatic post-payment flow */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "hsl(220 60% 2% / 0.85)", backdropFilter: "blur(8px)" }}
            onClick={() => setConfirmOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6 md:p-7 relative overflow-hidden"
              style={{
                background: "linear-gradient(180deg, hsl(220 35% 8%), hsl(220 40% 5%))",
                border: "1px solid hsl(var(--candle) / 0.4)",
                boxShadow: "0 30px 80px -20px hsl(220 80% 0% / 0.8), 0 0 60px -10px hsl(var(--candle) / 0.3)",
              }}
            >
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, hsl(var(--candle) / 0.3), transparent 70%)" }} />

              <div className="text-center relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 250 }}
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, hsl(var(--candle)), hsl(35 90% 50%))" }}
                >
                  <Sparkles size={28} style={{ color: "hsl(220 50% 6%)" }} />
                </motion.div>
                <p className="bengali-text text-sm mb-1" style={{ color: "hsl(var(--candle))" }}>
                  ধন্যবাদ — তোমার pledge সংরক্ষিত হয়েছে
                </p>
                <h3
                  className="text-2xl italic font-semibold mb-2"
                  style={{ color: "hsl(var(--foreground))", fontFamily: "'Cormorant Garamond', serif" }}
                >
                  One last step
                </h3>

                <div className="my-4 p-3 rounded-lg" style={{ background: "hsl(220 50% 4% / 0.6)", border: "1px solid hsl(var(--candle) / 0.25)" }}>
                  <p className="text-[10px] uppercase tracking-[0.22em] sans mb-1" style={{ color: "hsl(42 25% 55%)" }}>Your reference</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-xl font-bold tracking-wider sans text-gradient-candle">{reference}</code>
                    <button
                      onClick={() => copyToClipboard(reference, "ref")}
                      className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
                      aria-label="Copy reference"
                    >
                      {copied === "ref" ? <Check size={14} className="text-green-400" /> : <Copy size={14} style={{ color: "hsl(var(--candle))" }} />}
                    </button>
                  </div>
                </div>

                <p className="text-sm leading-relaxed bengali-text mb-1" style={{ color: "hsl(42 22% 80%)" }}>
                  এখন <span className="font-bold" style={{ color: selected.accent }}>{selected.label}</span> অ্যাপ থেকে{" "}
                  <span className="font-bold text-gradient-candle">৳{finalAmount}</span> পাঠাও:
                </p>
                <p className="text-xl font-bold sans my-2 select-all" style={{ color: "hsl(0 0% 100%)" }}>
                  {selected.number}
                </p>
                <p className="text-xs bengali-text mb-5" style={{ color: "hsl(42 22% 65%)" }}>
                  তারপর নিচের button-এ tap করে WhatsApp-এ screenshot পাঠাও — instantly confirm হবে।
                </p>

                <a
                  href={buildWhatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSpark()}
                  className="w-full px-5 py-3.5 rounded-xl font-semibold sans inline-flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
                  style={{ background: "linear-gradient(135deg, hsl(142 70% 40%), hsl(142 70% 30%))", color: "hsl(0 0% 100%)" }}
                >
                  <MessageCircle size={18} fill="currentColor" />
                  Confirm on WhatsApp
                </a>
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="w-full mt-2 text-xs sans py-2 transition-colors"
                  style={{ color: "hsl(42 22% 55%)" }}
                >
                  I'll confirm later · পরে করবো
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default DonationSection;
