"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, ArrowRight, CornerDownLeft, Sparkles } from "lucide-react";

interface CommandOutput {
    id: string;
    command: string;
    output: React.ReactNode;
}

export default function CommandTerminal() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<CommandOutput[]>([
        {
            id: "init",
            command: "system.init",
            output: (
                <div className="space-y-1 text-emerald-400 font-mono text-xs">
                    <p>ANKUSH_DEV TERMINAL v1.0.0 [Linux x86_64]</p>
                    <p>Type <span className="text-white font-bold">help</span> to list commands, or try <span className="text-white font-bold">sudo hire ankush</span></p>
                </div>
            ),
        },
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Keyboard shortcut listener (Ctrl + K or /)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey && e.key.toLowerCase() === "k") || (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA")) {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            } else if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const scrollToSection = (id: string) => {
        setIsOpen(false);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleCommand = (cmd: string) => {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        const lower = trimmed.toLowerCase();
        let outputNode: React.ReactNode = null;

        if (lower === "help") {
            outputNode = (
                <div className="space-y-1 text-xs font-mono text-white/80">
                    <p className="text-emerald-400 font-bold">AVAILABLE COMMANDS:</p>
                    <p><span className="text-emerald-300 w-24 inline-block">skills</span> - Inspect technical stack & skills matrix</p>
                    <p><span className="text-emerald-300 w-24 inline-block">projects</span> - View top engineering projects</p>
                    <p><span className="text-emerald-300 w-24 inline-block">experience</span> - View internship timeline & history</p>
                    <p><span className="text-emerald-300 w-24 inline-block">about</span> - Read bio & background</p>
                    <p><span className="text-emerald-300 w-24 inline-block">contact</span> - Jump to contact section</p>
                    <p><span className="text-emerald-300 w-24 inline-block">resume</span> - Download Ankush's Resume PDF</p>
                    <p><span className="text-emerald-300 w-24 inline-block">clear</span> - Clear terminal history</p>
                    <p><span className="text-emerald-300 w-24 inline-block">sudo hire</span> - Special recruiter shortcut</p>
                </div>
            );
        } else if (lower === "skills") {
            outputNode = (
                <div className="text-xs font-mono space-y-1 text-emerald-300">
                    <p>Fetching technical stack telemetry...</p>
                    <p className="text-white">▹ React.js, Next.js 14, FastAPI, Kotlin, OpenCV, Python, Node.js</p>
                    <button onClick={() => scrollToSection("skills")} className="text-emerald-400 underline hover:text-white mt-1 block">
                        [ Jump to Skills Section ]
                    </button>
                </div>
            );
        } else if (lower === "projects") {
            outputNode = (
                <div className="text-xs font-mono space-y-1 text-emerald-300">
                    <p>Fetching project repositories...</p>
                    <p className="text-white">▹ Computer Vision Object Detection Apps, Next.js Web SaaS Platforms, Microservices</p>
                    <button onClick={() => scrollToSection("projects")} className="text-emerald-400 underline hover:text-white mt-1 block">
                        [ Jump to Projects Section ]
                    </button>
                </div>
            );
        } else if (lower === "experience") {
            outputNode = (
                <div className="text-xs font-mono space-y-1 text-emerald-300">
                    <p>Fetching internship logs...</p>
                    <p className="text-white">▹ Varadhast Innovations (Android & CV ML Intern)</p>
                    <p className="text-white">▹ Technology Business Incubator - TBI (AI Full Stack Intern)</p>
                    <button onClick={() => scrollToSection("experience")} className="text-emerald-400 underline hover:text-white mt-1 block">
                        [ Jump to Experience Section ]
                    </button>
                </div>
            );
        } else if (lower === "about") {
            outputNode = (
                <div className="text-xs font-mono space-y-1 text-emerald-300">
                    <p>Ankush Rawat — Software Developer pursuing Computer Science & Software Engineering at Graphic Era University.</p>
                    <button onClick={() => scrollToSection("about")} className="text-emerald-400 underline hover:text-white mt-1 block">
                        [ Jump to About Section ]
                    </button>
                </div>
            );
        } else if (lower === "contact") {
            outputNode = (
                <div className="text-xs font-mono space-y-1 text-emerald-300">
                    <p>Email: ankushsinghrawat154@gmail.com</p>
                    <button onClick={() => scrollToSection("contact")} className="text-emerald-400 underline hover:text-white mt-1 block">
                        [ Jump to Contact Form ]
                    </button>
                </div>
            );
        } else if (lower === "resume") {
            if (typeof window !== "undefined") {
                window.open("/Ankush_Resume.pdf", "_blank");
            }
            outputNode = <div className="text-xs font-mono text-emerald-400">Opening Ankush_Resume.pdf...</div>;
        } else if (lower === "clear") {
            setHistory([]);
            setInput("");
            return;
        } else if (lower.includes("sudo hire") || lower.includes("hire")) {
            outputNode = (
                <div className="text-xs font-mono space-y-1.5 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-300">
                    <p className="font-bold text-white">ACCESS GRANTED: RECRUITER MODE ENABLED 🚀</p>
                    <p>Ankush is ready for full-time Software Engineering roles!</p>
                    <button onClick={() => scrollToSection("contact")} className="px-3 py-1 bg-emerald-500 text-black font-bold rounded hover:bg-emerald-400 mt-1 inline-block">
                        Initiate Hiring Contact
                    </button>
                </div>
            );
        } else {
            outputNode = (
                <div className="text-xs font-mono text-red-400">
                    Command not found: "{trimmed}". Type <span className="text-white underline">help</span> for command list.
                </div>
            );
        }

        setHistory((prev) => [
            ...prev,
            {
                id: String(Date.now()),
                command: trimmed,
                output: outputNode,
            },
        ]);
        setInput("");
    };

    return (
        <>
            {/* Global Trigger Button in corner or keyboard hint */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 border border-emerald-500/30 text-emerald-400 hover:text-white hover:border-emerald-400 text-xs font-mono shadow-lg backdrop-blur-md transition-all group"
            >
                <Terminal className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-emerald-400" />
                <span>TERMINAL</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/60">Ctrl+K</span>
            </button>

            {/* Terminal Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl h-[480px] bg-black/95 border border-emerald-500/40 rounded-xl shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col overflow-hidden font-mono"
                        >
                            {/* Terminal Window Bar */}
                            <div className="px-4 py-2.5 bg-emerald-950/40 border-b border-emerald-500/20 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block cursor-pointer" onClick={() => setIsOpen(false)} />
                                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                                    <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                                    <span className="text-xs text-white/60 font-mono ml-2">ankush@dev-matrix:~</span>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Output History */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono scrollbar-thin scrollbar-thumb-emerald-500/20">
                                {history.map((item) => (
                                    <div key={item.id} className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-emerald-400">
                                            <span>ankush@portfolio:~$</span>
                                            <span className="text-white">{item.command}</span>
                                        </div>
                                        <div className="pl-4">{item.output}</div>
                                    </div>
                                ))}
                                <div ref={bottomRef} />
                            </div>

                            {/* Input Command Line */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleCommand(input);
                                }}
                                className="px-4 py-3 bg-black border-t border-emerald-500/20 flex items-center gap-2"
                            >
                                <span className="text-emerald-400 text-xs font-bold">ankush@portfolio:~$</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a command (or 'help')..."
                                    className="flex-1 bg-transparent text-xs text-white placeholder:text-white/30 focus:outline-none font-mono"
                                />
                                <button type="submit" className="text-emerald-400 hover:text-white">
                                    <CornerDownLeft className="w-4 h-4" />
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
