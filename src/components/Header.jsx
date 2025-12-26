const Header = ({ onOpenTask, onOpenPlanet, selectedDate, onSelectDate, checkCompleted }) => {
  const days = [
    { label: "週日", date: "1" },
    { label: "週一", date: "2" },
    { label: "週二", date: "3" },
    { label: "週三", date: "今天" },
    { label: "週四", date: "5" },
    { label: "週五", date: "6" },
    { label: "週六", date: "7" },
  ];

  return (
    <div
      className="
                pt-12 px-6 pb-1
                bg-white/30 backdrop-blur-[10px] 
                relative z-20 flex flex-col items-center
            "
    >
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-1 mt-1">
        {/* Rocket Button */}
        {/*
        <div
          className="w-11 h-11 flex items-center justify-center rounded-xl border border-white/60 bg-white/20 backdrop-blur-[20px] shadow-[0_4px_14px_rgba(0,0,0,0.16)] cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,180,100,0.5)]"
          onClick={onOpenTask}
        >
          <img
            src="/images/icon-rocket.png"
            alt="Rocket"
            className="w-9 h-9 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
          />
        </div>
        */}
        
        {/* Date Text only */}
        <h1 className="text-2xl font-extrabold text-[#707070] tracking-wide mx-auto">
          11月, 2025
        </h1>

        {/* Planet Button */}
        {/*
        <div 
          className="w-11 h-11 flex items-center justify-center rounded-xl border border-white/60 bg-white/20 backdrop-blur-[20px] shadow-[0_4px_14px_rgba(0,0,0,0.16)] cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-[0_0_20px_rgba(100,200,255,0.5)]"
          onClick={onOpenPlanet}
        >
          <img
            src="/images/icon-planet.png"
            alt="Planet"
            className="w-9 h-9 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
          />
        </div>
        */}
      </div>

      {/* Week Row */}
      <div className="mt-1 flex justify-center gap-2 w-full">
        {days.map((day, index) => {
          const isActive = selectedDate === day.date;
          const isCompleted = checkCompleted && checkCompleted(day.date);
          
          return (
            <div
              key={index}
              onClick={() => onSelectDate && onSelectDate(day.date)}
              className={`
      flex flex-col items-center justify-center cursor-pointer outline-none
      w-[52px] h-[70px] py-1.5 transition-all duration-300 ease-in-out
      ${
        isActive
          ? `bg-white shadow-[0_8px_20px_rgba(0,0,0,0.1)] z-30 relative`
          : `bg-transparent`
      }
      rounded-[12px]
    `}
            >
              {/* 選取態高光 */}
              {isActive && (
                <div className="pointer-events-none absolute top-1 left-2 right-2 h-3 rounded-full bg-white/60 blur-[2px]" />
              )}

              {/* WEEK */}
              <span
                className={`
        w-full text-center text-[13px]
        ${
          isActive
            ? "font-bold text-[#585575]"
            : "font-medium text-gray-400"
        }
      `}
              >
                {day.label}
              </span>

              {/* DAY / 今天 */}
              {day.date === '今天' ? (
                <div className="mt-2 h-8 flex items-center justify-center">
                    <span className={`text-[16px] font-bold leading-none ${isActive ? 'text-[#585575]' : 'text-gray-400 opacity-60'}`}>
                      今天
                    </span>
                </div>
              ) : (
                <div
                  className={`
          mt-3 w-8 h-8 flex items-center justify-center rounded-full
          transition-all duration-300
          ${
            isCompleted
              ? "bg-orange-400 text-white shadow-md transform scale-105"
              : "text-[#7C89A6]"
          }
        `}
                >
                  <span className="text-[16px] font-bold">{day.date}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
