import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Code2, Server, Database, Cloud, Wrench,
  GitBranch, Brain
} from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";
import ParallaxSection from "./ui/ParallaxSection";
import SpotlightCard from "./ui/SpotlightCard";

const skillCategories = [
  { id: "01", title: "Languages", icon: Code2, color: "emerald", skills: [{ name: "JavaScript", level: 80 }, { name: "C++", level: 75 }, { name: "Python", level: 75 }, { name: "TypeScript", level: 70 }, { name: "Kotlin", level: 55 }] },
  { id: "02", title: "Frameworks", icon: Server, color: "blue", skills: [{ name: "React-Native", level: 80 }, { name: "FastAPI", level: 75 }, { name: "ReactJS", level: 70 }, { name: "Scikit-Learn", level: 70 }] },
  { id: "03", title: "Databases", icon: Database, color: "purple", skills: [{ name: "MongoDB", level: 50 }, { name: "SQLite", level: 80 }, { name: "Firebase", level: 60 }, { name: "Redis", level: 65 }, { name: "PostgreSQL", level: 75 }] },
  { id: "04", title: "Tools & Tech", icon: Wrench, color: "yellow", skills: [{ name: "VS Code", level: 95 }, { name: "PyCharm", level: 85 }, { name: "IntelliJ", level: 80 }, { name: "Canva", level: 75 }, { name: "Figma", level: 75 }, { name: "Git", level: 80 }] },
  { id: "05", title: "Cloud", icon: Cloud, color: "cyan", skills: [{ name: "Google Cloud", level: 90 }, { name: "Supabase", level: 85 }, { name: "Vercel", level: 85 }, { name: "Render", level: 80 }, { name: "AWS", level: 65 }] },
  { id: "06", title: "AI & Machine Learning", icon: Brain, color: "cyan", skills: [{ name: "YOLOv8", level: 85 }, { name: "OpenCV", level: 80 }, { name: "TensorFlow", level: 75 }, { name: "PyTorch", level: 75 }, { name: "LLM Integration", level: 80 }] },
];

const colorMap: Record<string, {
  accent: string;
  accentBg: string;
  accentBorder: string;
  ring: string;
  arc: string;
  hoverAccentBorder: string;
  viaRing40: string;
  viaRing30: string;
  groupHoverAccentBorder: string;
  groupHoverAccentBg: string;
  groupHoverAccent: string;
  groupHoverAccentBgStrong: string;
}> = {
  emerald: { 
    accent: "text-emerald-400", accentBg: "bg-emerald-500/10", accentBorder: "border-emerald-500/20", ring: "stroke-emerald-500", arc: "rgba(16,185,129,",
    hoverAccentBorder: "hover:border-emerald-500/20", viaRing40: "via-emerald-500/40", viaRing30: "via-emerald-500/30", groupHoverAccentBorder: "group-hover:border-emerald-500/20", groupHoverAccentBg: "group-hover:bg-emerald-500/10", groupHoverAccent: "group-hover:text-emerald-400", groupHoverAccentBgStrong: "group-hover:bg-emerald-400"
  },
  blue: { 
    accent: "text-blue-400", accentBg: "bg-blue-500/10", accentBorder: "border-blue-500/20", ring: "stroke-blue-500", arc: "rgba(59,130,246,",
    hoverAccentBorder: "hover:border-blue-500/20", viaRing40: "via-blue-500/40", viaRing30: "via-blue-500/30", groupHoverAccentBorder: "group-hover:border-blue-500/20", groupHoverAccentBg: "group-hover:bg-blue-500/10", groupHoverAccent: "group-hover:text-blue-400", groupHoverAccentBgStrong: "group-hover:bg-blue-400"
  },
  purple: { 
    accent: "text-purple-400", accentBg: "bg-purple-500/10", accentBorder: "border-purple-500/20", ring: "stroke-purple-500", arc: "rgba(168,85,247,",
    hoverAccentBorder: "hover:border-purple-500/20", viaRing40: "via-purple-500/40", viaRing30: "via-purple-500/30", groupHoverAccentBorder: "group-hover:border-purple-500/20", groupHoverAccentBg: "group-hover:bg-purple-500/10", groupHoverAccent: "group-hover:text-purple-400", groupHoverAccentBgStrong: "group-hover:bg-purple-400"
  },
  yellow: { 
    accent: "text-yellow-400", accentBg: "bg-yellow-500/10", accentBorder: "border-yellow-500/20", ring: "stroke-yellow-500", arc: "rgba(234,179,8,",
    hoverAccentBorder: "hover:border-yellow-500/20", viaRing40: "via-yellow-500/40", viaRing30: "via-yellow-500/30", groupHoverAccentBorder: "group-hover:border-yellow-500/20", groupHoverAccentBg: "group-hover:bg-yellow-500/10", groupHoverAccent: "group-hover:text-yellow-400", groupHoverAccentBgStrong: "group-hover:bg-yellow-400"
  },
  cyan: { 
    accent: "text-cyan-400", accentBg: "bg-cyan-500/10", accentBorder: "border-cyan-500/20", ring: "stroke-cyan-500", arc: "rgba(6,182,212,",
    hoverAccentBorder: "hover:border-cyan-500/20", viaRing40: "via-cyan-500/40", viaRing30: "via-cyan-500/30", groupHoverAccentBorder: "group-hover:border-cyan-500/20", groupHoverAccentBg: "group-hover:bg-cyan-500/10", groupHoverAccent: "group-hover:text-cyan-400", groupHoverAccentBgStrong: "group-hover:bg-cyan-400"
  },
  rose: { 
    accent: "text-rose-400", accentBg: "bg-rose-500/10", accentBorder: "border-rose-500/20", ring: "stroke-rose-500", arc: "rgba(244,63,94,",
    hoverAccentBorder: "hover:border-rose-500/20", viaRing40: "via-rose-500/40", viaRing30: "via-rose-500/30", groupHoverAccentBorder: "group-hover:border-rose-500/20", groupHoverAccentBg: "group-hover:bg-rose-500/10", groupHoverAccent: "group-hover:text-rose-400", groupHoverAccentBgStrong: "group-hover:bg-rose-400"
  },
};

