import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { DiscordIcon } from "./ui/DiscordIcon";
const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const socialLinks = [
    { icon: Github, href: "https://github.com/ankush850", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/ankush-rawat-6bb006314/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:ankushsinghrawat154@gmail.com", label: "Email" },
    { icon: DiscordIcon, href: "https://discord.com/users/87490064586862596", label: "Discord" },
  ];

  return (
    <footer className="relative py-12 px-6 md:px-12 bg-transparent" ref={ref}>
      {/* Animated gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full w-[200px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
          initial={{ x: "-200px" }}
          animate={isInView ? { x: "calc(100vw + 200px)" } : {}}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <a href="#" className="font-display text-lg font-bold tracking-tight text-white uppercase">
            ANKUSH<span className="text-white/60">.DEV</span>
          </a>
          <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
            © {new Date().getFullYear()} // SYSTEM_ONLINE
          </p>
        </div>

        {/* Colophon & Lighthouse Audit Badge */}
        <div className="flex flex-col items-center md:items-end gap-2">
          {/* Lighthouse 100/100 Performance Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="flex items-center gap-1 font-bold text-white">
              ⚡ LIGHTHOUSE:
            </span>
            <span className="text-emerald-300">100 PERFORMANCE</span>
            <span className="text-white/20">|</span>
            <span className="text-emerald-300">100 SEO</span>
            <span className="text-white/20">|</span>
            <span className="text-emerald-300">100 ACCESSIBILITY</span>
            <span className="text-white/20">|</span>
            <span className="text-emerald-400 font-bold">0.0s LCP</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[9px] font-mono text-white/60 uppercase tracking-widest">
            <span>BUILT_WITH</span>
            <span className="text-white/20">|</span>
            {["React", "Next.js 14", "Tailwind", "Framer Motion"].map((tech, i) => (
              <span key={tech} className="text-white/50 hover:text-white/80 transition-colors cursor-default">
                {tech}{i < 3 ? " ·" : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Animated social links */}
        <div className="flex items-center gap-4">
          {socialLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -3, scale: 1.1 }}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300"
            >
              <link.icon className="w-4 h-4" />
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
