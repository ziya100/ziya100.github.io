import React, { useEffect, useMemo, useState } from "react";
import {
  Shield,
  Terminal,
  Bug,
  Lock,
  Globe,
  BookOpen,
  Wrench,
  Mail,
  ExternalLink,
  Search,
  Menu,
  Layers,
  Database,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  X,
  KeyRound,
} from "lucide-react";

const API_BASE_URL = "https://ziya-portfolio-api.vercel.app";

const DEFAULT_CONTENT = {
  profile: {
    name: "Ziya Abdullayev",
    title: "Cyber Security Researcher",
    headline: "Web Application Security, Bug Bounty & Responsible Disclosure",
    summary:
      "I help organizations identify and responsibly report security vulnerabilities before they can be abused. My focus is web application security, API testing, penetration testing and clear security reporting.",
    email: "ziya.abdullayev.40@gmail.com",
    linkedin: "https://www.linkedin.com/in/ziya-abdullayev-cyber/",
    github: "https://github.com/ziya100/Tryhackme",
    tryhackme: "https://tryhackme.com/p/ziko600",
  },
  stats: [
    { label: "Research", value: "Web/API", note: "Manual security testing" },
    { label: "Disclosure", value: "VDP", note: "Ethical reporting" },
    { label: "Labs", value: "100+", note: "Hands-on practice" },
    { label: "Focus", value: "Impact", note: "Business risk first" },
  ],
  achievements: [
    {
      title: "Polestar VDP",
      tag: "Critical",
      description:
        "Reported a confirmed Critical security vulnerability through responsible disclosure. Technical details are withheld in accordance with disclosure rules.",
      link: "",
      year: "2026",
    },
    {
      title: "University of Texas Hall of Fame",
      tag: "Hall of Fame",
      description: "Recognized for responsibly reporting information disclosure vulnerabilities.",
      link: "https://security.utexas.edu/hall-of-fame",
      year: "2026",
    },
    {
      title: "European Commission / CERT-EU",
      tag: "Fixed",
      description: "Reported a vulnerability through the official disclosure process. The issue was reviewed and fixed.",
      link: "https://cert.europa.eu/hall-of-fame",
      year: "2026",
    },
    {
      title: "eJPTv2",
      tag: "Certification",
      description: "Practical junior penetration testing certification focused on real-world assessment methodology.",
      link: "https://certs.ine.com/c9228976-f172-4e81-891b-fa5fd61cfac9#acc.Hz0BYRLr",
      year: "2025",
    },
  ],
  disclosures: [
    {
      organization: "Polestar",
      type: "VDP",
      status: "Confirmed",
      severity: "Critical",
      disclosure:
        "Technical details are not publicly disclosed. Public mention is limited to non-technical responsible disclosure context.",
    },
    {
      organization: "University of Texas",
      type: "Responsible Disclosure",
      status: "Published",
      severity: "Information Disclosure",
      disclosure: "Hall of Fame recognition for valid responsible disclosure reports.",
    },
    {
      organization: "European Commission",
      type: "VDP / CVD",
      status: "Fixed",
      severity: "Not Public",
      disclosure: "Issue fixed through the official disclosure process.",
    },
  ],
  tools: [
    { name: "Burp Suite", use: "Manual web testing, request analysis, Repeater and Intruder workflows" },
    { name: "OWASP ZAP", use: "Proxying, crawling, passive scanning and lab-based testing" },
    { name: "ffuf", use: "Content discovery, parameter fuzzing and targeted wordlist testing" },
    { name: "subfinder / httpx", use: "Subdomain discovery and live host filtering" },
    { name: "Nmap", use: "Network enumeration in authorized environments" },
    { name: "BloodHound", use: "Active Directory relationship and attack-path analysis" },
    { name: "Impacket", use: "Windows and Active Directory protocol testing in labs" },
    { name: "Wireshark", use: "Network traffic inspection and packet analysis" },
  ],
  learning: [
    {
      topic: "NoSQL Injection",
      note: "Studied MongoDB-style boolean conditions, operator injection and backend query logic manipulation in lab environments.",
      date: "2026-05-08",
    },
    {
      topic: "XXE",
      note: "Learned how unsafe XML parsing and external entities can lead to file disclosure, SSRF-style requests or denial of service.",
      date: "2026-05-06",
    },
    {
      topic: "Active Directory Enumeration",
      note: "Practiced Linux-based credentialed enumeration with SMB, LDAP, BloodHound.py, NetExec, Impacket and rpcclient.",
      date: "2026-05-05",
    },
  ],
};

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "achievements", label: "Achievements" },
  { id: "posts", label: "Posts" },
  { id: "pages", label: "Pages" },
  { id: "disclosure", label: "Disclosure" },
  { id: "tools", label: "Tools" },
  { id: "contact", label: "Contact" },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function normalizeContent(content) {
  const c = content || {};
  return {
    profile: { ...DEFAULT_CONTENT.profile, ...(c.profile || {}) },
    stats: Array.isArray(c.stats) && c.stats.length ? c.stats : DEFAULT_CONTENT.stats,
    achievements:
      Array.isArray(c.achievements) && c.achievements.length
        ? c.achievements
        : DEFAULT_CONTENT.achievements,
    disclosures:
      Array.isArray(c.disclosures) && c.disclosures.length
        ? c.disclosures
        : DEFAULT_CONTENT.disclosures,
    tools: Array.isArray(c.tools) && c.tools.length ? c.tools : DEFAULT_CONTENT.tools,
    learning: Array.isArray(c.learning) && c.learning.length ? c.learning : DEFAULT_CONTENT.learning,
  };
}

