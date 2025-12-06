import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
    const word = "CURSOR";
    const letters = word.split('');

    const [currentIndex, setCurrentIndex] = useState(-1);
    const [visibleCount, setVisibleCount] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [showCore, setShowCore] = useState(false);

    useEffect(() => {
        let index = 0;

        const sequenceInterval = setInterval(() => {
            if (index >= letters.length) {
                clearInterval(sequenceInterval);

                setTimeout(() => {
                    setShowCore(true);

                    setTimeout(() => {
                        setIsExiting(true);
                        setTimeout(onComplete, 800);
                    }, 1500);
                }, 200);
                return;
            }

            setCurrentIndex(index);

            setTimeout(() => {
                setVisibleCount(prev => prev + 1);
            }, 200);

            index++;
        }, 300);

        return () => clearInterval(sequenceInterval);
    }, [letters.length, onComplete]);

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center font-mono overflow-hidden transition-opacity duration-1000 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <style jsx>{`
                .perspective-container {
                    perspective: 1000px;
                }
                
                /* Advanced CSS 3D Gyroscope/Core */
                .gyro {
                    width: 140px;
                    height: 140px;
                    position: relative;
                    transform-style: preserve-3d;
                    animation: rotateGyro 15s infinite linear;
                    will-change: transform;
                }
                
                .ring {
                    position: absolute;
                    inset: 0;
                    border: 1px solid rgba(6, 182, 212, 0.4);
                    border-radius: 50%;
                    transform-style: preserve-3d;
                    box-shadow: 0 0 10px rgba(6, 182, 212, 0.1);
                    will-change: transform;
                }
                
                .ring:nth-child(1) { transform: rotateX(0deg); border-width: 2px; border-color: rgba(6, 182, 212, 0.8); }
                .ring:nth-child(2) { transform: rotateX(60deg); animation: rotateRing 8s infinite linear reverse; }
                .ring:nth-child(3) { transform: rotateX(-60deg); animation: rotateRing 12s infinite linear; }
                .ring:nth-child(4) { transform: rotateY(90deg); animation: rotateRing 10s infinite linear; border-color: rgba(34, 211, 238, 0.3); }
                
                .core-cube {
                    position: absolute;
                    inset: 40px;
                    transform-style: preserve-3d;
                    animation: rotateCube 6s infinite linear;
                    will-change: transform;
                }
                
                .face {
                    position: absolute;
                    inset: 0;
                    background: rgba(6, 182, 212, 0.1);
                    border: 1px solid rgba(34, 211, 238, 0.6);
                    box-shadow: 0 0 20px rgba(6, 182, 212, 0.2) inset;
                }
                
                .face:nth-child(1) { transform: translateZ(30px); }
                .face:nth-child(2) { transform: rotateY(180deg) translateZ(30px); }
                .face:nth-child(3) { transform: rotateY(90deg) translateZ(30px); }
                .face:nth-child(4) { transform: rotateY(-90deg) translateZ(30px); }
                .face:nth-child(5) { transform: rotateX(90deg) translateZ(30px); }
                .face:nth-child(6) { transform: rotateX(-90deg) translateZ(30px); }

                /* Inner glowing nucleus */
                .nucleus {
                    position: absolute;
                    inset: 55px;
                    background: #22d3ee;
                    border-radius: 50%;
                    filter: blur(8px);
                    box-shadow: 0 0 30px #22d3ee;
                    animation: pulseNucleus 2s infinite ease-in-out;
                    will-change: transform, opacity;
                }

                @keyframes rotateGyro {
                    0% { transform: rotateY(0deg) rotateX(10deg); }
                    100% { transform: rotateY(360deg) rotateX(10deg); }
                }
                
                @keyframes rotateRing {
                    0% { transform: rotateX(60deg) rotateZ(0deg); }
                    100% { transform: rotateX(60deg) rotateZ(360deg); }
                }
                
                @keyframes rotateCube {
                    0% { transform: rotateX(0deg) rotateY(0deg); }
                    100% { transform: rotateX(360deg) rotateY(360deg); }
                }

                @keyframes pulseNucleus {
                    0%, 100% { transform: scale(0.8); opacity: 0.8; }
                    50% { transform: scale(1.2); opacity: 1; }
                }

                /* Floating Data Particles */
                .data-particle {
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: rgba(34, 211, 238, 0.5);
                    animation: floatUp 4s infinite linear;
                }

                @keyframes floatUp {
                    0% { transform: translateY(100vh) scale(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(-10vh) scale(1); opacity: 0; }
                }

                /* Text Reflection */
                .reflection {
                    transform: scaleY(-1);
                    opacity: 0.15;
                    mask-image: linear-gradient(transparent, black);
                    -webkit-mask-image: linear-gradient(transparent 20%, black 100%);
                    opacity: 0.15;
                }
            `}</style>

            {/* Cinematic Background */}
            <div className="absolute inset-0 bg-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#082f49_0%,#000000_90%)]" />
                <div className="scanline" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [perspective:1000px] [transform:rotateX(60deg)_scale(3)] origin-bottom opacity-20" />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="data-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                            opacity: Math.random() * 0.5
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-16">
                {/* Main Text Sequence */}
                <div className="relative">
                    <div className="flex gap-1 md:gap-4">
                        {letters.map((letter, index) => {
                            const isProcessing = index === currentIndex;
                            const isVisible = index < visibleCount;
                            const isWaiting = index > currentIndex;

                            return (
                                <div key={index} className="relative w-16 h-28 md:w-28 md:h-48 flex items-center justify-center perspective-[1000px]">
                                    {/* Shape Layer - High Tech Card */}
                                    <div
                                        className={`
                                            absolute z-20
                                            w-16 h-24 md:w-24 md:h-36
                                            bg-cyan-950/30 border border-cyan-500/30
                                            shadow-[0_0_30px_rgba(6,182,212,0.1)]
                                            backdrop-blur-sm
                                            transition-all duration-700 cubic-bezier(0.23, 1, 0.32, 1)
                                            ${isVisible ? 'rotate-y-90 opacity-0' : ''} 
                                            ${isProcessing ? 'translate-x-0 opacity-100 rotate-y-0' : ''}
                                            ${isWaiting ? 'translate-x-[100px] opacity-0 rotate-y-45 scale-75' : ''}
                                            ${!isProcessing && !isVisible && !isWaiting ? 'scale-0 opacity-0' : ''} 
                                        `}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
                                        <div className="absolute top-2 left-2 w-1 h-1 bg-cyan-400 rounded-full" />
                                        <div className="absolute bottom-2 right-2 w-1 h-1 bg-cyan-400 rounded-full" />
                                    </div>

                                    {/* Letter Layer - Stable & Premium */}
                                    <div
                                        className={`
                                            relative z-10
                                            text-7xl md:text-[9rem] font-bold tracking-tighter
                                            text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-500
                                            filter drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]
                                            transition-all duration-700 cubic-bezier(0.23, 1, 0.32, 1)
                                            will-change-transform
                                            ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-8'}
                                        `}
                                    >
                                        {letter}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Reflection */}
                    <div className="flex gap-1 md:gap-4 absolute top-full left-0 w-full reflection">
                        {letters.map((letter, index) => (
                            <div key={index} className={`
                                w-16 md:w-28 flex items-center justify-center
                                text-7xl md:text-[9rem] font-bold tracking-tighter
                                text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-cyan-500
                                transition-opacity duration-700
                                ${index < visibleCount ? 'opacity-100' : 'opacity-0'}
                            `}>
                                {letter}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3D Gyroscope Core */}
                <div className={`perspective-container transition-all duration-1000 ease-out delay-200 ${showCore ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 translate-x-12'}`}>
                    <div className="gyro">
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="core-cube">
                            <div className="face"></div>
                            <div className="face"></div>
                            <div className="face"></div>
                            <div className="face"></div>
                            <div className="face"></div>
                            <div className="face"></div>
                        </div>
                        <div className="nucleus"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
