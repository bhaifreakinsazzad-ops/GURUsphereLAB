import { Link } from "react-router-dom";
import {
  Telescope, Library, Compass, Sparkles, ScrollText, Users, Palette, Heart, type LucideIcon,
} from "lucide-react";
import LabSectionHeader from "./LabSectionHeader";
import GlassCard from "./GlassCard";
import ScrollReveal from "@/components/ScrollReveal";

type Card = {
  title: string;
  bn: string;
  desc: string;
  to: string;
  external?: boolean;
  icon: LucideIcon;
  color: string;
};

const CARDS: Card[] = [
  { title: "Live Universe Classroom", bn: "লাইভ ক্লাসরুম", desc: "Orbiting planets, real teachers — join a live class and learn together.", to: "/#classroom", icon: Telescope, color: "var(--lab-cyan)" },
  { title: "Infinite Library", bn: "অসীম গ্রন্থাগার", desc: "Breathing books with voice notes — Tagore to MIT, all free.", to: "/#library", icon: Library, color: "var(--lab-violet)" },
  { title: "Hadi Meter", bn: "হাদী মিটার", desc: "Calculate your 7 promises — a 2-minute self-reflection.", to: "/hadi-meter", icon: Compass, color: "var(--candle)" },
  { title: "Learning Path", bn: "জ্ঞানের নক্ষত্রপথ", desc: "Walk the constellation: politics, literature, cinema, art.", to: "/#learning-path", icon: Sparkles, color: "var(--lab-cyan)" },
  { title: "Research Archive", bn: "গবেষণা সংগ্রহ", desc: "Free papers, MIT-grade resources curated for Bangladesh.", to: "/research-archive", icon: ScrollText, color: "var(--pathshala-green)" },
  { title: "Team Projects", bn: "দলগত প্রকল্প", desc: "Build with peers — open-source, cinema, literature, civic tech.", to: "/team-projects", icon: Users, color: "var(--hadi-red-soft)" },
  { title: "Mentorship", bn: "পথপ্রদর্শন", desc: "Find a guide. Become one. The school never closes.", to: "/mentorship", icon: Palette, color: "var(--candle-soft)" },
  { title: "Memorial Wall", bn: "স্মৃতির দেয়াল", desc: "Light a candle. Leave a wish. Keep his name alive.", to: "/#memorial", icon: Heart, color: "var(--hadi-red-soft)" },
];

const CommunityGrid = () => {
  return (
    <section className="relative py-24 md:py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <LabSectionHeader
          eyebrow="Community Hub · কমিউনিটি"
          title="One platform. Every door open."
          bengaliTitle="একটি প্ল্যাটফর্ম, সব দরজা খোলা"
          subtitle="Free knowledge, live classes, mentorship, and memorial — built by and for Bangladesh."
        />

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            const Inner = (
              <GlassCard glow="cyan" hoverLift className="p-6 mb-6 break-inside-avoid block">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `hsl(${card.color} / 0.15)`, color: `hsl(${card.color})` }}
                >
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
                <p className="bengali-text text-sm mt-1" style={{ color: `hsl(${card.color})` }}>{card.bn}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                <span
                  className="inline-flex items-center gap-1 mt-4 text-xs font-semibold tracking-wide"
                  style={{ color: "hsl(var(--lab-cyan))" }}
                >
                  Open →
                </span>
              </GlassCard>
            );

            return (
              <ScrollReveal key={card.title} delay={i * 0.05}>
                {card.to.startsWith("/") && !card.to.includes("#") ? (
                  <Link to={card.to}>{Inner}</Link>
                ) : (
                  <a href={card.to}>{Inner}</a>
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CommunityGrid;
