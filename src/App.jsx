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
  CheckCircle2,
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
   MATRIX RAIN CANVAS
   ═══════════════════════════════════════════════════════════ */
function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン∧∨∇∆∞≡±×÷∑∏∫∂√∇∂∃∀∌∈∉∋∏∑";
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array.from({ length: columns }, () => Math.random() * -100);

    const draw = () => {
      ctx.fillStyle = "rgba(4, 8, 16, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = "rgba(0, 240, 255, 0.9)";
        ctx.font = `${fontSize}px 'Courier New', monospace`;
        ctx.fillText(char, x, y);

        if (drops[i] > 1) {
          ctx.fillStyle = "rgba(0, 240, 255, 0.12)";
          const prevChar = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(prevChar, x, y - fontSize);
        }

        if (y > canvas.height && Math.random() > 0.985) {
          drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.5;
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -100);
    };

    window.addEventListener("resize", handleResize);
    const interval = setInterval(draw, 45);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} id="matrix-canvas" />;
}

/* ═══════════════════════════════════════════════════════════
   FLOATING HEX PARTICLES
   ═══════════════════════════════════════════════════════════ */
function HexParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        char: ["0x", ">>", "::", "//", "&&", "||", "##", "$$", "@@", "01", "10", "FF", "A0", "B1", "C2", "D3", "E4", "5F"][i],
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 20}s`,
        duration: `${15 + Math.random() * 25}s`,
        size: `${8 + Math.random() * 6}px`,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    []
  );

  return (
    <>
      {particles.map((p) => (
        <span
          key={p.id}
          className="hex-particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            fontSize: p.size,
            opacity: p.opacity,
          }}
        >
          {p.char}
        </span>
      ))}
    </>
  );
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
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

function RevealSection({ children, className = "", delay = 0 }) {
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
   CYBER LOGO
   ═══════════════════════════════════════════════════════════ */
function CyberLogo({ size = "normal" }) {
  const s = size === "small" ? "h-10 w-10" : "h-12 w-12";

  return (
    <div className="relative group">
      <div className={cn(s, "absolute -inset-1 rounded-2xl bg-gradient-to-br from-[var(--color-neon)]/20 to-[var(--color-accent)]/20 blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500")} />
      <div className={cn(s, "relative grid place-items-center rounded-2xl border border-[var(--color-neon)]/30 bg-[var(--color-void)] shadow-lg shadow-[var(--color-neon)]/10 group-hover:shadow-[var(--color-neon)]/30 transition-all duration-500")}>
        <Shield className="h-5 w-5 text-[var(--color-neon)] group-hover:text-white transition-colors" />
        <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-[var(--color-neon)] rounded-full opacity-60" />
        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full opacity-60" />
        <span className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full opacity-60" />
        <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-[var(--color-neon)] rounded-full opacity-60" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CARD / BADGE / BUTTON COMPONENTS
   ═══════════════════════════════════════════════════════════ */
function CardCyber({ children, className = "" }) {
  return (
    <div className={cn("card-cyber p-6", className)}>
      <span className="corner corner-tl" />
      <span className="corner corner-tr" />
      <span className="corner corner-bl" />
      <span className="corner corner-br" />
      {children}
    </div>
  );
}

function Badge({ children, variant = "neon" }) {
  return (
    <span className={cn("badge-cyber", `badge-${variant}`)}>
      <span className="dot" />
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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-[var(--color-glass-border)] bg-[var(--color-void)]/85 backdrop-blur-xl shadow-lg shadow-black/20"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#home" className="flex items-center gap-3 group">
          <CyberLogo size="small" />
          <div>
            <div className="text-sm font-black tracking-[0.3em] text-white uppercase glitch-text" data-text="ZIYASEC">
              ZiyaSec
            </div>
            <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-txt-dim)]">
              Security Research
            </div>
          </div>
        </a>

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
          <div className="flex items-center gap-2 rounded-full border border-[var(--color-mint)]/20 bg-[var(--color-mint)]/5 px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-mint)] shadow-[0_0_6px_var(--color-mint)] animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-mint)]">
              Active
            </span>
          </div>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden hover:border-[var(--color-neon)]/30 hover:bg-[var(--color-neon)]/5 transition-all"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--color-glass-border)] bg-[var(--color-void)]/98 backdrop-blur-xl px-5 py-5 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[var(--color-txt-dim)] hover:bg-[var(--color-neon)]/5 hover:text-white transition-all"
                >
                  <Icon className="h-4 w-4 text-[var(--color-neon)]/50" />
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
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
        <div>
          <RevealSection>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-mint)]/20 bg-[var(--color-mint)]/5 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--color-mint)]" />
              <span className="text-xs font-bold tracking-wider uppercase text-[var(--color-mint)]">
                Authorized Testing & Responsible Disclosure
              </span>
            </div>
          </RevealSection>

          <RevealSection delay={0.1}>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {p.name.split(" ").map((word, i) => (
                <span key={i} className="glitch-text" data-text={word}>
                  {word}{" "}
                </span>
              ))}
              <span className="block mt-2 bg-gradient-to-r from-[var(--color-neon)] via-white to-[var(--color-accent)] bg-clip-text text-transparent">
                {p.title}
              </span>
            </h1>
          </RevealSection>

          <RevealSection delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg font-semibold text-[var(--color-neon)]/80 sm:text-xl">
              {p.headline}
            </p>
          </RevealSection>

          <RevealSection delay={0.3}>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-txt-dim)] sm:text-lg">
              {p.summary}
            </p>
          </RevealSection>

          <RevealSection delay={0.4}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#posts" className="btn-cyber btn-neon">
                <Terminal className="h-4 w-4" /> Read Posts
              </a>
              <a href="#disclosure" className="btn-cyber btn-ghost">
                <Shield className="h-4 w-4" /> Disclosure Portfolio
              </a>
            </div>
          </RevealSection>

          <RevealSection delay={0.5}>
            <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {content.stats.map((s, i) => (
                <div key={`${s.label}-${i}`} className="stat-block">
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="mt-1 text-xs font-bold tracking-wider uppercase text-[var(--color-neon)]">
                    {s.label}
                  </div>
                  <div className="mt-1 text-[11px] text-[var(--color-txt-dim)]">{s.note}</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>

        <RevealSection delay={0.3}>
          <CardCyber className="p-0 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5 bg-black/30">
              <span className="terminal-dot bg-[#ff5f57] hover:bg-[#ff3b30]" />
              <span className="terminal-dot bg-[#febc2e] hover:bg-[#ffcc00]" />
              <span className="terminal-dot bg-[#28c840] hover:bg-[#30d158]" />
              <span className="ml-3 text-xs font-bold tracking-wider text-[var(--color-txt-dim)]">
                ziya@research:~$
              </span>
            </div>

            <div className="p-5 sm:p-6 font-mono text-sm space-y-4">
              <div>
                <span className="text-[var(--color-mint)]">{typedText}</span>
                {typedText.length < fullText.length && <span className="typing-cursor" />}
              </div>

              {typedText.length >= fullText.length && (
                <>
                  <div>
                    <span className="text-[var(--color-txt-dim)]">┌──(</span>
                    <span className="text-[var(--color-neon)]">ziya@research</span>
                    <span className="text-[var(--color-txt-dim)]">)-(</span>
                    <span className="text-[var(--color-accent)]">~</span>
                    <span className="text-[var(--color-txt-dim)]">)</span>
                  </div>
                  <div className="text-[var(--color-txt-dim)]">
                    └─$ <span className="text-white">{p.name.toLowerCase().replace(" ", "_")} :: {p.title}</span>
                  </div>
                </>
              )}

              <div className="pt-2">
                <div className="text-[var(--color-neon)] mb-3">$ focus --list</div>
                <div className="space-y-2">
                  {["Web Application Security", "API Security", "Bug Bounty", "Responsible Disclosure", "Penetration Testing"].map((x) => (
                    <div
                      key={x}
                      className="flex items-center gap-3 rounded-lg border border-[var(--color-neon)]/8 bg-[var(--color-neon)]/[0.02] px-3 py-2.5 text-[var(--color-txt)] text-sm hover:border-[var(--color-neon)]/20 hover:bg-[var(--color-neon)]/[0.05] transition-all group"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-neon)] shadow-[0_0_8px_var(--color-neon)] group-hover:shadow-[0_0_14px_var(--color-neon)] transition-shadow" />
                      <span className="font-mono text-[13px]">{x}</span>
                      <ChevronRight className="h-3 w-3 ml-auto text-[var(--color-txt-dim)] group-hover:text-[var(--color-neon)] transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[var(--color-neon)] mb-3">$ disclosure_policy</div>
                <div className="rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/[0.04] p-4 text-[var(--color-gold)] text-sm flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>No customer data, tokens, private endpoints or unresolved technical details are published.</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[var(--color-mint)] pt-2">
                <span>$</span>
                <span className="w-2 h-4 bg-[var(--color-mint)] animate-pulse" />
              </div>
            </div>
          </CardCyber>
        </RevealSection>
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
      color: "var(--color-neon)",
      title: "Responsible Disclosure",
      desc: "Reports are handled ethically: no data misuse, no public technical details without permission and clear communication with security teams.",
    },
    {
      icon: Bug,
      color: "var(--color-mint)",
      title: "Web & API Security",
      desc: "Focus areas include access control, authentication, IDOR, JWT, SSRF, API logic flaws, file upload risks and information disclosure.",
    },
    {
      icon: FileText,
      color: "var(--color-accent)",
      title: "Report Quality",
      desc: "Strong reports explain impact, reproduction, business risk, screenshots, proof and practical remediation recommendations.",
    },
  ];

  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <RevealSection>
          <div className="section-label">
            <span className="pulse" />
            About
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl max-w-3xl">
            Security research with clean reporting and ethical boundaries.
          </h2>
          <p className="mt-4 text-base text-[var(--color-txt-dim)] sm:text-lg max-w-2xl">
            A professional portfolio for skills, achievements, learning notes and sanitized security posts.
          </p>
        </RevealSection>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <RevealSection key={c.title} delay={i * 0.1}>
              <CardCyber className="h-full">
                <div
                  className="grid h-12 w-12 place-items-center rounded-xl border"
                  style={{
                    borderColor: `color-mix(in srgb, ${c.color} 20%, transparent)`,
                    background: `color-mix(in srgb, ${c.color} 5%, transparent)`,
                  }}
                >
                  <c.icon className="h-6 w-6" style={{ color: c.color }} />
                </div>
                <h3 className="mt-5 text-xl font-black text-white">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-txt-dim)]">{c.desc}</p>
                <div className="skill-bar mt-5">
                  <div className="skill-bar-fill" style={{ width: `${75 + i * 8}%` }} />
                </div>
              </CardCyber>
            </RevealSection>
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
    if (t.includes("cert")) return "accent";
    return "neon";
  };

  return (
    <section id="achievements" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <RevealSection>
          <div className="section-label">
            <span className="pulse" />
            Achievements
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl max-w-3xl">
            Recognition, training and security milestones.
          </h2>
          <p className="mt-4 text-base text-[var(--color-txt-dim)] sm:text-lg max-w-2xl">
            Public references only. Private technical details stay private.
          </p>
        </RevealSection>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {content.achievements.map((a, i) => (
            <RevealSection key={`${a.title}-${i}`} delay={i * 0.08}>
              <CardCyber className="h-full flex flex-col">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-bold tracking-wider text-[var(--color-txt-dim)]">{a.year}</div>
                    <h3 className="mt-2 break-words text-xl font-black text-white">{a.title}</h3>
                  </div>
                  <Badge variant={tagVariant(a.tag)}>{a.tag}</Badge>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--color-txt-dim)]">{a.description}</p>
                {a.link && (
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-neon)] hover:text-white transition-colors group"
                  >
                    View reference
                    <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </CardCyber>
            </RevealSection>
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
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <RevealSection>
          <div className="section-label">
            <span className="pulse" />
            Posts
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl max-w-3xl">
            Security posts and learning notes.
          </h2>
          <p className="mt-4 text-base text-[var(--color-txt-dim)] sm:text-lg max-w-2xl">
            Latest public security posts and learning notes.
          </p>
        </RevealSection>

        <RevealSection delay={0.1}>
          <div className="mt-10 mb-8 grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-txt-dim)]" />
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
        </RevealSection>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-12 text-center text-[var(--color-txt-dim)]">
            No posts published yet.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <RevealSection key={p.id || p.title} delay={i * 0.05}>
                <CardCyber className="flex min-h-[320px] flex-col h-full">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge>{p.category}</Badge>
                    {p.difficulty && <Badge variant="accent">{p.difficulty}</Badge>}
                  </div>
                  <h3 className="break-words text-xl font-black leading-tight text-white">{p.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-txt-dim)]">{p.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/5 pt-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-txt-dim)]">
                      <Calendar className="h-3.5 w-3.5" />
                      {String(p.created_at || p.date || "").slice(0, 10)}
                    </div>
                    <button
                      onClick={() => setSelected(p)}
                      className="btn-cyber btn-ghost !py-2 !px-4 !text-xs"
                    >
                      Read <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </CardCyber>
              </RevealSection>
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
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <RevealSection>
          <div className="section-label">
            <span className="pulse" />
            Pages
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl max-w-3xl">
            Published pages and directories.
          </h2>
          <p className="mt-4 text-base text-[var(--color-txt-dim)] sm:text-lg max-w-2xl">
            Public pages and resources will appear here.
          </p>
        </RevealSection>

        {pages.length === 0 ? (
          <RevealSection delay={0.1}>
            <div className="mt-10 rounded-xl border border-white/5 bg-white/[0.02] p-12 text-center text-[var(--color-txt-dim)]">
              No pages have been published yet.
            </div>
          </RevealSection>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page, i) => (
              <RevealSection key={page.id || page.slug} delay={i * 0.05}>
                <CardCyber className="h-full flex flex-col">
                  <Badge variant="mint">/{page.slug || slugify(page.title)}</Badge>
                  <h3 className="mt-4 break-words text-xl font-black text-white">{page.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-txt-dim)]">{page.summary}</p>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/5 pt-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-txt-dim)]">
                      <Calendar className="h-3.5 w-3.5" />
                      {String(page.created_at || page.date || "").slice(0, 10)}
                    </div>
                    <a
                      href={`#/p/${page.slug || slugify(page.title)}`}
                      className="btn-cyber btn-ghost !py-2 !px-4 !text-xs"
                    >
                      Open <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardCyber>
              </RevealSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CUSTOM PAGE VIEW (hash route: #/p/slug)
   ═══════════════════════════════════════════════════════════ */
function CustomPageView({ page, onBack }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="mb-8 btn-cyber btn-ghost"
        >
          ← Back home
        </button>
        <CardCyber className="p-6 sm:p-10">
          <Badge variant="mint">/{page.slug}</Badge>
          <h1 className="mt-6 break-words text-3xl font-black tracking-tight text-white sm:text-5xl">{page.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-[var(--color-txt-dim)]">{page.summary}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[var(--color-txt-dim)]">
            <Calendar className="h-3.5 w-3.5" /> {String(page.created_at || page.date || "").slice(0, 10)}
          </div>
          <div className="mt-8 border-t border-white/5 pt-8">
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[var(--color-txt-dim)]">{page.body}</p>
          </div>
        </CardCyber>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DISCLOSURE TABLE
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
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <RevealSection>
          <div className="section-label">
            <span className="pulse" />
            Disclosure
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl max-w-3xl">
            Public-safe disclosure portfolio.
          </h2>
          <p className="mt-4 text-base text-[var(--color-txt-dim)] sm:text-lg max-w-2xl">
            No private endpoints, tokens, PoC steps, customer data or unresolved technical details.
          </p>
        </RevealSection>

        <RevealSection delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-xl border border-white/5 bg-[rgba(10,16,32,0.65)] backdrop-blur-xl">
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
                      <td className="font-black text-white whitespace-nowrap">{d.organization}</td>
                      <td className="text-[var(--color-txt-dim)] whitespace-nowrap">{d.type}</td>
                      <td>
                        <Badge variant={statusVariant(d.status)}>{d.status}</Badge>
                      </td>
                      <td>
                        <Badge variant={sevVariant(d.severity)}>{d.severity}</Badge>
                      </td>
                      <td className="text-sm leading-relaxed text-[var(--color-txt-dim)] min-w-[200px]">{d.disclosure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOOLS & LEARNING
   ═══════════════════════════════════════════════════════════ */
function Tools({ content }) {
  const toolIcons = [Terminal, Wrench, Globe, Database, Lock, Layers, Bug, KeyRound, Code2, Cpu, Fingerprint, Zap];

  return (
    <section id="tools" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <RevealSection>
          <div className="section-label">
            <span className="pulse" />
            Toolbox
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl max-w-3xl">
            Tools and practical security workflow.
          </h2>
          <p className="mt-4 text-base text-[var(--color-txt-dim)] sm:text-lg max-w-2xl">
            Tools are used only in authorized environments and labs.
          </p>
        </RevealSection>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.tools.map((t, idx) => {
            const Icon = toolIcons[idx % toolIcons.length];
            const level = t.level || 80;
            return (
              <RevealSection key={`${t.name}-${idx}`} delay={idx * 0.05}>
                <CardCyber className="h-full group">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--color-neon)]/10 bg-[var(--color-neon)]/[0.03] group-hover:border-[var(--color-neon)]/25 group-hover:bg-[var(--color-neon)]/[0.08] transition-all shrink-0">
                      <Icon className="h-5 w-5 text-[var(--color-neon)]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-white truncate">{t.name}</h3>
                      <div className="text-[10px] font-bold text-[var(--color-neon)]">{level}%</div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--color-txt-dim)]">{t.use}</p>
                  <div className="skill-bar mt-3">
                    <div className="skill-bar-fill" style={{ width: `${level}%` }} />
                  </div>
                </CardCyber>
              </RevealSection>
            );
          })}
        </div>

        <RevealSection delay={0.2}>
          <div className="mt-16">
            <h3 className="text-2xl font-black text-white mb-8">Learning Notes</h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {content.learning.map((l, i) => (
                <RevealSection key={`${l.topic}-${i}`} delay={i * 0.08}>
                  <CardCyber className="h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen className="h-5 w-5 text-[var(--color-accent)]" />
                      <h4 className="text-lg font-black text-white">{l.topic}</h4>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--color-txt-dim)]">{l.note}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[var(--color-txt-dim)]">
                      <Calendar className="h-3.5 w-3.5" />
                      {l.date}
                    </div>
                  </CardCyber>
                </RevealSection>
              ))}
            </div>
          </div>
        </RevealSection>
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
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <RevealSection>
          <div className="section-label">
            <span className="pulse" />
            Contact
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl max-w-4xl">
            Open to ethical security research, internships and junior AppSec/Pentest roles.
          </h2>
        </RevealSection>

        <RevealSection delay={0.1}>
          <CardCyber className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="text-2xl font-black text-white">Let's connect professionally.</h3>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-txt-dim)]">
                For responsible disclosure communication, collaboration or professional opportunities, contact me through email or LinkedIn.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {p.email && (
                <a href={`mailto:${encodeURIComponent(p.email)}`} className="btn-cyber btn-neon">
                  <Mail className="h-4 w-4" /> Email
                </a>
              )}
              {p.linkedin && (
                <a href={p.linkedin} target="_blank" rel="noreferrer" className="btn-cyber btn-ghost">
                  <ExternalLink className="h-4 w-4" /> LinkedIn
                </a>
              )}
              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer" className="btn-cyber btn-ghost">
                  <ExternalLink className="h-4 w-4" /> GitHub
                </a>
              )}
              {p.tryhackme && (
                <a href={p.tryhackme} target="_blank" rel="noreferrer" className="btn-cyber btn-ghost">
                  <Target className="h-4 w-4" /> TryHackMe
                </a>
              )}
            </div>
          </CardCyber>
        </RevealSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   ARTICLE MODAL
   ═══════════════════════════════════════════════════════════ */
