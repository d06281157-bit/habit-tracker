import React from "react";

const Header = ({ onOpenTask, onOpenPlanet }) => {
  const days = [
    { label: "週日", date: "1", active: false },
    { label: "週一", date: "2", active: false },
    { label: "週二", date: "3", active: false },
    { label: "週三", date: "今天", active: true },
    { label: "週四", date: "5", active: false },
    { label: "週五", date: "6", active: false },
    { label: "週六", date: "7", active: false },
  ];

  return (
    <div
      className="
                pt-8 px-6 pb-6
                bg-white/30 backdrop-blur-[10px] 
                relative z-20 flex flex-col items-center
            "
    >
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-3 mt-3">
        {/* Rocket Button */}
        <div
          className="w-11 h-11 flex items-center justify-center rounded-xl border border-white/60 bg-white/20 backdrop-blur-[20px] shadow-[0_4px_14px_rgba(0,0,0,0.16)] cursor-pointer"
          onClick={onOpenTask}
        >
          <img
            src="/images/icon-rocket.png"
            alt="Rocket"
            className="w-9 h-9 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
          />
        </div>
        {/* Date Text only */}
        <h1 className="text-2xl font-extrabold text-[#707070] tracking-wide">
          11月, 2025
        </h1>

        {/* Planet Button */}
        <div 
          className="w-11 h-11 flex items-center justify-center rounded-xl border border-white/60 bg-white/20 backdrop-blur-[20px] shadow-[0_4px_14px_rgba(0,0,0,0.16)] cursor-pointer"
          onClick={onOpenPlanet}
        >
          <img
            src="/images/icon-planet.png"
            alt="Planet"
            className="w-9 h-9 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
          />
        </div>
      </div>

      {/* Week Row */}
      <div className="mt-1 flex justify-center gap-3 w-full">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
    flex flex-col items-center justify-center
    h-[78px] transition-all duration-200
    ${
      day.active
        ? `
        w-[62px] py-3
        bg-white
        border border-white/80
        shadow-[0_18px_30px_rgba(0,0,0,0.18)]
        scale-[1.08] z-30
        mx-2
        relative
      `
        : `
        w-[52px] py-2
        bg-transparent
      `
    }
    rounded-[10px]
  `}
          >
            {/* 選取態高光（玻璃立體感） */}
            {day.active && (
              <div className="pointer-events-none absolute top-1 left-2 right-2 h-3 rounded-full bg-white/60 blur-[2px]" />
            )}

            {/* WEEK：未選取維持你原本大小，只放大選取 */}
            <span
              className={`
      w-full text-center
      ${
        day.active
          ? "text-[16px] font-black text-[#585575]"
          : "text-[13px] font-medium text-gray-400"
      }
      }
    `}
            >
              {day.label}
            </span>

            {/* DAY / 今天：未選取保留你原本「完成態」設計（1號橘色、字 20px） */}
            {day.active ? (
              <span className="w-full text-center text-[21px] font-black text-[#585575] mt-3 leading-none">
                今天
              </span>
            ) : (
              <span
                className={`
        mt-3 w-8 h-8 flex items-center justify-center rounded-full
        text-[20px] font-bold
        ${
          day.date === "1"
            ? "bg-orange-400 text-white shadow-md"
            : "text-[#7C89A6]"
        }
      `}
              >
                {day.date}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
