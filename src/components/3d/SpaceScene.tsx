"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

export const isDJMuted = true;

export type ModelType = "sphere" | "torus_knot" | "quantum_core" | "hypercube";

const MODEL_OPTIONS: { id: ModelType; label: string }[] = [
    { id: "sphere", label: "SPHERE" },
    { id: "torus_knot", label: "TORUS_KNOT" },
    { id: "quantum_core", label: "QUANTUM_CORE" },
    { id: "hypercube", label: "HYPERCUBE" },
];

const SphereModel = () => (
    <>
        <mesh scale={[1.2, 1.2, 1.2]}>
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
        <mesh scale={[1.1, 1.1, 1.1]}>
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
    </>
);

const TorusKnotModel = () => (
    <>
        <mesh scale={[0.95, 0.95, 0.95]}>
            <torusKnotGeometry args={[1, 0.3, 120, 16]} />
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
        <mesh scale={[0.9, 0.9, 0.9]}>
            <torusKnotGeometry args={[1, 0.28, 100, 12]} />
            <meshStandardMaterial
                color="#4ade80"
                emissive="#10b981"
                emissiveIntensity={0.2}
                transparent
                opacity={0.08}
                wireframe={false}
            />
        </mesh>
    </>
);

const QuantumCoreModel = () => {
    const ring1Ref = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);
    useFrame(() => {
        if (ring1Ref.current) {
            ring1Ref.current.rotation.z += 0.008;
            ring1Ref.current.rotation.x += 0.004;
        }
        if (ring2Ref.current) {
            ring2Ref.current.rotation.z -= 0.01;
            ring2Ref.current.rotation.y += 0.005;
        }
    });
    return (
        <>
            <mesh scale={[1.0, 1.0, 1.0]}>
                <icosahedronGeometry args={[1, 2]} />
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
            <mesh ref={ring1Ref} scale={[1.5, 1.5, 1.5]}>
                <torusGeometry args={[1, 0.025, 16, 100]} />
                <meshStandardMaterial color="#4ade80" emissive="#10b981" emissiveIntensity={0.9} />
            </mesh>
            <mesh ref={ring2Ref} scale={[1.75, 1.75, 1.75]} rotation={[Math.PI / 3, 0, 0]}>
                <torusGeometry args={[1, 0.015, 16, 100]} />
                <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.8} />
            </mesh>
        </>
    );
};

const HypercubeModel = () => (
    <>
        <mesh scale={[1.0, 1.0, 1.0]}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
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
        <mesh scale={[0.7, 0.7, 0.7]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <octahedronGeometry args={[1]} />
            <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.3}
                wireframe={true}
                transparent
                opacity={0.35}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    </>
);

const HeroObjectFixed = ({ animEnabled, activeModel }: { animEnabled: boolean; activeModel: ModelType }) => {
    const groupRef = useRef<THREE.Group>(null);
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

        // Smooth scaling on hover (compact base scale)
        const targetScale = hovered ? 0.95 : 0.8;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    return (
        <Float speed={animEnabled ? 1.5 : 0} rotationIntensity={animEnabled ? 0.3 : 0} floatIntensity={animEnabled ? 0.3 : 0}>
            <group
                ref={groupRef}
                onPointerOver={() => {
                    if (window.innerWidth <= 1024 || !animEnabled) return;
                    setHovered(true);
                }}
                onPointerOut={() => {
                    if (window.innerWidth <= 1024 || !animEnabled) return;
                    setHovered(false);
                    setIsGrabbing(false);
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
                {activeModel === "sphere" && <SphereModel />}
                {activeModel === "torus_knot" && <TorusKnotModel />}
                {activeModel === "quantum_core" && <QuantumCoreModel />}
                {activeModel === "hypercube" && <HypercubeModel />}
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
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#10b981" />
            <pointLight position={[-10, -10, -10]} intensity={1.0} color="#3b82f6" />
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


