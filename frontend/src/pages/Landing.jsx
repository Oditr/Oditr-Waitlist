import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import axios from "axios";
import { ArrowUpRight, Check, ArrowRight, Instagram, Twitter, Linkedin, Menu, X } from "lucide-react";

// Strip trailing slash so REACT_APP_BACKEND_URL with or without '/' both work
const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/+$/, "");
const API = BACKEND_URL ? `${BACKEND_URL}/api` : null;

const NAV_ITEMS = [
  { label: "Product", href: "#product" },
  { label: "Vision", href: "#vision" },
  { label: "Capabilities", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];

const ATMOSPHERE_WORDS = [
  { text: "LCP", top: "8%", left: "4%", size: "text-6xl md:text-8xl", rotate: "-8deg" },
  { text: "SEO", top: "18%", right: "6%", size: "text-5xl md:text-7xl", rotate: "6deg" },
  { text: "INP", bottom: "28%", left: "8%", size: "text-7xl md:text-9xl", rotate: "-4deg" },
  { text: "TTFB", top: "62%", right: "10%", size: "text-6xl md:text-8xl", rotate: "10deg" },
  { text: "Core Web Vitals", top: "44%", left: "2%", size: "text-3xl md:text-5xl", rotate: "0deg" },
  { text: "Revenue", bottom: "12%", right: "4%", size: "text-4xl md:text-6xl", rotate: "-6deg" },
  { text: "Accessibility", top: "78%", left: "32%", size: "text-3xl md:text-5xl", rotate: "3deg" },
  { text: "Security", top: "30%", left: "40%", size: "text-3xl md:text-4xl", rotate: "-2deg" },
];

const FLOW_STEPS = ["Audit", "Analyze", "Prioritize", "Fix", "Monitor"];

const VISION_PILLARS = [
  { label: "Web Intelligence", desc: "Beyond raw scores. Full-site context - performance, SEO, security, and accessibility in one place." },
  { label: "Revenue Impact", desc: "Understand how technical issues may affect conversions, leads, trust, and business outcomes." },
  { label: "Smart Prioritization", desc: "Know exactly what to fix first - ranked by severity, user impact, effort, and business value." },
  { label: "AI-Powered Clarity", desc: "Ask why an issue matters, what caused it, and how to resolve it. Developer-friendly answers, not links." },
  { label: "Continuous Monitoring", desc: "Track how a site improves or declines over time with scheduled scans and regression detection." },
  { label: "Agency & Team Ready", desc: "Client-ready reports, exportable audits, and workspaces built for agencies and growing teams." },
];

const CAPABILITIES = [
  {
    n: "01",
    title: "Revenue Impact Engine",
    desc: "Understand how performance, SEO, accessibility, and trust issues may affect conversions, leads, and business outcomes.",
  },
  {
    n: "02",
    title: "Intelligent Prioritization Engine",
    desc: "Ranks every issue by severity, user impact, effort, and business value so teams know what to fix first.",
  },
  {
    n: "03",
    title: "Performance Health Score",
    desc: "A clear score that combines Core Web Vitals, Lighthouse signals, technical issues, and real improvement potential.",
  },
  {
    n: "04",
    title: "AI Audit Copilot",
    desc: "Ask why an issue matters, what caused it, and how to fix it — with developer-friendly explanations, not documentation links.",
  },
  {
    n: "05",
    title: "Regression Detection",
    desc: "Catch when a deploy, redesign, plugin, or content update makes performance or SEO worse. Before users notice.",
  },
  {
    n: "06",
    title: "Client-Ready Reports",
    desc: "Export clean audit reports with issue summaries, estimated revenue impact, priorities, and recommended fixes.",
  },
  {
    n: "07",
    title: "Scheduled Scans",
    desc: "Run recurring audits and track how a website improves or declines over time. Continuous visibility, zero manual effort.",
  },
  {
    n: "08",
    title: "Framework-Aware Recommendations",
    desc: "Recommendations tailored for modern stacks like Next.js, React, Astro, and other frontend frameworks.",
  },
  {
    n: "09",
    title: "Real User Monitoring",
    desc: "Understand how real users experience your site across devices, networks, locations, and sessions.",
  },
];

function FloatingNav({ onJoinClick }) {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeTimeout = useRef(null);

  const handleEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpen(true);
  };
  const handleLeave = () => {
    closeTimeout.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <motion.nav
      data-testid="floating-nav"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
      className="fixed top-5 right-5 left-5 md:left-auto z-50 flex items-center bg-white border border-[#EAEAEA] rounded-full p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
    >
      {/* Hover zone — expands when entered */}
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="flex items-center grow md:grow-0"
      >
        <a
          href="#top"
          data-testid="nav-logo"
          aria-label="Øditr"
          className="flex items-center justify-center w-10 h-10 text-2xl font-medium leading-none shrink-0"
        >
          Ø
        </a>

        {/* Desktop Drawer */}
        <motion.div
          initial={false}
          animate={{
            width: open ? "auto" : 0,
            opacity: open ? 1 : 0,
            marginLeft: open ? 4 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
          style={{ overflow: "hidden", direction: "rtl" }}
          className="hidden md:flex items-center"
        >
          <div className="flex items-center" style={{ direction: "ltr" }}>
            <span className="block h-5 w-px bg-[#EAEAEA] mx-3" />
            <ul className="flex items-center gap-1 shrink-0 pr-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="px-3 py-2 text-sm text-[#666666] hover:text-[#0A0A0A] transition-colors whitespace-nowrap">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Arrow cue visible on desktop between logo and Join Waitlist when menu is closed */}
        <motion.div
          initial={false}
          animate={{
            width: open ? 0 : "auto",
            opacity: open ? 0 : 1,
            marginLeft: open ? 0 : 8,
            marginRight: open ? 0 : 8,
          }}
          transition={{ duration: 0.3 }}
          style={{ overflow: "hidden" }}
          className="hidden md:flex items-center justify-center text-[#AAAAAA]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </motion.div>
      </div>

      <button
        onClick={onJoinClick}
        data-testid="nav-join-waitlist-btn"
        className="bg-[#0A0A0A] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#222222] transition-colors flex items-center gap-1.5 ml-auto md:ml-0"
      >
        Join Waitlist
        <ArrowUpRight className="w-3.5 h-3.5" />
      </button>

      <button className="md:hidden ml-3 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-0 left-0 bg-white border border-[#EAEAEA] rounded-2xl p-4 shadow-xl md:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.href} className="block py-3 px-4 text-sm hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function AtmosphereLayer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {ATMOSPHERE_WORDS.map((w, i) => (
        <span
          key={w.text + i}
          className={`atmosphere-keyword drift-slow ${w.size}`}
          style={{
            top: w.top,
            left: w.left,
            right: w.right,
            bottom: w.bottom,
            transform: `rotate(${w.rotate})`,
            animationDelay: `${i * 1.4}s`,
          }}
        >
          {w.text}
        </span>
      ))}
    </div>
  );
}

function Hero({ count, onJoinClick }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden pt-32 pb-12"
    >
      <AtmosphereLayer />

      {/* Top label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 mb-10 flex items-center gap-3"
      >
        <span className="inline-flex w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" />
        <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#666666]">
          Pre-launch — Waitlist open
        </span>
      </motion.div>

      {/* Massive wordmark */}
      <motion.h1
        style={{ y, opacity }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        data-testid="hero-wordmark"
        className="relative z-10 leading-[0.82] tracking-hero font-medium text-[#0A0A0A] text-center text-[26vw] md:text-[22vw] lg:text-[20vw]"
      >
        Øditr
      </motion.h1>

      {/* Positioning statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6 }}
        className="relative z-10 mt-10 md:mt-14 max-w-2xl text-center px-6"
      >
        <p className="text-lg md:text-2xl text-[#0A0A0A] leading-snug tracking-tight text-balance">
          Performance Intelligence for modern websites.
        </p>
        <p className="mt-3 text-sm md:text-base text-[#666666] leading-relaxed text-balance">
          Know what slows your website. Fix it before users leave.
        </p>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.8 }}
        className="relative z-10 mt-10 flex flex-col sm:flex-row items-center gap-3"
      >
        <button
          onClick={onJoinClick}
          data-testid="hero-join-waitlist-btn"
          className="btn-primary-magnetic bg-[#0A0A0A] text-white border border-[#0A0A0A] px-7 py-4 rounded-full text-sm font-medium inline-flex items-center gap-2"
        >
          <span className="btn-text">Join the Waitlist</span>
          <ArrowRight className="w-4 h-4 btn-text" strokeWidth={2} />
        </button>
        <a
          href="#vision"
          data-testid="hero-see-vision-btn"
          className="px-7 py-4 rounded-full text-sm font-medium border border-[#EAEAEA] hover:border-[#0A0A0A] transition-colors inline-flex items-center gap-2"
        >
          See the Vision
        </a>
      </motion.div>

      {/* Live count pill */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.1 }}
        className="relative z-10 mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-[#666666]"
      >
        <span className="relative inline-flex w-2 h-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#0A0A0A] opacity-30 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0A0A0A]" />
        </span>
        <span data-testid="hero-live-count">
          {(count ?? 0).toLocaleString()} founders &amp; developers on the waitlist
        </span>
      </motion.div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section id="product" className="relative px-6 md:px-12 lg:px-24 py-32 md:py-48 border-t border-[#EAEAEA]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#666666]">[ 01 ] The Problem</p>
        </div>
        <div className="md:col-span-9">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-[#0A0A0A] text-balance"
          >
            Most tools <span className="text-[#666666]">show a score.</span>
            <br />
            None explain <em className="not-italic underline decoration-1 underline-offset-[10px] decoration-[#0A0A0A]">what it costs your business.</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mt-10 max-w-xl text-base md:text-lg text-[#666666] leading-relaxed"
          >
            Lighthouse tells you your score. PageSpeed shows the symptoms. Øditr goes further — it audits your entire site across performance, SEO, accessibility, security, and broken links, then explains what each issue means for your conversions, trust, and revenue. So you fix what actually matters, in the right order.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function FlowSection() {
  return (
    <section className="relative px-6 md:px-12 lg:px-24 py-32 md:py-48 border-t border-[#EAEAEA]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#666666]">[ 02 ] How It Works</p>
        </div>
        <div className="md:col-span-9">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="flex flex-wrap items-center gap-x-4 md:gap-x-8 gap-y-4"
          >
            {FLOW_STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-4 md:gap-8">
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight font-medium text-[#0A0A0A] leading-none"
                >
                  {step}
                </motion.span>
                {i < FLOW_STEPS.length - 1 && (
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-[#0A0A0A] leading-none select-none">→</span>
                )}
              </div>
            ))}
          </motion.div>
          <p className="mt-12 max-w-xl text-base md:text-lg text-[#666666] leading-relaxed">
            A complete intelligence loop - not just a one-time report. Øditr audits your full site, analyzes every issue for business impact, prioritizes what to fix, guides you through the fix, and monitors for regressions so improvements stick.
          </p>
        </div>
      </div>
    </section>
  );
}

function VisionSection() {
  return (
    <section id="vision" className="relative px-6 md:px-12 lg:px-24 py-32 md:py-48 border-t border-[#EAEAEA]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#666666]">[ 03 ] Product Vision</p>
        </div>
        <div className="md:col-span-9">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-[#0A0A0A] text-balance max-w-4xl"
          >
            Øditr is more than an audit tool - it is a{" "}
            <span className="text-[#666666]">web intelligence platform that connects technical issues to business outcomes.</span>
          </motion.h2>

          <ul className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#EAEAEA] border border-[#EAEAEA]">
            {VISION_PILLARS.map((pillar, i) => (
              <motion.li
                key={pillar.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-white p-8 md:p-10 flex flex-col gap-3"
              >
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#666666]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl md:text-2xl tracking-tight text-[#0A0A0A]">{pillar.label}</h3>
                <p className="text-sm md:text-base text-[#666666] leading-relaxed">{pillar.desc}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const AUDIT_COVERAGE = [
  { label: "Performance & Core Web Vitals", detail: "LCP, INP, CLS, TTFB, FCP — measured and explained." },
  { label: "SEO & Metadata", detail: "Titles, descriptions, headings, canonical tags, Open Graph, structured data." },
  { label: "Accessibility", detail: "WCAG signals, contrast ratios, missing alt text, keyboard nav issues." },
  { label: "Security Signals", detail: "HTTPS, mixed content, insecure headers, exposed sensitive paths." },
  { label: "Broken Link Detection", detail: "Internal and external links checked for dead ends and redirect chains." },
  { label: "Image Optimization", detail: "Uncompressed images, missing dimensions, format recommendations." },
  { label: "CSS & JS Efficiency", detail: "Render-blocking resources, large bundles, unused code, code splitting opportunities." },
  { label: "Mobile Responsiveness", detail: "Viewport configuration, tap target size, mobile-friendly rendering." },
];

function AuditCoverageSection() {
  return (
    <section className="relative px-6 md:px-12 lg:px-24 py-32 md:py-48 border-t border-[#EAEAEA]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#666666]">[ 04 ] What We Audit</p>
        </div>
        <div className="md:col-span-9">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-[#0A0A0A] text-balance max-w-3xl mb-16"
          >
            Every layer of your site - <span className="text-[#666666]">audited, explained, prioritized.</span>
          </motion.h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#EAEAEA] border border-[#EAEAEA]">
            {AUDIT_COVERAGE.map((item, i) => (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="bg-white p-8 md:p-10 flex flex-col gap-3"
              >
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#666666]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg md:text-xl tracking-tight text-[#0A0A0A]">{item.label}</h3>
                <p className="text-sm md:text-base text-[#666666] leading-relaxed">{item.detail}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CapabilitiesSection() {
  return (
    <section id="roadmap" className="relative px-6 md:px-12 lg:px-24 py-32 md:py-48 border-t border-[#EAEAEA]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#666666]">[ 05 ] Capabilities</p>
        </div>
        <div className="md:col-span-9">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-[#0A0A0A] text-balance max-w-3xl mb-16"
          >
            Built around the questions every founder, developer, and agency asks before shipping.
          </motion.h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#EAEAEA] border border-[#EAEAEA]">
        {CAPABILITIES.map((cap, i) => (
          <motion.div
            key={cap.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            data-testid={`capability-${cap.n}`}
            className="capability-tile bg-white p-8 md:p-10 flex flex-col gap-4 min-h-[260px]"
          >
            <div className="flex items-center justify-between">
              <span className="capability-number font-mono text-xs tracking-[0.2em] uppercase text-[#666666]">
                {cap.n}
              </span>
              <ArrowUpRight className="w-4 h-4 text-current opacity-60" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl md:text-2xl tracking-tight leading-tight mt-2">{cap.title}</h3>
            <p className="capability-desc text-sm md:text-base text-[#666666] leading-relaxed mt-auto">
              {cap.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const FAQ_ITEMS = [
  {
    q: "What is Øditr?",
    a: "Øditr (pronounced \"Auditor\") is a web intelligence and website audit platform. It scans websites across performance, SEO, accessibility, security, broken links, image optimization, and more — then explains what each issue means for your business and tells you what to fix first.",
  },
  {
    q: "How is Øditr different from Lighthouse or PageSpeed Insights?",
    a: "Lighthouse and PageSpeed give you scores and diagnostics. Øditr goes further — it prioritizes issues by business impact, estimates how problems may affect conversions and revenue, provides AI-powered fix guidance, and tracks regressions over time. It is built for founders and agencies, not just engineers.",
  },
  {
    q: "Who is Øditr for?",
    a: "Øditr is built for developers, founders, freelancers, and agencies who want more than a score. If you care about how your site's technical health affects business outcomes, Øditr is for you.",
  },
  {
    q: "What is the Revenue Impact Engine?",
    a: "The Revenue Impact Engine analyzes technical issues — like slow load times, broken accessibility, missing HTTPS, or poor SEO — and estimates how they may affect conversions, user trust, bounce rate, and leads. It helps teams understand not just what is broken, but what it costs to leave it broken.",
  },
  {
    q: "Will agencies be able to export client reports?",
    a: "Yes. Client-ready, exportable audit reports are a planned capability. Reports will include issue summaries, estimated impact, prioritized recommendations, and fix guidance — formatted for sharing with clients.",
  },
  {
    q: "Is Øditr currently available?",
    a: "Øditr is currently in pre-launch. We are building toward early access for waitlist members. Join the waitlist to get notified when access opens. No spam — one email when it is ready.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="relative px-6 md:px-12 lg:px-24 py-32 md:py-48 border-t border-[#EAEAEA]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#666666]">[ 06 ] FAQ</p>
        </div>
        <div className="md:col-span-9">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.1] text-[#0A0A0A] text-balance max-w-3xl mb-16"
          >
            Questions worth asking.
          </motion.h2>

          <ul className="flex flex-col divide-y divide-[#EAEAEA] border-t border-b border-[#EAEAEA]">
            {FAQ_ITEMS.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="py-7"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-start justify-between gap-6 text-left group"
                  aria-expanded={openIndex === i}
                >
                  <span className="text-base md:text-lg tracking-tight text-[#0A0A0A] group-hover:text-[#444444] transition-colors">
                    {item.q}
                  </span>
                  <span
                    className="shrink-0 mt-1 w-5 h-5 flex items-center justify-center text-[#666666] transition-transform duration-300"
                    style={{ transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-sm md:text-base text-[#666666] leading-relaxed max-w-2xl">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function WaitlistSection({ count, onSubmitSuccess }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [position, setPosition] = useState(null);

  // Read referral code from ?ref= URL param (e.g. shared links)
  const refCode = new URLSearchParams(window.location.search).get("ref") || undefined;

  const submit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;
    const trimmed = email.trim();
    if (!trimmed || !/^\S+@\S+\.\S+$/.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    setMessage("");
    if (!API) {
      setStatus("error");
      setMessage("Service unavailable. Please try again later.");
      return;
    }
    try {
      const { data } = await axios.post(`${API}/waitlist`, { email: trimmed, ref: refCode });
      const pos = data?.position ?? 0;
      const cnt = data?.count ?? 0;
      setStatus("success");
      setPosition(pos);
      setMessage(`You're in. Position #${pos}.`);
      setEmail("");
      onSubmitSuccess?.(cnt);
    } catch (err) {
      // Log full error to browser console for debugging
      console.error("[Waitlist] submission error:", err?.response?.status, err?.response?.data ?? err?.message);
      // detail can be an array (Pydantic validation) or a plain string (custom HTTPException)
      const detail = err?.response?.data?.detail;
      const msg =
        Array.isArray(detail)
          ? detail[0]?.msg
          : typeof detail === "string"
            ? detail
            : null;
      setStatus("error");
      setMessage(msg || "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="waitlist" className="relative px-6 md:px-12 lg:px-24 py-32 md:py-48 border-t border-[#EAEAEA]">
      <div className="max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-mono text-xs tracking-[0.25em] uppercase text-[#666666]"
        >
          [ 07 ] Join the Waitlist
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mt-6 text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-hero leading-[0.95] font-medium text-[#0A0A0A] text-balance"
        >
          Be early.
          <br />
          <span className="text-[#666666]">Be ready.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-8 max-w-xl mx-auto text-base md:text-lg text-[#666666] leading-relaxed"
        >
          Øditr is currently on waitlist. Join now to get access as soon as it launches. No spam — one email when early access opens.
        </motion.p>

        <motion.form
          onSubmit={submit}
          noValidate
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          data-testid="waitlist-form"
          id="waitlist"
          className="mt-14 max-w-2xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-2 border border-[#EAEAEA] rounded-2xl sm:rounded-full p-2 sm:p-1.5 bg-white focus-within:border-[#0A0A0A] transition-colors">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourdomain.com"
              data-testid="waitlist-email-input"
              autoComplete="email"
              className="flex-1 min-w-0 bg-transparent outline-none px-5 py-3 text-base text-[#0A0A0A] placeholder:text-[#999999]"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              data-testid="waitlist-submit-btn"
              disabled={status === "loading"}
              className="btn-primary-magnetic bg-[#0A0A0A] text-white border border-[#0A0A0A] px-6 py-3 rounded-xl sm:rounded-full text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-60 w-full sm:w-auto"
            >
              <span className="btn-text">
                {status === "loading" ? "Joining…" : status === "success" ? "Joined" : "Join Waitlist"}
              </span>
              {status === "success" ? (
                <Check className="w-4 h-4 btn-text" strokeWidth={2.5} />
              ) : (
                <ArrowRight className="w-4 h-4 btn-text" strokeWidth={2} />
              )}
            </button>
          </div>

          <div className="mt-5 min-h-[24px] flex items-center justify-center gap-3 text-sm">
            {status === "success" && (
              <p data-testid="waitlist-success-msg" className="text-[#0A0A0A]">
                You're on the Øditr waitlist. We'll notify you the moment early access opens.
              </p>
            )}
            {status === "error" && (
              <p data-testid="waitlist-error-msg" className="text-[#0A0A0A]">
                {message}
              </p>
            )}
            {status === "idle" && (
              <p className="text-[#666666] font-mono text-xs tracking-[0.18em] uppercase">
                <span data-testid="waitlist-section-count">
                  {(count ?? 0).toLocaleString()}
                </span>{" "}
                founders &amp; developers waiting
              </p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  );
}

function Footer() {
  const socials = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/oditr.io/",
      icon: <Instagram className="w-4 h-4" strokeWidth={1.5} />,
    },
    {
      name: "Twitter",
      href: "https://x.com/Oditr_io",
      icon: <Twitter className="w-4 h-4" strokeWidth={1.5} />,
    },
    {
      name: "Reddit",
      href: "https://www.reddit.com/user/Oditr-io/",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="13" r="9" />
          <circle cx="9" cy="13" r="0.7" fill="currentColor" />
          <circle cx="15" cy="13" r="0.7" fill="currentColor" />
          <path d="M9 16c.9.7 2 1 3 1s2.1-.3 3-1" />
          <path d="M18 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
          <path d="M15 5l3 1.5" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/oditr-io",
      icon: <Linkedin className="w-4 h-4" strokeWidth={1.5} />,
    },
  ];

  return (
    <footer className="px-6 md:px-12 lg:px-24 py-16 border-t border-[#EAEAEA]">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
        <div>
          <div className="text-7xl md:text-9xl font-medium tracking-hero leading-none">Ø</div>
          <p className="mt-4 font-mono text-xs tracking-[0.25em] uppercase text-[#666666]">
            Øditr — Pronounced &ldquo;Auditor&rdquo;
          </p>
        </div>
        <div className="grid grid-cols-2 md:flex md:items-start gap-8 md:gap-14 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#666666]">Product</span>
            <a href="#product" className="link-underline text-[#0A0A0A]">Overview</a>
            <a href="#vision" className="link-underline text-[#0A0A0A]">Vision</a>
            <a href="#roadmap" className="link-underline text-[#0A0A0A]">Capabilities</a>
            <a href="#faq" className="link-underline text-[#0A0A0A]">FAQ</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#666666]">Company</span>
            <a href="#waitlist" className="link-underline text-[#0A0A0A]">Join Waitlist</a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=hello.oditr@gmail.com" target="_blank" rel="noopener noreferrer" className="link-underline text-[#0A0A0A]">Contact</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#666666]">Follow</span>
            <a href="https://www.instagram.com/oditr.io/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="link-underline text-[#0A0A0A]">Instagram</a>
            <a href="https://x.com/Oditr_io" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="link-underline text-[#0A0A0A]">Twitter / X</a>
            <a href="https://www.reddit.com/user/Oditr-io/" target="_blank" rel="noopener noreferrer" aria-label="Reddit" className="link-underline text-[#0A0A0A]">Reddit</a>
            <a href="https://www.linkedin.com/company/oditr-io" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="link-underline text-[#0A0A0A]">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#666666]">Follow</span>
          <ul className="flex items-center gap-2 flex-wrap" data-testid="footer-socials">
            {socials.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href || "#"}
                  aria-label={s.name}
                  data-testid={`social-${s.name.toLowerCase().replace(" ", "-")}`}
                  target={s.href ? "_blank" : undefined}
                  rel={s.href ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#EAEAEA] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16 flex items-center justify-between text-xs font-mono tracking-[0.2em] uppercase text-[#666666]">
        <span>© {new Date().getFullYear()} Øditr Labs</span>
        <span>v 0.1 · Pre-launch</span>
      </div>
    </footer>
  );
}

export default function Landing() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!API) return;
    let mounted = true;
    axios
      .get(`${API}/waitlist/count`)
      .then(({ data }) => {
        if (mounted) setCount(data?.count ?? 0);
      })
      .catch(() => { });
    return () => {
      mounted = false;
    };
  }, []);

  const scrollToWaitlist = () => {
    const el = document.getElementById("waitlist");
    if (!el) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(el, {
        offset: -40,
        duration: 1.6,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <main data-testid="landing-page" className="relative bg-white text-[#0A0A0A] min-h-screen overflow-x-hidden">
      <FloatingNav onJoinClick={scrollToWaitlist} />
      <Hero count={count} onJoinClick={scrollToWaitlist} />
      <ProblemSection />
      <FlowSection />
      <VisionSection />
      <AuditCoverageSection />
      <CapabilitiesSection />
      <FAQSection />
      <WaitlistSection count={count} onSubmitSuccess={(c) => setCount(c)} />
      <Footer />
    </main>
  );
}
