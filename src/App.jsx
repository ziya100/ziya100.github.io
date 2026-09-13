import { useEffect, useMemo, useRef, useState } from "react";
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
  AlertTriangle,
  Calendar,
  X,
  KeyRound,
  ChevronRight,
  Zap,
  Target,
  Eye,
  Code2,
  Fingerprint,
  Cpu,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════════ */
const API_BASE_URL = "https://ziya-portfolio-api.vercel.app";

const DEFAULT_CONTENT = {
  profile: {
    firstName: "Ziya",
    lastName: "Abdullayev",
    name: "Ziya Abdullayev",
    title: "Cyber Security Researcher",
    headline: "Web Application Security, Bug Bounty & Responsible Disclosure",
    summary:
      "Identifying and responsibly disclosing security vulnerabilities across web applications and APIs. Specializing in access control, authentication flaws, API logic weaknesses and penetration testing with clear, actionable reporting.",
    email: "ziya.abdullayev.40@gmail.com",
    linkedin: "https://www.linkedin.com/in/ziya-abdullayev-cyber/",
    github: "https://github.com/ziya100",
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
    { name: "Burp Suite", use: "Manual web testing, request analysis, Repeater and Intruder workflows", level: 90 },
    { name: "OWASP ZAP", use: "Proxying, crawling, passive scanning and lab-based testing", level: 85 },
    { name: "ffuf", use: "Content discovery, parameter fuzzing and targeted wordlist testing", level: 88 },
    { name: "subfinder / httpx", use: "Subdomain discovery and live host filtering", level: 82 },
    { name: "Nmap", use: "Network enumeration in authorized environments", level: 80 },
    { name: "BloodHound", use: "Active Directory relationship and attack-path analysis", level: 75 },
    { name: "Impacket", use: "Windows and Active Directory protocol testing in labs", level: 78 },
    { name: "Wireshark", use: "Network traffic inspection and packet analysis", level: 83 },
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
  { id: "home", label: "Home", icon: Shield },
  { id: "about", label: "About", icon: Eye },
  { id: "achievements", label: "Achievements", icon: Target },
  { id: "posts", label: "Posts", icon: FileText },
  { id: "pages", label: "Pages", icon: Globe },
  { id: "disclosure", label: "Disclosure", icon: Lock },
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "contact", label: "Contact", icon: Mail },
];

/* ═══════════════════════════════════════════════════════════
   UTILS
   ═══════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════════════════ */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "visible", className)}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOGO
   ═══════════════════════════════════════════════════════════ */
