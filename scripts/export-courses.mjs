import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const envText = await fs.readFile(path.join(root, ".env"), "utf8");
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1).trim().replace(/^['\"]|['\"]$/g, "")];
    }),
);

const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env");

const select = [
  "id", "slug", "title", "title_bn", "short_description", "description",
  "difficulty", "language", "estimated_minutes", "thumbnail_url", "subject_id",
  "outcomes", "prerequisites", "published_at", "created_at", "updated_at",
  "subjects(slug,name,name_bn)",
].join(",");

const endpoint = `${url}/rest/v1/courses?select=${encodeURIComponent(select)}&status=eq.published&visibility=eq.public&order=published_at.asc,title.asc&limit=1000`;
const response = await fetch(endpoint, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
if (!response.ok) throw new Error(`Supabase request failed: ${response.status} ${await response.text()}`);
const rows = await response.json();

const courses = rows.map((row) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  title_bn: row.title_bn,
  short_description: row.short_description,
  description: row.description,
  difficulty: row.difficulty,
  language: row.language,
  estimated_minutes: row.estimated_minutes,
  estimated_hours: Math.round((row.estimated_minutes / 60) * 10) / 10,
  thumbnail_url: row.thumbnail_url,
  subject_id: row.subject_id,
  subject: row.subjects ?? null,
  outcomes: row.outcomes ?? [],
  prerequisites: row.prerequisites ?? [],
  published_at: row.published_at,
  created_at: row.created_at,
  updated_at: row.updated_at,
}));

const outDir = path.join(root, "exports");
await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(path.join(outDir, "courses.json"), JSON.stringify({ exported_at: new Date().toISOString(), count: courses.length, courses }, null, 2) + "\n");

const csvFields = ["id", "slug", "title", "title_bn", "short_description", "difficulty", "language", "estimated_minutes", "estimated_hours", "subject", "published_at"];
const csvCell = (value) => {
  const text = value == null ? "" : Array.isArray(value) ? value.join("; ") : String(value);
  return `"${text.replaceAll('"', '""')}"`;
};
const csv = [csvFields.join(","), ...courses.map((course) => [
  course.id, course.slug, course.title, course.title_bn, course.short_description,
  course.difficulty, course.language, course.estimated_minutes, course.estimated_hours,
  course.subject?.name, course.published_at,
].map(csvCell).join(","))].join("\n") + "\n";
await fs.writeFile(path.join(outDir, "courses.csv"), csv);

const lines = [
  "# GURUsphere Public Course Catalog",
  "",
  `Exported: ${new Date().toISOString()}`,
  `Published public courses: **${courses.length}**`,
  "",
  "| # | Course | Subject | Difficulty | Language | Hours | Slug |",
  "|---:|---|---|---|---|---:|---|",
  ...courses.map((course, index) => {
    const title = String(course.title ?? "").replaceAll("|", "\\|");
    const subject = String(course.subject?.name ?? "Uncategorized").replaceAll("|", "\\|");
    const description = course.short_description ? ` — ${String(course.short_description).replaceAll("|", "\\|")}` : "";
    return `| ${index + 1} | [${title}](/courses/${course.slug})${description} | ${subject} | ${course.difficulty} | ${course.language} | ${course.estimated_hours} | \`${course.slug}\` |`;
  }),
  "",
];
await fs.writeFile(path.join(outDir, "courses.md"), lines.join("\n"));
console.log(JSON.stringify({ count: courses.length, files: ["exports/courses.json", "exports/courses.csv", "exports/courses.md"] }, null, 2));
