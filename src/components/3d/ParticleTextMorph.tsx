"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

interface ParticleTextMorphProps {
  text?: string;
  className?: string;
  height?: string | number;
  interactive?: boolean;
  autoStart?: boolean;
  onPhaseChange?: (phase: number) => void;
}

// Fast HSL to RGB conversion helper
function calcRgbFromHsl(h: number, s: number, l: number, out: [number, number, number]) {
  let hue = h % 1.0;
  if (hue < 0) hue += 1.0;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (t: number) => {
    let val = t;
    if (val < 0) val += 1;
    if (val > 1) val -= 1;
    if (val < 1 / 6) return p + (q - p) * 6 * val;
    if (val < 1 / 2) return q;
    if (val < 2 / 3) return p + (q - p) * (2 / 3 - val) * 6;
    return p;
  };
  out[0] = hue2rgb(hue + 1 / 3);
  out[1] = hue2rgb(hue);
  out[2] = hue2rgb(hue - 1 / 3);
}

export const ParticleTextMorph: React.FC<ParticleTextMorphProps> = ({
  text = "ANKUSH RAWAT",
  className = "",
  height = "420px",
  interactive = true,
  autoStart = true,
  onPhaseChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const phaseRef = useRef<number>(0);
  const triggerExplosionRef = useRef<() => void>(() => { });
  const clickWaveRef = useRef<{ x: number; y: number; time: number }[]>([]);

  const updatePhase = useCallback((p: number) => {
    phaseRef.current = p;
    setCurrentPhase(p);
    if (onPhaseChange) onPhaseChange(p);
  }, [onPhaseChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 8,000 dense, crisp particles for high readability and razor-sharp lettering
    const N = 8000;
    const R = 3.2;
    let W = container.clientWidth || 1200;
    let H = container.clientHeight || 420;

    let letterReady = false;
    let reformFrame = 0;
    let exploded = false;

    // ── Three.js Scene Setup ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 9.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0); // Pure clean background (no stray dots)

    // ── Particle Buffers ──
    const posA = new Float32Array(N * 3); // 3D sphere
    const posB = new Float32Array(N * 3); // Radial explosion
    const posC = new Float32Array(N * 3); // Crisp typography target
    const cur = new Float32Array(N * 3);  // Live position
    const vel = new Float32Array(N * 3);  // Velocity
    const colArr = new Float32Array(N * 3);  // Dynamic RGB colors
    const reformDelay = new Float32Array(N);
    const rgbCache: [number, number, number] = [0, 0, 0];

    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      posA[i * 3] = R * Math.sin(phi) * Math.cos(theta);
      posA[i * 3 + 1] = R * Math.sin(phi) * Math.sin(theta);
      posA[i * 3 + 2] = R * Math.cos(phi);

      cur[i * 3] = posA[i * 3];
      cur[i * 3 + 1] = posA[i * 3 + 1];
      cur[i * 3 + 2] = posA[i * 3 + 2];

      // Radial blast scatter target
      const sc = 5.0 + Math.random() * 8.5;
      posB[i * 3] = posA[i * 3] * sc + (Math.random() - 0.5) * 3.5;
      posB[i * 3 + 1] = posA[i * 3 + 1] * sc + (Math.random() - 0.5) * 3.5;
      posB[i * 3 + 2] = posA[i * 3 + 2] * sc * 0.4;

      // Initial rainbow hue
      const initialHue = (theta / (Math.PI * 2)) % 1.0;
      calcRgbFromHsl(initialHue, 0.95, 0.58, rgbCache);
      colArr[i * 3] = rgbCache[0];
      colArr[i * 3 + 1] = rgbCache[1];
      colArr[i * 3 + 2] = rgbCache[2];

      reformDelay[i] = Math.floor(Math.random() * 60);
    }

    // ── Ambient 3D Rotating Wireframe (Phase 0) ──
    const globeWire = new THREE.Mesh(
      new THREE.SphereGeometry(R, 28, 20),
      new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      })
    );
    scene.add(globeWire);

    // ── Main Geometry & Custom Shaders ──
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(cur, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colArr, 3));

    const vertexShader = `
      uniform float uSize;
      attribute vec3 aColor;
      varying vec3 vC;
      void main() {
        vC = aColor;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = max(1.0, uSize * (46.0 / -mv.z));
        gl_Position = projectionMatrix * mv;
      }
    `;

    // Halo Glow Shader (Soft vibrant outer neon glow)
    const haloMat = new THREE.ShaderMaterial({
      uniforms: { uSize: { value: 2.4 } },
      vertexShader,
      fragmentShader: `
        varying vec3 vC;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float a = pow(1.0 - d * 2.0, 1.8);
          gl_FragColor = vec4(vC, a * 0.075);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Core Sharp Particle Shader (Crystal-clear, sharp readable typography)
    const coreMat = new THREE.ShaderMaterial({
      uniforms: { uSize: { value: 1.05 } },
      vertexShader,
      fragmentShader: `
        varying vec3 vC;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float a = pow(1.0 - d * 2.0, 2.0);
          gl_FragColor = vec4(vC, a * 1.0);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const haloPoints = new THREE.Points(geo, haloMat);
    const corePoints = new THREE.Points(geo, coreMat);
    scene.add(haloPoints);
    scene.add(corePoints);

    // ── High-Precision Crisp Canvas Text Sampler ──
    function sampleLetterPos(targetText: string): boolean {
      const tw = 3200;
      const th = 440;
      const tc = document.createElement("canvas");
      tc.width = tw;
      tc.height = th;
      const ctx = tc.getContext("2d");
      if (!ctx) return false;

      ctx.fillStyle = "#ffffff";
      // Bold, clean, solid font
      const fontSize = 290;
      ctx.font = `900 ${fontSize}px "Inter", "Archivo Black", "Arial Black", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(targetText.toUpperCase(), tw / 2, th / 2);

      const imgData = ctx.getImageData(0, 0, tw, th).data;
      const lit: [number, number][] = [];
      for (let y = 0; y < th; y += 1) {
        for (let x = 0; x < tw; x += 1) {
          // Sharp cutoff threshold for clean letter edges with zero fuzzy stray noise
          if (imgData[(y * tw + x) * 4] > 110) {
            lit.push([x, y]);
          }
        }
      }

      if (lit.length < 500) return false;

      // Aspect ratio spread tuned for optimal readable prominence
      const spreadX = 26.5;
      const spreadY = 4.3;

      for (let i = 0; i < N; i++) {
        const px = lit[Math.floor(Math.random() * lit.length)];
        posC[i * 3] = (px[0] / tw - 0.5) * spreadX;
        posC[i * 3 + 1] = -(px[1] / th - 0.5) * spreadY;
        posC[i * 3 + 2] = 0.0; // Pure flat Z=0 plane: eliminates 3D depth-blur for razor-sharp readability
      }
      return true;
    }

    letterReady = sampleLetterPos(text);

    if (!letterReady && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        letterReady = sampleLetterPos(text);
      });
    }

    // ── Interactive Cursor Raycasting on Z=0 Plane ──
    const mouseWorld = new THREE.Vector3(9999, 9999, 0);
    const ray = new THREE.Raycaster();
    const ndcM = new THREE.Vector2();
    const zPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const onMouseMove = (e: MouseEvent) => {
      if (phaseRef.current < 3 || !interactive) return;
      const r = container.getBoundingClientRect();
      ndcM.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndcM.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ndcM, camera);
      ray.ray.intersectPlane(zPlane, mouseWorld);
    };

    const onMouseLeave = () => {
      mouseWorld.set(9999, 9999, 0);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (phaseRef.current < 3 || !interactive || e.touches.length === 0) return;
      const touch = e.touches[0];
      const r = container.getBoundingClientRect();
      ndcM.x = ((touch.clientX - r.left) / r.width) * 2 - 1;
      ndcM.y = -((touch.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ndcM, camera);
      ray.ray.intersectPlane(zPlane, mouseWorld);
    };

    const onTouchEnd = () => {
      mouseWorld.set(9999, 9999, 0);
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);

    // ── Resize Handler ──
    const handleResize = () => {
      if (!container || !renderer) return;
      W = container.clientWidth;
      H = container.clientHeight;
      if (!W || !H) return;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H, false);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // ── Explosion Trigger ──
    const startExplosion = () => {
      if (exploded || !letterReady) return;
      exploded = true;
      updatePhase(1);

      let wOp = 0.15;
      const fw = setInterval(() => {
        wOp -= 0.007;
        globeWire.material.opacity = Math.max(0, wOp);
        if (wOp <= 0) {
          globeWire.visible = false;
          clearInterval(fw);
        }
      }, 16);

      setTimeout(() => {
        updatePhase(2);
        reformFrame = 0;
      }, 950);
    };

    triggerExplosionRef.current = () => {
      if (phaseRef.current === 0) {
        startExplosion();
      } else if (phaseRef.current === 3) {
        // Shockwave on click
        const clickX = mouseWorld.x !== 9999 ? mouseWorld.x : 0;
        const clickY = mouseWorld.y !== 9999 ? mouseWorld.y : 0;
        clickWaveRef.current.push({ x: clickX, y: clickY, time: 0 });

        for (let i = 0; i < N; i++) {
          const i3 = i * 3;
          vel[i3] += (Math.random() - 0.5) * 1.8;
          vel[i3 + 1] += (Math.random() - 0.5) * 1.8;
          vel[i3 + 2] += (Math.random() - 0.5) * 1.2;
        }
      }
    };

    let clearObserver: (() => void) | undefined;
    if (autoStart) {
      const timer = setTimeout(() => {
        if (!exploded) startExplosion();
      }, 900);

      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startExplosion();
            io.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      io.observe(container);

      clearObserver = () => {
        clearTimeout(timer);
        io.disconnect();
      };
    }

    // ── Physics Constants ──
    const REPEL_R = 3.4;
    const REPEL_S = 0.60;
    const SPRING_K = 0.090;  // Snappy spring response
    const DAMP = 0.84;       // Smooth damping

    // ── Main Render Loop ──
    let rafId: number | null = null;
    let clockTime = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      clockTime += 0.016;

      const pos = geo.attributes.position.array as Float32Array;
      const col = geo.attributes.aColor.array as Float32Array;
      const p = phaseRef.current;

      // Global continuous smooth multi-color hue cycle
      const globalHue = (clockTime * 0.075) % 1.0;

      // Update globe wire color
      calcRgbFromHsl(globalHue, 0.95, 0.52, rgbCache);
      globeWire.material.color.setRGB(rgbCache[0], rgbCache[1], rgbCache[2]);

      if (p === 0) {
        // Phase 0: Ambient rotating sphere with smooth multi-color spectrum
        globeWire.rotation.y += 0.006;
        globeWire.rotation.x = Math.sin(clockTime * 0.5) * 0.12;

        for (let i = 0; i < N; i++) {
          const i3 = i * 3;
          const theta = Math.atan2(posA[i3 + 1], posA[i3]);
          const h = (globalHue + theta / (Math.PI * 2)) % 1.0;
          calcRgbFromHsl(h, 0.95, 0.56, rgbCache);
          col[i3] = rgbCache[0];
          col[i3 + 1] = rgbCache[1];
          col[i3 + 2] = rgbCache[2];
        }
        geo.attributes.aColor.needsUpdate = true;
      } else if (p === 1) {
        // Phase 1: 3D explosion with multi-color dispersion
        for (let i = 0; i < N; i++) {
          const i3 = i * 3;
          pos[i3] += (posB[i3] - pos[i3]) * 0.12;
          pos[i3 + 1] += (posB[i3 + 1] - pos[i3 + 1]) * 0.12;
          pos[i3 + 2] += (posB[i3 + 2] - pos[i3 + 2]) * 0.12;

          const h = (globalHue + i * 0.001) % 1.0;
          calcRgbFromHsl(h, 0.95, 0.58, rgbCache);
          col[i3] = rgbCache[0];
          col[i3 + 1] = rgbCache[1];
          col[i3 + 2] = rgbCache[2];
        }
        geo.attributes.aColor.needsUpdate = true;
      } else if (p === 2) {
        // Phase 2: Staggered magnetic reform into TEXT
        reformFrame++;
        let done = 0;
        for (let i = 0; i < N; i++) {
          if (reformFrame < reformDelay[i]) {
            done++;
            continue;
          }
          const i3 = i * 3;
          const dx = posC[i3] - pos[i3];
          const dy = posC[i3 + 1] - pos[i3 + 1];
          const dz = posC[i3 + 2] - pos[i3 + 2];
          if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) < 0.012) {
            done++;
            continue;
          }
          pos[i3] += dx * 0.075;
          pos[i3 + 1] += dy * 0.075;
          pos[i3 + 2] += dz * 0.075;

          const normX = (pos[i3] / 26.5) + 0.5;
          const h = (globalHue + normX * 0.85) % 1.0;
          calcRgbFromHsl(h, 0.95, 0.56, rgbCache);
          col[i3] = rgbCache[0];
          col[i3 + 1] = rgbCache[1];
          col[i3 + 2] = rgbCache[2];
        }
        if (done >= N && reformFrame > 90) {
          updatePhase(3);
        }
        geo.attributes.aColor.needsUpdate = true;
      } else {
        // Phase 3: Razor-Sharp, Clean Multi-Color Typography + Smooth Organic Wave + Mouse Physics
        const mx = mouseWorld.x;
        const my = mouseWorld.y;
        const RR = REPEL_R * REPEL_R;

        // Process active click shockwaves
        for (let w = clickWaveRef.current.length - 1; w >= 0; w--) {
          const wave = clickWaveRef.current[w];
          wave.time += 0.04;
          if (wave.time > 2.2) {
            clickWaveRef.current.splice(w, 1);
          }
        }

        for (let i = 0; i < N; i++) {
          const i3 = i * 3;
          const px = pos[i3];
          const py = pos[i3 + 1];

          // Smooth unified breathing wave (keeps letters crisp and solid together)
          const waveY = Math.sin(clockTime * 1.6 + px * 0.25) * 0.04;

          const targetX = posC[i3];
          const targetY = posC[i3 + 1] + waveY;
          const targetZ = posC[i3 + 2];

          // Spring return to precise home position
          vel[i3] = (vel[i3] + SPRING_K * (targetX - px)) * DAMP;
          vel[i3 + 1] = (vel[i3 + 1] + SPRING_K * (targetY - py)) * DAMP;
          vel[i3 + 2] = (vel[i3 + 2] + SPRING_K * (targetZ - pos[i3 + 2])) * DAMP;

          // ── Cursor Repulsion & Swirl Physics ──
          const dxm = px - mx;
          const dym = py - my;
          const d2 = dxm * dxm + dym * dym;
          let cf = 0.0;

          if (d2 < RR) {
            const dist = Math.sqrt(d2) + 0.0001;
            const f = (REPEL_S * (1 - dist / REPEL_R)) / dist;
            vel[i3] += dxm * f - dym * f * 0.2;
            vel[i3 + 1] += dym * f + dxm * f * 0.2;
            vel[i3 + 2] += (Math.random() - 0.5) * f * 0.4;
            cf = Math.pow(1 - dist / REPEL_R, 1.8);
          }

          // ── Click Shockwave Impact ──
          for (let w = 0; w < clickWaveRef.current.length; w++) {
            const wave = clickWaveRef.current[w];
            const waveRadius = wave.time * 6.0;
            const dwx = px - wave.x;
            const dwy = py - wave.y;
            const distWave = Math.sqrt(dwx * dwx + dwy * dwy);
            const waveDiff = Math.abs(distWave - waveRadius);
            if (waveDiff < 1.0) {
              const waveStrength = (1.0 - waveDiff) * Math.max(0, 1 - wave.time / 2.2) * 0.7;
              vel[i3] += (dwx / (distWave + 0.001)) * waveStrength;
              vel[i3 + 1] += (dwy / (distWave + 0.001)) * waveStrength;
              vel[i3 + 2] += (Math.random() - 0.5) * waveStrength;
              cf = Math.max(cf, waveStrength * 0.85);
            }
          }

          pos[i3] += vel[i3];
          pos[i3 + 1] += vel[i3 + 1];
          pos[i3 + 2] += vel[i3 + 2];

          // ── Clean Multi-Color Auto-Shifting Chromatic Flow ──
          const normX = (px / 26.5) + 0.5;
          const particleHue = (globalHue + normX * 0.90) % 1.0;
          calcRgbFromHsl(particleHue, 0.96, 0.56, rgbCache);

          let r = rgbCache[0];
          let g = rgbCache[1];
          let b = rgbCache[2];

          // Cursor hover hyper-glow reaction
          if (cf > 0.01) {
            r = r * (1 - cf) + 1.0 * cf;
            g = g * (1 - cf) + 0.35 * cf;
            b = b * (1 - cf) + 0.55 * cf;
          }

          col[i3] = r;
          col[i3 + 1] = g;
          col[i3 + 2] = b;
        }

        geo.attributes.aColor.needsUpdate = true;
      }

      geo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (clearObserver) clearObserver();
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      geo.dispose();
      haloMat.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, [text, interactive, autoStart, updatePhase]);

  return (
    <div
      ref={containerRef}
      onClick={() => triggerExplosionRef.current()}
      className={`relative w-full cursor-crosshair overflow-hidden select-none ${className}`}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />

      {/* Micro HUD Status with dynamic rainbow indicator */}
      <div className="absolute bottom-3 right-6 font-mono text-[9px] text-white/50 tracking-widest pointer-events-none uppercase flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 animate-spin" />
        {currentPhase === 0 && "[ MULTI_SPECTRUM_SPHERE // CLICK TO DETONATE ]"}
        {currentPhase === 1 && "[ CHROMATIC_EXPANSION // SCATTERING ]"}
        {currentPhase === 2 && "[ MAGNETIC_LOCK // RECLUSTERING ]"}
        {currentPhase === 3 && "[ MULTI_COLOR_FIELD // AUTO_SHIFTING ]"}
      </div>
    </div>
  );
};

export default ParticleTextMorph;
