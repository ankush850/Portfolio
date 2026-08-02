"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "./ui/SectionHeader";
import { Cpu, Server, Globe, Smartphone, Sparkles, Activity, ShieldCheck, Zap } from "lucide-react";

interface TechNode {
    id: string;
    name: string;
    category: "ai" | "fullstack" | "mobile" | "infra";
    role: string;
    latency: string;
    status: "HEALTHY" | "OPTIMAL" | "ACTIVE";
    description: string;
    x: number; // percentage coordinate on graph
    y: number;
}

const TECH_NODES: TechNode[] = [
    {
        id: "node-1",
        name: "OpenCV ML Pipeline",
        category: "ai",
        role: "Computer Vision Engine",
        latency: "12ms",
        status: "OPTIMAL",
        description: "Real-time object detection and frame processing algorithms built with Python & OpenCV.",
        x: 25,
        y: 30,
    },
    {
        id: "node-2",
        name: "Next.js 14 SSG/SSR",
        category: "fullstack",
        role: "Frontend Core Framework",
        latency: "8ms",
        status: "HEALTHY",
        description: "High-performance React application architecture with dynamic route pre-rendering.",
        x: 48,
        y: 20,
    },
    {
        id: "node-3",
        name: "FastAPI & Express Backend",
        category: "fullstack",
        role: "Microservices Gateway",
        latency: "18ms",
        status: "ACTIVE",
        description: "Asynchronous REST & GraphQL API endpoints powering high-throughput workloads.",
        x: 75,
        y: 35,
    },
    {
        id: "node-4",
        name: "Android Studio & Kotlin",
        category: "mobile",
        role: "Native Mobile App Engine",
        latency: "15ms",
        status: "HEALTHY",
        description: "Native Android application development focused on performance, UI polish, and API integration.",
        x: 35,
        y: 70,
    },
    {
        id: "node-5",
        name: "Google Gemini & OpenAI APIs",
        category: "ai",
        role: "Generative AI Integration",
        latency: "24ms",
        status: "OPTIMAL",
        description: "LLM agent integration, structured prompt pipelines, and intelligent AI features.",
        x: 65,
        y: 65,
    },
    {
        id: "node-6",
        name: "Docker & Cloud Deploy",
        category: "infra",
        role: "DevOps & Containerization",
        latency: "10ms",
        status: "HEALTHY",
        description: "Containerized deployment pipelines with scalable infrastructure orchestration.",
        x: 50,
        y: 85,
    },
];

