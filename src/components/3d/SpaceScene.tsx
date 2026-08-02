"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Volume2, VolumeX } from "lucide-react";

export const isDJMuted = true;

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
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) audioCtx = new Ctx();
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
    const [isGrabbing, setIsGrabbing] = useState(false);

    useEffect(() => {
        if (!animEnabled || window.innerWidth <= 1024) {
            document.body.style.cursor = 'auto';
            return;
        }

        if (isGrabbing) {
            document.body.style.cursor = 'grabbing';
        } else if (hovered) {
            document.body.style.cursor = 'grab';
        } else {
            document.body.style.cursor = 'auto';
        }

        return () => {
            document.body.style.cursor = 'auto';
        };
    }, [hovered, isGrabbing, animEnabled]);
    
    useFrame(() => {
        if (!animEnabled) return;
        if (!groupRef.current) return;

        // Continuous smooth ambient rotation
        groupRef.current.rotation.y += 0.003;
        groupRef.current.rotation.x += 0.001;

        // Smooth scaling on hover
        const targetScale = hovered ? 1.2 : 1.0;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    return (
        <Float speed={animEnabled ? 1.5 : 0} rotationIntensity={animEnabled ? 0.3 : 0} floatIntensity={animEnabled ? 0.3 : 0}>
            <group
                ref={groupRef}
                onPointerOver={() => { 
                    if (window.innerWidth <= 1024 || !animEnabled) return;
                    setHovered(true);
                    startDJ(); 
                }}
                onPointerOut={() => { 
                    if (window.innerWidth <= 1024 || !animEnabled) return;
                    setHovered(false);
                    setIsGrabbing(false);
                    stopDJ(); 
                }}
                onPointerDown={() => { 
                    if (window.innerWidth <= 1024 || !animEnabled) return;
                    setIsGrabbing(true); 
                }}
                onPointerUp={() => { 
                    if (window.innerWidth <= 1024 || !animEnabled) return;
                    setIsGrabbing(false); 
                }}
            >
                {/* Main Wireframe Sphere */}
                <mesh scale={[1.6, 1.6, 1.6]}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#ffffff"
                        emissiveIntensity={0.4}
                        wireframe={true}
                        transparent
                        opacity={0.5}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
                
                {/* Inner faint core for depth */}
                <mesh scale={[1.5, 1.5, 1.5]}>
                    <sphereGeometry args={[1, 20, 20]} />
                    <meshStandardMaterial
                        color="#4ade80"
                        emissive="#10b981"
                        emissiveIntensity={0.2}
                        transparent
                        opacity={0.08}
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

    useEffect(() => {
        return () => {
            stopDJ();
            if (audioCtx && audioCtx.state !== 'closed') {
                audioCtx.suspend();
            }
        };
    }, []);

    return (
        <div className="absolute inset-0 z-0">
            <Canvas gl={{ antialias: false, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: false }} dpr={[1, 1.25]} frameloop="always">
                <Scene animEnabled={true} />
            </Canvas>
        </div>
    );
};

export default SpaceScene;
