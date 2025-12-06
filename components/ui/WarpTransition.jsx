import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, PerspectiveCamera, CameraShake, Text, Image as DreiImage } from '@react-three/drei';
import * as THREE from 'three';

// --- Components ---

const TunnelRing = ({ index, speedRef, color }) => {
    const mesh = useRef();
    const [initialZ] = useState(-index * 8);

    useFrame((state, delta) => {
        if (!mesh.current) return;

        // Move towards camera
        const currentSpeed = speedRef.current * delta * 20;
        let newZ = mesh.current.position.z + currentSpeed;

        // Reset if passed camera
        if (newZ > 15) {
            newZ = -150; // Further back for deeper tunnel
        }

        mesh.current.position.z = newZ;

        // Spin faster with speed
        mesh.current.rotation.z += delta * (0.5 + speedRef.current * 0.1) * (index % 2 === 0 ? 1 : -1);

        // Pulse scale
        if (speedRef.current > 5) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 20) * 0.1;
            mesh.current.scale.setScalar(scale);
        }
    });

    return (
        <group ref={mesh} position={[0, 0, initialZ]}>
            {/* Outer Ring */}
            <mesh>
                <torusGeometry args={[8, 0.2, 16, 6]} /> {/* Hexagonal rings are cooler */}
                <meshBasicMaterial color={color} transparent opacity={0.3} wireframe />
            </mesh>
            {/* Inner Ring */}
            <mesh rotation={[0, 0, Math.PI / 4]}>
                <torusGeometry args={[5, 0.1, 8, 40]} />
                <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>
        </group>
    );
};

const SpeedStreaks = ({ speedRef }) => {
    const count = 300;
    const mesh = useRef();

    const lines = useMemo(() => {
        return new Array(count).fill().map(() => ({
            pos: new THREE.Vector3(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 200 - 50
            ),
            len: Math.random() * 5 + 2
        }));
    }, []);

    useFrame((state, delta) => {
        if (!mesh.current) return;
        const currentSpeed = speedRef.current * 40 * delta;

        mesh.current.children.forEach((child, i) => {
            child.position.z += currentSpeed;

            // Stretch based on speed
            child.scale.z = 1 + speedRef.current * 2;

            if (child.position.z > 20) {
                child.position.z = -200;
                child.position.x = (Math.random() - 0.5) * 60;
                child.position.y = (Math.random() - 0.5) * 60;
            }
        });
    });

    return (
        <group ref={mesh}>
            {lines.map((line, i) => (
                <mesh key={i} position={line.pos} rotation={[0, 0, 0]}>
                    <boxGeometry args={[0.1, 0.1, line.len]} />
                    <meshBasicMaterial color="#a5f3fc" transparent opacity={0.4} />
                </mesh>
            ))}
        </group>
    );
};

const HyperSpaceEffect = ({ speedRef }) => {
    const camRef = useRef();
    const shakeRef = useRef();

    useFrame((state, delta) => {
        if (!camRef.current) return;

        // FOV DISTORTION (Quake Style)
        // Base 75, max 120
        const targetFov = 75 + (speedRef.current * 2.5);
        camRef.current.fov = THREE.MathUtils.lerp(camRef.current.fov, targetFov, delta * 2);
        camRef.current.updateProjectionMatrix();

        // Camera Shake Intensity
        if (shakeRef.current) {
            shakeRef.current.setIntensity(speedRef.current * 0.05);
        }
    });

    return (
        <>
            <PerspectiveCamera ref={camRef} makeDefault position={[0, 0, 0]} fov={75} />
            <CameraShake
                ref={shakeRef}
                maxPitch={0.05}
                maxRoll={0.05}
                maxYaw={0.05}
                intensity={0}
                decay={false}
                decayRate={0.65}
            />
        </>
    );
}

