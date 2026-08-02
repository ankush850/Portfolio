"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Web Audio Synthesizer helper for sci-fi UI sound effects.
 * Generates custom sound waves directly in browser without external audio assets.
 */
class SciFiSynth {
    private ctx: AudioContext | null = null;

    private getContext(): AudioContext | null {
        if (typeof window === "undefined") return null;
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
        return this.ctx;
    }

    public playHover() {
        try {
            const ctx = this.getContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

            gain.gain.setValueAtTime(0.015, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch {
            // Ignore audio context errors gracefully
        }
    }

    public playClick() {
        try {
            const ctx = this.getContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.03, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } catch {
            // Ignore audio context errors
        }
    }

    public playChime() {
        try {
            const ctx = this.getContext();
            if (!ctx) return;
            const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);

                gain.gain.setValueAtTime(0.02, ctx.currentTime + idx * 0.04);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.04 + 0.3);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + idx * 0.04);
                osc.stop(ctx.currentTime + idx * 0.04 + 0.3);
            });
        } catch {
            // Ignore audio errors
        }
    }
}

export const synth = new SciFiSynth();

export default function SoundscapeController() {
    const [isMuted, setIsMuted] = useState(true);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const savedState = localStorage.getItem("portfolio_audio_muted");
        if (savedState !== null) {
            setIsMuted(savedState === "true");
        }
    }, []);

    const toggleAudio = () => {
        const nextState = !isMuted;
        setIsMuted(nextState);
        localStorage.setItem("portfolio_audio_muted", String(nextState));
        if (!nextState) {
            synth.playChime();
        }
    };

    // Attach global click sound if enabled
    useEffect(() => {
        if (isMuted) return;

        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (target && (target.closest("button") || target.closest("a") || target.closest(".cursor-pointer"))) {
                synth.playClick();
            }
        };

        window.addEventListener("click", handleGlobalClick);
        return () => window.removeEventListener("click", handleGlobalClick);
    }, [isMuted]);

    return (
        <div className="fixed bottom-6 right-20 z-50 pointer-events-auto">
            <div className="relative">
                <AnimatePresence>
                    {showTooltip && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-black/90 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 rounded backdrop-blur-md shadow-xl whitespace-nowrap flex items-center gap-2"
                        >
                            <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                            <span>{isMuted ? "CYBER_AUDIO: OFF" : "CYBER_AUDIO: ONLINE"}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={toggleAudio}
                    onMouseEnter={() => {
                        setShowTooltip(true);
                        if (!isMuted) synth.playHover();
                    }}
                    onMouseLeave={() => setShowTooltip(false)}
                    className={`group relative p-3 rounded-full border backdrop-blur-md transition-all duration-300 ${!isMuted
                            ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            : "bg-black/60 border-white/10 text-white/40 hover:text-white hover:border-white/30"
                        }`}
                    aria-label="Toggle Sci-Fi Audio Effects"
                >
                    {!isMuted ? (
                        <div className="relative">
                            <Volume2 className="w-4 h-4" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        </div>
                    ) : (
                        <VolumeX className="w-4 h-4" />
                    )}
                </button>
            </div>
        </div>
    );
}
