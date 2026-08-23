"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, FileText, Sparkles, RefreshCw } from "lucide-react";
import ParticleTextMorph from "@/components/3d/ParticleTextMorph";

const WORDS = ["ANKUSH RAWAT", "SOFTWARE DEVELOPER", "FULL STACK", "ADVERSARIAL"];

export const CollaborationSection = () => {
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  const cycleWord = () => {
    setActiveWordIndex((prev) => (prev + 1) % WORDS.length);
  };

  return (
    <section className="relative w-full py-28 px-6 md:px-12 bg-black overflow-hidden select-none border-t border-white/10">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Top Badges & Status */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[11px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            OPEN TO OPPORTUNITIES
          </span>
          <span className="text-white/30 font-mono text-xs hidden sm:inline">//</span>
          <span className="text-white/50 font-mono text-xs hidden sm:inline tracking-wider">
            HIGH-IMPACT ENGINEERING
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-none mb-6 font-display"
        >
          Let&apos;s work together<span className="text-emerald-400">.</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-white/60 font-mono text-xs sm:text-sm md:text-base uppercase tracking-wider leading-relaxed mb-8"
        >
          I architect distributed systems, robust ML infrastructure, and immersive web experiences.
          Hover &amp; interact with the particle system below.
        </motion.p>

        {/* Interactive Text Switcher Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-4 flex items-center gap-2"
        >
          <button
            onClick={cycleWord}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-emerald-500/50 rounded-full font-mono text-[10px] text-white/70 hover:text-emerald-300 transition-all cursor-pointer group"
          >
            <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500 text-emerald-400" />
            <span>SWITCH TEXT ({WORDS[activeWordIndex]})</span>
          </button>
        </motion.div>

        {/* ── Interactive WebGL Particle Morph Canvas ── */}
        <div className="w-full relative my-2 min-h-[260px] md:min-h-[320px] rounded-2xl border border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,204,0.04)_0%,transparent_75%)] pointer-events-none" />
          <ParticleTextMorph
            key={WORDS[activeWordIndex]}
            text={WORDS[activeWordIndex]}
            height="320px"
            interactive={true}
            autoStart={true}
          />
        </div>

        {/* Action Buttons Matching Reference Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full"
        >
          {/* EMAIL ME (Cyan Accent) */}
          <a
            href="mailto:ankushsinghrawat154@gmail.com"
            className="relative px-8 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] flex items-center gap-2 cursor-pointer rounded-sm"
          >
            <Mail className="w-4 h-4" />
            EMAIL ME
          </a>

          {/* GITHUB */}
          <a
            href="https://github.com/ankush850"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 hover:border-white/40 text-white font-mono font-bold text-xs tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer rounded-sm"
          >
            <Github className="w-4 h-4" />
            GITHUB
          </a>

          {/* LINKEDIN */}
          <a
            href="https://www.linkedin.com/in/ankush-rawat-6bb006314/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 hover:border-white/40 text-white font-mono font-bold text-xs tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer rounded-sm"
          >
            <Linkedin className="w-4 h-4" />
            LINKEDIN
          </a>
        </motion.div>

        {/* Footer Meta Coordinates */}
        <div className="mt-16 w-full pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-white/30 font-mono text-[10px] tracking-widest">
          <span>&copy; ANKUSH RAWAT // FULL STACK × SYSTEMS</span>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <a href="https://github.com/ankush850" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GITHUB</a>
            <a href="https://www.linkedin.com/in/ankush-rawat-6bb006314/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LINKEDIN</a>
            <a href="mailto:ankushsinghrawat154@gmail.com" className="hover:text-white transition-colors">EMAIL</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollaborationSection;
