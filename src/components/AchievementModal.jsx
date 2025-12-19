import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const AchievementModal = ({ isOpen, onClose, score = 0 }) => {
    // Control animation state
    const [isVisible, setIsVisible] = useState(false);
    
    // Local score states for animation
    const [displayScore, setDisplayScore] = useState(score);
    const [targetScore, setTargetScore] = useState(score);
    const [activeTab, setActiveTab] = useState('daily'); // 'daily' or 'special'
    const [claimedMilestones, setClaimedMilestones] = useState([]); // Array of score targets like [200, 600]

    // Sync prop score to target score when modal opens or prop changes
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTargetScore(score);
            // If opening for the first time, start from current score
            if (!isVisible) setDisplayScore(score);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 500); 
            return () => clearTimeout(timer);
        }
    }, [isOpen, score]);

    // Smooth animation logic: displayScore follows targetScore
    useEffect(() => {
        if (!isOpen) return;
        
        if (displayScore < targetScore) {
            const diff = targetScore - displayScore;
            const step = Math.max(1, Math.ceil(diff / 15)); // Adjust speed here
            const timer = setTimeout(() => {
                setDisplayScore(prev => Math.min(prev + step, targetScore));
            }, 20); // 50fps approximate
            return () => clearTimeout(timer);
        } else if (displayScore > targetScore) {
            // Optional: handle score reduction
            setDisplayScore(targetScore);
        }
    }, [displayScore, targetScore, isOpen]);

    // Handle Claim (Simulation)
    const handleClaim = (rewardPoints) => {
        setTargetScore(prev => prev + rewardPoints);
    };

    const handleClaimMilestone = (milestoneScore) => {
        if (!claimedMilestones.includes(milestoneScore)) {
            setClaimedMilestones(prev => [...prev, milestoneScore]);
            // Logic for claiming milestone rewards
            console.log(`Earned milestone reward for ${milestoneScore} points!`);
        }
    };

    if (!isOpen && !isVisible) return null;

    // Milestone Logic
    // Milestone Configuration: Points mapped to visual percentage positions
    const MILESTONES = [
        { score: 200, pos: 33.333 },
        { score: 600, pos: 66.666 },
        { score: 1000, pos: 100 }
    ];

    // Piecewise Linear Interpolation to align progress fill with milestones
    const calculateProgressPercent = (val) => {
        if (val <= 0) return 0;
        if (val <= MILESTONES[0].score) 
            return (val / MILESTONES[0].score) * MILESTONES[0].pos;
        if (val <= MILESTONES[1].score) 
            return MILESTONES[0].pos + ((val - MILESTONES[0].score) / (MILESTONES[1].score - MILESTONES[0].score)) * (MILESTONES[1].pos - MILESTONES[0].pos);
        if (val <= MILESTONES[2].score) 
            return MILESTONES[1].pos + ((val - MILESTONES[1].score) / (MILESTONES[2].score - MILESTONES[1].score)) * (MILESTONES[2].pos - MILESTONES[1].pos);
        return 100;
    };
    const progressPercent = calculateProgressPercent(displayScore);

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
        <div
            className={`fixed inset-0 z-[1000] flex items-center justify-center pt-10 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* 2. Modal Body */}
            <div
                className={`relative w-[90%] max-w-md min-h-[600px] h-auto max-h-[85vh] rounded-[2rem] shadow-2xl transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) flex flex-col ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-[20%] scale-95'}`}
            >
                {/* Background (Whole card is white/light, but header is dark) */}
                <div className="absolute inset-0 bg-white" />
                
                {/* 1. Header Section with Image Background */}
                <div 
                    className="relative z-10 pt-14 pb-8 px-6 flex flex-col items-center bg-cover bg-top overflow-hidden"
                    style={{ backgroundImage: "url('/images/Starlight-background-2.png')" }}
                >
                    {/* Dark Overlay to ensure content readability */}
                    <div className="absolute inset-0 bg-[#001D6E]/40" />
                    {/* Header Title & Close */}
                    <div className="w-full flex justify-center items-center mb-10 relative">
                        <h2 className="text-2xl font-black text-white tracking-widest">成就任務</h2>
                        <button
                            onClick={onClose}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90"
                        >
                            <X className="w-6 h-6 text-[#001D6E]" strokeWidth={3} />
                        </button>
                    </div>

                    {/* Milestone Progress Bar: Centered horizontally */}
                    <div className="w-full px-8 mb-12">
                        <div className="relative h-20 flex items-center mb-10">
                            {/* Updated Track: Using ring instead of border to ensure pixel-perfect internal alignment */}
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-7 bg-[#3E4166] rounded-lg ring-1 ring-inset ring-white/35 shadow-[0_2px_6px_rgba(0,0,0,0.25),inset_0_4px_4px_rgba(0,0,0,0.4)] overflow-hidden">
                                {/* Vertical Milestone Dividers ('直線') synchronized with shared MILESTONES positions */}
                                {MILESTONES.slice(0, 2).map((m) => (
                                    <div 
                                        key={`divider-${m.score}`}
                                        className="absolute h-full w-[1.5px] bg-white/30 z-20" 
                                        style={{ left: `${m.pos}%`, transform: 'translateX(-50%)' }} 
                                    />
                                ))}

                                {/* Specified Gradient Fill */}
                                {progressPercent > 0 && (
                                    <div 
                                        className="h-full transition-all duration-1000 ease-out relative rounded-l-[4px] z-10"
                                        style={{ 
                                            width: `${progressPercent}%`,
                                            background: 'linear-gradient(90deg, #6B5CFF 0%, #8A6CFF 40%, #FFD76A 100%)'
                                        }}
                                    >
                                        {/* Top Highlight line (Subtle shine) */}
                                        <div className="absolute top-0 left-0 right-0 h-[35%] bg-white/30 rounded-t-[4px]" />
                                        
                                        {/* Bottom Shadow within the fill */}
                                        <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-black/20" />
                                        
                                        {/* Right edge shadow for depth */}
                                        <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-black/20" />
                                    </div>
                                )}
                            </div>

                            {/* Milestones (Gifts) centered on dividers */}
                            {MILESTONES.map((m) => {
                                const isReached = displayScore >= m.score;
                                const isClaimed = claimedMilestones.includes(m.score);
                                const canClaim = isReached && !isClaimed;
                                
                                return (
                                    <div 
                                        key={m.score} 
                                        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-300 ${canClaim ? 'cursor-pointer active:scale-95 pointer-events-auto' : 'pointer-events-none'}`}
                                        style={{ left: `${m.pos}%` }}
                                        onClick={() => canClaim && handleClaimMilestone(m.score)}
                                    >
                                        {/* Gift Icon: Smaller and sitting closer on top of the bar */}
                                        <div 
                                            className={`w-12 h-12 flex items-center justify-center relative z-20 transition-all duration-500 ${canClaim ? 'animate-gift-shake' : ''}`}
                                            style={{ transform: 'translateY(-36px)' }}
                                        >
                                            <img 
                                                src="/images/icon-gift.png" 
                                                alt="Gift" 
                                                className={`w-full h-full object-contain transition-all duration-500 drop-shadow-md ${
                                                    isReached ? (isClaimed ? 'brightness-75 grayscale-[30%]' : 'brightness-110 saturate-[1.2]') : 'grayscale opacity-90'
                                                }`}
                                            />
                                            
                                            {/* Claimed overlay: Checkmark icon */}
                                            {isClaimed && (
                                                <div className="absolute inset-x-0 -top-2 flex justify-center">
                                                    <div className="bg-green-500 rounded-full p-0.5 border-2 border-white shadow-md select-none">
                                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Glow effect for reached gifts */}
                                            {isReached && !isClaimed && (
                                                <div className="absolute inset-0 bg-yellow-400/40 blur-xl rounded-full -z-10 animate-gift-glow" />
                                            )}
                                        </div>

                                        {/* Value Label: Bold, white, and closer to the bottom of the bar */}
                                        <div 
                                            className={`text-[14px] font-black tracking-wider whitespace-nowrap transition-colors duration-500 ${
                                                isReached ? (isClaimed ? 'text-white/50' : 'text-white') : 'text-white/80'
                                            }`}
                                            style={{ transform: 'translateY(18px)' }}
                                        >
                                            {m.score}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tabs (Integrated into Header) */}
                    <div className="absolute bottom-0 left-0 w-full flex px-4">
                        <button 
                            onClick={() => setActiveTab('daily')}
                            className={`flex-1 py-3 text-center rounded-t-2xl font-bold transition-all ${
                                activeTab === 'daily' 
                                ? 'bg-[#C5C3E3] text-[#001D6E] text-lg' 
                                : 'bg-white/20 text-white/60 text-sm hover:bg-white/30'
                            }`}
                        >
                            每日
                        </button>
                        <button 
                            onClick={() => setActiveTab('special')}
                            className={`flex-1 py-3 text-center rounded-t-2xl font-bold transition-all ${
                                activeTab === 'special' 
                                ? 'bg-[#C5C3E3] text-[#001D6E] text-lg' 
                                : 'bg-white/20 text-white/60 text-sm hover:bg-white/30'
                            }`}
                        >
                            特殊
                        </button>
                    </div>
                </div>

                {/* Task List (Scrollable Area) */}
                <div className="flex-1 bg-[#C5C3E3] px-6 py-8 space-y-4 overflow-y-auto no-scrollbar relative z-10 pb-20">
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
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
                @keyframes heartbeat {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(70, 0, 161, 0.7); }
                    14% { transform: scale(1.1); box-shadow: 0 0 20px 5px rgba(70, 0, 161, 0.4); }
                    28% { transform: scale(1); box-shadow: 0 0 0 0 rgba(70, 0, 161, 0.7); }
                    42% { transform: scale(1.1); box-shadow: 0 0 20px 5px rgba(70, 0, 161, 0.4); }
                    70% { transform: scale(1); box-shadow: 0 0 0 0 rgba(70, 0, 161, 0); }
                }
                .animate-heartbeat {
                    animation: heartbeat 2.5s infinite cubic-bezier(0.21, 0.53, 0.56, 0.8);
                }
                @keyframes gift-shake {
                    0%, 100% { transform: translateY(-36px) rotate(0deg); }
                    20% { transform: translateY(-36px) rotate(-8deg); }
                    40% { transform: translateY(-36px) rotate(8deg); }
                    60% { transform: translateY(-36px) rotate(-4deg); }
                    80% { transform: translateY(-36px) rotate(4deg); }
                }
                .animate-gift-shake {
                    animation: gift-shake 0.6s ease-in-out infinite;
                }
                @keyframes gift-glow {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                .animate-gift-glow {
                    animation: gift-glow 1.5s infinite ease-in-out;
                }
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
    
    const isCompleted = current >= target;
    const canClaim = isCompleted && !claimed;

    return (
        <div className="bg-gray-50 rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between shrink-0 hover:shadow-md transition-shadow">
            <div className="flex-1">
                <h3 className="text-gray-700 font-bold text-base mb-4">{title}</h3>
                
                {/* Simple Progress Bar */}
                <div className="w-[90%] h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[#4600A1] rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min((current / target) * 100, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-400">{current}/{target}</p>
                </div>
            </div>

            <div className="ml-4 mr-4 flex flex-col items-center gap-3 min-w-[90px]">
                <div className="w-full flex items-center justify-center text-base font-bold text-gray-500 bg-yellow-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
                    <img src={image} className="w-7 h-7 mr-1.5" alt="R" />
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
                    className={`text-sm px-4 py-2 rounded-full font-bold transition-all w-full whitespace-nowrap ${
                        canClaim 
                        ? 'bg-[#4600A1] text-white shadow-[0_0_15px_rgba(70,0,161,0.5)] animate-heartbeat cursor-pointer' 
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
