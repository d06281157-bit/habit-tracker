import React from "react";

const CloudProgressBar = ({ percentage }) => {
  return (
    <div className="relative w-full max-w-[400px]"> {/* Root Container */}
      
      {/* 1. Background Image */}
      <img 
        src="/images/cloud-bar-bg3.png" 
        alt="Bar Background" 
        className="w-full object-contain pointer-events-none select-none" 
      />

      {/* 2. Calibration Track (The Invisible Safe Zone) */}
      {/* DEVELOPER NOTE: Tweak these 'top', 'left', 'right', 'height' values to match the PNG artwork perfectly */}
      <div 
        className="absolute rounded-full box-border"
        style={{
          top: '42%',    // Push down to match the trough vertical center
          left: '8.5%',  // Push in from the left cloud edge
          right: '10%',   // Push in from the right cloud edge
          height: '35%', // Height of the inner trough
          
          // 👇 Trough Styles
          backgroundColor: 'rgba(242, 239, 239, 0.5)', // #F2EFEF @ 100%
          border: '0.5px solid #e7ded2ff',
        }}
      >
        {/* 3. The Dynamic Fill Bar */}
        <div 
          className="relative h-full rounded-full flex items-center box-border"
          style={{ 
            width: `${percentage}%`,
            
            // 👇 Fill Styles
            backgroundColor: '#ffcb59ff', 
            border: '2px solid #e4ddd4ff',
            // Inner Shadow: x=2, y=6, blur=2, color=#FFF8EA @ 50%
            boxShadow: 'inset 2px 4px 2px rgba(255, 248, 234, 0.5)',
          }}
        >
          {/* 4. The Indicator (Winged Star) - Stick to right end */}
          <div className="absolute right-0 translate-x-1/2 w-15 h-15 flex items-center justify-center drop-shadow-md z-10">
             <img src="/images/winged-star.png" alt="Star" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default CloudProgressBar;



