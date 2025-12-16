import React from "react";

const CloudProgressBar = ({ percentage = 0 }) => {
  const p = Math.max(0, Math.min(percentage, 100));

  return (
    <div className="w-full px-0">
      {/* 你要的「底座」寬度，就由這個容器決定 */}
      <div className="relative w-full h-26">
        {/* 雲朵底座：用 fill 才會真的被拉寬 */}
        <img
          src="/images/cloud-bar-bg.png"
          alt="Cloud Progress Bar"
          className="absolute inset-0 w-full h-full object-fill z-0 pointer-events-none"
        />

        {/* 填充（依照底座槽微調 left/top/h） */}
        <div
          className="absolute left-8 top-[44px] h-[37px] rounded-full z-10 transition-[width] duration-500"
          style={{
            width: `calc((100% - 48px) * ${p / 100})`, // 48px = left 24 + right 24
            background: "linear-gradient(to right, #fde047, #fb923c)",
          }}
        >
          {/* 星星 */}
          <div className="absolute -right-5 -top-3 w-15 h-15 z-20 pointer-events-none">
            <img
              src="/images/winged-star.png"
              alt="Star"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudProgressBar;