const WarpTransition = ({ onComplete }) => {
    const [finished, setFinished] = useState(false);
    const [warpState, setWarpState] = useState("SPOOLING UP");
    const speedRef = useRef(0.5); // Start with slow drift
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let startTime = Date.now();
        const duration = 4000; // Longer, more epic build up

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const p = Math.min(1, elapsed / duration);
            setProgress(p);

            // LOGARITHMIC ACCELERATION CURVE
            if (p < 0.2) {
                // Phase 1: Drift
                speedRef.current = 1 + p * 5;
                setWarpState("ALIGNING VECTORS");
            } else if (p < 0.6) {
                // Phase 2: Charge
                speedRef.current = 5 + (p - 0.2) * 20;
                setWarpState("WARP DRIVE ENGAGED");
            } else if (p < 0.9) {
                // Phase 3: Hyperspeed
                speedRef.current = 20 + (p - 0.6) * 100;
                setWarpState("MAXIMUM VELOCITY");
            } else {
                // Phase 4: Beyond Light
                speedRef.current = 80;
                setWarpState("DESTINATION REACHED");
            }

            if (p >= 1 && !finished) {
                setFinished(true);
                clearInterval(interval);
                setTimeout(() => { if (onComplete) onComplete(); }, 400);
            }
        }, 16);

        return () => clearInterval(interval);
    }, [finished, onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] bg-black overflow-hidden pointer-events-none">

            {/* 3D Scene */}
            <div className={`absolute inset-0 transition-opacity duration-200 ${finished ? 'opacity-0' : 'opacity-100'}`}>
                <Canvas>
                    <color attach="background" args={['#000000']} />
                    <fog attach="fog" args={['#000000', 10, 100]} /> // Deep depth

                    <HyperSpaceEffect speedRef={speedRef} />

                    <group>
                        {/* Multiple Layers of Rings for depth */}
                        {Array.from({ length: 25 }).map((_, i) => (
                            <TunnelRing
                                key={i}
                                index={i}
                                speedRef={speedRef}
                                color={i % 2 === 0 ? "#06b6d4" : "#6366f1"} // Cyan & Indigo
                            />
                        ))}
                    </group>

                    <SpeedStreaks speedRef={speedRef} />

                    {/* Background Stars just streaming by */}
                    <Stars radius={150} depth={50} count={8000} factor={8} saturation={0} fade speed={10} />
                </Canvas>
            </div>

            {/* Cinematic HUD Overlay */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ${finished ? 'opacity-0 scale-150 blur-xl' : 'opacity-100'}`}>

                {/* Central Target Reticle */}
                <div className="relative w-[300px] h-[300px] border border-cyan-500/30 rounded-full flex items-center justify-center animate-spin-slow">
                    <div className="w-[80%] h-[80%] border border-indigo-500/30 rounded-full border-dashed animate-reverse-spin" />
                    <div className="absolute top-0 w-1 h-4 bg-cyan-400/50" />
                    <div className="absolute bottom-0 w-1 h-4 bg-cyan-400/50" />
                    <div className="absolute left-0 w-4 h-1 bg-cyan-400/50" />
                    <div className="absolute right-0 w-4 h-1 bg-cyan-400/50" />
                </div>

                {/* Warp Text */}
                <div className="absolute mt-80 flex flex-col items-center">
                    <h2 className="text-4xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-indigo-400 tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(0,240,255,0.8)] animate-pulse">
                        {Math.floor(speedRef.current * 10)} KM/S
                    </h2>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="h-1 w-24 bg-gradient-to-r from-transparent to-cyan-500" />
                        <span className="font-mono text-cyan-300 text-sm tracking-[0.5em]">{warpState}</span>
                        <div className="h-1 w-24 bg-gradient-to-l from-transparent to-cyan-500" />
                    </div>
                </div>

            </div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_100%)] opacity-80" />

            {/* Final Flash */}
            <div className={`absolute inset-0 bg-white mix-blend-overlay transition-opacity duration-300 ease-in ${finished ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute inset-0 bg-white transition-opacity duration-300 ease-in ${finished ? 'opacity-100' : 'opacity-0'}`} />

            <style>{`
                @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes reverse-spin { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
                .animate-spin-slow { animation: spin-slow 10s linear infinite; }
                .animate-reverse-spin { animation: reverse-spin 5s linear infinite; }
            `}</style>
        </div>
    );
};

export default WarpTransition;
