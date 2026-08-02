"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "./ui/SectionHeader";
import { Activity, GitCommit, Cpu, HardDrive, ShieldCheck, Terminal } from "lucide-react";

export default function LiveTelemetryDashboard() {
    const [cpuLoad, setCpuLoad] = useState(14);
    const [memUsage, setMemUsage] = useState(42);
    const [ping, setPing] = useState(18);

    // Simulate real-time metric jitter
    useEffect(() => {
        const interval = setInterval(() => {
            setCpuLoad(Math.floor(12 + Math.random() * 15));
            setMemUsage(Math.floor(40 + Math.random() * 6));
            setPing(Math.floor(15 + Math.random() * 8));
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    // Generate pseudo contribution grid blocks (52 weeks x 7 days scaled)
    const generateHeatmap = () => {
        const blocks = [];
        for (let i = 0; i < 140; i++) {
            const intensity = Math.random();
            let colorClass = "bg-white/5 border-white/5";
            if (intensity > 0.8) colorClass = "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]";
            else if (intensity > 0.5) colorClass = "bg-emerald-500/60";
            else if (intensity > 0.25) colorClass = "bg-emerald-700/30";
            blocks.push({ id: i, colorClass });
        }
        return blocks;
    };

    const [heatmapBlocks] = useState(generateHeatmap);

    return (
        <section id="telemetry" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden bg-transparent">
            <div className="max-w-7xl mx-auto relative z-10">
                <SectionHeader
                    label="[ SYSTEM_TELEMETRY_V1.8 ]"
                    titleMain="Real-Time System"
                    titleAccent="Telemetry Matrix"
                    align="center"
                />

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {/* Gauge Card 1: CPU Telemetry */}
                    <div className="p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Cpu className="w-5 h-5 text-emerald-400" />
                                <span className="font-mono text-xs text-white/60 uppercase">CPU_UTILIZATION</span>
                            </div>
                            <span className="font-mono text-sm font-bold text-white">{cpuLoad}%</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${cpuLoad}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                            />
                        </div>
                    </div>

                    {/* Gauge Card 2: Memory Allocation */}
                    <div className="p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <HardDrive className="w-5 h-5 text-emerald-400" />
                                <span className="font-mono text-xs text-white/60 uppercase">MEMORY_HEAP</span>
                            </div>
                            <span className="font-mono text-sm font-bold text-white">{memUsage}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${memUsage}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                            />
                        </div>
                    </div>

                    {/* Gauge Card 3: Network Ping */}
                    <div className="p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-emerald-400" />
                                <span className="font-mono text-xs text-white/60 uppercase">LATENCY_PING</span>
                            </div>
                            <span className="font-mono text-sm font-bold text-emerald-400">{ping}ms</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${(ping / 50) * 100}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                            />
                        </div>
                    </div>
                </div>

                {/* GitHub Contribution Heatmap Card */}
                <div className="p-8 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <GitCommit className="w-6 h-6 text-emerald-400" />
                            <div>
                                <h4 className="font-display text-lg font-bold text-white uppercase">
                                    LIVE_COMMIT_ACTIVITY_HEATMAP
                                </h4>
                                <span className="text-[10px] font-mono text-white/40 uppercase">
                                    GITHUB // ANKUSH850 (2026 MATRIX)
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>STREAK: 365+ DAYS ACTIVE</span>
                        </div>
                    </div>

                    {/* Matrix Grid */}
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(14px,1fr))] gap-1.5">
                        {heatmapBlocks.map((block) => (
                            <div
                                key={block.id}
                                className={`w-3.5 h-3.5 rounded-sm border transition-transform duration-300 hover:scale-125 ${block.colorClass}`}
                            />
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/30">
                        <span>LESS</span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 bg-white/5 rounded-sm" />
                            <span className="w-2.5 h-2.5 bg-emerald-700/30 rounded-sm" />
                            <span className="w-2.5 h-2.5 bg-emerald-500/60 rounded-sm" />
                            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-sm" />
                        </div>
                        <span>MORE</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