// Circular progress arc component
const SkillArc = ({ name, level, delay, arcColor }: { name: string; level: number; delay: number; arcColor: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="group/token relative flex items-center gap-3 px-3 py-2.5 bg-black/40 border border-white/5 rounded-lg hover:border-white/15 hover:bg-white/[0.03] hover:-translate-y-0.5 transition-all duration-300 cursor-crosshair"
    >
      {/* Mini arc progress ring */}
      <div className="relative w-10 h-10 shrink-0">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 44 44">
          {/* Background ring */}
          <circle cx="22" cy="22" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          {/* Progress arc */}
          <motion.circle
            cx="22"
            cy="22"
            r={radius}
            fill="none"
            stroke={`${arcColor}0.6)`}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.2, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        {/* Percentage in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-[9px] font-mono font-bold text-white/50 group-hover/token:text-white/80 transition-colors"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: delay + 0.5 }}
          >
            {level}
          </motion.span>
        </div>
      </div>

      <span className="font-mono text-[11px] font-bold tracking-wide text-white/50 group-hover/token:text-white/80 transition-colors z-10 whitespace-nowrap">
        {name}
      </span>
    </motion.div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="[ SYSTEM_DIAGNOSTICS ]"
          titleMain="Operational"
          titleAccent="Capabilities"
          align="center"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, i) => {
            const colors = colorMap[category.color] || colorMap.emerald;
            return (
              <ParallaxSection key={category.title} speed={0.1} className="h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="h-full"
                >
                  <SpotlightCard
                    className={`h-full glass-card p-6 border border-white/10 bg-black/40 relative overflow-hidden group ${colors.hoverAccentBorder} transition-colors duration-500`}
                    spotlightColor="rgba(255, 255, 255, 0.05)"
                  >
                    {/* Color-coded gradient header accent */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${colors.viaRing40} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    {/* Background gradient bloom on hover */}
                    <div className={`absolute inset-0 ${colors.accentBg} opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none`} />

                    {/* Decorative Corners */}
                    <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 ${colors.groupHoverAccentBorder} transition-colors duration-500`} />
                    <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 ${colors.groupHoverAccentBorder} transition-colors duration-500`} />
                    <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 ${colors.groupHoverAccentBorder} transition-colors duration-500`} />
                    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 ${colors.groupHoverAccentBorder} transition-colors duration-500`} />

                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-start mb-8 gap-y-2 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${colors.groupHoverAccentBg} ${colors.groupHoverAccentBorder} transition-colors duration-500`}>
                          <category.icon className={`w-5 h-5 text-white/70 ${colors.groupHoverAccent} transition-colors duration-500`} />
                        </div>
                        <div className="flex flex-col">
                          <h3 className={`font-display text-lg font-bold text-white tracking-wide ${colors.groupHoverAccent} transition-colors duration-500`}>{category.title}</h3>
                          <span className={`text-[10px] font-mono text-white/30 ${colors.groupHoverAccent} opacity-50 transition-colors duration-500`}>MODULE_0{i + 1}</span>
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-white/5 border border-white/10 rounded flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-white/50 ${colors.groupHoverAccentBgStrong} opacity-75 transition-colors duration-500`}></span>
                          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 bg-white/80 ${colors.groupHoverAccentBgStrong} transition-colors duration-500`}></span>
                        </span>
                        <span className={`text-[9px] font-mono text-white/40 ${colors.groupHoverAccent} opacity-70 transition-colors duration-500 tracking-wider`}>ACTIVE</span>
                      </div>
                    </div>

                    {/* Skills List with arc progress */}
                    <div className="flex flex-wrap gap-2 md:gap-3 relative z-10">
                      {category.skills.map((skill, j) => (
                        <SkillArc
                          key={skill.name}
                          name={skill.name}
                          level={skill.level}
                          delay={0.2 + i * 0.1 + j * 0.05}
                          arcColor={colors.arc}
                        />
                      ))}
                    </div>

                    {/* Bottom Scan Line */}
                    <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent ${colors.viaRing30} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </SpotlightCard>
                </motion.div>
              </ParallaxSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
