import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";

export type RadarDatum = { subject: string; value: number; fullMark: number };

const HadiRadar = ({ data }: { data: RadarDatum[] }) => (
  <div className="w-full h-[340px]">
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="78%" data={data}>
        <PolarGrid stroke="hsl(var(--lab-cyan) / 0.25)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "hsl(var(--lab-cyan))", fontSize: 11, fontFamily: "'Noto Sans Bengali', sans-serif" }}
        />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="You"
          dataKey="value"
          stroke="hsl(var(--lab-violet))"
          strokeWidth={2}
          fill="hsl(var(--lab-violet))"
          fillOpacity={0.35}
        />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

export default HadiRadar;
