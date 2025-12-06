import React from 'react';
import { ShimmerButton } from "./shimmer-button";

const Hero = ({ onInitialize, onDocumentation }) => {
    return (
        <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 py-20">

            {/* Main Headline - No Container, Just Pure Text */}
            <h1 className="text-center mb-8 relative group mt-20">
                {/* Glitch/Blur Effect behind text */}
                <span className="absolute top-0 left-0 w-full h-full text-7xl md:text-9xl font-bold text-blue-500/20 blur-sm select-none pointer-events-none animate-pulse">
                    CURSOR
                </span>
                <div className="relative text-7xl md:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-blue-100 to-blue-200">
                        CURSOR
                    </span>
                    <span className="text-blue-500 mx-4"> </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        AI
                    </span>
                </div>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-blue-100/80 text-center mb-12 leading-relaxed max-w-3xl font-light tracking-wide drop-shadow-lg">
                The architecture of your digital reality. <br className="hidden md:block" />
                <span className="text-white font-normal">Build. Deploy. Transcend.</span>
            </p>

            {/* Action Buttons - Minimal & High Contrast */}
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                <ShimmerButton
                    className="shadow-2xl border-black/10"
                    background="rgba(255, 255, 255, 1)"
                    shimmerColor="#000000"
                    shimmerSize="0.15em"
                    borderRadius="9999px"
                    onClick={onInitialize}
                >
                    <span className="relative z-10 flex items-center gap-2 text-black text-lg font-bold px-4">
                        Initialize
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                </ShimmerButton>

                <ShimmerButton
                    className="shadow-2xl"
                    background="rgba(0, 0, 0, 0.5)"
                    shimmerColor="#ffffff"
                    borderRadius="9999px"
                    onClick={onDocumentation} // Correctly wired to the Warp transition
                >
                    <span className="flex items-center gap-2 text-white text-lg font-medium px-4">
                        Documentation
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400">_</span>
                    </span>
                </ShimmerButton>
            </div>

            {/* Decorative 'Code' Lines floating around */}
            <div className="absolute top-1/2 left-10 hidden lg:block text-blue-500/20 font-mono text-sm pointer-events-none select-none">
                <div>{'<System>'}</div>
                <div className="pl-4">{'<Core>Active</Core>'}</div>
                <div className="pl-4">{'<Uplink>Secure</Uplink>'}</div>
                <div>{'</System>'}</div>
            </div>
            <div className="absolute top-1/2 right-10 hidden lg:block text-blue-500/20 font-mono text-sm pointer-events-none select-none text-right">
                <div>{'// Protocol'}</div>
                <div>{'const reality = new Matrix();'}</div>
                <div>{'reality.init();'}</div>
            </div>
        </div>
    );
};

export default Hero;
