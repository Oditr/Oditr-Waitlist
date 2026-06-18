import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import axios from "axios";
import { ArrowUpRight, Check, ArrowRight, Instagram, Twitter, Linkedin } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const API = BACKEND_URL ? `${BACKEND_URL}/api` : null;

const NAV_ITEMS = [
  { label: "Product", href: "#product" },
  { label: "Vision", href: "#vision" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Docs", href: "#docs" },
];

const ATMOSPHERE_WORDS = [
  { text: "LCP", top: "8%", left: "4%", size: "text-6xl md:text-8xl", rotate: "-8deg" },
  { text: "CLS", top: "18%", right: "6%", size: "text-5xl md:text-7xl", rotate: "6deg" },
  { text: "INP", bottom: "28%", left: "8%", size: "text-7xl md:text-9xl", rotate: "-4deg" },
  { text: "TTFB", top: "62%", right: "10%", size: "text-6xl md:text-8xl", rotate: "10deg" },
  { text: "Core Web Vitals", top: "44%", left: "2%", size: "text-3xl md:text-5xl", rotate: "0deg" },
  { text: "Performance", bottom: "12%", right: "4%", size: "text-4xl md:text-6xl", rotate: "-6deg" },
  { text: "Monitoring", top: "78%", left: "32%", size: "text-3xl md:text-5xl", rotate: "3deg" },
  { text: "Optimization", top: "30%", left: "40%", size: "text-3xl md:text-4xl", rotate: "-2deg" },
];

const FLOW_STEPS = ["Audit", "Prioritize", "Understand", "Fix", "Monitor"];

const VISION_PILLARS = [
  { label: "Performance Intelligence", desc: "Beyond raw metrics. Context-aware insight." },
  { label: "Monitoring", desc: "Continuous visibility. Real users. Real fields." },
  { label: "Prioritization", desc: "Know what to fix first. Always." },
  { label: "Recommendations", desc: "Framework-aware, codebase-aware." },
  { label: "Continuous Optimization", desc: "Improvement as a default state." },
  { label: "Developer Experience", desc: "Quiet by default. Loud when it matters." },
];

const CAPABILITIES = [
  {
    n: "01",
    title: "Intelligent Prioritization Engine",
    desc: "An engine that ranks every diagnostic by user impact, traffic, and effort. Stop guessing what to fix next.",
  },
  {
    n: "02",
    title: "Performance Health Score",
    desc: "A single, honest number that reflects how your site actually feels. Tracked over time, never gamed.",
  },
  {
    n: "03",
    title: "Real User Monitoring",
    desc: "Field data from the people who matter. Real devices, real networks, real outcomes.",
  },
  {
    n: "04",
    title: "Regression Detection",
    desc: "Catch the moment a deploy makes things worse. Before customers do.",
  },
  {
    n: "05",
    title: "AI Performance Copilot",
    desc: "Conversational guidance grounded in your data. Ask why, get answers, not links.",
  },
  {
    n: "06",
    title: "Framework-Aware Recommendations",
    desc: "Next.js, React, Astro, SvelteKit. Recommendations that speak the language of your stack.",
  },
];

function FloatingNav({ onJoinClick }) {
  const [open, setOpen] = useState(false);
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
      className="fixed top-5 right-5 z-50 flex items-center bg-white border border-[#EAEAEA] rounded-full p-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
    >
      {/* Hover zone — expands leftward when entered */}
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="flex items-center"
      >
        <a
          href="#top"
          data-testid="nav-logo"
          aria-label="Øditr"
          className="flex items-center justify-center w-10 h-10 text-2xl font-medium leading-none shrink-0"
        >
          Ø
        </a>

        <motion.div
          initial={false}
          animate={{
            width: open ? "auto" : 0,
            opacity: open ? 1 : 0,
            marginLeft: open ? 4 : 0,
            marginRight: open ? 8 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
          style={{ overflow: "hidden", direction: "rtl" }}
          className="flex items-center"
          data-testid="nav-drawer"
        >
          {/* direction:ltr on inner so children read left-to-right while the
              outer width animates from the right edge inward */}
          <div className="flex items-center" style={{ direction: "ltr" }}>
            <span className="block h-5 w-px bg-[#EAEAEA] mx-3 shrink-0" />
            <ul className="flex items-center gap-1 shrink-0 pr-2">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={false}
                  animate={{
                    x: open ? 0 : -8,
                    opacity: open ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.35,
                    delay: open ? 0.08 + i * 0.05 : 0,
                    ease: [0.65, 0, 0.35, 1],
                  }}
                >
                  <a
                    href={item.href}
                    data-testid={`nav-link-${item.label.toLowerCase()}`}
                    className="px-3 py-2 text-sm text-[#666666] hover:text-[#0A0A0A] transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <button
        onClick={onJoinClick}
        data-testid="nav-join-waitlist-btn"
        className="bg-[#0A0A0A] text-white px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#222222] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
      >
        Join Waitlist
        <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
      </button>
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
          {(count ?? 0).toLocaleString()} developers on the waitlist
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
            Most tools <span className="text-[#666666]">show diagnostics.</span>
            <br />
            Few explain <em className="not-italic underline decoration-1 underline-offset-[10px] decoration-[#0A0A0A]">what matters most.</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="mt-10 max-w-xl text-base md:text-lg text-[#666666] leading-relaxed"
          >
            Øditr turns scattered web-vitals into a clear, prioritized path. So engineering time goes where it actually moves the needle — not where the dashboard happens to glow red.
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
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#666666]">[ 02 ] What Øditr Is</p>
        </div>
        <div className="md:col-span-9">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="flex flex-wrap items-baseline gap-x-6 md:gap-x-10 gap-y-4"
          >
            {FLOW_STEPS.map((step, i) => (
              <div key={step} className="flex items-baseline gap-6 md:gap-10">
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
                  <span className="font-mono text-2xl md:text-4xl text-[#0A0A0A]">→</span>
                )}
              </div>
            ))}
          </motion.div>
          <p className="mt-12 max-w-xl text-base md:text-lg text-[#666666] leading-relaxed">
            A complete loop — not a screenshot of charts. From the first audit to continuous monitoring, every step closes itself into the next.
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
            Øditr is evolving beyond traditional audits into a system for{" "}
            <span className="text-[#666666]">continuous performance intelligence.</span>
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

function CapabilitiesSection() {
  return (
    <section id="roadmap" className="relative px-6 md:px-12 lg:px-24 py-32 md:py-48 border-t border-[#EAEAEA]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#666666]">[ 04 ] Future Capabilities</p>
        </div>
        <div className="md:col-span-9">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-[#0A0A0A] text-balance max-w-3xl mb-16"
          >
            Built around the questions every performance engineer already asks.
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

function WaitlistSection({ count, onSubmitSuccess }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");
  const [position, setPosition] = useState(null);

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
      const { data } = await axios.post(`${API}/waitlist`, { email: trimmed });
      const pos = data?.position ?? 0;
      const cnt = data?.count ?? 0;
      setStatus("success");
      setPosition(pos);
      setMessage(`You're in. Position #${pos}.`);
      setEmail("");
      onSubmitSuccess?.(cnt);
    } catch (err) {
      setStatus("error");
      setMessage(err?.response?.data?.detail?.[0]?.msg || "Something went wrong. Try again.");
    }
  };

  return (
    <section id="docs" className="relative px-6 md:px-12 lg:px-24 py-32 md:py-48 border-t border-[#EAEAEA]">
      <div className="max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-mono text-xs tracking-[0.25em] uppercase text-[#666666]"
        >
          [ 05 ] Join the Waitlist
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
          <span className="text-[#666666]">Be measured.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-8 max-w-xl mx-auto text-base md:text-lg text-[#666666] leading-relaxed"
        >
          Reserve your spot. No spam. No drip campaigns. One email when Øditr is ready for you.
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
          <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-2 border border-[#EAEAEA] rounded-full p-1.5 bg-white focus-within:border-[#0A0A0A] transition-colors">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourdomain.com"
              data-testid="waitlist-email-input"
              autoComplete="email"
              className="flex-1 bg-transparent outline-none px-5 py-3 text-base text-[#0A0A0A] placeholder:text-[#999999]"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              data-testid="waitlist-submit-btn"
              disabled={status === "loading"}
              className="btn-primary-magnetic bg-[#0A0A0A] text-white border border-[#0A0A0A] px-6 py-3 rounded-full text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-60"
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
                {message}
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
                developers waiting
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
      href: "",
      icon: <Instagram className="w-4 h-4" strokeWidth={1.5} />,
    },
    {
      name: "Twitter",
      href: "",
      icon: <Twitter className="w-4 h-4" strokeWidth={1.5} />,
    },
    {
      name: "Reddit",
      href: "",
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
      href: "",
      icon: <Linkedin className="w-4 h-4" strokeWidth={1.5} />,
    },
    {
      name: "Product Hunt",
      href: "",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M10 7v10" />
          <path d="M10 7h3.5a2.5 2.5 0 0 1 0 5H10" />
        </svg>
      ),
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
        <div className="grid grid-cols-2 md:flex md:items-end gap-8 md:gap-14 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#666666]">Product</span>
            <a href="#product" className="link-underline text-[#0A0A0A]">Overview</a>
            <a href="#vision" className="link-underline text-[#0A0A0A]">Vision</a>
            <a href="#roadmap" className="link-underline text-[#0A0A0A]">Roadmap</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#666666]">Company</span>
            <a href="#waitlist" className="link-underline text-[#0A0A0A]">Waitlist</a>
            <a href="mailto:hello@oditr.dev" className="link-underline text-[#0A0A0A]">Contact</a>
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
      .catch(() => {});
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
    <main data-testid="landing-page" className="relative bg-white text-[#0A0A0A] min-h-screen">
      <FloatingNav onJoinClick={scrollToWaitlist} />
      <Hero count={count} onJoinClick={scrollToWaitlist} />
      <ProblemSection />
      <FlowSection />
      <VisionSection />
      <CapabilitiesSection />
      <WaitlistSection count={count} onSubmitSuccess={(c) => setCount(c)} />
      <Footer />
    </main>
  );
}
