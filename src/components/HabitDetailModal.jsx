import React from 'react';
import { X } from 'lucide-react';

const HabitDetailModal = ({ habit, onClose, onEdit }) => {
    if (!habit) return null;

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]" onClick={onClose}>
            <div 
                className="bg-[#FFFFF0] w-full max-w-[320px] rounded-[32px] p-6 relative shadow-2xl scale-100 animate-[popIn_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-[#E8E8E8] flex items-center justify-center hover:bg-[#d8d8d8] transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" strokeWidth={1.5} />
                    </button>
                    <button 
                        onClick={() => onEdit(habit)}
                        className="text-lg font-bold text-gray-400 hover:text-[#A78BFA] transition-colors"
                    >
                        編輯
                    </button>
                </div>

                {/* Main Icon */}
                <div className="flex justify-center mb-10 relative">
                    <img 
                        src={`/images/${habit?.icon || 'icon-plant'}.png`} 
                        alt="Habit Icon"
                        className="w-28 h-28 object-contain drop-shadow-md"
                        onError={(e) => {
                            e.target.style.display = 'none'; // Hide if broken
                        }}
                    />
                </div>

                {/* Divider */}
                <div className="w-full h-[2px] bg-[#E8E8E8] mb-6" />

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap- text-center">
                    {/* Streak */}
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-black">經歷天數</span>
                        <span className="text-xl font-black text-black">第20天</span>
                    </div>

                    {/* Count */}
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-black">完成次數</span>
                        <span className="text-xl font-black text-black">6次</span>
                    </div>

                    {/* Time */}
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-bold text-black">時間</span>
                        <span className="text-xl font-black text-black">永久</span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes popIn {
                    0% { transform: scale(0.9); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default HabitDetailModal;
