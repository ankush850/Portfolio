"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import ParticleTextMorph from "@/components/3d/ParticleTextMorph";
import { Sparkles, Activity, Zap, RefreshCw } from "lucide-react";

export const TopParticleHeader = () => {
  const [pulseKey, setPulseKey] = useState(0);

  return (
    <div className="relative w-full pt-16 pb-8 px-4 sm:px-8 md:px-12 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md border-b border-white/10 select-none z-20 overflow-hidden group">
      {/* Dynamic Multi-Color Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,240,255,0.09)_0%,rgba(168,85,247,0.06)_35%,rgba(236,72,153,0.04)_60%,transparent_75%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-cyan-400 via-purple-500 via-pink-500 to-transparent opacity-60" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400 via-cyan-400 to-transparent opacity-40" />

      {/* Technical HUD Top Line */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-white/50 tracking-[0.25em] uppercase mb-2 px-2"
      >
        <span className="flex items-center gap-2 text-cyan-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          SYSTEM_IDENTITY // 28.61° N · 77.20° E
        </span>
        <div className="hidden md:flex items-center gap-3 text-white font-bold bg-white/[0.04] border border-white/15 px-3.5 py-0.5 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 animate-pulse" />
          <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            AUTO_SPECTRUM_MATRIX // 7,500 NODES
          </span>
        </div>
        <span className="text-white/40">DELHI // IN</span>
      </motion.div>

      {/* ── Massive Interactive Multi-Color Particle Text Canvas ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="w-full max-w-7xl relative min-h-[320px] sm:min-h-[380px] md:min-h-[420px] flex items-center justify-center my-2 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-sm"
      >
        {/* Subtle HUD corner notches */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/50 pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-purple-400/50 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-pink-400/50 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400/50 pointer-events-none" />

        <ParticleTextMorph
          key={pulseKey}
          text="ANKUSH RAWAT"
          height="400px"
          interactive={true}
          autoStart={true}
          className="w-full"
        />
      </motion.div>

      {/* Interactive Controls & Navigation Cue */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="w-full max-w-7xl flex flex-wrap items-center justify-between gap-4 mt-2 px-2"
      >
        <div className="flex items-center gap-3 font-mono text-[10px] text-white/50 tracking-widest uppercase">
          <span className="flex items-center gap-1.5 text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded">
            <Zap className="w-3 h-3" />
            MULTI-COLOR AUTO SHIFT
          </span>
          <span className="hidden sm:inline-block">HOVER TO SWIRL • CLICK FOR SHOCKWAVE</span>
        </div>

        <button
          type="button"
          onClick={() => setPulseKey((k) => k + 1)}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-purple-500/50 rounded-full font-mono text-[10px] text-white/80 hover:text-purple-300 transition-all cursor-pointer group"
        >
          <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500 text-purple-400" />
          <span>RE-DETONATE SPHERE</span>
        </button>
      </motion.div>
    </div>
  );
};

export default TopParticleHeader;
