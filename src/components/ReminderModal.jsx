import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

// --- Internal WheelPicker Component (Standard Finite List) ---
const WheelPicker = ({ options, value, onChange }) => {
  const ITEM_HEIGHT = 40;     // Height of each text item
  const CONTAINER_HEIGHT = 200; // Total height of the view window (5 items)
  const SPACER_HEIGHT = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2; // 80px to center first/last item

  const scrollRef = useRef(null);
  const isScrolling = useRef(false);
  const lastWheelTime = useRef(0);

  // 1. Initial Scroll to Position
  useEffect(() => {
    if (scrollRef.current) {
      const index = options.indexOf(value);
      if (index !== -1) {
        scrollRef.current.scrollTop = index * ITEM_HEIGHT;
      }
    }
  }, [value, options]);

  // 2. Handle Mouse Wheel - Must use addEventListener with passive: false
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleWheel = (e) => {
      e.preventDefault(); // This only works with passive: false
      e.stopPropagation();
      
      const now = Date.now();
      // Throttle: only allow wheel actions every 200ms
      if (now - lastWheelTime.current < 200) {
        return;
      }
      lastWheelTime.current = now;
      
      const currentIndex = options.indexOf(value);
      let newIndex = currentIndex;
      
      // deltaY > 0 = scroll down = next item
      // deltaY < 0 = scroll up = previous item
      if (e.deltaY > 0) {
        newIndex = Math.min(currentIndex + 1, options.length - 1);
      } else if (e.deltaY < 0) {
        newIndex = Math.max(currentIndex - 1, 0);
      }
      
      if (newIndex !== currentIndex) {
        onChange(options[newIndex]);
        // Update scroll position smoothly
        element.scrollTo({
          top: newIndex * ITEM_HEIGHT,
          behavior: 'smooth'
        });
      }
    };

    // Add wheel listener with passive: false to allow preventDefault
    element.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [options, value, onChange]);

  // 3. Touch/Drag Scroll Handler
  const handleScroll = (e) => {
    isScrolling.current = true;
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    
    // Bounds check
    if (index >= 0 && index < options.length) {
      const selectedOption = options[index];
      if (selectedOption !== value) {
        onChange(selectedOption);
      }
    }
    
    clearTimeout(scrollRef.current.scrollTimeout);
    scrollRef.current.scrollTimeout = setTimeout(() => {
        isScrolling.current = false;
    }, 150);
  };

  return (
    <div className={`relative w-full overflow-hidden`} style={{ height: `${CONTAINER_HEIGHT}px` }}>
      {/* Center Highlight Bar */}
      <div className="absolute top-1/2 left-0 right-0 h-[40px] -translate-y-1/2 bg-[#6B4EFF]/10 border-y border-[#6B4EFF]/30 pointer-events-none z-0" />
      
      {/* Scroll Container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto snap-y snap-mandatory relative z-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {/* Top Spacer: Pushes the first item to the center */}
        <div style={{ height: `${SPACER_HEIGHT}px` }} className="w-full flex-shrink-0" />
        
        {options.map((opt) => (
          <div 
            key={opt}
            className={`h-[40px] flex items-center justify-center snap-center transition-all duration-200 cursor-pointer ${
              value === opt 
                ? 'text-[#6B4EFF] font-bold text-2xl scale-110 opacity-100' 
                : 'text-gray-300 text-lg scale-90 opacity-40'
            }`}
            onClick={() => {
                // Allow click to select
                onChange(opt);
                // Smooth scroll to this item
                if (scrollRef.current) {
                    const idx = options.indexOf(opt);
                    scrollRef.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' });
                }
            }}
          >
            {opt}
          </div>
        ))}

        {/* Bottom Spacer: Allows the last item to reach the center */}
        <div style={{ height: `${SPACER_HEIGHT}px` }} className="w-full flex-shrink-0" />
      </div>
    </div>
  );
};

// --- Main ReminderModal Component ---
const ReminderModal = ({ isOpen, onClose, onSave, initialTime = "每日 上午 08:00" }) => {
  // Simple state management
  const [period, setPeriod] = useState("上午");
  const [hour, setHour] = useState("08");
  const [minute, setMinute] = useState("00");

  const periods = ["上午", "下午"];
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleSave = () => {
    onSave(`${period} ${hour}:${minute}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Body */}
      <div className="relative bg-[#F2F2F7] w-full max-w-md h-[50vh] rounded-t-[2rem] shadow-2xl animate-slide-up overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-white/50 backdrop-blur-md border-b border-gray-200 flex-shrink-0">
          <button onClick={onClose} className="p-2 -ml-2 text-gray-500 hover:text-[#A78BFA] transition-colors">
            <X size={24} />
          </button>
          <span className="font-bold text-lg text-black">選擇提醒時間</span>
          <button onClick={handleSave} className="text-[#6B4EFF] font-extrabold text-lg hover:text-[#A78BFA] transition-colors">
            保存
          </button>
        </div>

        {/* Picker Container */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
            <div className="flex items-center w-full max-w-[300px] gap-2">
                
                {/* 1. Period */}
                <div className="flex-1">
                    <WheelPicker options={periods} value={period} onChange={setPeriod} />
                </div>
                
                {/* 2. Hour */}
                <div className="flex-1">
                    <WheelPicker options={hours} value={hour} onChange={setHour} />
                </div>
                
                <span className="text-2xl font-bold text-[#2B2D5C] pb-2">:</span>
                
                {/* 3. Minute */}
                <div className="flex-1">
                    <WheelPicker options={minutes} value={minute} onChange={setMinute} />
                </div>
            
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
