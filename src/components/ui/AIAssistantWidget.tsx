"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, ArrowRight, Copy, Check, RotateCcw, Volume2, VolumeX, Download, ExternalLink, Terminal, Shield, FileText, Code2, Briefcase, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PersonaMode = "recruiter" | "dev";

interface ChatCardData {
    type: "skills" | "experience" | "projects" | "contact";
    data?: Record<string, unknown>;
}

interface ChatMessage {
    id: string;
    sender: "user" | "ai";
    text: string;
    badges?: string[];
    card?: ChatCardData;
    action?: {
        label: string;
        targetId: string;
    };
    followUps?: { label: string; prompt: string }[];
}

const SLASH_COMMANDS = [
    { cmd: "/skills", label: "⚡ Skills Matrix", prompt: "Show me Ankush's technical skills matrix" },
    { cmd: "/projects", label: "🚀 Top Projects", prompt: "What are his key projects?" },
    { cmd: "/experience", label: "💼 Work History", prompt: "Show me his internship timeline" },
    { cmd: "/resume", label: "📄 Resume Download", prompt: "How can I download Ankush's resume?" },
    { cmd: "/contact", label: "📬 Contact Card", prompt: "Give me Ankush's contact details" },
];

const RECRUITER_KNOWLEDGE: Record<string, ChatMessage> = {
    skills: {
        id: "",
        sender: "ai",
        text: "Ankush is a production-ready Software Developer with a strong track record across Web Engineering, Mobile Development, and Artificial Intelligence:",
        badges: ["FULLSTACK_DEV", "FAST_LEARNER", "TEAM_PLAYER"],
        card: { type: "skills" },
        action: { label: "View Full Skills Section", targetId: "skills" },
        followUps: [
            { label: "💼 Work History", prompt: "Show me his internship timeline" },
            { label: "📄 Download Resume", prompt: "How can I download Ankush's resume?" }
        ]
    },
    experience: {
        id: "",
        sender: "ai",
        text: "Ankush has completed key software engineering internships with proven business impact:",
        badges: ["VARADHAST", "TBI_INCUBATOR"],
        card: { type: "experience" },
        action: { label: "Explore Experience Log", targetId: "experience" },
        followUps: [
            { label: "⚡ Skills Matrix", prompt: "Show me Ankush's technical skills matrix" },
            { label: "📬 Contact Card", prompt: "Give me Ankush's contact details" }
        ]
    },
    contact: {
        id: "",
        sender: "ai",
        text: "Ankush is actively seeking Software Developer / Engineering roles and is ready to start immediately:",
        badges: ["STATUS: AVAILABLE", "LOCATION: DEHRADUN/REMOTE"],
        card: { type: "contact" },
        action: { label: "Go to Contact Form", targetId: "contact" },
        followUps: [
            { label: "📄 Download Resume", prompt: "How can I download Ankush's resume?" },
            { label: "🚀 View Projects", prompt: "What are his key projects?" }
        ]
    },
    projects: {
        id: "",
        sender: "ai",
        text: "Ankush builds end-to-end applications designed for scale and performance:",
        badges: ["COMPUTER_VISION", "FULLSTACK_WEB", "AI_SAAS"],
        card: { type: "projects" },
        action: { label: "Explore Projects Section", targetId: "projects" },
        followUps: [
            { label: "⚡ Skills Matrix", prompt: "Show me Ankush's technical skills matrix" },
            { label: "📬 Contact Card", prompt: "Give me Ankush's contact details" }
        ]
    },
};

const DEV_KNOWLEDGE: Record<string, ChatMessage> = {
    skills: {
        id: "",
        sender: "ai",
        text: "TECHNICAL ARCHITECTURE TELEMETRY: System running React 18 / Next.js 14 (SSG/SSR), FastAPI backend microservices, Kotlin native Android, OpenCV computer vision pipelines, and Google Gemini API.",
        badges: ["NEXT.JS_14", "FASTAPI", "KOTLIN", "OPENCV", "TYPESCRIPT"],
        card: { type: "skills" },
        action: { label: "Inspect Tech Stack Radar", targetId: "tech-radar" },
        followUps: [
            { label: "🚀 Projects Pipeline", prompt: "What are his key projects?" },
            { label: "💼 Engineering Roles", prompt: "Show me his internship timeline" }
        ]
    },
    experience: {
        id: "",
        sender: "ai",
        text: "ENGINEERING DISPATCH LOG: Real-time image processing models built at Varadhast Innovations; Generative AI web architectures built at TBI Incubator.",
        badges: ["CV_PIPELINES", "AI_INTEGRATIONS"],
        card: { type: "experience" },
        action: { label: "Inspect Experience Log", targetId: "experience" },
        followUps: [
            { label: "⚡ Architecture Specs", prompt: "Show me Ankush's technical skills matrix" },
            { label: "📄 Resume Payload", prompt: "How can I download Ankush's resume?" }
        ]
    },
    contact: {
        id: "",
        sender: "ai",
        text: "COMMUNICATION NODE: Ready to establish connection via Email or Direct Portfolio Message:",
        badges: ["ANKUSHSINGHRAWAT154@GMAIL.COM"],
        card: { type: "contact" },
        action: { label: "Initiate Terminal Contact", targetId: "contact" },
        followUps: [
            { label: "📄 Download Resume", prompt: "How can I download Ankush's resume?" },
            { label: "🚀 Projects Specs", prompt: "What are his key projects?" }
        ]
    },
    projects: {
        id: "",
        sender: "ai",
        text: "DEPLOYED SYSTEM MODULES: Computer Vision object trackers, Next.js web platforms, and REST API microservices.",
        badges: ["OPENCV_CORE", "FASTAPI_BACKEND", "NEXTJS_FE"],
        card: { type: "projects" },
        action: { label: "Inspect Projects", targetId: "projects" },
        followUps: [
            { label: "⚡ Architecture Specs", prompt: "Show me Ankush's technical skills matrix" },
            { label: "📬 Contact Node", prompt: "Give me Ankush's contact details" }
        ]
    },
};

