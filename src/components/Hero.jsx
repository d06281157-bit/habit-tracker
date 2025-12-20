import { useState, useEffect } from 'react';

const Hero = ({ completed = 0, total = 0, progress = 0, score = 0, incubationStatus = 'idle', incubationStartTime = null, onEggClick }) => {
  const TOTAL_INCUBATION_TIME = 7200; // 2 hours in seconds
  const [timeLeft, setTimeLeft] = useState(TOTAL_INCUBATION_TIME);

  // Calculate time left for incubation
  useEffect(() => {
    if (incubationStatus !== 'incubating' || !incubationStartTime) {
      setTimeLeft(TOTAL_INCUBATION_TIME);
      return;
    }

    const calculateTimeLeft = () => {
      const elapsed = Math.floor((Date.now() - incubationStartTime) / 1000);
      return Math.max(TOTAL_INCUBATION_TIME - elapsed, 0);
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [incubationStatus, incubationStartTime]);

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Calculate fire progress percentage (0 to 100)
  const fireProgress = incubationStartTime 
    ? Math.min(((Date.now() - incubationStartTime) / 1000 / TOTAL_INCUBATION_TIME) * 100, 100)
    : 0;

  const isIncubating = incubationStatus === 'incubating' || incubationStatus === 'ready';

  return (
    <div className="relative w-full h-[360px] overflow-hidden rounded-b-[3rem] shadow-sm z-0">
      {/* Desert Background */}
      <div
        className="absolute inset-0 bg-no-repeat bg-bottom bg-contain"
        style={{
          backgroundImage: `url(/images/desert-background.jpeg)`,
        }}
      />

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 z-[2]">
        <div className="w-full px-6 flex items-end justify-between">
          
          {/* Frog */}
          <div className="w-40 h-40 relative -mb-6 -ml-6">
            <img
              src="/images/char-Melofroggy.png"
              alt="Frog"
              className="w-full h-full object-contain"
            />
          </div>

          {/* XP Bar or Incubation Path */}
          <div className="flex-1 ml-2 mb-0 flex items-end gap-1">

            {!isIncubating ? (
              /* MODE A: Idle - Progress Bar */
              <>
                {/* Flame + Glow */}
                <div className="relative mb-1 w-8 h-8 flex items-center justify-center group cursor-pointer hover:scale-110 transition-transform">
                  <div className="absolute inset-[-4px] rounded-full bg-[rgba(255,140,0,0.45)] blur-[6px]" />
                  <img
                    src="/images/icon-flame.png"
                    alt="Flame"
                    className="relative z-10 w-8 h-8 object-contain"
                  />
                </div>

                {/* Text + Progress */}
                <div className="flex-1 flex flex-col gap-0">
                  <span className="text-[10px] text-[#656565] font-bold ml-0.5">
                    完成今天的星願
                  </span>

                  <div className="relative h-10 flex items-center w-full overflow-visible">
                    
                    {/* Progress Track */}
                    <div className="w-[90%] h-5 bg-white rounded-full relative overflow-hidden shadow-[inset_0px_4px_6px_rgba(0,0,0,0.11)]">
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1/4 bg-[#E38240] rounded-full border-2 border-white shadow-[inset_0px_4px_4px_rgba(255,255,255,0.5)] transition-all duration-500 ease-out" 
                        style={{ width: `${Math.min((score / 20) * 100, 100)}%` }} 
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] text-[#BEBEBE] font-bold">
                        {score}/20
                      </span>
                    </div>

                    <div 
                        className={`absolute right-[-2px] top-1/2 -translate-y-[58%] z-30 transition-all duration-300 ${score >= 20 ? 'cursor-pointer hover:scale-110 animate-bounce' : 'opacity-60 grayscale'}`}
                        onClick={() => score >= 20 && onEggClick && onEggClick()}
                    >
                      {/* Glow - Only when unlocked */}
                      {score >= 20 && (
                          <div className="absolute inset-[-4px] rounded-full bg-[rgba(155,120,255,0.6)] blur-[8px] animate-pulse" />
                      )}
                      
                      <img
                        src="/images/icon-mystery-egg.png"
                        alt="Mystery Egg"
                        className="relative z-10 w-11 h-11 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* MODE B: Incubating - Fire Traveling Path */
              <div className="flex-1 flex flex-col gap-1">
                {/* Status Text + Timer */}
                <div className="flex items-center justify-center gap-4 mb-1">
                  <span className="text-[20px] text-white font-black [text-shadow:0_2px_6px_rgba(0,0,0,0.8)]">準備破蛋</span>
                  <span className="text-[24px] text-white font-black tracking-widest tabular-nums [text-shadow:0_2px_6px_rgba(0,0,0,0.8)]">
                    {formatTime(timeLeft)}
                  </span>
                </div>

                {/* Path Container */}
                <div className="relative h-10 flex items-center w-full">
                  
                  {/* Dotted Line Path */}
                  <div 
                    className="absolute left-4 right-8 top-1/2 -translate-y-1/2" 
                    style={{
                      height: '4px',
                      backgroundImage: 'repeating-linear-gradient(to right, #FFFFFF 0px, #FFFFFF 8px, transparent 8px, transparent 16px)',
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                      opacity: 0.9
                    }}
                  />

                  {/* Traveling Fire */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ease-linear"
                    style={{ left: `calc(${Math.min(fireProgress, 85)}% + 8px)` }}
                  >
                    <div className="relative">
                      <div className="absolute inset-[-4px] rounded-full bg-[rgba(255,140,0,0.5)] blur-[6px] animate-pulse" />
                      <img
                        src="/images/icon-flame.png"
                        alt="Flame"
                        className="relative z-10 w-7 h-7 object-contain animate-bounce"
                      />
                    </div>
                  </div>

                  {/* Clickable Egg at the End */}
                  <div 
                      className="absolute right-[-2px] top-1/2 -translate-y-[58%] z-30 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => onEggClick && onEggClick()}
                  >
                    <div className="absolute inset-[-4px] rounded-full bg-[rgba(155,120,255,0.6)] blur-[8px] animate-pulse" />
                    <img
                      src="/images/icon-mystery-egg.png"
                      alt="Mystery Egg"
                      className="relative z-10 w-11 h-11 object-contain animate-heartbeat"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
