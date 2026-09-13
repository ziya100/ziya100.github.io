import { useEffect, useMemo, useRef, useState } from "react";
import {
  Shield,
  Terminal,
  Bug,
  Lock,
  Globe,
  BookOpen,
  Mail,
  ExternalLink,
  Search,
  Menu,
  FileText,
  AlertTriangle,
  Calendar,
  X,
  ChevronRight,
  Target,
  Eye,
} from "lucide-react";

const API_BASE_URL = "https://ziya-portfolio-api.vercel.app";

const FALLBACK = {
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
    { title: "Polestar VDP", tag: "Critical", description: "Reported a confirmed Critical security vulnerability through responsible disclosure. Technical details are withheld in accordance with disclosure rules.", link: "", year: "2026" },
    { title: "University of Texas Hall of Fame", tag: "Hall of Fame", description: "Recognized for responsibly reporting information disclosure vulnerabilities.", link: "https://security.utexas.edu/hall-of-fame", year: "2026" },
    { title: "European Commission / CERT-EU", tag: "Fixed", description: "Reported a vulnerability through the official disclosure process. The issue was reviewed and fixed.", link: "https://cert.europa.eu/hall-of-fame", year: "2026" },
    { title: "eJPTv2", tag: "Certification", description: "Practical junior penetration testing certification focused on real-world assessment methodology.", link: "https://certs.ine.com/c9228976-f172-4e81-891b-fa5fd61cfac9#acc.Hz0BYRLr", year: "2025" },
  ],
  disclosures: [
    { organization: "Polestar", type: "VDP", status: "Confirmed", severity: "Critical", disclosure: "Technical details are not publicly disclosed. Public mention is limited to non-technical responsible disclosure context." },
    { organization: "University of Texas", type: "Responsible Disclosure", status: "Published", severity: "Information Disclosure", disclosure: "Hall of Fame recognition for valid responsible disclosure reports." },
    { organization: "European Commission", type: "VDP / CVD", status: "Fixed", severity: "Not Public", disclosure: "Issue fixed through the official disclosure process." },
  ],
  learning: [
    { topic: "NoSQL Injection", note: "Studied MongoDB-style boolean conditions, operator injection and backend query logic manipulation in lab environments.", date: "2026-05-08" },
    { topic: "XXE", note: "Learned how unsafe XML parsing and external entities can lead to file disclosure, SSRF-style requests or denial of service.", date: "2026-05-06" },
    { topic: "Active Directory Enumeration", note: "Practiced Linux-based credentialed enumeration with SMB, LDAP, BloodHound.py, NetExec, Impacket and rpcclient.", date: "2026-05-05" },
  ],
};

const NAV = [
  { id: "home", label: "Home", icon: Shield },
  { id: "about", label: "About", icon: Eye },
  { id: "achievements", label: "Achievements", icon: Target },
  { id: "posts", label: "Posts", icon: FileText },
  { id: "pages", label: "Pages", icon: Globe },
  { id: "disclosure", label: "Disclosure", icon: Lock },
  { id: "contact", label: "Contact", icon: Mail },
];

function cn(...c) { return c.filter(Boolean).join(" "); }

