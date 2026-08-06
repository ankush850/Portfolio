"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

export const isDJMuted = true;

export type ModelType =
    | "sphere"
    | "hypercube"
    | "cyber_crystal"
    | "geodesic_nexus";

const MODEL_OPTIONS: { id: ModelType; label: string }[] = [
    { id: "sphere", label: "SPHERE" },
    { id: "hypercube", label: "HYPERCUBE" },
    { id: "cyber_crystal", label: "CRYSTAL" },
    { id: "geodesic_nexus", label: "NEXUS" },
];

const SphereModel = () => (
    <>
        {/* Outer wireframe sphere - Vibrant Emerald */}
        <mesh scale={[1.2, 1.2, 1.2]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
                color="#34d399"
                emissive="#059669"
                emissiveIntensity={0.8}
                wireframe={true}
                transparent
                opacity={0.65}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
        {/* Middle glowing aura sphere - Cyber Teal */}
        <mesh scale={[1.1, 1.1, 1.1]}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial
                color="#06b6d4"
                emissive="#0891b2"
                emissiveIntensity={0.4}
                transparent
                opacity={0.2}
                wireframe={false}
            />
        </mesh>
        {/* Inner nucleus core - Neon Violet */}
        <mesh scale={[0.5, 0.5, 0.5]}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial
                color="#c084fc"
                emissive="#9333ea"
                emissiveIntensity={1.0}
                wireframe={true}
                transparent
                opacity={0.85}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    </>
);

const HypercubeModel = () => (
    <>
        {/* Outer Box - Electric Sky Blue */}
        <mesh scale={[1.0, 1.0, 1.0]}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={0.8}
                wireframe={true}
                transparent
                opacity={0.65}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
        {/* Middle Octahedron - Hot Pink */}
        <mesh scale={[0.75, 0.75, 0.75]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <octahedronGeometry args={[1]} />
            <meshStandardMaterial
                color="#f472b6"
                emissive="#ec4899"
                emissiveIntensity={0.85}
                wireframe={true}
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
        {/* Inner Golden Core Box */}
        <mesh scale={[0.4, 0.4, 0.4]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                color="#fbbf24"
                emissive="#f59e0b"
                emissiveIntensity={1.0}
                wireframe={true}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    </>
);

const CyberCrystalModel = () => {
    const innerRef = useRef<THREE.Mesh>(null);
    const outerRef = useRef<THREE.Mesh>(null);
    useFrame(() => {
        if (innerRef.current) {
            innerRef.current.rotation.y -= 0.008;
            innerRef.current.rotation.x += 0.004;
        }
        if (outerRef.current) {
            outerRef.current.rotation.y += 0.004;
            outerRef.current.rotation.z += 0.002;
        }
    });
    return (
        <>
            {/* Outer Dodecahedron - Vivid Purple/Violet */}
            <mesh ref={outerRef} scale={[1.15, 1.15, 1.15]}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color="#c084fc"
                    emissive="#8b5cf6"
                    emissiveIntensity={0.85}
                    wireframe={true}
                    transparent
                    opacity={0.65}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
            {/* Inner Octahedron Crystal Solid - Sapphire Blue */}
            <mesh ref={innerRef} scale={[0.7, 0.7, 0.7]}>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color="#60a5fa"
                    emissive="#3b82f6"
                    emissiveIntensity={0.6}
                    wireframe={false}
                    transparent
                    opacity={0.3}
                />
            </mesh>
            {/* Inner Octahedron Crystal Wireframe - Neon Emerald Green */}
            <mesh ref={innerRef} scale={[0.72, 0.72, 0.72]}>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color="#34d399"
                    emissive="#10b981"
                    emissiveIntensity={1.0}
                    wireframe={true}
                    transparent
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </>
    );
};

const GeodesicNexusModel = () => {
    const outerRef = useRef<THREE.Mesh>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    useFrame(() => {
        if (outerRef.current) {
            outerRef.current.rotation.y += 0.004;
            outerRef.current.rotation.x += 0.002;
        }
        if (coreRef.current) {
            coreRef.current.rotation.y -= 0.006;
        }
    });
    return (
        <>
            {/* Outer Icosahedron Grid - Neon Cyan */}
            <mesh ref={outerRef} scale={[1.2, 1.2, 1.2]}>
                <icosahedronGeometry args={[1, 3]} />
                <meshStandardMaterial
                    color="#22d3ee"
                    emissive="#0891b2"
                    emissiveIntensity={0.75}
                    wireframe={true}
                    transparent
                    opacity={0.55}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
            {/* Middle Dodecahedron Core - Fiery Orange */}
            <mesh ref={coreRef} scale={[0.65, 0.65, 0.65]}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color="#fb923c"
                    emissive="#f97316"
                    emissiveIntensity={0.85}
                    wireframe={true}
                    transparent
                    opacity={0.75}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
            {/* Inner Sun Nucleus - Glowing Gold */}
            <mesh scale={[0.35, 0.35, 0.35]}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial
                    color="#facc15"
                    emissive="#eab308"
                    emissiveIntensity={1.2}
                    transparent
                    opacity={0.4}
                />
            </mesh>
        </>
    );
};

const HeroObjectFixed = ({ animEnabled, activeModel }: { animEnabled: boolean; activeModel: ModelType }) => {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    const [isEnlarged, setIsEnlarged] = useState(false);

    useEffect(() => {
        if (!animEnabled || window.innerWidth <= 1024) {
            document.body.style.cursor = 'auto';
            return;
        }

        if (hovered) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'auto';
        }

        return () => {
            document.body.style.cursor = 'auto';
        };
    }, [hovered, animEnabled]);

    useFrame(() => {
        if (!animEnabled) return;
        if (!groupRef.current) return;

        // Continuous smooth ambient rotation
        groupRef.current.rotation.y += 0.003;
        groupRef.current.rotation.x += 0.001;

        // Smooth scaling: toggles between 0.8 (normal) and 1.6 (enlarged) on double click
        const baseScale = isEnlarged ? 1.6 : 0.8;
        const targetScale = hovered ? baseScale * 1.12 : baseScale;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    return (
        <Float speed={animEnabled ? 1.5 : 0} rotationIntensity={animEnabled ? 0.3 : 0} floatIntensity={animEnabled ? 0.3 : 0}>
            <group
                ref={groupRef}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    if (window.innerWidth <= 1024 || !animEnabled) return;
                    setHovered(true);
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    if (window.innerWidth <= 1024 || !animEnabled) return;
                    setHovered(false);
                }}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    setIsEnlarged((prev) => !prev);
                }}
            >
                {activeModel === "sphere" && <SphereModel />}
                {activeModel === "hypercube" && <HypercubeModel />}
                {activeModel === "cyber_crystal" && <CyberCrystalModel />}
                {activeModel === "geodesic_nexus" && <GeodesicNexusModel />}
            </group>
        </Float>
    );
};

