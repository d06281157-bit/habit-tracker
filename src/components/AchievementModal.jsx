import React, { useEffect, useState } from 'react';

const AchievementModal = ({ isOpen, onClose, score = 0 }) => {
    // Control animation state
    const [isVisible, setIsVisible] = useState(false);
    
    // Local demo score to allow "Claim" to visually update the bar immediately
    const [displayScore, setDisplayScore] = useState(score);
    const [activeTab, setActiveTab] = useState('daily'); // 'daily' or 'special'

    // Sync prop score to display score when modal opens or score changes
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setDisplayScore(score);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 500); 
            return () => clearTimeout(timer);
        }
    }, [isOpen, score]);

    // Handle Claim (Simulation)
    const handleClaim = (rewardPoints) => {
        const newScore = displayScore + rewardPoints;
        setDisplayScore(newScore);
         // Visual feedback only for this demo
    };

    if (!isOpen && !isVisible) return null;

    // Milestone Logic
    const MAX_SCORE = 1000;
    const progressPercent = Math.min((displayScore / MAX_SCORE) * 100, 100);

    const getStarStatus = (target) => displayScore >= target ? 'saturate-100 opacity-100 scale-110' : 'saturate-0 opacity-50 scale-100';

    // Mock Data
    const dailyTasks = [
        { id: 1, title: "專注時間達到 30 分鐘", current: 0, target: 1, reward: 50 },
        { id: 2, title: "完成 3 個星願", current: Math.min(Math.floor(displayScore/100), 3), target: 3, reward: 100 }, // Mock progress
        { id: 3, title: "連續登入 3 天", current: 1, target: 3, reward: 150 },
    ];

    const specialTasks = [
        { id: 4, title: "解鎖第一顆寵物蛋", current: 1, target: 1, reward: 500, claimed: false },
        { id: 5, title: "收集 5 個外星人", current: 2, target: 5, reward: 1000, claimed: false },
        { id: 6, title: "可以領取的測試任務", current: 1, target: 1, reward: 200, claimed: false },
    ];

    const currentTasks = activeTab === 'daily' ? dailyTasks : specialTasks;

    return (
        // 1. Backdrop
        <div
            className={`fixed inset-0 z-[1000] flex items-center justify-center pt-10 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* 2. Modal Body */}
            <div
                className={`relative w-[90%] max-w-md min-h-[600px] h-auto max-h-[85vh] rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) flex flex-col ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-[20%] scale-95'}`}
            >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#A6C0FE] to-[#F68084]" />
                
                {/* Header */}
                <div className="relative z-10 p-6 flex items-center justify-between text-white">
                    <div className="w-8" />
                    <h2 className="text-2xl font-extrabold tracking-widest drop-shadow-md">成就任務</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition backdrop-blur-md"
                    >
                        ✕
                    </button>
                </div>

                {/* Goal Board Progress Bar */}
                <div className="relative z-10 w-full px-6 py-4">
                    <div className="bg-black/20 rounded-3xl p-6 backdrop-blur-sm border border-white/10">
                        {/* Flex Container for Nodes */}
                        <div className="relative flex justify-between items-center px-4">
                            
                            {/* Background Track */}
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 bg-black/40 rounded-full mx-8" />
                            
                            {/* Active Fill (Calculated) */}
                             <div 
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full transition-all duration-1000 mx-8"
                                style={{ width: `calc(${Math.max(0, Math.min(progressPercent, 100))}% - 64px)` }} 
                                // Simplified math to account for padding roughly.
                            />

                            {/* Nodes mapped via Flex */}
                            {[200, 600, 1000].map((target) => {
                                const isReached = displayScore >= target;
                                return (
                                    <div key={target} className="relative z-10 flex flex-col items-center">
                                        {/* Node Capsule */}
                                        <div 
                                            className={`min-w-[60px] h-[32px] px-3 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
                                                isReached 
                                                ? 'bg-[#7C5CFF] scale-110' // Purple for Achieved
                                                : 'bg-[#CBD5E1]'            // Gray for Unachieved
                                            }`}
                                        >
                                            {/* White Checkmark Icon (Always visible but color changes effectively if needed, but styling says white checkmark always) */}
                                            <svg 
                                                width="16" 
                                                height="16" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                stroke="white" 
                                                strokeWidth="3" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        
                                        {/* Label */}
                                        <div className="mt-2 text-xs font-bold text-white/90 drop-shadow-md bg-black/30 px-2 py-0.5 rounded-full">
                                            {target} exp
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="text-center mt-6 text-white font-bold text-sm">
                            當前積分: <span className="text-[#FFD700] text-lg">{displayScore}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-4 px-6 flex items-end relative z-10">
                    <button 
                        onClick={() => setActiveTab('daily')}
                        className={`flex-1 py-3 text-center rounded-t-2xl font-bold transition-all relative z-20 ${
                            activeTab === 'daily' 
                            ? 'bg-white text-[#F68084] text-lg shadow-[0_-4px_10px_rgba(0,0,0,0.1)]' 
                            : 'bg-white/50 text-white/80 text-sm hover:bg-white/70'
                        }`}
                    >
                        每日任務
                    </button>
                    <button 
                        onClick={() => setActiveTab('special')}
                        className={`flex-1 py-3 text-center rounded-t-2xl font-bold transition-all relative z-20 ${
                            activeTab === 'special' 
                            ? 'bg-white text-[#F68084] text-lg shadow-[0_-4px_10px_rgba(0,0,0,0.1)]' 
                            : 'bg-white/50 text-white/80 text-sm hover:bg-white/70'
                        }`}
                    >
                        特殊挑戰
                    </button>
                </div>

                {/* Task List */}
                <div className="flex-1 bg-white px-6 py-6 space-y-4 overflow-y-auto relative z-10 pb-10">
                    {currentTasks.map(task => (
                        <TaskCard 
                            key={task.id}
                            title={task.title} 
                            current={task.current}
                            target={task.target}
                            reward={task.reward} 
                            image="/images/icon-star.png"
                            onClaim={() => handleClaim(task.reward)}
                        />
                    ))}
                    {currentTasks.length === 0 && (
                        <div className="text-center text-gray-400 py-10">
                            暫無任務
                        </div>
                    )}
                </div>
            </div>
            
             <style>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1.1); filter: brightness(1.2); }
                    50% { transform: scale(1); filter: brightness(1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 2s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

const TaskCard = ({ title, current, target, reward, image, onClaim }) => {
    const [claimed, setClaimed] = useState(false);
    
    // Logic: Active ONLY if Complete AND Not Claimed
    // Mock fix: if claimed, mark as claimed. In real app, check 'task.claimed' from props.
    // For this UI demo, we use local state 'claimed' when button is clicked.
    const isCompleted = current >= target;
    const canClaim = isCompleted && !claimed;

    return (
        <div className="bg-gray-50 rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between shrink-0 hover:shadow-md transition-shadow">
            <div className="flex-1">
                <h3 className="text-gray-700 font-bold text-sm mb-2">{title}</h3>
                
                {/* Simple Progress Bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[#F68084] rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min((current / target) * 100, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-400">{current}/{target}</p>
                </div>
            </div>

            <div className="ml-4 flex flex-col items-end gap-2 min-w-[80px]">
                <div className="flex items-center text-xs font-bold text-gray-500 bg-yellow-100 px-2 py-1 rounded-lg">
                    <img src={image} className="w-4 h-4 mr-1" alt="R" />
                    <span>+{reward}</span>
                </div>
                
                <button 
                    onClick={() => {
                        if (canClaim) {
                            setClaimed(true);
                            onClaim();
                        }
                    }}
                    disabled={!canClaim}
                    className={`text-xs px-4 py-1.5 rounded-full font-bold transition-all ${
                        canClaim 
                        ? 'bg-[#FF8FAB] text-white shadow-md active:scale-95 hover:bg-[#ff9a9e] cursor-pointer' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {claimed ? '已領取' : isCompleted ? '領取' : '未完成'}
                </button>
            </div>
        </div>
    );
};

export default AchievementModal;
