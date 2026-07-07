"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Volume2, VolumeX } from "lucide-react";

export let isDJMuted = true;

// --- Procedural DJ Techno Loop Generator (Zero Copyright!) ---
let audioCtx: AudioContext | null = null;
let djInterval: NodeJS.Timeout | null = null;
let noteStep = 0;

const playDrum = (type: 'kick' | 'hat' | 'bass', time: number) => {
    if (!audioCtx || isDJMuted) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = type === 'bass' ? 800 : 8000;
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'kick') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
        gain.gain.setValueAtTime(1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
    } else if (type === 'hat') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(8000, time);
        gain.gain.setValueAtTime(0.05, time); 
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05); 
    } else if (type === 'bass') {
        osc.type = 'sawtooth';
        // Minor pentatonic bassline for that classic acid house feel
        const notes = [65.41, 73.42, 77.78, 98.00, 65.41]; 
        osc.frequency.setValueAtTime(notes[Math.floor(Math.random() * notes.length)], time);
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    }
    
    osc.start(time);
    osc.stop(time + 0.5);
};

const startDJ = () => {
    if (!audioCtx) {
        const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext; // eslint-disable-line @typescript-eslint/no-explicit-any
        if(Ctx) audioCtx = new Ctx();
    }
    if (audioCtx?.state === 'suspended') audioCtx.resume();
    
    if (djInterval) return;
    
    noteStep = 0;
    // 125 BPM = 120ms per 16th note
    djInterval = setInterval(() => {
        if (!audioCtx) return;
        const time = audioCtx.currentTime + 0.05;
        
        if (noteStep % 4 === 0) playDrum('kick', time);
        if (noteStep % 4 === 2) playDrum('hat', time);
        if (noteStep % 16 === 0 || noteStep % 16 === 3 || noteStep % 16 === 7 || noteStep % 16 === 10 || noteStep % 16 === 14) {
            playDrum('bass', time);
        }
        
        noteStep++;
    }, 120);
};

const stopDJ = () => {
    if (djInterval) {
        clearInterval(djInterval);
        djInterval = null;
    }
};

const HeroObjectFixed = ({ animEnabled }: { animEnabled: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);
    const { invalidate } = useThree();
    const [hovered, setHovered] = useState(false);
    const isBlasted = useRef(false);
    const origOpacities = useRef<number[]>([]);
    
    useFrame((state) => {
        if (!animEnabled) return;
        if (!groupRef.current) return;

        const time = state.clock.elapsedTime;
        const blastPhase = time > 15 && time < 25;

        // Dispatch events and reset state exactly on transition
        if (blastPhase && !isBlasted.current) {
            isBlasted.current = true;
            window.dispatchEvent(new CustomEvent('blast_change', { detail: true }));
            
            // Save original opacities if we haven't already
            if (origOpacities.current.length === 0) {
                groupRef.current.children.forEach((child) => {
                    if (child.type === "Mesh") {
                        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                        origOpacities.current.push(mat.opacity);
                    }
                });
            }
        } else if (!blastPhase && isBlasted.current && time >= 25) {
            isBlasted.current = false;
            window.dispatchEvent(new CustomEvent('blast_change', { detail: false }));
            
            // Reset scale instantly so it doesn't shrink back weirdly
            groupRef.current.scale.set(0.1, 0.1, 0.1); 
            
            // Restore original opacities
            groupRef.current.children.forEach((child, idx) => {
                if (child.type === "Mesh") {
                    const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                    mat.opacity = origOpacities.current[idx] || 0.3;
                }
            });
        }

        // Slow continuous ambient rotation
        groupRef.current.rotation.y += 0.001;
        groupRef.current.rotation.x += 0.0005;

        if (isBlasted.current) {
            // Blast animation: Rapidly scale up to create an explosion effect
            groupRef.current.scale.lerp(new THREE.Vector3(15, 15, 15), 0.15);
            
            // Fade out opacity during blast
            groupRef.current.children.forEach((child) => {
                if (child.type === "Mesh") {
                    const mesh = child as THREE.Mesh;
                    if (mesh.material) {
                        const mat = mesh.material as THREE.MeshStandardMaterial;
                        mat.opacity = THREE.MathUtils.lerp(mat.opacity, -0.1, 0.1);
                    }
                }
            });
        } else {
            // Smooth scaling on hover and resetting from tiny size
            const targetScale = hovered ? 1.2 : 1.0;
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }

        invalidate();
    });

    return (
        <Float speed={animEnabled ? 1 : 0} rotationIntensity={animEnabled ? 0.2 : 0} floatIntensity={animEnabled ? 0.2 : 0}>
            <group
                ref={groupRef}
                onPointerOver={() => { 
                    if (window.innerWidth <= 1024 || !animEnabled) return;
                    document.body.style.cursor = 'grab'; 
                    setHovered(true);
                    startDJ(); 
                }}
                onPointerOut={() => { 
                    if (window.innerWidth <= 1024 || !animEnabled) return;
                    document.body.style.cursor = 'auto'; 
                    setHovered(false);
                    stopDJ(); 
                }}
                onPointerDown={() => { document.body.style.cursor = 'grabbing'; }}
                onPointerUp={() => { document.body.style.cursor = 'grab'; }}
            >
                {/* Main Wireframe Sphere */}
                <mesh scale={[1.6, 1.6, 1.6]}>
                    <sphereGeometry args={[1, 12, 12]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#ffffff"
                        emissiveIntensity={0.3}
                        wireframe={true}
                        transparent
                        opacity={0.3}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
                
                {/* Inner faint core for depth */}
                <mesh scale={[1.5, 1.5, 1.5]}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#ffffff"
                        emissiveIntensity={0.1}
                        transparent
                        opacity={0.02}
                        wireframe={false}
                    />
                </mesh>
            </group>
        </Float>
    );
}

const Scene = ({ animEnabled }: { animEnabled: boolean }) => {
    return (
        <>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
            <HeroObjectFixed animEnabled={animEnabled} />
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
        </>
    );
};

const SpaceScene = () => {
    const [muted, setMuted] = useState(isDJMuted);

    return (
        <div className="absolute inset-0 z-0">
            <Canvas gl={{ antialias: false, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: false }} dpr={[1, 1.25]} frameloop="demand">
                <Scene animEnabled={true} />
            </Canvas>
            
            <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 z-50 flex gap-4">
                <button
                    onClick={() => {
                        const newMuted = !muted;
                        setMuted(newMuted);
                        isDJMuted = newMuted;
                        if (newMuted) stopDJ();
                    }}
                    className="p-4 rounded-full bg-black/40 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all group"
                    title={muted ? "Unmute DJ" : "Mute DJ"}
                >
                    {muted ? (
                        <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    ) : (
                        <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default SpaceScene;