function slugify(v) {
  return String(v || "").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function merge(c) {
  const x = c || {};
  return {
    profile: { ...FALLBACK.profile, ...(x.profile || {}) },
    stats: Array.isArray(x.stats) && x.stats.length ? x.stats : FALLBACK.stats,
    achievements: Array.isArray(x.achievements) && x.achievements.length ? x.achievements : FALLBACK.achievements,
    disclosures: Array.isArray(x.disclosures) && x.disclosures.length ? x.disclosures : FALLBACK.disclosures,
    learning: Array.isArray(x.learning) && x.learning.length ? x.learning : FALLBACK.learning,
  };
}

async function api(path) {
  const r = await fetch(`${API_BASE_URL}${path}`);
  if (!r.ok) throw new Error();
  return r.json();
}

/* ═══════════ REVEAL ═══════════ */
function useRv() {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return [ref, v];
}

function Rv({ children, className = "", delay = 0 }) {
  const [ref, v] = useRv();
  return <div ref={ref} className={cn("rv", v && "vis", className)} style={{ transitionDelay: `${delay}s` }}>{children}</div>;
}

/* ═══════════ NAVBAR ═══════════ */
function Nav({ active }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-[#030712]/80 backdrop-blur-xl border-b border-white/[0.03]" : "bg-transparent")}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 grid place-items-center rounded-lg border border-white/[0.06] bg-[#080e1c] group-hover:border-[var(--color-neon)]/20 transition-colors">
            <Shield className="h-4 w-4 text-[var(--color-neon)]" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-[0.2em] text-white uppercase">ZiyaSec<span className="text-[var(--color-neon)]">.</span></div>
            <div className="text-[9px] font-semibold tracking-[0.12em] uppercase text-[var(--color-txt-dim)]">Security Research</div>
          </div>
        </a>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV.map(n => <a key={n.id} href={`#${n.id}`} className={cn("nav-link", active === n.id && "active")}>{n.label}</a>)}
        </nav>

        <div className="hidden lg:flex items-center gap-1.5 rounded border border-white/[0.04] bg-white/[0.015] px-2 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-mint)]" />
          <span className="text-[9px] font-bold tracking-wider uppercase text-[var(--color-txt-dim)]">Available</span>
        </div>

        <button className="lg:hidden grid h-9 w-9 place-items-center rounded-lg border border-white/[0.06] text-white hover:border-white/10 transition-colors" onClick={() => setOpen(v => !v)} aria-label="Menu">
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/[0.03] bg-[#030712]/95 backdrop-blur-xl px-5 py-4">
          <div className="grid gap-1">
            {NAV.map(n => {
              const Ic = n.icon;
              return <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-txt-dim)] hover:text-white hover:bg-white/[0.03] transition-colors"><Ic className="h-4 w-4 text-white/20" />{n.label}</a>;
            })}
          </div>
        </div>
      )}
    </header>
  );
}

/* ═══════════ HERO ═══════════ */
function Hero({ c }) {
  const p = c.profile;
  const [t, setT] = useState("");
  const full = "$ whoami";

  useEffect(() => {
    let i = 0;
    const tm = setInterval(() => { if (i <= full.length) { setT(full.slice(0, i)); i++; } else clearInterval(tm); }, 80);
    return () => clearInterval(tm);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 pb-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
        <div>
          <Rv>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {p.firstName} <span className="text-[var(--color-neon)]">{p.lastName}</span>
              <span className="block mt-2 text-base font-medium text-[var(--color-txt-dim)] sm:text-lg">{p.title}</span>
            </h1>
          </Rv>
          <Rv delay={0.08}>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-[var(--color-txt-dim)] sm:text-base">{p.summary}</p>
          </Rv>
          <Rv delay={0.16}>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <a href="#posts" className="btn btn-fill"><Terminal className="h-3.5 w-3.5" />Posts</a>
              <a href="#disclosure" className="btn btn-line"><Shield className="h-3.5 w-3.5" />Disclosure</a>
            </div>
          </Rv>
          <Rv delay={0.24}>
            <div className="mt-10 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {c.stats.map((s, i) => (
                <div key={`${s.label}-${i}`} className="stat">
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="mt-0.5 text-[10px] font-bold tracking-wider uppercase text-[var(--color-txt-dim)]">{s.label}</div>
                  <div className="text-[11px] text-[var(--color-txt-dim)]/50">{s.note}</div>
                </div>
              ))}
            </div>
          </Rv>
        </div>

        <Rv delay={0.12}>
          <div className="card p-0 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.03]">
              <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
              <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
              <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
              <span className="ml-1.5 text-[10px] font-medium text-[var(--color-txt-dim)]">ziya@research:~</span>
            </div>
            <div className="p-5 font-mono text-[13px] space-y-3.5">
              <div>
                <span className="text-[var(--color-neon)]">{t}</span>
                {t.length < full.length && <span className="cursor" />}
              </div>
              {t.length >= full.length && (
                <div className="text-[var(--color-txt-dim)]">
                  <span className="text-white/20">└─$</span>{" "}
                  <span className="text-white">{p.name.toLowerCase().replace(" ", "_")} :: {p.title}</span>
                </div>
              )}
              <div className="pt-1.5">
                <div className="text-[var(--color-neon)] text-[11px] mb-2.5">$ focus --list</div>
                <div className="space-y-1">
                  {["Web Application Security", "API Security", "Bug Bounty", "Responsible Disclosure", "Penetration Testing"].map(x => (
                    <div key={x} className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[var(--color-txt)] text-xs hover:bg-white/[0.02] transition-colors">
                      <ChevronRight className="h-3 w-3 text-[var(--color-neon)]/30" />
                      <span className="font-mono">{x}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-1.5">
                <div className="text-[var(--color-neon)] text-[11px] mb-2.5">$ disclosure_policy</div>
                <div className="rounded-md border border-white/[0.03] bg-white/[0.01] p-2.5 text-xs text-[var(--color-txt-dim)] flex items-start gap-2">
                  <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5 text-[var(--color-gold)]" />
                  <span>No customer data, tokens, private endpoints or unresolved technical details are published.</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--color-neon)] text-xs pt-0.5">
                <span>$</span>
                <span className="w-1.5 h-3 bg-[var(--color-neon)] animate-pulse" />
              </div>
            </div>
          </div>
        </Rv>
      </div>
    </section>
  );
}

