"use client";

import React, { useEffect, useState, useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows, Float, PerspectiveCamera, Center, Environment } from '@react-three/drei';
import { useConversation } from '@elevenlabs/react';
import { getTemplateByKeyword } from '../codeTemplates';
import { Mic, MicOff, Zap, Sparkles as SparklesIcon } from 'lucide-react';

function Model2(props) {
    const { scene } = useGLTF('/avatar2.glb');
    return <primitive object={scene} {...props} />;
}

const Avatar2 = forwardRef(({ onCodeGenerated, agentEndpoint = '/api/signed-url-backend', agentLabel = 'Backend Agent', isConnected: externalIsConnected, showChatInterface = true }, ref) => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const extractCodeFromMessage = useCallback((messageText) => {
        const template = getTemplateByKeyword(messageText);
        if (template && onCodeGenerated) {
            Object.entries(template).forEach(([fileName, fileData]) => {
                onCodeGenerated(fileData.content, fileName, fileData.language);
            });
            return;
        }
        const codeBlockRegex = /```(\\w+)?\\n([\\s\\S]*?)```/g;
        const matches = [...messageText.matchAll(codeBlockRegex)];
        if (matches.length > 0 && onCodeGenerated) {
            matches.forEach((match, index) => {
                const language = match[1] || 'javascript';
                const code = match[2].trim();
                const fileName = `generated-${Date.now()}-${index}.${language === 'python' ? 'py' : language === 'html' ? 'html' : 'js'}`;
                onCodeGenerated(code, fileName, language);
            });
        }
    }, [onCodeGenerated]);

    const conversation = useConversation({
        onConnect: () => console.log('Backend Agent Connected'),
        onDisconnect: () => console.log('Backend Agent Disconnected'),
        onMessage: (message) => {
            setMessages((prev) => [...prev, message]);
            if (message.source === 'ai' && message.message) extractCodeFromMessage(message.message);
        },
        onError: (error) => console.error('Backend Agent Error:', error),
    });

    const triggerStart = async () => {
        try {
            const response = await fetch(agentEndpoint);
            const { signedUrl } = await response.json();
            await conversation.startSession({ signedUrl });
        } catch (e) { console.error(e); }
    };

    const triggerStop = async () => { await conversation.endSession(); };

    // Expose connect/disconnect methods to parent via ref
    useImperativeHandle(ref, () => ({
        connect: triggerStart,
        disconnect: triggerStop
    }));

    const isConnected = externalIsConnected !== undefined ? externalIsConnected : conversation.status === 'connected';

    // If showChatInterface is false, render 3D model (50%) + status area (50%) to match Avatar 1
    if (!showChatInterface) {
        return (
            <div className="w-full h-full flex flex-col relative bg-transparent">
                {/* === ENERGETIC CLEAN BACKGROUND === */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-br from-[#db2777] via-[#7c3aed] to-[#4f46e5]">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[100px]" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-30 animate-pulse" style={{ animationDuration: '3s' }} />
                </div>

                {/* 3D AVATAR CONTAINER - Top 50% */}
                <div className="relative w-full h-1/2 z-10 border-b border-white/5">
                    <Canvas gl={{ alpha: true }} shadows>
                        <PerspectiveCamera makeDefault position={[0, 0.5, 6]} fov={35} />
                        <ambientLight intensity={2.5} />
                        <Environment preset="city" intensity={1.2} />
                        <directionalLight position={[0, 5, 5]} intensity={3} color="#ffffff" />
                        <spotLight position={[5, 5, 5]} intensity={2} color="#818cf8" angle={0.5} penumbra={1} />
                        <spotLight position={[-5, 5, 5]} intensity={2} color="#c084fc" angle={0.5} penumbra={1} />

                        <Float speed={2} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.05, 0.05]}>
                            <Center>
                                <Model2
                                    scale={[1.6, 1.6, 1.6]}
                                    rotation={[0, -1.4, 0]}
                                    position={[0, -1, 0]}
                                />
                            </Center>
                        </Float>

                        <ContactShadows opacity={0.4} scale={10} blur={2.5} far={2} color="black" />

                        <OrbitControls
                            enableZoom={true}
                            enablePan={true}
                            minDistance={3}
                            maxDistance={12}
                            minPolarAngle={Math.PI / 2.5}
                            maxPolarAngle={Math.PI / 1.8}
                        />
                    </Canvas>

                    {/* Status Badge with Agent Label */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                        <div className="px-3 py-1 rounded-full bg-black/20 border border-white/10 backdrop-blur-md flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-zinc-600'}`} />
                            <span className="text-[10px] text-white/70 font-mono tracking-widest uppercase">{agentLabel}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom 50% - Empty status area to match Avatar 1 layout */}
                <div className="relative flex flex-col bg-[#050508]/80 backdrop-blur-xl h-1/2 z-10">
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center space-y-2 opacity-50">
                            <div className={`w-3 h-3 rounded-full mx-auto ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                                {isConnected ? 'Synced with main agent' : 'Disconnected'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Original layout with chat interface
    return (
        <div className="w-full h-full flex flex-col relative bg-transparent">
            {/* === ENERGETIC CLEAN BACKGROUND === */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-br from-[#db2777] via-[#7c3aed] to-[#4f46e5]">
                {/* Subtle overlay to soften the gradient slightly and add depth without clutter */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[100px]" />

                {/* Dynamic Pulse for "Energy" */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-30 animate-pulse" style={{ animationDuration: '3s' }} />
            </div>

            {/* 3D AVATAR CONTAINER - Top 50% */}
            <div className="relative w-full h-1/2 z-10 border-b border-white/5">
                {/* Transparent Canvas sitting on top of the 2D background */}
                <Canvas gl={{ alpha: true }} shadows>
                    <PerspectiveCamera makeDefault position={[0, 0.5, 6]} fov={35} />

                    {/* Lighting: significantly brighter */}
                    <ambientLight intensity={2.5} />
                    <Environment preset="city" intensity={1.2} />
                    <directionalLight position={[0, 5, 5]} intensity={3} color="#ffffff" />
                    <spotLight position={[5, 5, 5]} intensity={2} color="#818cf8" angle={0.5} penumbra={1} />
                    <spotLight position={[-5, 5, 5]} intensity={2} color="#c084fc" angle={0.5} penumbra={1} />

                    {/* Float with 0 rotation intensity to keep model facing forward */}
                    <Float speed={2} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.05, 0.05]}>
                        <Center>
                            {/* Rotated to face camera */}
                            <Model2
                                scale={[1.6, 1.6, 1.6]}
                                rotation={[0, -1.4, 0]}
                                position={[0, -1, 0]}
                            />
                        </Center>
                    </Float>

                    <ContactShadows opacity={0.4} scale={10} blur={2.5} far={2} color="black" />

                    <OrbitControls
                        enableZoom={true}
                        enablePan={true}
                        minDistance={3}
                        maxDistance={12}
                        minPolarAngle={Math.PI / 2.5}
                        maxPolarAngle={Math.PI / 1.8}
                    />
                </Canvas>

                {/* Status Badge with Agent Label */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                    <div className="px-3 py-1 rounded-full bg-black/20 border border-white/10 backdrop-blur-md flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-zinc-600'}`} />
                        <span className="text-[10px] text-white/70 font-mono tracking-widest uppercase">{agentLabel}</span>
                    </div>
                </div>
            </div>

            {/* CHAT INTERFACE - Bottom 50% */}
            <div className="relative flex flex-col bg-[#050508]/80 backdrop-blur-xl h-1/2 z-10">
                {/* Header - No buttons, controlled by parent */}
                <div className="h-12 border-b border-white/5 flex items-center px-4 shrink-0 bg-white/[0.02]">
                    <div className="flex-1 flex gap-3">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                            {isConnected ? 'Listening for "Backend" keyword...' : 'Disconnected'}
                        </span>
                    </div>

                    {/* Simple decorative element */}
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                    </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4 opacity-50">
                            <SparklesIcon className="w-12 h-12 text-zinc-700" strokeWidth={1} />
                            <p className="text-[10px] font-mono uppercase tracking-widest">Ready for input</p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div key={index} className={`flex flex-col ${msg.source === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`py-2 px-3 max-w-[85%] text-xs leading-relaxed backdrop-blur-md shadow-sm 
                                ${msg.source === 'user'
                                    ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-100 rounded-2xl rounded-tr-sm'
                                    : 'bg-zinc-800/40 border border-zinc-700/40 text-zinc-300 rounded-2xl rounded-tl-sm'
                                }
                             `}>
                                {msg.message}
                            </div>
                        </div>
                    ))}

                    {isConnected && (
                        <div className="flex items-center gap-2 ml-1 opacity-50">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                            <span className="text-[10px] font-mono text-indigo-400/70 uppercase">Listening...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

Avatar2.displayName = 'Avatar2';

export default Avatar2;

useGLTF.preload('/avatar2.glb');
