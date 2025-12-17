const Hero = ({ completed = 0, total = 0, progress = 0, score = 0, onEggClick }) => {
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
        <div className="w-full px-6 flex items-end justify-between relative bottom-2">
          
          {/* Frog */}
          <div className="w-40 h-40 relative -mb-6 -ml-6">
            <img
              src="/images/char-Melofroggy.png"
              alt="Frog"
              className="w-full h-full object-contain"
            />
          </div>

          {/* XP Bar */}
          <div className="flex-1 ml-2 mb-10 flex items-end gap-1">

            {/* Flame + Glow */}
            <div className="relative mb-1 w-8 h-8 flex items-center justify-center group cursor-pointer hover:scale-110 transition-transform">
              <div className="absolute inset-[-4px] rounded-full bg-[rgba(255,140,0,0.45)] blur-[6px]" />
              <img
                src="/images/icon-flame.png"
                alt="Flame"
                className="relative z-10 w-8 h-8 object-contain"
              />
              {/* Optional Score Popup on Hover */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
