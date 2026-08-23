"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";

export const isDJMuted = true;

export type ModelType =
    | "sphere"
    | "particle_morph"
    | "hypercube"
    | "cyber_crystal"
    | "geodesic_nexus";

const MODEL_OPTIONS: { id: ModelType; label: string }[] = [
    { id: "sphere", label: "SPHERE" },
    { id: "particle_morph", label: "PARTICLES" },
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

const ParticleMorphModel = ({ text = "ANKUSH RAWAT" }: { text?: string }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const N = 3500;
    const { pointer, camera } = useThree();

    const [buffers] = useState(() => {
        const spherePos = new Float32Array(N * 3);
        const textPos = new Float32Array(N * 3);
        const curPos = new Float32Array(N * 3);
        const vel = new Float32Array(N * 3);
        const colors = new Float32Array(N * 3);
        const baseColors = new Float32Array(N * 3);

        const R = 1.35;
        for (let i = 0; i < N; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            spherePos[i * 3] = R * Math.sin(phi) * Math.cos(theta);
            spherePos[i * 3 + 1] = R * Math.sin(phi) * Math.sin(theta);
            spherePos[i * 3 + 2] = R * Math.cos(phi);

            curPos[i * 3] = spherePos[i * 3];
            curPos[i * 3 + 1] = spherePos[i * 3 + 1];
            curPos[i * 3 + 2] = spherePos[i * 3 + 2];

            // Sample text pixels
            textPos[i * 3] = spherePos[i * 3];
            textPos[i * 3 + 1] = spherePos[i * 3 + 1];
            textPos[i * 3 + 2] = 0;

            const isEmerald = Math.random() > 0.35;
            baseColors[i * 3] = isEmerald ? 0.06 : 0.0;
            baseColors[i * 3 + 1] = isEmerald ? 0.9 : 0.95;
            baseColors[i * 3 + 2] = isEmerald ? 0.6 : 0.85;

            colors[i * 3] = baseColors[i * 3];
            colors[i * 3 + 1] = baseColors[i * 3 + 1];
            colors[i * 3 + 2] = baseColors[i * 3 + 2];
        }

        return { spherePos, textPos, curPos, vel, colors, baseColors };
    });

    useEffect(() => {
        // Offscreen sampling
        const tc = document.createElement("canvas");
        tc.width = 1200;
        tc.height = 200;
        const ctx = tc.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#ffffff";
        ctx.font = 'bold 90px "Archivo Black", "Inter", sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text.toUpperCase(), 600, 100);

        const imgData = ctx.getImageData(0, 0, 1200, 200).data;
        const lit: [number, number][] = [];
        for (let y = 0; y < 200; y += 2) {
            for (let x = 0; x < 1200; x += 2) {
                if (imgData[(y * 1200 + x) * 4] > 80) {
                    lit.push([x, y]);
                }
            }
        }

        if (lit.length > 100) {
            for (let i = 0; i < N; i++) {
                const px = lit[Math.floor(Math.random() * lit.length)];
                buffers.textPos[i * 3] = (px[0] / 1200 - 0.5) * 4.2;
                buffers.textPos[i * 3 + 1] = -(px[1] / 200 - 0.5) * 0.9;
                buffers.textPos[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
            }
        }
    }, [text, buffers, N]);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(buffers.curPos, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(buffers.colors, 3));
        return geo;
    }, [buffers]);

    const raycaster = useMemo(() => new THREE.Raycaster(), []);
    const zPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
    const mouseWorld = useMemo(() => new THREE.Vector3(999, 999, 0), []);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const pos = geometry.attributes.position.array as Float32Array;
        const col = geometry.attributes.color.array as Float32Array;
        const time = state.clock.getElapsedTime();

        // Project pointer to world coordinate on z=0 plane
        raycaster.setFromCamera(pointer, camera);
        raycaster.ray.intersectPlane(zPlane, mouseWorld);

        // Oscillate morph factor slowly or interact on click
        const morphFactor = Math.sin(time * 0.5) * 0.5 + 0.5; // 0 (sphere) -> 1 (text)
        const mx = mouseWorld.x;
        const my = mouseWorld.y;
        const REPEL_R = 1.2;
        const RR = REPEL_R * REPEL_R;

        for (let i = 0; i < N; i++) {
            const i3 = i * 3;
            // Target pos interpolated between sphere and text
            const tx = buffers.spherePos[i3] * (1 - morphFactor) + buffers.textPos[i3] * morphFactor;
            const ty = buffers.spherePos[i3 + 1] * (1 - morphFactor) + buffers.textPos[i3 + 1] * morphFactor;
            const tz = buffers.spherePos[i3 + 2] * (1 - morphFactor) + buffers.textPos[i3 + 2] * morphFactor;

            // Spring return
            buffers.vel[i3] = (buffers.vel[i3] + 0.08 * (tx - pos[i3])) * 0.86;
            buffers.vel[i3 + 1] = (buffers.vel[i3 + 1] + 0.08 * (ty - pos[i3 + 1])) * 0.86;
            buffers.vel[i3 + 2] = (buffers.vel[i3 + 2] + 0.08 * (tz - pos[i3 + 2])) * 0.86;

            // Mouse repulsion
            const dx = pos[i3] - mx;
            const dy = pos[i3 + 1] - my;
            const d2 = dx * dx + dy * dy;
            let cf = 0;
            if (d2 < RR) {
                const dist = Math.sqrt(d2) + 0.001;
                const f = (0.28 * (1 - dist / REPEL_R)) / dist;
                buffers.vel[i3] += dx * f;
                buffers.vel[i3 + 1] += dy * f;
                buffers.vel[i3 + 2] += (Math.random() - 0.5) * f;
                cf = Math.pow(1 - dist / REPEL_R, 2);
            }

            pos[i3] += buffers.vel[i3];
            pos[i3 + 1] += buffers.vel[i3 + 1];
            pos[i3 + 2] += buffers.vel[i3 + 2];

            // Color perturbation
            col[i3] = buffers.baseColors[i3] + (1.0 - buffers.baseColors[i3]) * cf;
            col[i3 + 1] = buffers.baseColors[i3 + 1] + (0.15 - buffers.baseColors[i3 + 1]) * cf;
            col[i3 + 2] = buffers.baseColors[i3 + 2] + (0.15 - buffers.baseColors[i3 + 2]) * cf;
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} geometry={geometry}>
            <pointsMaterial
                size={0.04}
                vertexColors
                transparent
                opacity={0.9}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

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
        if (activeModel !== "particle_morph") {
            groupRef.current.rotation.y += 0.003;
            groupRef.current.rotation.x += 0.001;
        }

        // Smooth scaling: toggles between 0.8 (normal) and 1.6 (enlarged) on double click
        const baseScale = isEnlarged ? 1.6 : (activeModel === "particle_morph" ? 1.1 : 0.8);
        const targetScale = hovered ? baseScale * 1.12 : baseScale;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    return (
        <Float speed={animEnabled ? 1.5 : 0} rotationIntensity={animEnabled && activeModel !== "particle_morph" ? 0.3 : 0} floatIntensity={animEnabled ? 0.25 : 0}>
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
                {activeModel === "particle_morph" && <ParticleMorphModel text="ANKUSH RAWAT" />}
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
            {/* 3D Model Switcher Controls Bar */}
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
