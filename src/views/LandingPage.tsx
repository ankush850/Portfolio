"use client";

import React, { useState, useRef } from 'react';
import { ArrowUpRight, X, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLoading } from "@/context/LoadingContext";

const LandingPage = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Control muted via React state only — no direct DOM mutation to avoid desync
  const toggleMute = () => setIsMuted((prev) => !prev);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-inter">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={`/assest/video/video.mp4`} type="video/mp4" />
      </video>

      {/* Overlay to ensure text readability if needed (optional but good practice) */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Navbar */}
        <header className="w-full flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 lg:py-7">
          <div className="font-podium text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            ANKUSH.DEV
          </div>
          


          {/* Mobile Hamburger */}
          <button 
            className="md:hidden flex flex-col justify-center items-end space-y-1.5 w-10 h-10"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Menu"
          >
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-4 h-0.5 bg-white"></div>
          </button>
        </header>

        {/* Hero Content */}
        <main className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 pb-20">
          <div className="max-w-4xl">


            {/* Main Heading */}
            <h1 className="font-podium text-white uppercase leading-[0.92] tracking-tight opacity-0 animate-fade-up-delay-1 flex flex-col">
              <span className="text-[clamp(2.8rem,8vw,7rem)]">Design.</span>
              <span className="text-[clamp(2.8rem,8vw,7rem)]">Disrupt.</span>
              <span className="text-[clamp(2.8rem,8vw,7rem)]">Conquer.</span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 lg:mt-8 text-white/70 text-sm sm:text-base font-inter leading-relaxed max-w-md opacity-0 animate-fade-up-delay-2">
              Mastering the code, owning the outcome
            </p>

            {/* CTA Row */}
            <div className="mt-8 lg:mt-10 flex flex-wrap items-center gap-4 sm:gap-6 opacity-0 animate-fade-up-delay-3">
              <button 
                onClick={() => {
                  setIsLoading(true);
                  // Slight delay so the loader can fade in before the heavy route transition
                  setTimeout(() => router.push('/main'), 300);
                }}
                className="group flex items-center gap-2 bg-black hover:bg-neutral-900 border border-white/20 px-5 sm:px-7 py-3 sm:py-4 text-[11px] sm:text-xs tracking-widest uppercase transition-colors"
              >
                SEE MY WORK
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </main>

        {/* Play/Mute Controls */}
        <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 lg:right-16 flex items-center gap-3 z-50">
          <button 

            onClick={toggleMute}
            className="p-3 sm:p-4 rounded-full bg-black/40 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all group"
            aria-label={isMuted ? "Unmute Video" : "Mute Video"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm transition-all duration-500 flex flex-col ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="w-full flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 lg:py-7">
          <div className="font-podium text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            ANKUSH.DEV
          </div>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-2 -mr-2 text-white hover:text-white/70 transition-colors"
            aria-label="Close Menu"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className={`transition-all duration-500 delay-200 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                setIsLoading(true);
                setTimeout(() => router.push('/main'), 300);
              }}
              className="flex items-center gap-2 border border-white/30 hover:border-white/60 px-8 py-4 text-sm tracking-widest uppercase hover:bg-white/10 transition-colors"
            >
              ENTER PORTFOLIO
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
