import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CloudProgressBar from './CloudProgressBar';

const IncubatePage = ({ isIncubating, onStartIncubation }) => {
    // Timer Logic
    const TOTAL_TIME = 7200; // 2 Hours in seconds
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

    // Countdown Effect
    useEffect(() => {
        if (!isIncubating) return;

        // If already done, don't restart (or handle as 'Hatch Ready' in future)
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isIncubating, timeLeft]);

    // Calculate Progress (Inverted: Time goes down, Progress goes up)
    const progressPercentage = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;

    // Helper: Format Time HH:MM:SS
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h} : ${m} : ${s}`;
    };
    // Generate stars for "Safe Motion Mode"
    const [stars] = useState(() => {
        return Array.from({ length: 35 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`, // Random Horizontal
            size: `${Math.random() * 3 + 2}px`,
            duration: `${(15 + Math.random() * 10).toFixed(2)}s`, // Random Duration 15-25s
            delay: `${(Math.random() * -25).toFixed(2)}s`, // Random Negative Delay for instant spread
            shineDuration: `${(Math.random() * 2 + 2).toFixed(2)}s`, // Frequency 2-4s
            shineDelay: `${(Math.random() * 2).toFixed(2)}s` // Trigger 0-2s
        }));
    });

    return (
        // 1. Root Container: Soft Dark Gradient Base
        <div
            className="relative min-h-screen w-full overflow-hidden"
            style={{
                background: 'linear-gradient(to bottom, #231E3D 0%, #584A6E 100%)'
            }}
        >

            {/* 2. Dynamic Star Layer (Safe Motion) */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    zIndex: 50 // Keep Safe High Z-Index
                }}
            >
                {stars.map(star => (
                    <div
                        key={star.id}
                        className="absolute rounded-full shiney"
                        style={{
                            left: star.left,
                            top: '-20px', // Start above screen for animation
                            width: star.size,
                            height: star.size,
                            backgroundColor: '#FFFDD0', // Cream Color
                            boxShadow: '0 0 10px white',
                            opacity: 1.0,
                            zIndex: 50,
                            // Motion Restoration
                            animation: `fall ${star.duration} linear infinite ${star.delay}, shine ${star.shineDuration} ease-in-out infinite ${star.shineDelay}`
                            // animation: 'fall linear infinite',
                            // animationDuration: star.duration,
                            // animationDelay: star.delay
                        }}
                    />
                ))}
            </div>

            {/* 3. Main Content (Egg, Platforms, etc.) */}
            {/* Ensure z-10 is used so content sits ABOVE the stars */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pb-20" style={{ zIndex: 60 }}>

                {isIncubating ? (
                    // --- State B: Incubating ---
                    <div className="flex flex-col items-center w-full animate-[fadeIn_0.5s_ease-out]">
                        {/* 1. Text Top */}
                        <h2 className="text-white/90 text-xl font-bold mb-12 tracking-widest drop-shadow-md">正在孵化中...</h2>

                        {/* 2. Egg & Platform Group */}
                        <div className="relative mb-12 w-full flex justify-center">
                            {/* Cloud Platform Base - Positioned under the egg */}
                            <img
                                src="/images/cloud-platform.png"
                                className="absolute bottom-[-45px] translate-y-6 z-0 w-48 object-contain opacity-90"
                                alt="Cloud Platform"
                            />

                            {/* Egg */}
                            <img
                                src="/images/icon-mystery-egg.png"
                                className="w-40 h-40 object-contain relative z-10 animate-egg-shake"
                                alt="Incubating Egg"
                            />
                        </div>

                        {/* 3. Cloud Progress Bar */}
                        <div className="w-[140%] max-w-[400px] flex justify-center mb-4 px-4 mt-6">
                            <CloudProgressBar percentage={progressPercentage} />
                        </div>

                        {/* 4. Timer Text (Formatted & Styled) */}
                        <div
                            className="text-[#FFFFFF] text-[40px] font-bold tracking-widest tabular-nums opacity-90"
                            style={{
                                fontFamily: 'monospace',
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                zIndex: 10
                            }}
                        >
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                ) : (
                    // --- State A: Idle / Unlock ---
                    <div className="flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
                        <h2 className="text-white/80 text-sm font-medium mb-12 tracking-wide">[去完成更多星願，解鎖下一顆星蛋]</h2>

                        {/* Cloud Button */}
                        <div
                            onClick={onStartIncubation}
                            className="relative mb-20 cursor-pointer group transition-transform active:scale-95 flex flex-col items-center justify-center"
                        >
                            {/* Cloud Platform Base - Added as requested */}
                            <img
                                src="/images/cloud-platform.png"
                                className="absolute bottom-[-45px] translate-y-6 z-0 w-48 object-contain opacity-90"
                                alt="Cloud Platform"
                            />

                            {/* Simplified Plus Floating Icon */}
                            <div className="relative z-10 mb-6">
                                <Plus size={80} strokeWidth={3} className="text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncubatePage;
