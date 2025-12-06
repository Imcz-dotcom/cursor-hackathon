import React, { useState, useEffect } from 'react';
import Background from './ui/Background';
import Aurora from './ui/Aurora';
import Hero from './ui/Hero';
import InterfaceMockup from './ui/InterfaceMockup';
import LoadingScreen from './ui/LoadingScreen';
import DoorTransition from './ui/DoorTransition';
import WarpTransition from './ui/WarpTransition'; // Import the new transition

import Particles from './ui/Particles';

import { useRouter } from 'next/router';

const LandingPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [transitionMode, setTransitionMode] = useState(null); // 'door' or 'warp' or null

    useEffect(() => {
        if (router.isReady && router.query.skipLoading === 'true') {
            setIsLoading(false);
        }
    }, [router.isReady, router.query]);

    // Handle standard initialization (Avatar Walk)
    const handleInitialize = () => {
        setTransitionMode('door');
    };

    // Handle documentation click (New Warp Effect)
    const handleDocumentation = () => {
        setTransitionMode('warp');
    };

    return (
        <>
            {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

            {/* Conditional Rendering of Transitions */}
            {transitionMode === 'door' && <DoorTransition onComplete={() => router.push('/Avatar')} />}
            {transitionMode === 'warp' && <WarpTransition onComplete={() => router.push('/Avatar')} />}

            <div className={`transition-all duration-1000 ${isLoading || transitionMode ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <Background>
                    <Particles />
                    <div className="relative z-20 flex flex-col min-h-screen overflow-hidden">

                        <main className="flex-1 w-full flex flex-col items-center justify-center py-12 relative z-30">
                            <Hero
                                onInitialize={handleInitialize}
                                onDocumentation={handleDocumentation}
                            />
                        </main>

                        <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none z-10">
                            <Aurora>
                                <></>
                            </Aurora>
                        </div>
                    </div>
                </Background>
            </div>
        </>
    );
};

export default LandingPage;
