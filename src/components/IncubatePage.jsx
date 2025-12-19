import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CloudProgressBar from './CloudProgressBar';

// Placeholder Pet Data
const HATCHED_PET = {
    name: 'Bloomthorn',
    image: '/images/char-Bloomthorn.png',
    desc: '草系 / 喜歡陽光'
};

const IncubatePage = ({ isIncubating, onStartIncubation, onNavigateHome }) => {
    // Timer Logic
    const TOTAL_TIME = 7200; // 2 Hours in seconds
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
    
    // Hatching State
    const [isHatching, setIsHatching] = useState(false);
    const [showPet, setShowPet] = useState(false);
    const [showFlash, setShowFlash] = useState(false);

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

    // Demo Mode Shortcut (Shift + D)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
                console.log("🎹 Antigravity: Keyboard Shortcut Triggered!");
                setTimeLeft(5);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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
                        {/* 1. Text Top */}
                        <h2 className="text-white/90 text-xl font-bold mb-12 tracking-widest drop-shadow-md">
                            {timeLeft <= 0 ? "已完成孵化" : "正在孵化中..."}
                        </h2>

                        {/* 2. Egg & Platform Group */}
                        <div className="relative mb-12 w-full flex justify-center">
                            {/* Cloud Platform Base - Positioned under the egg */}
                            <img
                                src="/images/cloud-platform.png"
                                className="absolute bottom-[-45px] translate-y-6 z-0 w-48 object-contain opacity-90"
                                alt="Cloud Platform"
                            />

                            {/* Egg */}
                            <div className="relative z-10 group" onClick={() => {
                                if (timeLeft <= 0 && !isHatching && !showPet) {
                                    setIsHatching(true);
                                    
                                    // 1. Flash at 7s
                                    setTimeout(() => {
                                        setShowFlash(true);
                                    }, 7000);

                                    // 2. Reveal at 8s
                                    setTimeout(() => {
                                        setIsHatching(false);
                                        setShowFlash(false); // Fade out handled by unmount or CSS if needed, but simple toggle is fine for now
                                        setShowPet(true);
                                    }, 8000); 
                                }
                            }}>
                                {/* Glow Effect (Only when complete & not hatching) */}
                                {timeLeft <= 0 && !isHatching && !showPet && (
                                    <div className="absolute inset-0 bg-yellow-200/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full scale-125 pointer-events-none" />
                                )}

                                {/* White Flash Overlay */}
                                {showFlash && (
                                    <div className="fixed inset-0 bg-white z-[60] animate-[fadeIn_1s_ease-in] pointer-events-none" />
                                )}

                                {/* Pet Reveal Modal / Overlay */}
                                {showPet && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 animate-[fadeIn_0.5s_ease-out]">
                                        <div className="relative">
                                            {/* Light Burst Behind */}
                                            <div className="absolute inset-0 bg-white/40 blur-3xl scale-150 animate-pulse" />
                                            
                                            <img 
                                                src={HATCHED_PET.image} 
                                                alt={HATCHED_PET.name}
                                                className="w-48 h-48 object-contain relative z-10 animate-[bounce_1s_infinite]"
                                            />
                                        </div>
                                        <div className="mt-4 text-center">
                                            <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-2">哇！孵化了！</h3>
                                            <p className="text-white/80 text-lg">{HATCHED_PET.name}</p>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onNavigateHome(); // Claim and go home
                                                }}
                                                className="mt-6 px-6 py-2 bg-white text-purple-900 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                                            >
                                                帶回家
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Main Egg Image (Static) */}
                                {!showPet && !isHatching && (
                                    <img
                                        src="/images/icon-mystery-egg.png"
                                        className={`w-40 h-40 object-contain relative z-20 transition-all duration-300 ${
                                            timeLeft <= 0 
                                                ? 'cursor-pointer animate-heartbeat' 
                                                : 'animate-egg-shake'
                                        }`}
                                        alt="Incubating Egg"
                                    />
                                )}
                                
                                {/* Full Screen Hatching GIF */}
                                {isHatching && (
                                    <img
                                        src={`/images/egg-cracking-2.gif?t=${Date.now()}`}
                                        alt="Hatching..."
                                        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-full object-cover z-[99999]"
                                    />
                                )}
                            </div>
                        </div>

                        {/* 3. Cloud Progress Bar & Timer (Hide during hatching/reveal) */}
                        {!isHatching && !showPet && (
                            <>
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
                            </>
                        )}
                    </div>
                ) : (
                    // --- State A: Idle / Unlock ---
                    <div className="flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
                        <h2 className="text-white/90 text-xl font-bold mb-12 tracking-widest drop-shadow-md">[去完成更多星願，解鎖下一顆星蛋]</h2>

                        {/* Cloud Button */}
                        <div
                            onClick={onNavigateHome}
                            className="relative mb-12 w-full h-40 flex justify-center cursor-pointer group transition-transform active:scale-95 items-center"
                        >
                            {/* Cloud Platform Base - Added as requested */}
                            <img
                                src="/images/cloud-platform.png"
                                className="absolute bottom-[-45px] translate-y-6 z-0 w-48 object-contain opacity-90"
                                alt="Cloud Platform"
                            />

                            {/* Simplified Plus Floating Icon - Minimalist */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigateHome();
                                }}
                                className="relative z-10 mb-6 w-20 h-20 flex items-center justify-center group focus:outline-none"
                            >
                                <Plus 
                                    size={80} 
                                    strokeWidth={3} 
                                    className="text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:text-[#FFFDD0] group-hover:drop-shadow-[0_0_8px_rgba(255,253,208,0.6)]" 
                                />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncubatePage;
