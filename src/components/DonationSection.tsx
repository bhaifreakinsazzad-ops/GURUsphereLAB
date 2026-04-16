import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Coffee, Smartphone, Globe } from "lucide-react";
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

const PRESETS = [100, 250, 500, 1000, 2500];
const METHODS = [
  { id: "bkash", label: "bKash", hint: "01XXXXXXXXX", icon: Smartphone, color: "hsl(330 80% 55%)" },
  { id: "nagad", label: "Nagad", hint: "01XXXXXXXXX", icon: Smartphone, color: "hsl(20 90% 55%)" },
  { id: "paypal", label: "PayPal", hint: "paypal.me/hadiwishes", icon: Globe, color: "hsl(220 80% 55%)" },
  { id: "bmc", label: "Buy Me a Coffee", hint: "buymeacoffee.com/hadi", icon: Coffee, color: "hsl(45 95% 55%)" },
] as const;

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

  const fetchDonations = async () => {
    const { data } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12);
    if (data) {
      setDonations(data as Donation[]);
    }
    const { data: all } = await supabase.from("donations").select("amount");
    if (all) setTotal(all.reduce((s: number, r: any) => s + Number(r.amount || 0), 0));
  };

  useEffect(() => { fetchDonations(); }, []);

  const finalAmount = custom.trim() ? Number(custom) : amount;

  const handlePledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalAmount || finalAmount < 10) {
      toast({ title: "Add an amount", description: "Minimum 10 to keep it meaningful.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    playSpark();
    const { error } = await supabase.from("donations").insert({
      donor_name: name.trim() || null,
      amount: finalAmount,
      currency: method === "paypal" || method === "bmc" ? "USD" : "BDT",
      method,
      message: message.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Couldn't pledge", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Pledge recorded 🕯️", description: "Open your payment app to complete it. Thank you for keeping his light." });
    setCustom(""); setName(""); setMessage("");
    fetchDonations();
  };

  const selected = METHODS.find((m) => m.id === method)!;

  return (
    <section
      id="donate"
      className="relative py-28 md:py-36 section-padding overflow-hidden"
    >
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
              This platform is free, forever — but servers, domains, and curation cost money.
              A small gift in his name keeps it alive for the next student who needs it.
            </p>
            {total > 0 && (
              <p className="mt-6 handwritten text-2xl text-gradient-candle">
                ৳{Math.round(total).toLocaleString()} pledged so far · {donations.length}+ candles lit
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
                  Choose an amount (BDT)
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
                  placeholder="Or enter custom amount"
                  className="w-full px-4 py-3 rounded-lg sans text-sm focus:outline-none focus:ring-2"
                  style={{
                    background: "hsl(220 30% 8% / 0.6)",
                    border: "1px solid hsl(var(--candle) / 0.2)",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </div>

              {/* Method */}
              <div>
                <label className="text-xs tracking-[0.2em] uppercase sans block mb-3" style={{ color: "hsl(42 25% 60%)" }}>
                  How will you send it?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {METHODS.map((m) => {
                    const Icon = m.icon;
                    const active = method === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => { setMethod(m.id); playSpark(); }}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all sans"
                        style={{
                          background: active ? `linear-gradient(135deg, ${m.color}, hsl(220 30% 8%))` : "hsl(220 30% 10%)",
                          border: active ? `1px solid ${m.color}` : "1px solid hsl(var(--candle) / 0.15)",
                          color: active ? "hsl(0 0% 100%)" : "hsl(var(--candle-soft))",
                        }}
                      >
                        <Icon size={16} />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs mt-2 sans" style={{ color: "hsl(42 25% 55%)" }}>
                  Send to: <span className="text-gradient-candle font-bold">{selected.hint}</span>
                </p>
              </div>

              {/* Optional name + message */}
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
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
                {submitting ? "Lighting..." : `Pledge ৳${finalAmount || 0} & light a candle`}
              </button>

              <p className="text-xs sans text-center" style={{ color: "hsl(42 22% 55%)" }}>
                After pledging, open your <span className="text-gradient-candle font-semibold">{selected.label}</span> app and send the amount.
                Every taka funds servers, domains and free knowledge for one more student.
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
                Recent pledges in his memory
              </p>
              <div className="space-y-3 max-h-[440px] overflow-y-auto pr-2">
                {donations.length === 0 && (
                  <p className="text-sm font-light italic" style={{ color: "hsl(42 22% 65%)" }}>
                    Be the first to keep his light burning.
                  </p>
                )}
                {donations.map((d) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg"
                    style={{ background: "hsl(220 30% 9% / 0.6)", border: "1px solid hsl(var(--candle) / 0.12)" }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="handwritten text-base" style={{ color: "hsl(var(--candle-soft))" }}>
                        {d.donor_name || "Anonymous"}
                      </span>
                      <span className="text-sm font-bold sans text-gradient-candle">
                        {d.currency === "BDT" ? "৳" : "$"}{Number(d.amount).toLocaleString()}
                      </span>
                    </div>
                    {d.message && (
                      <p className="text-sm font-light italic" style={{ color: "hsl(42 22% 75%)" }}>
                        "{d.message}"
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