function Logo({ small = false }) {
  const s = small ? "h-9 w-9" : "h-11 w-11";

  return (
    <a href="#home" className="flex items-center gap-3 group">
      <div className={cn(s, "relative grid place-items-center rounded-lg border border-white/[0.06] bg-[#08080c] group-hover:border-[var(--color-neon)]/20 transition-colors")}>
        <Shield className="h-4 w-4 text-[var(--color-neon)]" />
      </div>
      <div>
        <div className="text-sm font-bold tracking-[0.2em] text-white uppercase">
          Ziya<span className="text-[var(--color-neon)]">.</span>
        </div>
        {small && (
          <div className="text-[9px] font-semibold tracking-[0.15em] uppercase text-[var(--color-txt-dim)]">
            Security
          </div>
        )}
      </div>
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════
   CARD
   ═══════════════════════════════════════════════════════════ */
function Card({ children, className = "" }) {
  return (
    <div className={cn("card-cyber p-6", className)}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BADGE
   ═══════════════════════════════════════════════════════════ */
function Badge({ children, variant = "neon" }) {
  return (
    <span className={cn("badge-cyber", `badge-${variant}`)}>
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════ */
function Navbar({ activeSection }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/[0.03]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Logo small />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn("nav-link", activeSection === item.id && "active")}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-1.5 rounded-md border border-white/[0.04] bg-white/[0.02] px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-mint)]" />
            <span className="text-[9px] font-bold tracking-wider uppercase text-[var(--color-txt-dim)]">
              Available
            </span>
          </div>
        </div>

        <button
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.06] text-white lg:hidden hover:border-white/10 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/[0.03] bg-black/95 backdrop-blur-xl px-5 py-4 lg:hidden">
          <div className="mx-auto grid max-w-6xl gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-[var(--color-txt-dim)] hover:text-white hover:bg-white/[0.03] transition-colors"
                >
                  <Icon className="h-4 w-4 text-white/20" />
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════ */
function Hero({ content }) {
  const p = content.profile;
  const [typedText, setTypedText] = useState("");
  const fullText = "$ whoami";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 pb-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
        <div>
          <Reveal>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {p.firstName}{" "}
              <span className="text-[var(--color-neon)]">{p.lastName}</span>
              <span className="block mt-2 text-lg font-medium text-[var(--color-txt-dim)] sm:text-xl">
                {p.title}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-[var(--color-txt-dim)] sm:text-base">
              {p.summary}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#posts" className="btn-cyber btn-neon">
                <Terminal className="h-4 w-4" /> Posts
              </a>
              <a href="#disclosure" className="btn-cyber btn-ghost">
                <Shield className="h-4 w-4" /> Disclosure
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {content.stats.map((s, i) => (
                <div key={`${s.label}-${i}`} className="stat-block">
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="mt-1 text-[10px] font-bold tracking-wider uppercase text-[var(--color-txt-dim)]">
                    {s.label}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[var(--color-txt-dim)]/60">{s.note}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.03]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              <span className="ml-2 text-[11px] font-medium text-[var(--color-txt-dim)]">
                ziya@research:~
              </span>
            </div>

            <div className="p-5 font-mono text-sm space-y-4">
              <div>
                <span className="text-[var(--color-neon)]">{typedText}</span>
                {typedText.length < fullText.length && <span className="typing-cursor" />}
              </div>

              {typedText.length >= fullText.length && (
                <>
                  <div className="text-[var(--color-txt-dim)]">
                    <span className="text-white/30">└─$</span>{" "}
                    <span className="text-white">{p.name.toLowerCase().replace(" ", "_")} :: {p.title}</span>
                  </div>
                </>
              )}

              <div className="pt-2">
                <div className="text-[var(--color-neon)] text-xs mb-3">$ focus --list</div>
                <div className="space-y-1.5">
                  {["Web Application Security", "API Security", "Bug Bounty", "Responsible Disclosure", "Penetration Testing"].map((x) => (
                    <div
                      key={x}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-[var(--color-txt)] text-xs hover:bg-white/[0.02] transition-colors"
                    >
                      <ChevronRight className="h-3 w-3 text-[var(--color-neon)]/40" />
                      <span className="font-mono">{x}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[var(--color-neon)] text-xs mb-3">$ disclosure_policy</div>
                <div className="rounded-md border border-white/[0.04] bg-white/[0.01] p-3 text-xs text-[var(--color-txt-dim)] flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[var(--color-gold)]" />
                  <span>No customer data, tokens, private endpoints or unresolved technical details are published.</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[var(--color-neon)] text-xs pt-1">
                <span>$</span>
                <span className="w-1.5 h-3.5 bg-[var(--color-neon)] animate-pulse" />
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   ABOUT
   ═══════════════════════════════════════════════════════════ */
function About() {
  const cards = [
    {
      icon: Shield,
      title: "Responsible Disclosure",
      desc: "Reports are handled ethically: no data misuse, no public technical details without permission and clear communication with security teams.",
    },
    {
      icon: Bug,
      title: "Web & API Security",
      desc: "Focus areas include access control, authentication, IDOR, JWT, SSRF, API logic flaws, file upload risks and information disclosure.",
    },
    {
      icon: FileText,
      title: "Report Quality",
      desc: "Strong reports explain impact, reproduction, business risk, screenshots, proof and practical remediation recommendations.",
    },
  ];

  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <div className="section-label"><span className="dot" />About</div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl max-w-3xl">
            Security research with clean reporting and ethical boundaries.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <Card className="h-full">
                <c.icon className="h-5 w-5 text-[var(--color-neon)]" />
                <h3 className="mt-4 text-base font-bold text-white">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-txt-dim)]">{c.desc}</p>
                <div className="skill-bar mt-4">
                  <div className="skill-bar-fill" style={{ width: `${75 + i * 8}%` }} />
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   ACHIEVEMENTS
   ═══════════════════════════════════════════════════════════ */
function Achievements({ content }) {
  const tagVariant = (tag) => {
    const t = tag.toLowerCase();
    if (t.includes("critical")) return "ember";
    if (t.includes("fixed")) return "mint";
    if (t.includes("hall")) return "gold";
    return "neon";
  };

  return (
    <section id="achievements" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <div className="section-label"><span className="dot" />Achievements</div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl max-w-3xl">
            Recognition, training and security milestones.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {content.achievements.map((a, i) => (
            <Reveal key={`${a.title}-${i}`} delay={i * 0.06}>
              <Card className="h-full flex flex-col">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold tracking-wider text-[var(--color-txt-dim)]">{a.year}</div>
                    <h3 className="mt-1.5 break-words text-base font-bold text-white">{a.title}</h3>
                  </div>
                  <Badge variant={tagVariant(a.tag)}>{a.tag}</Badge>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-txt-dim)]">{a.description}</p>
                {a.link && (
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-neon)] hover:text-white transition-colors"
                  >
                    View reference <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   POSTS
   ═══════════════════════════════════════════════════════════ */
function Posts({ posts }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))],
    [posts]
  );

  const filtered = posts.filter((p) => {
    const blob = [p.title, p.category, p.excerpt, p.body].join(" ").toLowerCase();
    return blob.includes(query.toLowerCase()) && (category === "All" || p.category === category);
  });

  return (
    <section id="posts" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <div className="section-label"><span className="dot" />Posts</div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl max-w-3xl">
            Security posts and learning notes.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-txt-dim)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts..."
                className="input-cyber"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select-cyber"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-white/[0.03] bg-[#06060a] p-12 text-center text-[var(--color-txt-dim)] text-sm">
            No posts published yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <Reveal key={p.id || p.title} delay={i * 0.04}>
                <Card className="flex min-h-[280px] flex-col h-full">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge>{p.category}</Badge>
                    {p.difficulty && <Badge variant="slate">{p.difficulty}</Badge>}
                  </div>
                  <h3 className="break-words text-base font-bold leading-snug text-white">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-txt-dim)]">{p.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.03] pt-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-txt-dim)]">
                      <Calendar className="h-3 w-3" />
                      {String(p.created_at || p.date || "").slice(0, 10)}
                    </div>
                    <button
                      onClick={() => setSelected(p)}
                      className="text-[11px] font-bold text-[var(--color-neon)] hover:text-white transition-colors"
                    >
                      Read →
                    </button>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {selected && <ArticleModal item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGES
   ═══════════════════════════════════════════════════════════ */
function Pages({ pages }) {
  return (
    <section id="pages" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <div className="section-label"><span className="dot" />Pages</div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl max-w-3xl">
            Published pages and directories.
          </h2>
        </Reveal>

        {pages.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-8 rounded-lg border border-white/[0.03] bg-[#06060a] p-12 text-center text-[var(--color-txt-dim)] text-sm">
              No pages have been published yet.
            </div>
          </Reveal>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page, i) => (
              <Reveal key={page.id || page.slug} delay={i * 0.04}>
                <Card className="h-full flex flex-col">
                  <Badge variant="mint">/{page.slug || slugify(page.title)}</Badge>
                  <h3 className="mt-3 break-words text-base font-bold text-white">{page.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-txt-dim)]">{page.summary}</p>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.03] pt-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-txt-dim)]">
                      <Calendar className="h-3 w-3" />
                      {String(page.created_at || page.date || "").slice(0, 10)}
                    </div>
                    <a
                      href={`#/p/${page.slug || slugify(page.title)}`}
                      className="text-[11px] font-bold text-[var(--color-neon)] hover:text-white transition-colors"
                    >
                      Open →
                    </a>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CUSTOM PAGE VIEW
   ═══════════════════════════════════════════════════════════ */
function CustomPageView({ page, onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 lg:px-8">
        <button onClick={onBack} className="mb-8 btn-cyber btn-ghost text-xs">
          ← Back
        </button>
        <Card className="p-6 sm:p-8">
          <Badge variant="mint">/{page.slug}</Badge>
          <h1 className="mt-4 break-words text-2xl font-bold tracking-tight text-white sm:text-4xl">{page.title}</h1>
          <p className="mt-3 text-sm text-[var(--color-txt-dim)]">{page.summary}</p>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-txt-dim)]">
            <Calendar className="h-3 w-3" /> {String(page.created_at || page.date || "").slice(0, 10)}
          </div>
          <div className="mt-6 border-t border-white/[0.03] pt-6">
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[var(--color-txt-dim)]">{page.body}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DISCLOSURE
   ═══════════════════════════════════════════════════════════ */
function Disclosure({ content }) {
  const statusVariant = (s) => {
    const v = s.toLowerCase();
    if (v.includes("fixed") || v.includes("published")) return "mint";
    return "neon";
  };

  const sevVariant = (s) => {
    const v = s.toLowerCase();
    if (v.includes("critical")) return "ember";
    if (v.includes("information")) return "gold";
    return "slate";
  };

  return (
    <section id="disclosure" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <div className="section-label"><span className="dot" />Disclosure</div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl max-w-3xl">
            Public-safe disclosure portfolio.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 overflow-hidden rounded-lg border border-white/[0.03] bg-[#06060a]">
            <div className="overflow-x-auto">
              <table className="table-cyber">
                <thead>
                  <tr>
                    <th>Organization</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Severity</th>
                    <th>Public Note</th>
                  </tr>
                </thead>
                <tbody>
                  {content.disclosures.map((d, i) => (
                    <tr key={`${d.organization}-${i}`}>
                      <td className="font-bold text-white whitespace-nowrap">{d.organization}</td>
                      <td className="text-[var(--color-txt-dim)] whitespace-nowrap">{d.type}</td>
                      <td><Badge variant={statusVariant(d.status)}>{d.status}</Badge></td>
                      <td><Badge variant={sevVariant(d.severity)}>{d.severity}</Badge></td>
                      <td className="text-sm text-[var(--color-txt-dim)] min-w-[180px]">{d.disclosure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOOLS
   ═══════════════════════════════════════════════════════════ */
function Tools({ content }) {
  const toolIcons = [Terminal, Wrench, Globe, Database, Lock, Layers, Bug, KeyRound, Code2, Cpu, Fingerprint, Zap];

  return (
    <section id="tools" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <div className="section-label"><span className="dot" />Toolbox</div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl max-w-3xl">
            Tools and practical security workflow.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {content.tools.map((t, idx) => {
            const Icon = toolIcons[idx % toolIcons.length];
            const level = t.level || 80;
            return (
              <Reveal key={`${t.name}-${idx}`} delay={idx * 0.04}>
                <Card className="h-full">
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-[var(--color-neon)]" />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{t.name}</h3>
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-txt-dim)]">{t.use}</p>
                  <div className="skill-bar mt-3">
                    <div className="skill-bar-fill" style={{ width: `${level}%` }} />
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-14">
            <h3 className="text-lg font-bold text-white mb-6">Learning Notes</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.learning.map((l, i) => (
                <Reveal key={`${l.topic}-${i}`} delay={i * 0.06}>
                  <Card className="h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-[var(--color-neon)]" />
                      <h4 className="text-sm font-bold text-white">{l.topic}</h4>
                    </div>
                    <p className="text-xs leading-relaxed text-[var(--color-txt-dim)]">{l.note}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-txt-dim)]">
                      <Calendar className="h-3 w-3" />
                      {l.date}
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════════════════════ */
function Contact({ content }) {
  const p = content.profile;

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <div className="section-label"><span className="dot" />Contact</div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl max-w-4xl">
            Open to ethical security research, internships and junior AppSec/Pentest roles.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Let's connect.</h3>
              <p className="mt-2 max-w-xl text-sm text-[var(--color-txt-dim)]">
                For responsible disclosure, collaboration or professional opportunities.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {p.email && (
                <a href={`mailto:${encodeURIComponent(p.email)}`} className="btn-cyber btn-neon text-xs">
                  <Mail className="h-3.5 w-3.5" /> Email
                </a>
              )}
              {p.linkedin && (
                <a href={p.linkedin} target="_blank" rel="noreferrer" className="btn-cyber btn-ghost text-xs">
                  <ExternalLink className="h-3.5 w-3.5" /> LinkedIn
                </a>
              )}
              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer" className="btn-cyber btn-ghost text-xs">
                  <ExternalLink className="h-3.5 w-3.5" /> GitHub
                </a>
              )}
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   ARTICLE MODAL
   ═══════════════════════════════════════════════════════════ */
function ArticleModal({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div className="relative my-8 w-full max-w-2xl rounded-lg border border-white/[0.04] bg-[#08080c] p-6 sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge>{item.category || "Article"}</Badge>
              {item.difficulty && <Badge variant="slate">{item.difficulty}</Badge>}
            </div>
            <h3 className="break-words text-xl font-bold text-white">{item.title}</h3>
            <div className="mt-1.5 text-[10px] font-bold text-[var(--color-txt-dim)]">
              {String(item.created_at || item.date || "").slice(0, 10)}
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/[0.06] text-[var(--color-txt-dim)] hover:text-white hover:border-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[var(--color-txt-dim)]">
          {item.body}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
function Footer({ content }) {
  return (
    <footer className="relative">
      <div className="footer-divider" />
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-[11px] text-[var(--color-txt-dim)] sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} {content.profile.name}</div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded border border-white/[0.03] px-2 py-0.5">No sensitive details</span>
          <span className="rounded border border-white/[0.03] px-2 py-0.5">Responsible disclosure</span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════ */
export default function CyberSecurityPortfolio() {
  const [route, setRoute] = useState(window.location.hash);
  const [content, setContent] = useState(normalizeContent(DEFAULT_CONTENT));
  const [dynamicContent, setDynamicContent] = useState({ posts: [], pages: [] });
  const [loadError, setLoadError] = useState("");
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sync = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([apiFetch("/api/site-content"), apiFetch("/api/content")])
      .then(([contentData, data]) => {
        if (!active) return;
        setContent(normalizeContent(contentData.content));
        setDynamicContent({ posts: data.posts || [], pages: data.pages || [] });
        setLoadError("");
      })
      .catch((err) => {
        if (active) setLoadError(err.message);
      });
    return () => { active = false; };
  }, []);

  const customSlug = route.startsWith("#/p/")
    ? decodeURIComponent(route.replace("#/p/", ""))
    : null;
  const page = customSlug
    ? dynamicContent.pages.find((p) => (p.slug || slugify(p.title)) === customSlug)
    : null;

  if (customSlug && page) {
    return (
      <div className="min-h-screen bg-black text-[var(--color-txt)]">
        <div className="bg-grid" />
        <div className="relative z-10">
          <CustomPageView page={page} onBack={() => { window.location.hash = "home"; }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[var(--color-txt)]">
      <div className="bg-grid" />

      <div className="relative z-10">
        <Navbar activeSection={activeSection} />

        {loadError && (
          <div className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
            <div className="rounded-lg border border-[var(--color-gold)]/10 bg-[var(--color-gold)]/[0.02] p-3 text-xs text-[var(--color-gold)]">
              {loadError}
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
    </div>
  );
}
