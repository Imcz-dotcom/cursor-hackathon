import React, { useEffect, useRef } from 'react';

const Background = ({ children }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const setCanvasSize = () => {
            // Make canvas slightly larger than screen to cover parallax movement
            canvas.width = window.innerWidth + 100;
            canvas.height = window.innerHeight + 100;
        };
        setCanvasSize();

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        // Create multiple layers for depth
        const createLayer = (count, speed, fontSize, opacityBase) => {
            const drops = [];
            for (let i = 0; i < count; i++) {
                drops.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    speed: speed + Math.random() * speed * 0.5,
                    text: alphabet.charAt(Math.floor(Math.random() * alphabet.length)),
                    fontSize: fontSize,
                    opacityBase: opacityBase
                });
            }
            return drops;
        };

        // Layer config: [count, speed, fontSize, opacity]
        let layers = [
            createLayer(150, 0.5, 10, 0.1),  // Back
            createLayer(100, 1, 14, 0.3),    // Mid
            createLayer(50, 2, 20, 0.6)      // Front
        ];

        const draw = () => {
            // Clear with fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            layers.forEach(layer => {
                if (layer.length > 0) {
                    ctx.font = `${layer[0].fontSize}px monospace`;
                }

                layer.forEach(drop => {
                    if (Math.random() > 0.95) {
                        drop.text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                    }

                    const isBright = Math.random() > 0.98;
                    const opacity = isBright ? 0.9 : drop.opacityBase;

                    ctx.fillStyle = `rgba(0, 150, 255, ${opacity})`;
                    ctx.fillText(drop.text, drop.x, drop.y);

                    drop.y += drop.speed;

                    if (drop.y > canvas.height) {
                        drop.y = -20;
                        drop.x = Math.random() * canvas.width;
                    }
                });
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            setCanvasSize();
            layers = [
                createLayer(150, 0.5, 10, 0.1),
                createLayer(100, 1, 14, 0.3),
                createLayer(50, 2, 20, 0.6)
            ];
        };

        // Parallax Mouse Effect
        const handleMouseMove = (e) => {
            if (!canvas) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 40; // Max move 20px
            const y = (e.clientY / window.innerHeight - 0.5) * 40;

            // Move canvas opposite to mouse for depth
            canvas.style.transform = `translate(${-x}px, ${-y}px)`;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-black text-white font-mono">
            <canvas
                ref={canvasRef}
                id="matrix-canvas"
                className="absolute -top-[50px] -left-[50px] w-[calc(100%+100px)] h-[calc(100%+100px)] z-0 pointer-events-none transition-transform duration-100 ease-out will-change-transform"
            />

            {/* Content - Remains Static/Centered */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default Background;