/* ═══════════ ABOUT ═══════════ */
function About() {
  const items = [
    { icon: Shield, title: "Responsible Disclosure", desc: "Reports are handled ethically: no data misuse, no public technical details without permission and clear communication with security teams." },
    { icon: Bug, title: "Web & API Security", desc: "Focus areas include access control, authentication, IDOR, JWT, SSRF, API logic flaws, file upload risks and information disclosure." },
    { icon: FileText, title: "Report Quality", desc: "Strong reports explain impact, reproduction, business risk, screenshots, proof and practical remediation recommendations." },
  ];

  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Rv>
          <div className="section-tag">About</div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl max-w-3xl">Security research with clean reporting and ethical boundaries.</h2>
        </Rv>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c, i) => (
            <Rv key={c.title} delay={i * 0.06}>
              <div className="card h-full">
                <c.icon className="h-5 w-5 text-[var(--color-neon)]" />
                <h3 className="mt-3 text-sm font-bold text-white">{c.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-txt-dim)]">{c.desc}</p>
                <div className="bar mt-3"><div className="bar-fill" style={{ width: `${75 + i * 8}%` }} /></div>
              </div>
            </Rv>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════ ACHIEVEMENTS ═══════════ */
function Achievements({ c }) {
  const tv = (t) => {
    const l = t.toLowerCase();
    if (l.includes("critical")) return "red";
    if (l.includes("fixed")) return "green";
    if (l.includes("hall")) return "yellow";
    return "cyan";
  };

  return (
    <section id="achievements" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Rv>
          <div className="section-tag">Achievements</div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl max-w-3xl">Recognition, training and security milestones.</h2>
        </Rv>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {c.achievements.map((a, i) => (
            <Rv key={`${a.title}-${i}`} delay={i * 0.05}>
              <div className="card h-full flex flex-col">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold tracking-wider text-[var(--color-txt-dim)]">{a.year}</div>
                    <h3 className="mt-1 text-sm font-bold text-white">{a.title}</h3>
                  </div>
                  <span className={`badge badge-${tv(a.tag)}`}>{a.tag}</span>
                </div>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-[var(--color-txt-dim)]">{a.description}</p>
                {a.link && (
                  <a href={a.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-neon)] hover:text-white transition-colors">
                    View reference <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </Rv>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════ POSTS ═══════════ */
function Posts({ posts }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sel, setSel] = useState(null);

  const cats = useMemo(() => ["All", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))], [posts]);
  const list = posts.filter(p => {
    const b = [p.title, p.category, p.excerpt, p.body].join(" ").toLowerCase();
    return b.includes(q.toLowerCase()) && (cat === "All" || p.category === cat);
  });

  return (
    <section id="posts" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Rv>
          <div className="section-tag">Posts</div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl max-w-3xl">Security posts and learning notes.</h2>
        </Rv>
        <Rv delay={0.08}>
          <div className="mt-6 mb-5 grid gap-2.5 sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-txt-dim)]" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search posts..." className="inp" />
            </div>
            <select value={cat} onChange={e => setCat(e.target.value)} className="sel">
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </Rv>

        {list.length === 0 ? (
          <div className="rounded-lg border border-white/[0.025] bg-[#060b16] p-10 text-center text-[var(--color-txt-dim)] text-xs">No posts published yet.</div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => (
              <Rv key={p.id || p.title} delay={i * 0.03}>
                <div className="card flex min-h-[260px] flex-col h-full">
                  <div className="mb-2.5 flex flex-wrap gap-1.5">
                    <span className="badge badge-cyan">{p.category}</span>
                    {p.difficulty && <span className="badge badge-dim">{p.difficulty}</span>}
                  </div>
                  <h3 className="break-words text-sm font-bold leading-snug text-white">{p.title}</h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-[var(--color-txt-dim)]">{p.excerpt}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-white/[0.025] pt-3">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--color-txt-dim)]"><Calendar className="h-3 w-3" />{String(p.created_at || p.date || "").slice(0, 10)}</span>
                    <button onClick={() => setSel(p)} className="text-[11px] font-bold text-[var(--color-neon)] hover:text-white transition-colors">Read →</button>
                  </div>
                </div>
              </Rv>
            ))}
          </div>
        )}
      </div>
      {sel && <Modal item={sel} onClose={() => setSel(null)} />}
    </section>
  );
}

