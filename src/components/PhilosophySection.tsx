import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useTransform, useSpring } from "framer-motion";
import { SectionHeader } from "./ui/SectionHeader";
import TextReveal from "./ui/TextReveal";
import { Server, Sparkles, Terminal, Activity, Network, Cpu, Brain, Zap, Layers } from "lucide-react";

const BentoCard = ({ children, className = "", delay = 0, glowColor = "rgba(16, 185, 129, 0.15)" }: { children: React.ReactNode, className?: string, delay?: number, glowColor?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXLocal = e.clientX - rect.left;
        const mouseYLocal = e.clientY - rect.top;
        x.set(mouseXLocal / width - 0.5);
        y.set(mouseYLocal / height - 0.5);
        mouseX.set(mouseXLocal);
        mouseY.set(mouseYLocal);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const maskImage = useMotionTemplate`radial-gradient(400px at ${mouseX}px ${mouseY}px, white, transparent)`;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`group relative rounded-[2rem] bg-[#09090b] border border-white/5 backdrop-blur-md shadow-2xl ${className}`}
        >
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                <motion.div
                    className="absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                    style={{ maskImage, WebkitMaskImage: maskImage, background: glowColor }}
                />
            </div>
            <div className="relative h-full z-10 flex flex-col p-6 md:p-10" style={{ transform: "translateZ(20px)" }}>
                {children}
            </div>
        </motion.div>
    );
};

