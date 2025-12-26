import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import FrequencyModal from './FrequencyModal';
import ReminderModal from './ReminderModal';
import IconSelectionModal from './IconSelectionModal';

// 1. 這裡補上了 isOpen，讓 App.js 可以控制開關
import { useEffect } from 'react'; // Import useEffect

const AddHabitModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [habitName, setHabitName] = useState('');
    const [isFreqModalOpen, setIsFreqModalOpen] = useState(false);
    const [isRemindModalOpen, setIsRemindModalOpen] = useState(false);
    const [frequencyLabel, setFrequencyLabel] = useState("1次, 每天");
    const [reminderTime, setReminderTime] = useState("每日 13:35");
    const [isIconModalOpen, setIsIconModalOpen] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState('icon-plant');

    // 2. Pre-fill logic when initialData changes or modal opens
    useEffect(() => {
        if (initialData) {
            setHabitName(initialData.title || '');
            setFrequencyLabel(initialData.frequency || '1次, 每天');
            setReminderTime(initialData.reminder || '每日 13:35');
            setSelectedIcon(initialData.icon || 'icon-plant');
        } else {
            // Reset to defaults if adding new
            setHabitName('');
            setFrequencyLabel('1次, 每天');
            setReminderTime('每日 13:35');
            setSelectedIcon('icon-plant');
        }
    }, [initialData, isOpen]);

    // 2. 這是防呆機制：如果沒打開，就什麼都不渲染 (避免擋住畫面)
    if (!isOpen) return null;

    const handleSave = () => {
        if (!habitName.trim()) return;
        
        onSave({
            title: habitName,
            frequency: frequencyLabel,
            reminder: reminderTime,
            icon: selectedIcon
        });

        // Reset states (already handled by useEffect, but good for safety)
        if (!initialData) {
            setHabitName('');
            setFrequencyLabel('1次, 每天');
            setReminderTime('每日 13:35');
            setSelectedIcon('icon-plant');
        }
    };
    return (
        <>
        <div className="absolute inset-0 z-[110] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div 
                className="bg-[#BCC6CC] w-full max-w-md h-[90vh] rounded-t-[2rem] rounded-b-none flex flex-col shadow-2xl overflow-hidden relative animate-[slideUp_0.3s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 pt-6 pb-4">
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-[#A78BFA] transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <button 
                        onClick={handleSave}
                        className="text-white/80 font-extrabold text-lg hover:text-[#A78BFA] transition-colors"
                    >
                        保存
                    </button>
                </div>

                {/* Title */}
                <div className="text-center mt-2">
                    <h2 className="text-white text-2xl font-bold tracking-wide">創造你的星願</h2>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center px-8 mt-10">
                    
                    {/* Icon Selection - Clickable */}
                    <div 
                        className="mb-12 relative cursor-pointer active:scale-95 transition-transform"
                        onClick={() => setIsIconModalOpen(true)}
                    >
                        <img 
                            src={`/images/${selectedIcon}.png`}
                            alt="Habit Icon" 
                            className="w-32 h-32 object-contain drop-shadow-lg" 
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/128x128/E3E7FF/656565?text=Icon';
                            }}
                        />
                        {/* Edit Badge */}
                        <div className="absolute bottom-0 right-0 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/50">
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="w-full mb-12">
                        <input
                            type="text"
                            value={habitName}
                            onChange={(e) => setHabitName(e.target.value)}
                            placeholder="輸入你想實現或培養的習慣"
                            className="w-full bg-transparent border-b-2 border-white/50 py-2 text-center text-gray-900 text-lg placeholder:text-gray-500 focus:outline-none focus:border-white transition-colors"
                            autoFocus
                        />
                    </div>

                    {/* Options Section */}
                    {/* REMOVED px-4 to restore full width */}
                    <div className="w-full space-y-6">
                        
                        {/* Frequency Row - 3D Style */}
                        <div 
                           onClick={() => setIsFreqModalOpen(true)}
                           className="bg-white rounded-2xl p-6 flex justify-between items-center border-[4px] border-[#E2E2E2] shadow-[4px_6px_2px_rgba(79,70,98,0.75)] active:translate-y-[2px] active:shadow-sm transition-all cursor-pointer gap-2"
                        >
                            <span className="font-bold text-gray-700 whitespace-nowrap text-lg">星願頻率</span>
                            <div className="flex-1 flex justify-end items-center text-[#5E009E] font-bold min-w-0 text-lg">
                                <span className="mr-2 text-right break-words leading-tight">{frequencyLabel}</span>
                                <ChevronRight size={24} className="flex-shrink-0 text-gray-400" />
                            </div>
                        </div>

                        {/* Reminder Row - 3D Style */}
                        <div 
                           onClick={() => setIsRemindModalOpen(true)}
                           className="bg-white rounded-2xl p-6 flex justify-between items-center border-[4px] border-[#E2E2E2] shadow-[4px_6px_2px_rgba(79,70,98,0.75)] active:translate-y-[2px] active:shadow-sm transition-all cursor-pointer gap-2"
                        >
                            <span className="font-bold text-gray-700 whitespace-nowrap text-lg">定時提醒</span>
                            <div className="flex-1 flex justify-end items-center text-[#5E009E] font-bold min-w-0 text-lg">
                                <span className="mr-2 text-right break-words leading-tight">{reminderTime}</span>
                                <ChevronRight size={24} className="flex-shrink-0 text-gray-400" />
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
            `}</style>
        </div>

        {/* 4. Render Nested Modal */}
        <FrequencyModal 
            isOpen={isFreqModalOpen}
            onClose={() => setIsFreqModalOpen(false)}
            onSave={(label) => setFrequencyLabel(label)}
        />
        
        <ReminderModal 
            isOpen={isRemindModalOpen} 
            onClose={() => setIsRemindModalOpen(false)}
            onSave={(time) => setReminderTime(time)}
            initialTime={reminderTime}
        />

        <IconSelectionModal 
            isOpen={isIconModalOpen}
            onClose={() => setIsIconModalOpen(false)}
            onSelect={(icon) => setSelectedIcon(icon)}
            currentIcon={selectedIcon}
        />
    </>
    );
};

export default AddHabitModal;