export default function TechStackRadar() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [activeNode, setActiveNode] = useState<TechNode>(TECH_NODES[0]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Radar canvas sweeping effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let angle = 0;

        const render = () => {
            const width = (canvas.width = canvas.offsetWidth);
            const height = (canvas.height = canvas.offsetHeight);
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(centerX, centerY) - 10;

            ctx.clearRect(0, 0, width, height);

            // Draw concentric radar rings
            ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
            ctx.lineWidth = 1;

            [0.3, 0.6, 0.9].forEach((r) => {
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius * r, 0, Math.PI * 2);
                ctx.stroke();
            });

            // Draw radar crosshairs
            ctx.beginPath();
            ctx.moveTo(centerX - radius, centerY);
            ctx.lineTo(centerX + radius, centerY);
            ctx.moveTo(centerX, centerY - radius);
            ctx.lineTo(centerX, centerY + radius);
            ctx.stroke();

            // Draw sweeping line
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);

            const gradient = ctx.createConicGradient(0, 0, 0);
            gradient.addColorStop(0, "rgba(16, 185, 129, 0.4)");
            gradient.addColorStop(0.15, "rgba(16, 185, 129, 0.0)");
            gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, 0, Math.PI * 0.4);
            ctx.closePath();
            ctx.fill();

            ctx.restore();

            angle += 0.015;
            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const filteredNodes = TECH_NODES.filter(
        (node) => selectedCategory === "all" || node.category === selectedCategory
    );

    return (
        <section id="tech-radar" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden bg-transparent">
            <div className="max-w-7xl mx-auto relative z-10">
                <SectionHeader
                    label="[ ARCHITECTURE_RADAR_V3 ]"
                    titleMain="Interactive Tech Radar"
                    titleAccent="Node Simulator"
                    align="center"
                />

                {/* Filter buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                    {[
                        { id: "all", label: "ALL_NODES" },
                        { id: "ai", label: "AI_&_COMPUTER_VISION" },
                        { id: "fullstack", label: "FULLSTACK_CORE" },
                        { id: "mobile", label: "ANDROID_&_MOBILE" },
                        { id: "infra", label: "CLOUD_INFRA" },
                    ].map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all duration-300 rounded-lg border ${selectedCategory === cat.id
                                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                    : "bg-black/40 border-white/10 text-white/50 hover:border-white/20 hover:text-white"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Radar Grid & Node Inspection Panel */}
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                    {/* Visual Radar Canvas Container (7 cols) */}
                    <div className="lg:col-span-7 relative aspect-square w-full max-w-xl mx-auto rounded-3xl border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden p-6 shadow-2xl flex items-center justify-center">
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

                        {/* Connection Lines simulation */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-500/20 stroke-dasharray-[4]">
                            <line x1="25%" y1="30%" x2="48%" y2="20%" strokeWidth="1" />
                            <line x1="48%" y1="20%" x2="75%" y2="35%" strokeWidth="1" />
                            <line x1="75%" y1="35%" x2="65%" y2="65%" strokeWidth="1" />
                            <line x1="35%" y1="70%" x2="50%" y2="85%" strokeWidth="1" />
                        </svg>

                        {/* Render Tech Node points */}
                        {filteredNodes.map((node) => {
                            const isSelected = activeNode.id === node.id;
                            return (
                                <motion.div
                                    key={node.id}
                                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                    onClick={() => setActiveNode(node)}
                                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                                    whileHover={{ scale: 1.2 }}
                                >
                                    <div className="relative flex items-center justify-center">
                                        {/* Outer glowing pulsing ring */}
                                        <div
                                            className={`w-10 h-10 rounded-full border transition-all duration-300 flex items-center justify-center ${isSelected
                                                    ? "border-emerald-400 bg-emerald-950/80 shadow-[0_0_20px_rgba(16,185,129,0.8)]"
                                                    : "border-white/20 bg-black/80 group-hover:border-emerald-500/50"
                                                }`}
                                        >
                                            <div
                                                className={`w-3 h-3 rounded-full ${isSelected ? "bg-emerald-400 animate-ping" : "bg-white/40 group-hover:bg-emerald-400"
                                                    }`}
                                            />
                                        </div>

                                        {/* Node Label Tooltip */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-black/90 border border-white/10 rounded text-[9px] font-mono text-white/80 whitespace-nowrap backdrop-blur-sm pointer-events-none">
                                            {node.name}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 font-mono text-[9px] text-white/30">
                            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                            <span>RADAR_TELEMETRY: ACTIVE</span>
                        </div>
                    </div>

                    {/* Node Detail & Telemetry Inspector (5 cols) */}
                    <div className="lg:col-span-5">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeNode.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="p-8 rounded-3xl border border-emerald-500/30 bg-black/70 backdrop-blur-xl shadow-2xl space-y-6 relative overflow-hidden"
                            >
                                {/* Decorative corner */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/20 to-transparent pointer-events-none" />

                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div>
                                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                                            [ NODE_INSPECTOR ]
                                        </span>
                                        <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
                                            {activeNode.name}
                                        </h3>
                                    </div>
                                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 uppercase">
                                        {activeNode.status}
                                    </span>
                                </div>

                                <p className="text-sm font-light text-white/70 leading-relaxed">
                                    {activeNode.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-xs">
                                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                        <div className="text-[9px] text-white/40 uppercase mb-1">ROLE_SPEC</div>
                                        <div className="text-white font-semibold">{activeNode.role}</div>
                                    </div>

                                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                        <div className="text-[9px] text-white/40 uppercase mb-1">LATENCY_PING</div>
                                        <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                                            <Zap className="w-3.5 h-3.5" />
                                            <span>{activeNode.latency}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/30">
                                    <span>PROTOCOL: HTTP/3 QUIC</span>
                                    <span>ENCRYPT: TLS_1.3</span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
