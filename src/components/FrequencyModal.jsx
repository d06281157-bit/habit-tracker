import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Minus, Plus } from 'lucide-react';

const TABS = [
  { id: 'none', label: '不重複' },
  { id: 'daily', label: '每天' },
  { id: 'weekly', label: '每週' },
  { id: 'monthly', label: '每月' },
];

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六'];
const DURATION_OPTIONS = ["30天", "60天", "90天", "180天", "一年", "永久"];

const WheelPicker = ({ options, value, onChange }) => {
  const ITEM_HEIGHT = 40; // Fixed height in pixels
  const scrollRef = useRef(null);
  const isScrolling = useRef(false);
  const lastWheelTime = useRef(0);

  // 1. Initial Scroll to Position
  useEffect(() => {
    if (scrollRef.current && !isScrolling.current) {
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

  // 3. Handle Touch/Drag Scroll
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
    
    // Reset scrolling flag after a timeout (debounce)
    clearTimeout(scrollRef.current.scrollTimeout);
    scrollRef.current.scrollTimeout = setTimeout(() => {
        isScrolling.current = false;
    }, 150);
  };

  return (
    <div className="relative h-[120px] w-full overflow-hidden bg-white/50 rounded-xl">
      {/* Center Highlight Bar (Fixed Visual) */}
      <div className="absolute top-1/2 left-0 right-0 h-[40px] -translate-y-1/2 bg-[#6B4EFF]/10 border-y border-[#6B4EFF]/30 pointer-events-none z-0" />
      
      {/* Scroll Container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar relative z-10"
      > 
        {/* Top Spacer: Pushes the first item to the center */}
        <div className="h-[40px] w-full flex-shrink-0" />

        {options.map((opt) => (
          <div 
            key={opt}
            className={`h-[40px] flex items-center justify-center snap-center transition-all duration-200 cursor-grab active:cursor-grabbing ${
              value === opt 
                ? 'text-[#6B4EFF] font-bold text-xl scale-110 opacity-100' // Selected
                : 'text-gray-400 text-sm scale-90 opacity-40' // Unselected
            }`}
          >
            {opt}
          </div>
        ))}
         {/* Bottom Spacer: Allows the last item to reach the center */}
        <div className="h-[40px] w-full flex-shrink-0" />
      </div>
    </div>
  );
};


const FrequencyModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('daily');
  
  // Tab Specific States
  const [dailyInterval, setDailyInterval] = useState(1);
  const [selectedWeekDays, setSelectedWeekDays] = useState([0, 1, 2, 3, 4, 5, 6]); // All days by default
  const [selectedMonthDays, setSelectedMonthDays] = useState([1]);

  // Common Settings
  const [dailyCount, setDailyCount] = useState(1);
  const [endDuration, setEndDuration] = useState("30天");
  
  // Timer Ref for Long Press
  const timerRef = useRef(null);

  // Logic Handlers
  const handleCountChange = (delta) => {
    setDailyCount(prev => {
        const newValue = prev + delta;
        if (newValue < 1) return 1;
        if (newValue > 20) return 20; 
        return newValue;
    });
  };

  const startPress = (delta) => {
    handleCountChange(delta);
    timerRef.current = setInterval(() => {
        handleCountChange(delta);
    }, 150);
  };

  const stopPress = () => {
    if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }
  };

  const handleWeekDayToggle = (index) => {
    setSelectedWeekDays(prev => {
      if (prev.includes(index)) {
        if (prev.length === 1) return prev; // Prevent empty
        return prev.filter(d => d !== index);
      } else {
        return [...prev, index].sort();
      }
    });
  };

  const handleMonthDayToggle = (day) => {
    setSelectedMonthDays(prev => {
      if (prev.includes(day)) {
        if (prev.length === 1) return prev; // Prevent empty
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day].sort((a, b) => a - b);
      }
    });
  };

  const handleSave = () => {
    // Generate label based on state
    let label = `${dailyCount}次, `;
    
    if (activeTab === 'none') {
        label = '不重複';
    } else if (activeTab === 'daily') {
        label += dailyInterval === 1 ? '每天' : `每 ${dailyInterval} 天`;
    } else if (activeTab === 'weekly') {
        if (selectedWeekDays.length === 7) label += '每天';
        else label += '每週...';
    } else if (activeTab === 'monthly') {
        label += '每月...';
    }

    onSave(label);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-end justify-center animate-[fadeIn_0.2s_ease-out]">
        {/* Backdrop (Separate click handler) */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

        {/* Modal Body: Responsive Bottom Sheet */}
        <div 
            className="relative bg-white w-full max-w-md rounded-t-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] pb-10 animate-[slideUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white z-10">
                <button onClick={onClose} className="hover:text-[#A78BFA] transition-colors">
                    <X className="w-6 h-6 text-gray-400 hover:text-[#A78BFA] transition-colors" />
                </button>
                <div className="w-10 h-1 bg-gray-300 rounded-full" /> {/* Handle bar visual */}
                <button 
                    onClick={handleSave}
                    className="text-[#6B4EFF] font-extrabold text-lg hover:text-[#A78BFA] transition-colors"
                >
                    保存
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
                {/* 1. Tabs */}
                <div className="px-6 mt-6">
                    <div className="flex bg-gray-100 rounded-full p-1">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                                    activeTab === tab.id 
                                    ? 'bg-gray-600 text-white shadow-md' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Dynamic Middle Section */}
                <div className="mt-8 px-6 min-h-[160px] flex items-center justify-center">
                    
                    {/* Daily */}
                    {activeTab === 'daily' && (
                        <div className="flex items-center justify-center gap-6 py-4">
                            <span className="text-gray-700 font-bold text-lg pt-2">每隔</span>
                            <div className="w-24">
                                <WheelPicker 
                                    options={Array.from({ length: 31 }, (_, i) => i + 1)} 
                                    value={dailyInterval} 
                                    onChange={setDailyInterval} 
                                />
                            </div>
                            <span className="text-gray-700 font-bold text-lg pt-2">天</span>
                        </div>
                    )}
                    
                    {/* Weekly */}
                    {activeTab === 'weekly' && (
                         <div className="flex justify-between w-full">
                            {WEEK_DAYS.map((day, idx) => {
                                const isSelected = selectedWeekDays.includes(idx);
                                return (
                                    <button
                                        key={day}
                                        onClick={() => handleWeekDayToggle(idx)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                                            isSelected 
                                            ? 'bg-[#4A00E0] text-white shadow-md' 
                                            : 'bg-gray-100 text-gray-400'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Monthly */}
                    {activeTab === 'monthly' && (
                        <div className="grid grid-cols-7 gap-2 w-full">
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                                const isSelected = selectedMonthDays.includes(day);
                                return (
                                     <button
                                        key={day}
                                        onClick={() => handleMonthDayToggle(day)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                                            isSelected 
                                            ? 'bg-[#4A00E0] text-white shadow-md' 
                                            : 'text-gray-400 hover:bg-gray-50'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {/* None */}
                    {activeTab === 'none' && (
                        <p className="text-gray-400 font-medium">此習慣不會重複循環</p>
                    )}
                </div>

                <div className="w-full h-px bg-gray-100 my-6" />

                {/* 3. Common Bottom Section */}
                <div className="px-6 space-y-8">
                    {/* Daily Count */}
                    <div className="flex items-center justify-between">
                        <span className="text-gray-800 font-bold text-lg">每日次數</span>
                        <div className="flex items-center gap-4">
                            <button 
                                onMouseDown={() => startPress(-1)}
                                onMouseUp={stopPress}
                                onMouseLeave={stopPress}
                                onTouchStart={() => startPress(-1)}
                                onTouchEnd={stopPress}
                                className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-300 active:scale-90 transition-transform"
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <span className="text-2xl font-bold text-[#4A00E0] w-8 text-center">{dailyCount}</span>
                            <button 
                                onMouseDown={() => startPress(1)}
                                onMouseUp={stopPress}
                                onMouseLeave={stopPress}
                                onTouchStart={() => startPress(1)}
                                onTouchEnd={stopPress}
                                className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-300 active:scale-90 transition-transform"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-200" />

                    {/* End Duration */}
                    {/* End Duration */}
                    <div className="flex justify-between items-center w-full mt-4 px-2">
                       <span className="text-[#2B2D5C] font-bold text-lg">結束時間</span>
                       <div className="w-40"> 
                          <WheelPicker 
                            options={DURATION_OPTIONS}
                            value={endDuration}
                            onChange={setEndDuration}
                          />
                       </div>
                    </div>

                </div>
            </div>
        </div>
        
        <style>{`
            @keyframes slideUp {
                0% { transform: translateY(100%); }
                100% { transform: translateY(0); }
            }
             /* Hide scrollbar for Chrome, Safari and Opera */
            .no-scrollbar::-webkit-scrollbar {
                display: none;
            }
            /* Hide scrollbar for IE, Edge and Firefox */
            .no-scrollbar {
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
            }
        `}</style>
    </div>
  );
};
export default FrequencyModal;