async function apiFetch(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

function CyberBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(139,92,246,0.18),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.13),transparent_30%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(148,163,184,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.7)_1px,transparent_1px)] [background-size:46px_46px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
    </div>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl transition duration-300 hover:border-cyan-300/30 hover:bg-slate-900/75",
        className
      )}
    >
      {children}
    </div>
  );
}

function Badge({ children, tone = "cyan" }) {
  const tones = {
    cyan: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
    green: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
    amber: "border-amber-300/20 bg-amber-300/10 text-amber-100",
    red: "border-red-300/20 bg-red-300/10 text-red-100",
    violet: "border-violet-300/20 bg-violet-300/10 text-violet-100",
    slate: "border-slate-300/20 bg-slate-300/10 text-slate-100",
  };
  return (
    <span className={cn("inline-flex max-w-full items-center rounded-full border px-3 py-1 text-xs font-bold leading-none", tones[tone] || tones.cyan)}>
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

function Section({ id, eyebrow, title, subtitle, children }) {
  return (
    <section id={id} className="relative scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          {eyebrow && (
            <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
              <span className="truncate">{eyebrow}</span>
            </div>
          )}
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{title}</h2>
          {subtitle && <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="group flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 shadow-lg shadow-cyan-950/40">
            <Shield className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <div className="text-sm font-black uppercase tracking-[0.26em] text-white">ZiyaSec</div>
            <div className="text-xs text-slate-400">Security Research Portfolio</div>
          </div>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <button
          className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {NAV_ITEMS.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ content }) {
  const p = content.profile;
  return (
    <section id="home" className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-100">
            <CheckCircle2 className="h-4 w-4" /> Authorized testing and responsible disclosure
          </div>
          <h1 className="max-w-5xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {p.name}
            <span className="block bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">{p.title}</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-semibold text-cyan-100 sm:text-2xl">{p.headline}</p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">{p.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#posts" className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-cyan-950/40 transition hover:bg-white">
              <Terminal className="h-4 w-4" /> Read Posts
            </a>
            <a href="#disclosure" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10">
              <Shield className="h-4 w-4" /> Disclosure Portfolio
            </a>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.stats.map((s, i) => (
              <div key={`${s.label}-${i}`} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="mt-1 text-sm font-bold text-cyan-100">{s.label}</div>
                <div className="mt-1 text-xs text-slate-400">{s.note}</div>
              </div>
            ))}
          </div>
        </div>

        <GlassCard className="relative overflow-hidden p-0">
          <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs font-bold text-slate-400">research-terminal</span>
            </div>
          </div>
          <div className="space-y-4 p-6 font-mono text-sm">
            <div className="text-emerald-300">$ whoami</div>
            <div className="break-words text-slate-200">
              {p.name.toLowerCase().replaceAll(" ", "_")} :: {p.title}
            </div>
            <div className="text-emerald-300">$ focus --list</div>
            <div className="grid gap-3">
              {["Web Application Security", "API Security", "Bug Bounty", "Responsible Disclosure", "Penetration Testing"].map((x) => (
                <div key={x} className="flex items-center gap-3 rounded-2xl border border-cyan-300/10 bg-cyan-300/5 p-3 text-slate-200">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,.9)]" /> {x}
                </div>
              ))}
            </div>
            <div className="text-emerald-300">$ public_disclosure_policy</div>
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-amber-100">
              <AlertTriangle className="mb-2 h-5 w-5" /> No customer data, tokens, private endpoints or unresolved technical details are published.
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function About() {
  return (
    <Section id="about" eyebrow="About" title="Security research with clean reporting and ethical boundaries." subtitle="A professional portfolio for skills, achievements, learning notes and sanitized security posts.">
      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard>
          <Shield className="h-8 w-8 text-cyan-200" />
          <h3 className="mt-5 text-xl font-black text-white">Responsible Disclosure</h3>
          <p className="mt-3 leading-7 text-slate-300">Reports are handled ethically: no data misuse, no public technical details without permission and clear communication with security teams.</p>
        </GlassCard>
        <GlassCard>
          <Bug className="h-8 w-8 text-emerald-200" />
          <h3 className="mt-5 text-xl font-black text-white">Web & API Security</h3>
          <p className="mt-3 leading-7 text-slate-300">Focus areas include access control, authentication, IDOR, JWT, SSRF, API logic flaws, file upload risks and information disclosure.</p>
        </GlassCard>
        <GlassCard>
          <FileText className="h-8 w-8 text-violet-200" />
          <h3 className="mt-5 text-xl font-black text-white">Report Quality</h3>
          <p className="mt-3 leading-7 text-slate-300">Strong reports explain impact, reproduction, business risk, screenshots, proof and practical remediation recommendations.</p>
        </GlassCard>
      </div>
    </Section>
  );
}

function Achievements({ content }) {
  return (
    <Section id="achievements" eyebrow="Achievements" title="Recognition, training and security milestones." subtitle="Public references only. Private technical details stay private.">
      <div className="grid gap-5 md:grid-cols-2">
        {content.achievements.map((a, i) => (
          <GlassCard key={`${a.title}-${i}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-400">{a.year}</div>
                <h3 className="mt-2 break-words text-2xl font-black text-white">{a.title}</h3>
              </div>
              <Badge tone={String(a.tag).toLowerCase().includes("critical") ? "red" : String(a.tag).toLowerCase().includes("fixed") ? "green" : "cyan"}>{a.tag}</Badge>
            </div>
            <p className="mt-4 leading-7 text-slate-300">{a.description}</p>
            {a.link && (
              <a href={a.link} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-200 hover:text-white">
                View reference <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}

function Posts({ posts }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);

  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))], [posts]);

  const filtered = posts.filter((p) => {
    const blob = [p.title, p.category, p.excerpt, p.body].join(" ").toLowerCase();
    return blob.includes(query.toLowerCase()) && (category === "All" || p.category === category);
  });

  return (
    <Section id="posts" eyebrow="Posts" title="Security posts and learning notes." subtitle="Latest public security posts and learning notes.">
      <FilterBar query={query} setQuery={setQuery} category={category} setCategory={setCategory} categories={categories} placeholder="Search posts..." />
      {filtered.length === 0 ? (
        <EmptyState text="No posts have been published yet." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {filtered.map((p) => (
            <GlassCard key={p.id || p.title} className="flex min-h-[330px] flex-col">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge>{p.category}</Badge>
                <Badge tone="violet">{p.difficulty}</Badge>
              </div>
              <h3 className="break-words text-2xl font-black leading-tight text-white">{p.title}</h3>
              <p className="mt-4 flex-1 leading-7 text-slate-300">{p.excerpt}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Calendar className="h-4 w-4" /> {String(p.created_at || p.date || "").slice(0, 10)}
                </div>
                <button onClick={() => setSelected(p)} className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-100 hover:bg-cyan-300/20">
                  Read <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
      {selected && <ArticleModal item={selected} onClose={() => setSelected(null)} />}
    </Section>
  );
}

function Pages({ pages }) {
  return (
    <Section id="pages" eyebrow="Custom Pages" title="Published pages and directories." subtitle="Public pages and resources will appear here.">
      {pages.length === 0 ? (
        <EmptyState text="No pages have been published yet." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <GlassCard key={page.id || page.slug}>
              <Badge tone="green">/{page.slug || slugify(page.title)}</Badge>
              <h3 className="mt-4 break-words text-2xl font-black text-white">{page.title}</h3>
              <p className="mt-3 leading-7 text-slate-300">{page.summary}</p>
              <a href={`#/p/${page.slug || slugify(page.title)}`} className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-100 hover:bg-cyan-300/20">
                Open page <ExternalLink className="h-4 w-4" />
              </a>
            </GlassCard>
          ))}
        </div>
      )}
    </Section>
  );
}

function EmptyState({ text }) {
  return <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-slate-300">{text}</div>;
}

function ArticleModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 p-4 backdrop-blur-xl">
      <div className="mx-auto my-8 max-w-3xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-cyan-950/40 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge>{item.category || "Article"}</Badge>
              {item.difficulty && <Badge tone="violet">{item.difficulty}</Badge>}
            </div>
            <h3 className="break-words text-3xl font-black text-white">{item.title}</h3>
            <div className="mt-3 text-sm font-bold text-slate-500">{String(item.created_at || item.date || "").slice(0, 10)}</div>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="whitespace-pre-wrap break-words text-base leading-8 text-slate-300">{item.body}</p>
      </div>
    </div>
  );
}

