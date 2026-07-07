"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

const ParallaxStars = () => {
    const group = useRef<THREE.Group>(null);
    const [blastMode, setBlastMode] = useState(false);

    useEffect(() => {
        const handleBlast = (e: Event) => {
            setBlastMode((e as CustomEvent).detail);
        };
        window.addEventListener('blast_change', handleBlast);
        return () => window.removeEventListener('blast_change', handleBlast);
    }, []);

    useFrame((state) => {
        if (!group.current) return;
        const { x, y } = state.mouse;
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, y * 0.05, 0.05);
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.05, 0.05);
        
        if (blastMode) {
            group.current.rotation.z += 0.01;
            group.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.05);
        } else {
            group.current.rotation.z += 0.001;
            group.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
        }
    });

    return (
        <group ref={group}>
            <Stars radius={100} depth={50} count={blastMode ? 6000 : 1500} factor={blastMode ? 8 : 4} saturation={0} fade speed={blastMode ? 4 : 1} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#4ade80" />
            <pointLight position={[-10, 0, -10]} intensity={1} color="#3b82f6" />
        </group>
    );
};

export default function SpaceStarsCanvas() {
    return (
        <Canvas
            style={{ pointerEvents: "none" }}
            gl={{ antialias: false, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
        >
            <ParallaxStars />
        </Canvas>
    );
}
