import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CloudProgressBar from './CloudProgressBar';

// Placeholder Pet Data
const HATCHED_PET = {
    name: 'Bloomthorn',
    image: '/images/char-Bloomthorn.png',
    desc: '草系 / 喜歡陽光'
};

const IncubatePage = ({ isIncubating, onStartIncubation, onNavigateHome, onNavVisibilityChange }) => {
    // Timer Logic
    const TOTAL_TIME = 7200; // 2 Hours in seconds
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
    
    // Hatching State
    const [isHatching, setIsHatching] = useState(false);
    const [showPet, setShowPet] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    // Sync Nav visibility with parent
    useEffect(() => {
        if (onNavVisibilityChange) {
            // Show nav if NOT hatching AND (NOT showing pet OR if we ARE exiting)
            onNavVisibilityChange(!isHatching && (!showPet || isExiting));
        }
        // Cleanup: Show nav when leaving
        return () => onNavVisibilityChange && onNavVisibilityChange(true);
    }, [isHatching, showPet, isExiting, onNavVisibilityChange]);

    const handleTakeHome = () => {
        setIsExiting(true);
        // Wait for animation (600ms) then navigate
        setTimeout(() => {
            onNavigateHome('alien'); 
        }, 600);
    };

    // Countdown Effect
    useEffect(() => {
        if (!isIncubating) return;
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
                setTimeLeft(5);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const progressPercentage = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h} : ${m} : ${s}`;
    };

    const [stars] = useState(() => {
        return Array.from({ length: 35 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * 3 + 2}px`,
            duration: `${(15 + Math.random() * 10).toFixed(2)}s`,
            delay: `${(Math.random() * -25).toFixed(2)}s`,
            shineDuration: `${(Math.random() * 2 + 2).toFixed(2)}s`,
            shineDelay: `${(Math.random() * 2).toFixed(2)}s`
        }));
    });

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#231E3D]">
            
            {/* 1. Normal State UI (Hidden when showing card) */}
            {!showPet && (
                <>
                    {/* Stars Background */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        {stars.map(star => (
                            <div
                                key={star.id}
                                className="absolute rounded-full shiney"
                                style={{
                                    left: star.left,
                                    top: '-20px',
                                    width: star.size,
                                    height: star.size,
                                    backgroundColor: '#FFFDD0',
                                    boxShadow: '0 0 10px white',
                                    animation: `fall ${star.duration} linear infinite ${star.delay}, shine ${star.shineDuration} ease-in-out infinite ${star.shineDelay}`
                                }}
                            />
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pb-24">
                        {isIncubating ? (
                            <div className="flex flex-col items-center w-full animate-[fadeIn_0.5s_ease-out]">
                                <h2 className="text-white/90 text-xl font-bold mb-12 tracking-widest drop-shadow-md">
                                    {timeLeft <= 0 ? "已完成孵化" : "正在孵化中..."}
                                </h2>

                                <div className="relative mb-12 w-full flex justify-center">
                                    <img src="/images/cloud-platform.png" className="absolute bottom-[-45px] translate-y-6 z-0 w-48 object-contain opacity-90" alt="Platform" />
                                    
                                    <div className="relative z-10 group" onClick={() => {
                                        if (timeLeft <= 0 && !isHatching) {
                                            setIsHatching(true);
                                            setTimeout(() => setShowFlash(true), 4000);
                                            setTimeout(() => {
                                                setIsHatching(false);
                                                setShowFlash(false);
                                                setShowPet(true);
                                            }, 5000);
                                        }
                                    }}>
                                        {/* White Glow / Halo on Hover (Only when ready) */}
                                        {timeLeft <= 0 && !isHatching && (
                                            <div className="absolute inset-0 bg-white/40 blur-[40px] rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 animate-pulse" />
                                        )}

                                        {!isHatching && (
                                            <img
                                                src="/images/icon-mystery-egg.png"
                                                className={`w-40 h-40 object-contain relative z-20 ${timeLeft <= 0 ? 'cursor-pointer animate-heartbeat' : 'animate-egg-shake'}`}
                                                alt="Egg"
                                            />
                                        )}
                                        {isHatching && (
                                            <video autoPlay muted playsInline className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-full object-cover z-[99999]">
                                                <source src="/images/mystery-egg-hatch-1.mp4" type="video/mp4" />
                                            </video>
                                        )}
                                        {showFlash && <div className="fixed inset-0 bg-white z-[100] animate-[fadeIn_0.5s_ease-in]" />}
                                    </div>
                                </div>

                                {!isHatching && (
                                    <>
                                        <div className="w-[140%] max-w-[400px] flex justify-center mb-4 px-4 mt-6">
                                            <CloudProgressBar percentage={progressPercentage} />
                                        </div>
                                        <div className="text-[#FFFFFF] text-[40px] font-bold tracking-widest tabular-nums opacity-90" style={{ fontFamily: 'monospace', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                            {formatTime(timeLeft)}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
                                <h2 className="text-white/90 text-[14px] font-bold mb-12 tracking-widest opacity-70">[去完成更多星願，解鎖下一顆星蛋]</h2>
                                <div onClick={onNavigateHome} className="relative mb-12 w-full h-40 flex justify-center cursor-pointer items-center">
                                    <img src="/images/cloud-platform.png" className="absolute bottom-[-45px] translate-y-6 z-0 w-48 object-contain opacity-90" />
                                    <button className="relative z-10 mb-6 w-20 h-20 flex items-center justify-center"><Plus size={80} strokeWidth={3} className="text-white/70" /></button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* 2. DISCOVERY CARD STATE (Active Overlay) */}
            {showPet && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center overflow-hidden p-6 rounded-b-[3rem]">
                    {/* Warm Coffee Brown Background (80% Opacity) */}
                    <div className="absolute inset-0 bg-[#3E2723]/80 z-0" />
                    <div 
                        className="absolute inset-[-20%] z-0 opacity-30 animate-mist"
                        style={{
                            background: 'radial-gradient(circle at 30% 30%, #5D4037 0%, transparent 45%), radial-gradient(circle at 70% 70%, #4E342E 0%, transparent 45%)',
                            filter: 'blur(60px)'
                        }}
                    />

                    {/* Discovery Card */}
                    <div className={`relative z-10 w-full max-w-[320px] aspect-[3/4.2] flex flex-col items-center ${isExiting ? 'animate-card-exit' : 'animate-card-reveal'}`}>
                        <div className={`absolute inset-0 rounded-[3rem] bg-[#FFFDE7] border-[6px] border-[#F2B36A]/30 shadow-[0_12px_0_rgba(0,0,0,0.15)] overflow-hidden ${!isExiting ? 'animate-card-pulse-slow' : ''}`}>
                            <div className="absolute top-[-10%] left-[-10%] w-40 h-40 bg-white/40 blur-3xl rounded-full" />
                        </div>

                        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#F2B36A]/20 blur-3xl rounded-full animate-pulse" />

                        <div className="relative z-20 mt-8 mb-6 bg-[#F2B36A] text-white px-4 py-1 rounded-full text-[12px] font-black tracking-widest shadow-sm">
                            NEW DISCOVERY
                        </div>

                        <div className="relative z-10 mb-6 animate-float">
                            <img src={HATCHED_PET.image} alt={HATCHED_PET.name} className="w-44 h-44 object-contain drop-shadow-[0_8px_0_rgba(0,0,0,0.1)]" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center px-8">
                            <h3 className="text-3xl font-black text-[#8B4513] mb-1 tracking-tight">{HATCHED_PET.name}</h3>
                            <p className="text-[#8B4513]/60 text-sm font-bold mb-8">{HATCHED_PET.desc}</p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleTakeHome(); }}
                                className="group relative px-12 py-3 bg-[#F2B36A] rounded-full shadow-[0_6px_0_#D4A017] transition-all hover:translate-y-[2px] hover:shadow-[0_4px_0_#D4A017] active:translate-y-[6px] active:shadow-none"
                            >
                                <span className="relative z-10 text-[#8B4513] font-black tracking-[0.2em] text-lg">帶回家</span>
                            </button>
                        </div>
                        <div className="absolute top-10 right-6 text-2xl animate-pulse delay-75">✨</div>
                        <div className="absolute bottom-32 left-8 text-xl animate-pulse delay-300">⭐</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncubatePage;