function FilterBar({ query, setQuery, category, setCategory, categories, placeholder }) {
  return (
    <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40"
        />
      </div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 font-bold text-white outline-none focus:border-cyan-300/40"
      >
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}

function Disclosure({ content }) {
  return (
    <Section id="disclosure" eyebrow="Responsible Disclosure" title="Public-safe disclosure portfolio." subtitle="No private endpoints, tokens, PoC steps, customer data or unresolved technical details.">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed text-left">
            <thead className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="w-[180px] px-6 py-5">Organization</th>
                <th className="w-[190px] px-6 py-5">Type</th>
                <th className="w-[150px] px-6 py-5">Status</th>
                <th className="w-[190px] px-6 py-5">Severity</th>
                <th className="px-6 py-5">Public Note</th>
              </tr>
            </thead>
            <tbody>
              {content.disclosures.map((d, i) => (
                <tr key={`${d.organization}-${i}`} className="border-b border-white/10 align-top last:border-0">
                  <td className="break-words px-6 py-5 font-black text-white">{d.organization}</td>
                  <td className="break-words px-6 py-5 text-slate-300">{d.type}</td>
                  <td className="px-6 py-5">
                    <Badge tone={String(d.status).toLowerCase().includes("fixed") || String(d.status).toLowerCase().includes("published") ? "green" : "cyan"}>
                      {d.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <Badge tone={String(d.severity).toLowerCase().includes("critical") ? "red" : "amber"}>{d.severity}</Badge>
                  </td>
                  <td className="break-words px-6 py-5 leading-7 text-slate-300">{d.disclosure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}

function Tools({ content }) {
  return (
    <Section id="tools" eyebrow="Toolbox" title="Tools and practical security workflow." subtitle="Tools are used only in authorized environments and labs.">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {content.tools.map((t, idx) => {
          const icons = [Terminal, Wrench, Globe, Database, Lock, Layers, Bug, KeyRound];
          const Icon = icons[idx % icons.length];
          return (
            <GlassCard key={`${t.name}-${idx}`}>
              <Icon className="h-7 w-7 text-cyan-200" />
              <h3 className="mt-5 break-words text-xl font-black text-white">{t.name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{t.use}</p>
            </GlassCard>
          );
        })}
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {content.learning.map((l, i) => (
          <GlassCard key={`${l.topic}-${i}`}>
            <BookOpen className="h-7 w-7 text-emerald-200" />
            <h3 className="mt-5 break-words text-xl font-black text-white">{l.topic}</h3>
            <p className="mt-3 leading-7 text-slate-300">{l.note}</p>
            <div className="mt-4 text-xs font-bold text-slate-500">{l.date}</div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}

function Contact({ content }) {
  const p = content.profile;
  return (
    <Section id="contact" eyebrow="Contact" title="Open to ethical security research, internships and junior AppSec/Pentest roles." subtitle="Professional contact links only.">
      <GlassCard className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h3 className="text-3xl font-black text-white">Let's connect professionally.</h3>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            For responsible disclosure communication, collaboration or professional opportunities, contact me through email or LinkedIn.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {p.email && (
            <a href={`mailto:${p.email}`} className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-white">
              <Mail className="h-4 w-4" /> Email
            </a>
          )}
          {p.linkedin && (
            <a href={p.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10">
              <ExternalLink className="h-4 w-4" /> LinkedIn
            </a>
          )}
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10">
              <ExternalLink className="h-4 w-4" /> GitHub
            </a>
          )}
        </div>
      </GlassCard>
    </Section>
  );
}

function CustomPageView({ page, onBack }) {
  return (
    <div className="min-h-screen text-slate-100 selection:bg-cyan-300 selection:text-slate-950">
      <CyberBackground />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10">
          ← Back home
        </button>
        <GlassCard className="p-6 sm:p-10">
          <Badge tone="green">/{page.slug}</Badge>
          <h1 className="mt-6 break-words text-4xl font-black tracking-tight text-white sm:text-6xl">{page.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">{page.summary}</p>
          <div className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-500">
            <Calendar className="h-4 w-4" /> {String(page.created_at || page.date || "").slice(0, 10)}
          </div>
          <div className="mt-8 border-t border-white/10 pt-8">
            <p className="whitespace-pre-wrap break-words text-base leading-8 text-slate-300">{page.body}</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function Footer({ content }) {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>© {new Date().getFullYear()} {content.profile.name}. Responsible security research portfolio.</div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">No sensitive details</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Authorized testing only</span>
        </div>
      </div>
    </footer>
  );
}

export default function CyberSecurityPortfolio() {
  const [route, setRoute] = useState(window.location.hash);
  const [content, setContent] = useState(normalizeContent(DEFAULT_CONTENT));
  const [dynamicContent, setDynamicContent] = useState({ posts: [], pages: [] });
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const syncRoute = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  async function loadContent() {
    try {
      const [contentData, data] = await Promise.all([apiFetch("/api/site-content"), apiFetch("/api/content")]);
      setContent(normalizeContent(contentData.content));
      setDynamicContent({ posts: data.posts || [], pages: data.pages || [] });
      setLoadError("");
    } catch (err) {
      setLoadError(err.message);
    }
  }

  useEffect(() => {
    loadContent();
  }, []);

  const customSlug = route.startsWith("#/p/") ? decodeURIComponent(route.replace("#/p/", "")) : null;
  const page = customSlug ? dynamicContent.pages.find((p) => (p.slug || slugify(p.title)) === customSlug) : null;

  if (customSlug && page) {
    return <CustomPageView page={page} onBack={() => { window.location.hash = "home"; }} />;
  }

  return (
    <div className="min-h-screen text-slate-100 selection:bg-cyan-300 selection:text-slate-950">
      <CyberBackground />
      <Navbar />
      {loadError && (
        <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm font-semibold text-amber-100">
            Content loading notice: {loadError}
          </div>
        </div>
      )}
      <main>
        <Hero content={content} />
        <About />
        <Achievements content={content} />
        <Posts posts={dynamicContent.posts} />
        <Pages pages={dynamicContent.pages} />
        <Disclosure content={content} />
        <Tools content={content} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
    </div>
  );
}