/* ═══════════ PAGES ═══════════ */
function Pages({ pages }) {
  return (
    <section id="pages" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Rv>
          <div className="section-tag">Pages</div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl max-w-3xl">Published pages.</h2>
        </Rv>
        {pages.length === 0 ? (
          <Rv delay={0.08}>
            <div className="mt-6 rounded-lg border border-white/[0.025] bg-[#060b16] p-10 text-center text-[var(--color-txt-dim)] text-xs">No pages published yet.</div>
          </Rv>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((pg, i) => (
              <Rv key={pg.id || pg.slug} delay={i * 0.03}>
                <div className="card h-full flex flex-col">
                  <span className="badge badge-green">/{pg.slug || slugify(pg.title)}</span>
                  <h3 className="mt-2.5 break-words text-sm font-bold text-white">{pg.title}</h3>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-[var(--color-txt-dim)]">{pg.summary}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-white/[0.025] pt-3">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--color-txt-dim)]"><Calendar className="h-3 w-3" />{String(pg.created_at || pg.date || "").slice(0, 10)}</span>
                    <a href={`#/p/${pg.slug || slugify(pg.title)}`} className="text-[11px] font-bold text-[var(--color-neon)] hover:text-white transition-colors">Open →</a>
                  </div>
                </div>
              </Rv>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════ PAGE VIEW ═══════════ */
function PageView({ page, onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-3xl px-5">
        <button onClick={onBack} className="mb-6 btn btn-line text-xs">← Back</button>
        <div className="card">
          <span className="badge badge-green">/{page.slug}</span>
          <h1 className="mt-4 break-words text-2xl font-bold text-white sm:text-3xl">{page.title}</h1>
          <p className="mt-2 text-xs text-[var(--color-txt-dim)]">{page.summary}</p>
          <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-[var(--color-txt-dim)]"><Calendar className="h-3 w-3" />{String(page.created_at || page.date || "").slice(0, 10)}</div>
          <div className="mt-5 border-t border-white/[0.025] pt-5">
            <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-[var(--color-txt-dim)]">{page.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ DISCLOSURE ═══════════ */
function Disclosure({ c }) {
  const sv = s => { const l = s.toLowerCase(); return (l.includes("fixed") || l.includes("published")) ? "green" : "cyan"; };
  const rv = s => { const l = s.toLowerCase(); if (l.includes("critical")) return "red"; if (l.includes("information")) return "yellow"; return "dim"; };

  return (
    <section id="disclosure" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Rv>
          <div className="section-tag">Disclosure</div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl max-w-3xl">Public-safe disclosure portfolio.</h2>
        </Rv>
        <Rv delay={0.08}>
          <div className="mt-6 overflow-hidden rounded-lg border border-white/[0.025] bg-[#060b16]">
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead>
                  <tr><th>Organization</th><th>Type</th><th>Status</th><th>Severity</th><th>Note</th></tr>
                </thead>
                <tbody>
                  {c.disclosures.map((d, i) => (
                    <tr key={`${d.organization}-${i}`}>
                      <td className="font-bold text-white whitespace-nowrap">{d.organization}</td>
                      <td className="text-[var(--color-txt-dim)] whitespace-nowrap">{d.type}</td>
                      <td><span className={`badge badge-${sv(d.status)}`}>{d.status}</span></td>
                      <td><span className={`badge badge-${rv(d.severity)}`}>{d.severity}</span></td>
                      <td className="text-xs text-[var(--color-txt-dim)] min-w-[160px]">{d.disclosure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Rv>
      </div>
    </section>
  );
}

/* ═══════════ CONTACT ═══════════ */
function Contact({ c }) {
  const p = c.profile;
  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Rv>
          <div className="section-tag">Contact</div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl max-w-4xl">Open to ethical security research, internships and junior AppSec/Pentest roles.</h2>
        </Rv>
        <Rv delay={0.08}>
          <div className="mt-6 card grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="text-base font-bold text-white">Let's connect.</h3>
              <p className="mt-1.5 max-w-lg text-xs text-[var(--color-txt-dim)]">For responsible disclosure, collaboration or professional opportunities.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {p.email && <a href={`mailto:${encodeURIComponent(p.email)}`} className="btn btn-fill text-[11px]"><Mail className="h-3 w-3" />Email</a>}
              {p.linkedin && <a href={p.linkedin} target="_blank" rel="noreferrer" className="btn btn-line text-[11px]"><ExternalLink className="h-3 w-3" />LinkedIn</a>}
              {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="btn btn-line text-[11px]"><ExternalLink className="h-3 w-3" />GitHub</a>}
            </div>
          </div>
        </Rv>
      </div>
    </section>
  );
}

/* ═══════════ MODAL ═══════════ */
function Modal({ item, onClose }) {
  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 p-4 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true">
      <div className="relative my-8 w-full max-w-2xl rounded-lg border border-white/[0.04] bg-[#080e1c] p-5 sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-1.5">
              <span className="badge badge-cyan">{item.category || "Article"}</span>
              {item.difficulty && <span className="badge badge-dim">{item.difficulty}</span>}
            </div>
            <h3 className="break-words text-lg font-bold text-white">{item.title}</h3>
            <div className="mt-1 text-[10px] font-bold text-[var(--color-txt-dim)]">{String(item.created_at || item.date || "").slice(0, 10)}</div>
          </div>
          <button onClick={onClose} className="shrink-0 grid h-7 w-7 place-items-center rounded border border-white/[0.06] text-[var(--color-txt-dim)] hover:text-white hover:border-white/10 transition-colors" aria-label="Close">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-[var(--color-txt-dim)]">{item.body}</p>
      </div>
    </div>
  );
}

/* ═══════════ FOOTER ═══════════ */
function Footer({ c }) {
  return (
    <footer>
      <div className="foot-line" />
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-7 text-[11px] text-[var(--color-txt-dim)] sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} {c.profile.name}</div>
        <div className="flex gap-1.5">
          <span className="rounded border border-white/[0.03] px-2 py-0.5">No sensitive details</span>
          <span className="rounded border border-white/[0.03] px-2 py-0.5">Responsible disclosure</span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════ MAIN ═══════════ */
export default function App() {
  const [route, setRoute] = useState(window.location.hash);
  const [content, setContent] = useState(merge(FALLBACK));
  const [posts, setPosts] = useState([]);
  const [pages, setPages] = useState([]);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const fn = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);

  useEffect(() => {
    const els = NAV.map(n => document.getElementById(n.id)).filter(Boolean);
    const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" });
    els.forEach(el => o.observe(el));
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    let ok = true;
    Promise.all([api("/api/site-content"), api("/api/content")])
      .then(([sc, ct]) => {
        if (!ok) return;
        setContent(merge(sc.content));
        setPosts(ct.posts || []);
        setPages(ct.pages || []);
      })
      .catch(() => {});
    return () => { ok = false; };
  }, []);

  const slug = route.startsWith("#/p/") ? decodeURIComponent(route.replace("#/p/", "")) : null;
  const page = slug ? pages.find(p => (p.slug || slugify(p.title)) === slug) : null;

  if (slug && page) {
    return (
      <div className="min-h-screen bg-[#030712] text-[var(--color-txt)]">
        <div className="bg-dots" />
        <div className="relative z-10"><PageView page={page} onBack={() => { window.location.hash = "home"; }} /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-[var(--color-txt)]">
      <div className="bg-dots" />
      <div className="relative z-10">
        <Nav active={active} />
        <main>
          <Hero c={content} />
          <About />
          <Achievements c={content} />
          <Posts posts={posts} />
          <Pages pages={pages} />
          <Disclosure c={content} />
          <Contact c={content} />
        </main>
        <Footer c={content} />
      </div>
    </div>
  );
}