export default function AIAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [persona, setPersona] = useState<PersonaMode>("recruiter");
    const [speechEnabled, setSpeechEnabled] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            sender: "ai",
            text: "SYSTEM_ONLINE: Welcome to ANKUSH_AI. Select Recruiter Mode or Dev Mode above, or use slash commands like /skills or /projects!",
            badges: ["NEURAL_CONNECTED"],
            followUps: [
                { label: "⚡ /skills", prompt: "Show me Ankush's technical skills matrix" },
                { label: "💼 /experience", prompt: "Show me his internship timeline" },
                { label: "📄 /resume", prompt: "How can I download Ankush's resume?" }
            ]
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const speakText = (text: string) => {
        if (!speechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText("ankushsinghrawat154@gmail.com");
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    const handleResetChat = () => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
        setMessages([
            {
                id: "reset",
                sender: "ai",
                text: `SYSTEM_RESET: Context cleared in ${persona.toUpperCase()} mode. Ask me anything!`,
                badges: ["READY"],
            },
        ]);
    };

    const handleSend = (textToSend?: string) => {
        const query = textToSend || input;
        if (!query.trim()) return;

        const userMsg: ChatMessage = {
            id: String(Date.now()),
            sender: "user",
            text: query,
        };

        setMessages((prev) => [...prev, userMsg]);
        if (!textToSend) setInput("");
        setIsTyping(true);

        setTimeout(() => {
            const lower = query.toLowerCase();
            const kbSource = persona === "recruiter" ? RECRUITER_KNOWLEDGE : DEV_KNOWLEDGE;
            let matchedKey = "skills";

            if (lower.includes("experience") || lower.includes("work") || lower.includes("intern") || lower.includes("job") || lower.includes("/experience")) {
                matchedKey = "experience";
            } else if (lower.includes("contact") || lower.includes("hire") || lower.includes("email") || lower.includes("reach") || lower.includes("/contact") || lower.includes("/resume") || lower.includes("resume")) {
                matchedKey = "contact";
            } else if (lower.includes("project") || lower.includes("build") || lower.includes("app") || lower.includes("/projects")) {
                matchedKey = "projects";
            } else {
                matchedKey = "skills";
            }

            const matchedData = kbSource[matchedKey];
            const aiMsg: ChatMessage = {
                ...matchedData,
                id: String(Date.now() + 1),
            };

            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
            speakText(aiMsg.text);
        }, 400);
    };

    const handleActionClick = (targetId: string) => {
        setIsOpen(false);
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-auto select-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-4 w-[90vw] max-w-[410px] h-[570px] bg-black/95 border border-emerald-500/40 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.25)] backdrop-blur-2xl flex flex-col overflow-hidden relative"
                    >
                        {/* Scanline Background */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent pointer-events-none z-0" />

                        {/* Top Control Bar: Persona Switcher & HUD */}
                        <div className="relative z-10 px-4 py-3 border-b border-emerald-500/20 bg-emerald-950/30 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="relative w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                    <Bot className="w-4 h-4 text-emerald-400" />
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse border border-black" />
                                </div>
                                <div>
                                    <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                        ANKUSH_AI
                                    </h4>
                                    
                                    {/* Persona Mode Switcher */}
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <button
                                            onClick={() => setPersona("recruiter")}
                                            className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                                                persona === "recruiter"
                                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                                    : "text-white/40 hover:text-white/70"
                                            }`}
                                        >
                                            RECRUITER
                                        </button>
                                        <span className="text-[8px] text-white/20">|</span>
                                        <button
                                            onClick={() => setPersona("dev")}
                                            className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                                                persona === "dev"
                                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                                    : "text-white/40 hover:text-white/70"
                                            }`}
                                        >
                                            DEV MODE
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Header Action Tools */}
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setSpeechEnabled((prev) => !prev)}
                                    title={speechEnabled ? "Mute Voice Reading" : "Enable Voice Reading"}
                                    className={`p-1.5 rounded-lg border transition-all ${
                                        speechEnabled
                                            ? "text-emerald-400 bg-emerald-500/20 border-emerald-500/40"
                                            : "text-white/40 border-transparent hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                    onClick={handleCopyEmail}
                                    title="Copy Email Address"
                                    className="p-1.5 rounded-lg text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-500/30"
                                >
                                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                    onClick={handleResetChat}
                                    title="Reset Conversation"
                                    className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Body */}
                        <div ref={scrollRef} className="relative z-10 flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-emerald-500/20">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                                >
                                    <div
                                        className={`max-w-[90%] p-3.5 rounded-xl text-xs leading-relaxed ${
                                            msg.sender === "user"
                                                ? "bg-emerald-500/20 text-emerald-100 border border-emerald-500/40 rounded-br-none shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                                                : "bg-black/70 text-white/90 border border-white/10 rounded-bl-none space-y-2.5 backdrop-blur-sm"
                                        }`}
                                    >
                                        <p className="font-sans font-light">{msg.text}</p>

                                        {/* Badges Pill Tags */}
                                        {msg.badges && (
                                            <div className="flex flex-wrap gap-1 pt-1">
                                                {msg.badges.map((badge, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[8.5px] font-mono text-emerald-400 tracking-wider uppercase"
                                                    >
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Rich Interactive UI Card Components inside Chat */}
                                        {msg.card?.type === "skills" && (
                                            <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10 space-y-2 font-mono">
                                                <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-between">
                                                    <span>FRONTEND & FRAMEWORKS</span>
                                                    <span>95%</span>
                                                </div>
                                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-400 w-[95%]" />
                                                </div>

                                                <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-between pt-1">
                                                    <span>BACKEND & FASTAPI / APIs</span>
                                                    <span>92%</span>
                                                </div>
                                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-400 w-[92%]" />
                                                </div>

                                                <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-between pt-1">
                                                    <span>KOTLIN & OPENCV ML</span>
                                                    <span>88%</span>
                                                </div>
                                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-400 w-[88%]" />
                                                </div>
                                            </div>
                                        )}

                                        {msg.card?.type === "experience" && (
                                            <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10 space-y-2 font-mono text-[10.5px]">
                                                <div className="text-emerald-400 font-bold">🏢 Varadhast Innovations</div>
                                                <div className="text-white/60 text-[9.5px]">Android & Computer Vision ML Intern (2026)</div>
                                                <div className="border-t border-white/10 pt-2 text-emerald-400 font-bold">🚀 TBI Graphic Era Incubator</div>
                                                <div className="text-white/60 text-[9.5px]">AI-Assisted Full Stack Development Intern</div>
                                            </div>
                                        )}

                                        {msg.card?.type === "contact" && (
                                            <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10 space-y-2 font-mono text-[10px]">
                                                <div className="text-white/80">📧 ankushsinghrawat154@gmail.com</div>
                                                <div className="flex gap-2 pt-1">
                                                    <a
                                                        href="/Ankush_Resume.pdf"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download="Ankush_Resume.pdf"
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                                                    >
                                                        <Download className="w-3 h-3" />
                                                        <span>Resume.pdf</span>
                                                    </a>
                                                    <button
                                                        onClick={handleCopyEmail}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition-colors"
                                                    >
                                                        <Copy className="w-3 h-3" />
                                                        <span>{copiedEmail ? "Copied!" : "Copy Email"}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action button */}
                                    {msg.action && (
                                        <button
                                            onClick={() => handleActionClick(msg.action!.targetId)}
                                            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 hover:text-white transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)] group"
                                        >
                                            <span>[ {msg.action.label} ]</span>
                                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-emerald-400" />
                                        </button>
                                    )}

                                    {/* Dynamic Contextual Follow-up Chips */}
                                    {msg.followUps && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {msg.followUps.map((f, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleSend(f.prompt)}
                                                    className="text-[9px] font-mono px-2 py-1 rounded bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-white/60 hover:text-emerald-300 transition-colors"
                                                >
                                                    {f.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl max-w-[100px] border border-white/10">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                                </div>
                            )}
                        </div>

                        {/* Slash Commands Bar */}
                        <div className="relative z-10 px-3.5 py-2 border-t border-white/5 flex flex-wrap gap-1.5 max-h-[105px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/30 bg-black/60">
                            {SLASH_COMMANDS.map((sc) => (
                                <button
                                    key={sc.cmd}
                                    onClick={() => handleSend(sc.prompt)}
                                    className="text-[9.5px] font-mono px-2.5 py-1 rounded-md bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-white/70 hover:text-emerald-300 transition-colors"
                                >
                                    {sc.label}
                                </button>
                            ))}
                        </div>

                        {/* Input Footer */}
                        <div className="relative z-10 p-3 border-t border-white/10 bg-black/90 flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder={`Ask AI in ${persona.toUpperCase()} mode or type /skills...`}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 font-mono"
                            />
                            <button
                                onClick={() => handleSend()}
                                className="p-2 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="group relative p-3.5 rounded-full bg-black border border-emerald-500/50 text-emerald-400 hover:text-white hover:border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)] backdrop-blur-md transition-all duration-300 flex items-center justify-center"
                aria-label="Toggle AI Assistant"
            >
                <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
            </button>
        </div>
    );
}

