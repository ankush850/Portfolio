import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy } from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";
import TextReveal from "./ui/TextReveal";
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const AwardSection = () => {
  const ref = useRef(null);

  return (
    <section id="awards" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden bg-transparent" ref={ref}>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader 
          label="[ RECOGNITION_LOG ]" 
          titleMain="HONORS &" 
          titleAccent="AWARDS" 
          align="center"
        />

        <div className="mt-16 relative">
          <style dangerouslySetInnerHTML={{__html: `
            .vertical-timeline::before {
              background: rgba(255, 255, 255, 0.1) !important;
            }
          `}} />

          <VerticalTimeline lineColor="rgba(255, 255, 255, 0.1)">
            <VerticalTimelineElement
              className="vertical-timeline-element--award"
              contentStyle={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                boxShadow: 'none',
                padding: '3rem'
              }}
              contentArrowStyle={{ borderRight: '7px solid rgba(255, 255, 255, 0.08)' }}
              iconStyle={{ 
                background: '#000000', 
                color: '#FFA500', 
                border: '1px solid rgba(255, 165, 0, 0.4)', 
                boxShadow: '0 0 15px rgba(245,158,11,0.2)' 
              }}
              icon={<Trophy />}
            >
                <div className="flex flex-col items-center text-center gap-6 group">
                  <TextReveal type="fade-up" delay={0.1}>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] md:text-xs font-mono border border-amber-500/20 text-amber-500/80 rounded bg-amber-500/5 uppercase tracking-[0.2em]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      IMPULSE 2026 // IEEE NITK SB
                    </span>
                  </TextReveal>
                  
                  <h3 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-white uppercase tracking-widest leading-tight">
                    <TextReveal type="blur-reveal" delay={0.2} as="span">
                      1st Place
                    </TextReveal>
                    <br />
                    <TextReveal type="blur-reveal" delay={0.3} as="span">
                      Hackathon Winner
                    </TextReveal>
                  </h3>

                  <div className="text-gray-400 leading-relaxed text-sm md:text-base border-t border-white/10 pt-6 mt-2 relative w-full">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                    
                    <TextReveal type="fade-up" delay={0.4}>
                      Secured 1st place in Impulse 2026, a specialized Signal Processing Hackathon conducted by the Signal Processing Society of IEEE NITK SB. Recognized for demonstrating advanced technical expertise, innovation, and exceptional problem-solving skills in engineering high-impact audio signal processing solutions.
                    </TextReveal>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="mt-8 rounded-lg overflow-hidden border border-white/10 relative group-hover:border-amber-500/30 transition-colors"
                    >
                      <img 
                        src={`/assest/IMPULSE WINNER.jpg`} 
                        alt="Impulse 2026 Winner" 
                        className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    </motion.div>
                  </div>
                </div>
            </VerticalTimelineElement>
            <VerticalTimelineElement
              className="vertical-timeline-element--award"
              contentStyle={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                boxShadow: 'none',
                padding: '3rem'
              }}
              contentArrowStyle={{ borderRight: '7px solid rgba(255, 255, 255, 0.08)' }}
              iconStyle={{ 
                background: '#000000', 
                color: '#FFA500', 
                border: '1px solid rgba(255, 165, 0, 0.4)', 
                boxShadow: '0 0 15px rgba(245,158,11,0.2)' 
              }}
              icon={<Trophy />}
            >
                <div className="flex flex-col items-center text-center gap-6 group">
                  <TextReveal type="fade-up" delay={0.1}>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] md:text-xs font-mono border border-amber-500/20 text-amber-500/80 rounded bg-amber-500/5 uppercase tracking-[0.2em]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      CODESANGRAM 2026 // QUIZCRED
                    </span>
                  </TextReveal>
                  
                  <h3 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-white uppercase tracking-widest leading-tight">
                    <TextReveal type="blur-reveal" delay={0.2} as="span">
                      1st Position
                    </TextReveal>
                    <br />
                    <TextReveal type="blur-reveal" delay={0.3} as="span">
                      Hackathon Winner
                    </TextReveal>
                  </h3>

                  <div className="text-gray-400 leading-relaxed text-sm md:text-base border-t border-white/10 pt-6 mt-2 relative w-full">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                    
                    <TextReveal type="fade-up" delay={0.4}>
                      Secured 1st Position in the Web Theme category at CodeSangram – Online Hackathon 2026, representing Graphic Era Hill University Bhimtal under team Procoder. Recognized by QuizCred, WebTantra, and CyberSudarshan for demonstrating exceptional innovation, technical excellence, and advanced problem-solving skills in full-stack web development.
                    </TextReveal>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="mt-8 rounded-lg overflow-hidden border border-white/10 relative group-hover:border-amber-500/30 transition-colors"
                    >
                      <img 
                        src={`/assest/winner codesangram.jpg`} 
                        alt="CodeSangram 2026 Winner" 
                        className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    </motion.div>
                  </div>
                </div>
            </VerticalTimelineElement>
            <VerticalTimelineElement
              className="vertical-timeline-element--award"
              contentStyle={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                boxShadow: 'none',
                padding: '3rem'
              }}
              contentArrowStyle={{ borderRight: '7px solid rgba(255, 255, 255, 0.08)' }}
              iconStyle={{ 
                background: '#000000', 
                color: '#FFA500', 
                border: '1px solid rgba(255, 165, 0, 0.4)', 
                boxShadow: '0 0 15px rgba(245,158,11,0.2)' 
              }}
              icon={<Trophy />}
            >
                <div className="flex flex-col items-center text-center gap-6 group">
                  <TextReveal type="fade-up" delay={0.1}>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] md:text-xs font-mono border border-amber-500/20 text-amber-500/80 rounded bg-amber-500/5 uppercase tracking-[0.2em]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      3SC AI HACKATHON 2026
                    </span>
                  </TextReveal>
                  
                  <h3 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-white uppercase tracking-widest leading-tight">
                    <TextReveal type="blur-reveal" delay={0.2} as="span">
                      2nd Place
                    </TextReveal>
                    <br />
                    <TextReveal type="blur-reveal" delay={0.3} as="span">
                      Hackathon Winner
                    </TextReveal>
                  </h3>

                  <div className="text-gray-400 leading-relaxed text-sm md:text-base border-t border-white/10 pt-6 mt-2 relative w-full">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                    
                    <TextReveal type="fade-up" delay={0.4}>
                      Secured 2nd Place at the 3SC AI Hackathon 2026, recognized for developing an innovative AI-powered solution that addressed real-world challenges through technology and collaboration. Demonstrated technical excellence, creativity, and effective problem-solving in a competitive hackathon environment.
                    </TextReveal>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="mt-8 rounded-lg overflow-hidden border border-white/10 relative group-hover:border-amber-500/30 transition-colors"
                    >
                      <img 
                        src={`/assest/3SC.jpg`} 
                        alt="3SC AI Hackathon 2026 Winner" 
                        className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    </motion.div>
                  </div>
                </div>
            </VerticalTimelineElement>
            <VerticalTimelineElement
              className="vertical-timeline-element--award"
              contentStyle={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                boxShadow: 'none',
                padding: '3rem'
              }}
              contentArrowStyle={{ borderRight: '7px solid rgba(255, 255, 255, 0.08)' }}
              iconStyle={{ 
                background: '#000000', 
                color: '#FFA500', 
                border: '1px solid rgba(255, 165, 0, 0.4)', 
                boxShadow: '0 0 15px rgba(245,158,11,0.2)' 
              }}
              icon={<Trophy />}
            >
                <div className="flex flex-col items-center text-center gap-6 group">
                  <TextReveal type="fade-up" delay={0.1}>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] md:text-xs font-mono border border-amber-500/20 text-amber-500/80 rounded bg-amber-500/5 uppercase tracking-[0.2em]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      ELITE HACK 1.0 // ELITE CODERS
                    </span>
                  </TextReveal>
                  
                  <h3 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-white uppercase tracking-widest leading-tight">
                    <TextReveal type="blur-reveal" delay={0.2} as="span">
                      Hackathon Finalist
                    </TextReveal>
                    <br />
                    <TextReveal type="blur-reveal" delay={0.3} as="span">
                      Award
                    </TextReveal>
                  </h3>

                  <div className="text-gray-400 leading-relaxed text-sm md:text-base border-t border-white/10 pt-6 mt-2 relative w-full">
                    {/* Laser Line separator */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                    
                    <TextReveal type="fade-up" delay={0.4}>
                      Recognized as a finalist in Elite Hack 1.0 while competing under the team name Only Bug Finder. Demonstrated exceptional technical execution, rapid problem-solving, and a dedicated builder spirit in delivering a high-quality project under intense hackathon constraints.
                    </TextReveal>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="mt-8 rounded-lg overflow-hidden border border-white/10 relative group-hover:border-amber-500/30 transition-colors"
                    >
                      <img 
                        src={`/assest/finalist.jpg`} 
                        alt="Hackathon Finalist Award" 
                        className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    </motion.div>
                  </div>
                </div>
            </VerticalTimelineElement>

          </VerticalTimeline>
        </div>
      </div>
    </section>
  );
};

export default AwardSection;