function ArticleModal({ item, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[var(--color-void)]/90 p-4 backdrop-blur-xl"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div className="relative my-8 w-full max-w-3xl rounded-2xl border border-white/5 bg-[var(--color-abyss)] p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge>{item.category || "Article"}</Badge>
              {item.difficulty && <Badge variant="accent">{item.difficulty}</Badge>}
            </div>
            <h3 className="break-words text-2xl font-black text-white">{item.title}</h3>
            <div className="mt-2 text-xs font-bold text-[var(--color-txt-dim)]">
              {String(item.created_at || item.date || "").slice(0, 10)}
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-[var(--color-ember)]/20 hover:border-[var(--color-ember)]/30 transition-all"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
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
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 text-xs text-[var(--color-txt-dim)] sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          © {new Date().getFullYear()} {content.profile.name}. Responsible security research portfolio.
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/5 bg-white/[0.02] px-3 py-1">No sensitive details</span>
          <span className="rounded-full border border-white/5 bg-white/[0.02] px-3 py-1">Authorized testing only</span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════ */
export default function CyberSecurityPortfolio() {
  const [route, setRoute] = useState(window.location.hash);
  const [content, setContent] = useState(normalizeContent(DEFAULT_CONTENT));
  const [dynamicContent, setDynamicContent] = useState({ posts: [], pages: [] });
  const [loadError, setLoadError] = useState("");
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const syncRoute = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
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

  /* Custom page route: #/p/slug */
  const customSlug = route.startsWith("#/p/")
    ? decodeURIComponent(route.replace("#/p/", ""))
    : null;
  const page = customSlug
    ? dynamicContent.pages.find((p) => (p.slug || slugify(p.title)) === customSlug)
    : null;

  if (customSlug && page) {
    return (
      <div className="min-h-screen text-[var(--color-txt)]">
        <MatrixRain />
        <div className="circuit-grid" />
        <div className="relative z-10">
          <CustomPageView page={page} onBack={() => { window.location.hash = "home"; }} />
        </div>
      </div>
    );
  }

  return (
    <div className="scanline min-h-screen text-[var(--color-txt)]">
      <MatrixRain />
      <div className="circuit-grid" />
      <HexParticles />

      <div className="relative z-10">
        <Navbar activeSection={activeSection} />

        {loadError && (
          <div className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
            <div className="rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/[0.04] p-4 text-sm font-semibold text-[var(--color-gold)]">
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
    </div>
  );
}
