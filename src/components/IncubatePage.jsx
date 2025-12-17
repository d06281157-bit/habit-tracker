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

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 pb-32 h-full relative w-full overflow-hidden">
             
             {/* Starry/Gradient Background */}
             <div className="absolute inset-0 bg-gradient-to-b from-[#1a1b4b] to-[#4a3b89] -z-10">
                {/* CSS Stars */}
                <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full opacity-80 animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-40 left-1/3 w-1 h-1 bg-white rounded-full opacity-90 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-white rounded-full opacity-70" />
                <div className="absolute top-1/4 right-10 w-2 h-2 bg-yellow-100 rounded-full opacity-40 blur-[1px]" />
             </div>

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
                            className="absolute bottom-[-32px] translate-y-6 z-0 w-48 object-contain opacity-90"
                            alt="Cloud Platform"
                         />
                         
                         {/* Egg */}
                         <img 
                            src="/images/icon-mystery-egg.png" 
                            className="w-40 h-40 object-contain relative z-10 animate-[bounce_3s_infinite]" 
                            alt="Incubating Egg" 
                         />
                     </div>

                     {/* 3. Cloud Progress Bar */}
                     <div className="w-[140%] max-w-[400px] flex justify-center mb-4 px-4 mt-4">
                        <CloudProgressBar percentage={progressPercentage} />
                     </div>

                     {/* 4. Timer Text (Formatted & Styled) */}
                     <div 
                        className="text-[#8B7D6B] text-[40px] font-bold tracking-widest tabular-nums opacity-90 drop-shadow-sm"
                        style={{ fontFamily: 'monospace' }}
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
                            className="absolute bottom-[-40px] translate-y-4 z-0 w-48 object-contain opacity-90 transition-transform group-hover:scale-105"
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
    );
};

export default IncubatePage;
