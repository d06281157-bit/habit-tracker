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
        // 1. Root Container: The Deep Blue Gradient Base
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#1B1E38] to-[#3B3857]">
          
        {/* 2. Stardust Layer (Optimized for Visibility) */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none animate-star-fall"
            style={{
              // --- 改動 A: 增加層次與亮度 ---
              backgroundImage: `
                radial-gradient(2px 2px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                radial-gradient(2px 2px at 40px 70px, #ffffff, rgba(0,0,0,0)),
                radial-gradient(white, rgba(255,255,255,.8) 2px, transparent 4px),
                radial-gradient(white, rgba(255,255,255,.6) 1px, transparent 3px)
              `,
              // --- 改動 B: 縮小尺寸以增加密度 (數值越小，星星越密) ---
              backgroundSize: '250px 250px, 150px 150px',
              
              // --- 改動 C: 調整遮罩，讓星星在畫面下方才慢慢消失 ---
              maskImage: 'linear-gradient(to bottom, black 20%, transparent 95%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 95%)'
            }}
          ></div>

          {/* 3. Main Content (Egg, Platforms, etc.) */}
          {/* Ensure z-10 is used so content sits ABOVE the stars */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pb-20">

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
