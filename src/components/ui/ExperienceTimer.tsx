import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ExperienceTimerProps {
    startDate: Date;
}

const ExperienceTimer = ({ startDate }: ExperienceTimerProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [, setTicker] = useState(0);

    // Force re-render every second continuously
    useEffect(() => {
        const interval = setInterval(() => {
            setTicker((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const calculateDuration = () => {
        const now = new Date();
        const diff = now.getTime() - startDate.getTime();

        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        const remainingAfterYears = diff % (1000 * 60 * 60 * 24 * 365.25);
        const months = Math.floor(remainingAfterYears / (1000 * 60 * 60 * 24 * 30.44));
        const remainingAfterMonths = remainingAfterYears % (1000 * 60 * 60 * 24 * 30.44);
        const days = Math.floor(remainingAfterMonths / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { years, months, days, hours, minutes, seconds };
    };

    const { years, months, days, hours, minutes, seconds } = calculateDuration();

    return (
        <div
            className="relative flex flex-col items-center justify-center w-full h-full cursor-pointer z-50 pointer-events-auto select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence mode="wait">
                {!isHovered ? (
                    <motion.div
                        key="summary"
                        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                        className="flex flex-col items-center justify-center"
                    >
                        <span className="block text-7xl md:text-8xl font-display font-bold text-white mb-2 tracking-tighter drop-shadow-2xl">
                            {years}+
                        </span>
                        <div className="w-16 h-px bg-white/20 my-2" />
                        <span className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-white/60">
                            Years Experience
                        </span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="detailed"
                        initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                        className="flex flex-col items-center justify-center w-full"
                    >
                        {/* Cybernetic Container */}
                        <div className="relative p-6 border border-emerald-500/30 bg-black/80 backdrop-blur-xl rounded-sm w-full max-w-[270px]">
                            {/* Decorative corners */}
                            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400" />
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400" />
                            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400" />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400" />

                            <div className="grid grid-cols-3 gap-x-6 gap-y-5 text-center">
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-mono font-bold text-white tracking-tight">{years}</span>
                                    <span className="text-[10px] uppercase text-emerald-400/90 tracking-widest font-mono mt-1">YRS</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-mono font-bold text-white tracking-tight">{months}</span>
                                    <span className="text-[10px] uppercase text-emerald-400/90 tracking-widest font-mono mt-1">MOS</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-mono font-bold text-white tracking-tight">{days}</span>
                                    <span className="text-[10px] uppercase text-emerald-400/90 tracking-widest font-mono mt-1">DAYS</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-mono font-bold text-white tracking-tight">{hours}</span>
                                    <span className="text-[10px] uppercase text-emerald-400/90 tracking-widest font-mono mt-1">HRS</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-3xl font-mono font-bold text-white tracking-tight">{minutes}</span>
                                    <span className="text-[10px] uppercase text-emerald-400/90 tracking-widest font-mono mt-1">MIN</span>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <div className="relative flex items-center justify-center px-1.5 py-0.5 rounded bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.35)] border border-emerald-500/30">
                                        <span className="text-3xl font-mono font-bold text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">
                                            {seconds.toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    <span className="text-[10px] uppercase text-emerald-400/90 tracking-widest font-mono mt-1">SEC</span>
                                </div>
                            </div>

                            <div className="mt-5 pt-3 border-t border-white/10 text-center">
                                <span className="text-[8px] font-mono text-white/40 tracking-[0.3em] uppercase">
                                    _LIVE_SYSTEM_UPTIME
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExperienceTimer;