const PhilosophySection = () => {
    const dob = new Date("1999-11-27");
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    // Get current time formatted like the logs
    const now = new Date();
    const logTime = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];

    return (
        <section id="philosophy" className="py-20 md:py-32 px-4 md:px-12 relative overflow-hidden bg-transparent perspective-[2000px]">
            {/* Background glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-emerald-500/10 rounded-full blur-[80px] md:blur-[120px] -z-10 pointer-events-none opacity-50" />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-16 md:mb-32">
                    <SectionHeader
                        label="[ DIRECTIVE_LOGIC ]"
                        titleMain="My Operational"
                        titleAccent="Manifesto."
                        align="center"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-[minmax(280px,auto)]">
                    
                    {/* ROW 1 */}
                    {/* 1. Core Belief */}
                    <BentoCard className="md:col-span-2 lg:col-span-8" delay={0.1} glowColor="rgba(16, 185, 129, 0.2)">
                        <div className="flex-1 flex flex-col justify-center">
                            <motion.div 
                                initial={{ rotate: -180, opacity: 0 }}
                                whileInView={{ rotate: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: "backOut" }}
                                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 md:mb-8 border border-emerald-500/20"
                            >
                                <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" />
                            </motion.div>
                            <h3 className="font-display text-2xl md:text-4xl lg:text-5xl font-light leading-tight text-white/70 tracking-tight">
                                Every line of code is <span className="text-white font-medium">cultivated with intention</span>.<br className="hidden xl:block" /> I seek no comfort in numbers, only in the <span className="text-white font-medium text-emerald-100">precision of quality</span>.
                            </h3>
                            <div className="mt-8 md:mt-12 flex items-center gap-4">
                                <div className="h-[2px] w-16 bg-gradient-to-r from-emerald-500 to-transparent" />
                                <span className="text-xs font-mono text-emerald-400/80 tracking-[0.3em] uppercase">Fundamental Axiom</span>
                            </div>
                        </div>
                    </BentoCard>

                    {/* 2. System Status */}
                    <BentoCard className="md:col-span-1 lg:col-span-4 flex flex-col items-center justify-center text-center overflow-hidden" delay={0.2} glowColor="rgba(59, 130, 246, 0.2)">
                        <div className="absolute inset-0 border-[40px] border-black/20 rounded-full blur-3xl pointer-events-none" />
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Activity className="w-12 h-12 md:w-16 md:h-16 text-blue-400 mb-6 md:mb-8 mx-auto" />
                        </motion.div>
                        <div className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-white/60 space-y-3 md:space-y-4 w-full relative z-10 mt-auto md:mt-0">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span>PROTOCOL</span>
                                <span className="text-white/40">INTO_AKP</span>
                            </div>
                            <div className="bg-blue-500/10 border border-blue-500/20 py-2.5 px-3 md:py-3 md:px-4 rounded-xl flex items-center justify-between">
                                <span className="text-blue-400/80">STATUS</span>
                                <span className="text-blue-400 font-bold relative flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping absolute -left-4"></span>
                                    <span className="w-2 h-2 rounded-full bg-blue-400 absolute -left-4"></span>
                                    V.{age}.0_ACTIVE
                                </span>
                            </div>
                            <div className="flex items-center justify-center gap-2 pt-2">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                <p className="animate-pulse text-emerald-400/80 font-bold">VALIDATION_PENDING_</p>
                            </div>
                        </div>
                    </BentoCard>

                    {/* ROW 2 */}
                    {/* Technology Stack - NEW */}
                    <BentoCard className="md:col-span-2 lg:col-span-8 shadow-2xl bg-gradient-to-br from-[#09090b] to-emerald-950/10" delay={0.25} glowColor="rgba(16, 185, 129, 0.15)">
                        <div className="flex flex-col h-full">
                            <h4 className="text-emerald-400 font-mono text-xs tracking-[0.2em] mb-6 uppercase flex items-center gap-2">
                                <Terminal className="w-4 h-4" /> [ // KEY TECHNOLOGIES ]
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                                {/* Tech 1: Python/AI */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col hover:bg-white/[0.04] transition-colors relative overflow-hidden group/tech">
                                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/tech:opacity-100 transition-opacity" />
                                    <div className="flex justify-between items-start mb-4 md:mb-6 relative z-10">
                                        <Brain className="w-6 h-6 md:w-8 md:h-8 text-white/60 group-hover/tech:text-emerald-400 transition-colors duration-500" />
                                        <span className="text-[9px] md:text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">V.3.11</span>
                                    </div>
                                    <h5 className="text-white font-medium mb-2 md:mb-3 font-display tracking-wide relative z-10 text-base md:text-lg">PYTHON & AI</h5>
                                    <p className="text-[9px] md:text-[10px] font-mono text-white/40 leading-relaxed uppercase relative z-10 mt-auto">
                                        COMPUTER VISION. GENERATIVE AI. ROBUST BACKEND APIS.
                                    </p>
                                </div>
                                
                                {/* Tech 2: React Ecosystem */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col hover:bg-white/[0.04] transition-colors relative overflow-hidden group/tech">
                                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/tech:opacity-100 transition-opacity" />
                                    <div className="flex justify-between items-start mb-4 md:mb-6 relative z-10">
                                        <Layers className="w-6 h-6 md:w-8 md:h-8 text-white/60 group-hover/tech:text-blue-400 transition-colors duration-500" />
                                        <span className="text-[9px] md:text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">V.14.0</span>
                                    </div>
                                    <h5 className="text-white font-medium mb-2 md:mb-3 font-display tracking-wide relative z-10 text-base md:text-lg">REACT / NEXT.JS</h5>
                                    <p className="text-[9px] md:text-[10px] font-mono text-white/40 leading-relaxed uppercase relative z-10 mt-auto">
                                        RESPONSIVE COMPONENT-BASED UIs. FULL-STACK WEB APPLICATIONS.
                                    </p>
                                </div>

                                {/* Tech 3: Node/FastAPI */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col hover:bg-white/[0.04] transition-colors relative overflow-hidden group/tech">
                                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover/tech:opacity-100 transition-opacity" />
                                    <div className="flex justify-between items-start mb-4 md:mb-6 relative z-10">
                                        <Zap className="w-6 h-6 md:w-8 md:h-8 text-white/60 group-hover/tech:text-purple-400 transition-colors duration-500" />
                                        <span className="text-[9px] md:text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/20">HEALTHY</span>
                                    </div>
                                    <h5 className="text-white font-medium mb-2 md:mb-3 font-display tracking-wide relative z-10 text-base md:text-lg">FASTAPI & EXPRESS</h5>
                                    <p className="text-[9px] md:text-[10px] font-mono text-white/40 leading-relaxed uppercase relative z-10 mt-auto">
                                        HIGH-PERFORMANCE RESTFUL SERVICES. SECURE AUTHENTICATION. DATA PIPELINES.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* System Log - NEW */}
                    <BentoCard className="md:col-span-1 lg:col-span-4 bg-[#050505] overflow-hidden" delay={0.28} glowColor="rgba(16, 185, 129, 0.1)">
                        <div className="flex flex-col h-full">
                            <h4 className="text-emerald-400 font-mono text-xs tracking-[0.2em] mb-4 uppercase">
                                [ // SYSTEM LOG : RECENT_DEPLOYMENTS ]
                            </h4>
                            <div className="flex-1 bg-black/80 border border-white/5 rounded-xl p-4 md:p-5 font-mono text-[9px] md:text-xs overflow-hidden relative shadow-inner">
                                <div className="space-y-4">
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                                        <p className="text-white/40 leading-relaxed">
                                            <span className="text-emerald-500/70">[{logTime}]</span> :: PYTHON_CV_PIPELINE : <br/>
                                            <span className="text-white/70 pl-2">↳ MODEL_WEIGHTS_SYNCED (10/10)</span>
                                        </p>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}>
                                        <p className="text-white/40 leading-relaxed">
                                            <span className="text-emerald-500/70">[{logTime}]</span> :: NEXTJS_FRONTEND : <br/>
                                            <span className="text-blue-400/80 pl-2">↳ V.14_BUILD_DEPLOYED</span>
                                        </p>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.0 }}>
                                        <p className="text-white/40 leading-relaxed">
                                            <span className="text-emerald-500/70">[{logTime}]</span> :: FASTAPI_SERVER : <br/>
                                            <span className="text-emerald-400/90 pl-2">↳ 99.99% (CONTINUOUS)</span>
                                        </p>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                                        <p className="text-emerald-400 mt-4 animate-pulse">root@system:~# _</p>
                                    </motion.div>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </BentoCard>

                    {/* ROW 3 */}
                    {/* 3. Institutional Grade */}
                    <BentoCard className="md:col-span-1 lg:col-span-5" delay={0.3}>
                        <div className="flex justify-between items-start mb-8 md:mb-10">
                            <Server className="w-8 h-8 md:w-10 md:h-10 text-white/30" />
                            <Network className="w-5 h-5 md:w-6 md:h-6 text-emerald-400/50" />
                        </div>
                        <h3 className="font-display text-3xl md:text-4xl font-bold leading-none text-white mb-4 md:mb-6">
                            Institutional-<br />Grade<br />Systems.
                        </h3>
                        <p className="text-sm md:text-base text-white/50 leading-relaxed mb-8 md:mb-12 flex-1">
                            Standard solutions suffice. <strong className="text-white/80 font-medium">I rewrite the standards.</strong> Latency, downtime, and fragile pipelines used to be the norm. Not anymore.
                        </p>
                        
                        <div className="mt-auto space-y-2 md:space-y-3 p-4 md:p-5 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-md">
                            <div className="flex justify-between text-xs font-mono text-white/50 mb-1">
                                <span>SYSTEM_UPTIME</span>
                                <span className="text-emerald-400">99.99%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full overflow-hidden h-1.5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "99.99%" }}
                                    transition={{ duration: 2, ease: "circOut", delay: 0.6 }}
                                    viewport={{ once: true }}
                                    className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.8)] rounded-full relative" 
                                >
                                    <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/50 blur-[2px]" />
                                </motion.div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* 4. The Tech Stack Matrix & Quote Combined (Expanded) */}
                    <BentoCard className="md:col-span-2 lg:col-span-7 bg-gradient-to-br from-[#09090b] to-emerald-950/20" delay={0.4}>
                        <div className="flex flex-col h-full relative">
                            {/* Decorative background icon */}
                            <Cpu className="absolute -bottom-10 -right-10 w-64 h-64 text-emerald-500/5 rotate-12 pointer-events-none" />
                            
                            <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8 relative z-10">
                                <Terminal className="w-5 h-5 md:w-6 md:h-6 text-emerald-400/50" />
                                <span className="text-[10px] md:text-xs font-mono text-white/30 uppercase tracking-widest">Core Capabilities</span>
                            </div>
                            
                            <TextReveal type="scrub" className="font-display text-xl md:text-3xl font-light text-white/80 leading-tight mb-6 md:mb-8 relative z-10" scrollOffset={["start 0.9", "start 0.5"]}>
                                "One mind aligned with purpose surpasses any algorithm without direction."
                            </TextReveal>
                            
                            <div className="mt-auto relative z-10">
                                <p className="text-[9px] md:text-xs font-mono tracking-[0.1em] text-emerald-400/70 uppercase leading-relaxed mb-5 md:mb-6 border-l-2 border-emerald-500/30 pl-3 md:pl-4 py-1">
                                    Managing distributed systems & deploying intelligent computer vision models at scale. Combining rigorous software engineering practices with cutting-edge infrastructure to build resilient, high-performance applications.
                                </p>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {['PYTHON', 'OPENAI API', 'COMPUTER VISION', 'NEXT.JS', 'REACT', 'FASTAPI', 'OPENCV', 'EXPRESS.JS'].map((tag, i) => (
                                        <motion.span 
                                            key={tag}
                                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={{ delay: 0.6 + (i * 0.05), type: "spring", stiffness: 200 }}
                                            viewport={{ once: true }}
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.15)", borderColor: "rgba(16, 185, 129, 0.4)" }}
                                            className="px-3 py-1.5 md:px-5 md:py-2.5 text-[9px] md:text-xs font-mono border border-white/10 text-white/60 rounded-full transition-all cursor-crosshair bg-black/40 backdrop-blur-md shadow-sm"
                                        >
                                            {tag}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                </div>
            </div>
        </section>
    );
};

export default PhilosophySection;
