import React, { useEffect, useRef } from 'react';

const Aurora = ({ children }) => {
    const canvasRef = useRef(null);

    // Aurora Animation Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let width, height;
        let time = 0;

        // Configuration for the oval ribbon effect
        const config = {
            lines: 35,        // Reduced lines for better performance
            speed: 0.0015,    // Slower, milder speed
            amplitude: 30,    // Milder wave height
            frequency: 3,     // Fewer waves
            baseRadiusX: 500,
            baseRadiusY: 250,
            resolution: 0.08, // Lower resolution (higher step value) for performance
        };

        // Resize function
        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const drawOvalRibbon = (centerX, centerY, rX, rY, colorStart, colorEnd, phaseSpeed, pulsePhase) => {
            // Create gradient once per ring, not per line
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, colorStart);
            gradient.addColorStop(1, colorEnd);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;

            // Breathing effect: Rhythmic expansion and contraction
            // Sync with the pulse phase for a cohesive "alive" feel
            const breathCycle = Math.sin(time * 12 + pulsePhase);
            const breathScale = 1 + (breathCycle * 0.06); // +/- 6% size variation

            for (let i = 0; i < config.lines; i++) {
                ctx.beginPath();

                // 1. Opacity Calculation with Pulsing
                let baseAlpha = Math.sin((i / config.lines) * Math.PI);

                // Pulsing effect: Fade in and fade out
                // Speed up the pulse significantly so it's visible (approx 6-7s cycle)
                let pulse = Math.sin(time * 12 + pulsePhase);

                // Normalize to 0 to 1
                let visibility = (pulse + 1) / 2;

                // Apply opacity: Distinct range from very faint to visible
                let minOpacity = 0.05;
                let maxOpacity = 0.3;
                let currentOpacity = minOpacity + (visibility * (maxOpacity - minOpacity));

                ctx.globalAlpha = baseAlpha * currentOpacity;

                // Draw the distorted oval
                // Optimized loop with lower resolution
                for (let a = 0; a <= Math.PI * 2 + config.resolution; a += config.resolution) {
                    // Distortion
                    let distortion = Math.sin(a * config.frequency + time * phaseSpeed + (i * 0.05)) * config.amplitude;

                    // Secondary fine distortion (simplified)
                    distortion += Math.cos(a * 8 + time * phaseSpeed * 2) * 3;

                    // Radial spread
                    let spread = (i - config.lines / 2) * 1.5;

                    // Apply breathing scale to the base radius
                    let currentRx = (rX * breathScale) + distortion + spread;
                    let currentRy = (rY * breathScale) + distortion + spread;

                    const x = centerX + currentRx * Math.cos(a);
                    const y = centerY + currentRy * Math.sin(a);

                    if (a === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        };

        const draw = () => {
            // 1. Clear screen completely each frame
            ctx.clearRect(0, 0, width, height); // Use clearRect instead of fillRect to be transparent

            // 2. Set blend mode to 'lighter'
            ctx.globalCompositeOperation = 'lighter';

            const cx = width / 2;
            const cy = height * 0.85; // Move to bottom

            // Draw overlapping oval ribbons
            // Ring 1: Cyan - Main
            drawOvalRibbon(cx, cy, config.baseRadiusX, config.baseRadiusY, '#06b6d4', '#3b82f6', 1, 0);

            // Ring 2: Blue - Secondary
            drawOvalRibbon(cx, cy, config.baseRadiusX * 1.1, config.baseRadiusY * 1.1, '#3b82f6', '#6366f1', -0.8, Math.PI);

            // Ring 3: Purple/White - Accent
            drawOvalRibbon(cx, cy, config.baseRadiusX * 0.8, config.baseRadiusY * 0.8, '#8b5cf6', '#ffffff', 1.2, Math.PI / 2);

            time += config.speed;
            animationFrameId = requestAnimationFrame(draw);
        };

        // Start animation
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-transparent text-white font-sans pointer-events-none">
            {/* Aurora Foreground Canvas */}
            <canvas
                ref={canvasRef}
                id="aurora-canvas"
                className="absolute inset-0 w-full h-full z-1"
            />

            <div className="relative z-10 w-full h-full pointer-events-auto">
                {children}
            </div>
        </div>
    );
};

export default Aurora;