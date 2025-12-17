import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CloudProgressBar from './CloudProgressBar';

const IncubatePage = ({ isIncubating, onStartIncubation }) => {
    // Timer Logic (Simple countdown for demo)
    const [timeLeft, setTimeLeft] = useState("03:21:00");
    const [progress, setProgress] = useState(0);

    // Simulate progress when incubating
    useEffect(() => {
        if (isIncubating) {
            const interval = setInterval(() => {
                setProgress(prev => (prev >= 100 ? 0 : prev + 1));
            }, 1000); // 1% per second for demo
            return () => clearInterval(interval);
        }
    }, [isIncubating]);

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
                     <div className="w-full flex justify-center mb-4 px-4">
                        <CloudProgressBar percentage={progress} />
                     </div>

                     {/* 4. Timer Text (Plain) */}
                     <div className="text-white/80 font-mono text-lg tracking-widest opacity-90">
                         {timeLeft}
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
