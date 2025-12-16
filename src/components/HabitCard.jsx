import React, { useState, useRef } from 'react';
import { Check, Edit2, Trash2 } from 'lucide-react';

const HabitCard = ({ habit, activeSwipeId, onSwipe, onToggle, onEdit, onDelete, onClick }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // 🛡️ Safety
  if (!habit) return null;

  // Derived State
  const isSwiped = activeSwipeId === habit.id;

  // Swipe Handlers (Unified)
  const handleSwipeStart = (clientX) => {
    setTouchEnd(null);
    setTouchStart(clientX);
    setIsDragging(true);
    // Notify parent to set this as the active swipe potential
    // We don't set it yet, we wait for swipe-left gesture
  };
  
  const handleSwipeMove = (clientX) => {
    if (isDragging || touchStart) { 
        setTouchEnd(clientX);
    }
  };

  const handleSwipeEnd = () => {
    setIsDragging(false);
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
        onSwipe(habit.id); // Open this one (closes others)
    }
    if (isRightSwipe) {
        if (isSwiped) onSwipe(null); // Close only if it's this one
    }
    
    // Reset
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="relative mb-3 h-24 select-none"> {/* Container - No Overflow Hidden so shadow shows? No, need hidden for buttons? */}
        {/* Buttons need to be visible when card moves. 
            If overflow-hidden, and buttons are at right, moving card changes nothing if card is z-10?
            Wait, buttons are BEHIND. 
            If I move card left, buttons are revealed. 
            So overflow-hidden on the CONTAINER is okay if buttons are INSIDE the container. 
        */}
      
      {/* 1. Background Action Buttons (Stationary, Z-0) */}
      <div className="absolute inset-y-0 right-0 w-[120px] flex items-center justify-end gap-2 pr-2 z-0">
         {/* Edit */}
         <button 
           onClick={(e) => { e.stopPropagation(); onEdit(habit); onSwipe(null); }}
           className="h-20 w-16 bg-white rounded-2xl flex flex-col items-center justify-center text-gray-700 shadow-sm border border-gray-100 active:scale-95 transition-all cursor-pointer"
         >
           <Edit2 size={20} />
           <span className="font-bold text-xs mt-1">編輯</span>
         </button>

         {/* Delete */}
         <button 
           onClick={(e) => { e.stopPropagation(); onDelete(habit.id); }}
           className="h-20 w-16 bg-[#EF5350] rounded-2xl flex flex-col items-center justify-center text-white shadow-sm active:scale-95 transition-all cursor-pointer"
         >
           <Trash2 size={20} />
           <span className="font-bold text-xs mt-1">刪除</span>
         </button>
      </div>

      {/* 2. Main Card Content (The Lid - Z-10) */}
      <div 
        className={`relative z-10 bg-[#E3E7FF] rounded-2xl p-4 h-full flex items-center justify-between transition-transform duration-300 ease-out border border-white cursor-grab active:cursor-grabbing w-full`}
        style={{
             transform: isSwiped ? 'translateX(-130px)' : 'translateX(0)',
             boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1), inset 0px 4px 4px rgba(255, 255, 255, 0.4)'
        }}
        onClick={onClick}
        
        // Touch Config
        onTouchStart={(e) => handleSwipeStart(e.targetTouches[0].clientX)}
        onTouchMove={(e) => handleSwipeMove(e.targetTouches[0].clientX)}
        onTouchEnd={handleSwipeEnd}

        // Mouse Config
        onMouseDown={(e) => handleSwipeStart(e.clientX)}
        onMouseMove={(e) => isDragging && handleSwipeMove(e.clientX)}
        onMouseUp={handleSwipeEnd}
        onMouseLeave={handleSwipeEnd}
      >
        
        {/* Left: Icon & Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0 pointer-events-none">
            {/* Icon */}
            <img 
                  src={`/images/${habit.icon || 'icon-plant'}.png`} 
                  alt="icon"
                  className="w-12 h-12 object-contain drop-shadow-sm flex-shrink-0"
                  onError={(e) => { 
                      e.target.style.display='none'; 
                  }}
            />
            {/* Title */}
            <h3 className={`font-bold text-[#2B2D5C] text-lg truncate ${habit.completed ? 'line-through text-gray-400' : ''}`}>
              {habit.title}
            </h3>
        </div>

        {/* Right Section: Fire Icon + Checkbox */}
        <div className="flex items-center gap-3">
            
            {/* Reward Badge */}
            <div className="flex items-center gap-1 pointer-events-none">
                <img src="/images/icon-flame.png" alt="XP" className="w-4 h-4 object-contain" />
                <span className="text-sm font-bold text-orange-500">
                    {habit.reward || 5}
                </span>
            </div>

            {/* Checkbox Toggle */}
            <div 
                onClick={(e) => {
                    e.stopPropagation(); // Prevent opening detail modal
                    onToggle(habit.id);
                }}
                className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                    habit.completed 
                    ? 'bg-[#6B4EFF] border-[#6B4EFF]' 
                    : 'bg-transparent border-[#8F9BB3] hover:border-[#6B4EFF]'
                }`}
            >
                {habit.completed && <Check size={20} className="text-white" strokeWidth={3} />}
            </div>

        </div>

      </div>
    </div>
  );
};

export default HabitCard;
