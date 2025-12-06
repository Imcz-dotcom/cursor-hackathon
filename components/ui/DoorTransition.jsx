import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float, ContactShadows, useGLTF, useAnimations, Environment, Loader } from '@react-three/drei';
import * as THREE from 'three';

// --- HUD / UI OVERLAY ---
const TechProgressBar = ({ progress }) => {
    return (
        <div className="absolute bottom-12 left-0 right-0 z-50 flex flex-col items-center justify-center pointer-events-none">
            <div className="relative w-[300px] md:w-[500px] h-2 bg-gray-900/50 rounded-full border border-white/10 backdrop-blur-md overflow-hidden shadow-2xl">
                {/* Background Grid inside bar */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent_0%,#fff_50%,transparent_100%)]" style={{ backgroundSize: '10px 100%' }} />

                {/* Fill Bar */}
                <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-[0_0_20px_#06b6d4]"
                    style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
                >
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] animate-pulse" />
                </div>
            </div>

            {/* Text & Data */}
            <div className="w-[300px] md:w-[500px] flex justify-between mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/80">
                <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                    System Initialization
                </span>
                <span className="tabular-nums font-bold text-cyan-200">{Math.floor(progress)}%</span>
            </div>

            {/* Decorative Brackets */}
            <div className="absolute bottom-[-10px] w-[320px] md:w-[520px] h-8 border-b border-x border-white/5 rounded-b-xl -z-10" />
        </div>
    );
};

// --- 3D SCENE COMPONENTS ---

const CameraController = () => {
    useFrame((state) => {
        state.camera.lookAt(0, 0.8, 0); // Targeted height
    });
    return null;
};

const AvatarModel = ({ onProgressUpdate }) => {
    const group = useRef();
    const { scene, animations } = useGLTF('/avatar.glb');
    const { actions } = useAnimations(animations, group);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (actions && Object.keys(actions).length > 0) {
            const actionName = Object.keys(actions)[0];
            const action = actions[actionName];
            if (action) action.reset().fadeIn(0.5).play();
        }
    }, [actions]);

    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;
        const totalDuration = 3.5;

        // --- ROTATION ONLY (Centered) ---
        // Ensure it stays at 0
        if (group.current) {
            group.current.position.x = 0;
            // Continuous spin
            group.current.rotation.y += delta * 2.5;
        }

        // --- PROGRESS ---
        const rawP = Math.min(100, (t / totalDuration) * 100);
        if (rawP !== progress) {
            setProgress(rawP);
            if (onProgressUpdate) onProgressUpdate(rawP);
        }
    });

    return (
        // Raised drastically to 2.5 to guarantee clearance above floor.
        <group ref={group} position={[0, 2.5, 0]}>
            <primitive object={scene} scale={1.8} />

            {/* Center Energy Effect */}
            {progress > 50 && (
                <Float speed={5} rotationIntensity={1} floatIntensity={0.5}>
                    <Sparkles count={40} scale={[2, 4, 2]} size={6} speed={2} opacity={0.6} color="#06b6d4" position={[0, 1, 0]} />
                </Float>
            )}
        </group>
    );
};
useGLTF.preload('/avatar.glb');

const TechFloor = () => {
    return (
        <group position={[0, 0, 0]}>
            <gridHelper args={[30, 30, 0x06b6d4, 0x111111]} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="#050505" roughness={0.2} metalness={0.8} />
            </mesh>
        </group>
    );
};

const DoorTransition = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [finishing, setFinishing] = useState(false);

    useEffect(() => {
        const duration = 3600;
        const timer = setTimeout(() => {
            setFinishing(true);
            setTimeout(() => { if (onComplete) onComplete(); }, 600);
        }, duration);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] bg-[#020205]">
            <div className={`absolute inset-0 w-full h-full transition-all duration-700 ${finishing ? 'opacity-0 scale-105 filter blur-lg' : 'opacity-100'} `}>
                <Canvas dpr={[1, 2]} camera={{ position: [0, 1.2, 5], fov: 45 }} gl={{ toneMappingExposure: 1.2 }}>
                    {/* ENVIRONMENT IS CRITICAL FOR VISIBILITY */}
                    <Environment preset="city" />
                    <color attach="background" args={['#020205']} />
                    <fog attach="fog" args={['#020205', 5, 20]} />

                    <ambientLight intensity={1} />
                    <spotLight position={[5, 5, 5]} intensity={2} color="#06b6d4" castShadow />
                    <spotLight position={[-5, 5, -5]} intensity={2} color="#8b5cf6" />

                    <CameraController />

                    <Suspense fallback={null}>
                        {/* Raised group from -1 to -0.5 to center model vertically */}
                        <group position={[0, -0.5, 0]}>
                            <TechFloor />
                            <AvatarModel onProgressUpdate={setProgress} />
                            <ContactShadows opacity={0.5} scale={10} blur={2.5} far={2} />
                        </group>
                    </Suspense>

                    <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                </Canvas>
                <Loader />
            </div>

            {/* HUD / UI Layer */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${finishing ? 'opacity-0' : 'opacity-100'}`}>
                <TechProgressBar progress={progress} />
            </div>

            {/* Cinematic Flash Out */}
            <div className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-700 ease-in ${finishing ? 'opacity-100' : 'opacity-0'} `} />
        </div>
    );
};

export default DoorTransition;