const Scene = ({ animEnabled, activeModel }: { animEnabled: boolean; activeModel: ModelType }) => {
    return (
        <>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
            <HeroObjectFixed key={activeModel} animEnabled={animEnabled} activeModel={activeModel} />
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.8} color="#10b981" />
            <pointLight position={[-10, -10, -10]} intensity={1.5} color="#3b82f6" />
            <pointLight position={[0, -10, 5]} intensity={1.2} color="#ec4899" />
        </>
    );
};

const SpaceScene = () => {
    const [activeModel, setActiveModel] = useState<ModelType>("sphere");

    return (
        <div className="absolute inset-0 z-0 pointer-events-auto">
            {/* 3D Model Switcher Controls Bar - Shifted right (left-[56%]) to align under 3D model */}
            <div className="absolute bottom-10 left-[56%] -translate-x-1/2 z-30 hidden md:flex items-center gap-1.5 p-1.5 bg-black/85 border border-emerald-500/40 rounded-full backdrop-blur-xl font-mono text-[10px] shadow-[0_0_25px_rgba(16,185,129,0.25)] pointer-events-auto select-none">
                <span className="px-2.5 py-1 text-emerald-400 font-bold uppercase tracking-widest border-r border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    3D_CORE:
                </span>
                <span className="hidden lg:inline-block px-2 py-0.5 text-[9px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full font-bold uppercase tracking-wider">
                    DBL CLICK TO ENLARGE
                </span>
                {MODEL_OPTIONS.map((m) => (
                    <button
                        key={m.id}
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveModel(m.id);
                        }}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${activeModel === m.id
                            ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/60 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                            : "text-white/50 hover:text-white hover:bg-white/10"
                            }`}
                    >
                        {m.label}
                    </button>
                ))}
            </div>

            <Canvas gl={{ antialias: false, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: false }} dpr={[1, 1.25]} frameloop="always">
                <Scene animEnabled={true} activeModel={activeModel} />
            </Canvas>
        </div>
    );
};

export default SpaceScene;
