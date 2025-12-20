import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const AchievementModal = ({ 
    isOpen, 
    onClose, 
    score = 0, 
    goldScore = 0, 
    completedHabitsCount = 0,
    claimedMilestones = [], 
    onClaimMilestone,
    claimedTaskIds = [],
    onClaimTask,
    onReset
}) => {
    // Control animation state
    const [isVisible, setIsVisible] = useState(false);
    
    // Local score states for animation
    const [displayScore, setDisplayScore] = useState(score);
    const [targetScore, setTargetScore] = useState(score);
    const [displayGoldScore, setDisplayGoldScore] = useState(goldScore);
    const [targetGoldScore, setTargetGoldScore] = useState(goldScore);
    const [activeTab, setActiveTab] = useState('daily'); // 'daily' or 'special'
    
    // Reward animation states
    const [popups, setPopups] = useState([]); // { id, x, y, value, type }
    const [isScorePulsing, setIsScorePulsing] = useState(false);
    const [showScoreBadge, setShowScoreBadge] = useState(false);
    const [isGoldPulsing, setIsGoldPulsing] = useState(false);
    const [showGoldBadge, setShowGoldBadge] = useState(false);

    // Sync prop score to target score when modal opens or prop changes
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTargetScore(score);
            setTargetGoldScore(goldScore);
            if (!isVisible) {
                setDisplayScore(score);
                setDisplayGoldScore(goldScore);
            }
        } else {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setShowScoreBadge(false);
                setShowGoldBadge(false);
            }, 500); 
            return () => clearTimeout(timer);
        }
    }, [isOpen, score, goldScore, isVisible]);

    // Smooth animation logic: displayScore follows targetScore
    useEffect(() => {
        if (!isOpen) return;
        
        if (displayScore < targetScore) {
            setShowScoreBadge(true);
            const diff = targetScore - displayScore;
            if (!isScorePulsing) {
                setIsScorePulsing(true);
                setTimeout(() => setIsScorePulsing(false), 200);
            }
            
            const step = Math.max(1, Math.ceil(diff / 15)); 
            const timer = setTimeout(() => {
                setDisplayScore(prev => Math.min(prev + step, targetScore));
            }, 20); 
            return () => clearTimeout(timer);
        } else if (displayScore > targetScore) {
            setDisplayScore(targetScore);
        } else {
            const timer = setTimeout(() => {
                if (displayScore === targetScore) setShowScoreBadge(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [displayScore, targetScore, isOpen, isScorePulsing]);

    // Animate gold score changes
    useEffect(() => {
        if (!isOpen) return;
        
        if (displayGoldScore < targetGoldScore) {
            setShowGoldBadge(true);
            const diff = targetGoldScore - displayGoldScore;
            if (!isGoldPulsing) {
                setIsGoldPulsing(true);
                setTimeout(() => setIsGoldPulsing(false), 200);
            }
            
            const step = Math.max(1, Math.ceil(diff / 15)); 
            const timer = setTimeout(() => {
                setDisplayGoldScore(prev => Math.min(prev + step, targetGoldScore));
            }, 20); 
            return () => clearTimeout(timer);
        } else if (displayGoldScore > targetGoldScore) {
            setDisplayGoldScore(targetGoldScore);
        } else if (displayGoldScore === targetGoldScore && targetGoldScore > 0) {
            const timer = setTimeout(() => setShowGoldBadge(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [displayGoldScore, targetGoldScore, isOpen, isGoldPulsing]);

    // Effect Trigger Helper for stars/gold
    const triggerRewardEffect = (value, type = 'star') => {
        const id = Date.now() + Math.random();
        setPopups(prev => [...prev, { id, x: '50%', y: '35%', value, type }]);
        
        if (type === 'star') {
            setShowScoreBadge(true);
            setIsScorePulsing(true);
            setTimeout(() => setIsScorePulsing(false), 600);
        } else if (type === 'gold') {
            setShowGoldBadge(true);
            setIsGoldPulsing(true);
            setTimeout(() => setIsGoldPulsing(false), 600);
        }
        
        setTimeout(() => {
            setPopups(prev => prev.filter(p => p.id !== id));
        }, 1000);
    };

    // Handle Claim (Task Cards)
    const handleClaim = (taskId, rewardPoints) => {
        if (onClaimTask) onClaimTask(taskId, rewardPoints);
        triggerRewardEffect(rewardPoints, 'star'); 
    };

    // Handle Claim (Milestones)
    const handleClaimMilestone = (milestoneScore) => {
        const isReached = displayScore >= milestoneScore;
        const isAlreadyClaimed = claimedMilestones.includes(milestoneScore);

        if (isReached && !isAlreadyClaimed) {
            const milestoneReward = milestoneScore > 600 ? 500 : milestoneScore > 200 ? 300 : 200;
            if (onClaimMilestone) onClaimMilestone(milestoneScore, milestoneReward);
            triggerRewardEffect(milestoneReward, 'gold');
        }
    };

    if (!isOpen && !isVisible) return null;

    // Milestone Logic
    const MILESTONES = [
        { score: 200, pos: 33.333 },
        { score: 600, pos: 66.666 },
        { score: 1000, pos: 100 }
    ];

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

    // Standardized Tasks
    const dailyTasks = [
        { id: 1, title: "專注時間達到 30 分鐘", current: 0, target: 1, reward: 100 },
        { id: 2, title: "完成 3 個星願", current: Math.min(completedHabitsCount, 3), target: 3, reward: 100 },
        { id: 3, title: "連續登入 3 天", current: 1, target: 3, reward: 100 },
    ];

    const specialTasks = [
        { id: 4, title: "解鎖第一顆寵物蛋", current: 1, target: 1, reward: 200 },
        { id: 5, title: "收集 5 個外星人", current: 2, target: 5, reward: 200 },
        { id: 6, title: "完成進階資料設定", current: 1, target: 1, reward: 200 },
        { id: 7, title: "首次分享養成心得", current: 1, target: 1, reward: 200 },
        { id: 8, title: "探索 3 個神祕星球", current: 2, target: 3, reward: 200 },
        { id: 9, title: "在商店兌換 1 個物品", current: 1, target: 1, reward: 200 },
        { id: 10, title: "達成 10 次完美專注", current: 1, target: 1, reward: 200 },
    ];

    const currentTasks = activeTab === 'daily' ? dailyTasks : specialTasks;

    return (
        <div
            className={`fixed inset-0 z-[1000] flex items-center justify-center pt-10 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* 2. Modal Body */}
            <div
                className={`relative w-[90%] max-w-md min-h-[720px] h-auto max-h-[90vh] rounded-[2rem] shadow-2xl transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) flex flex-col overflow-hidden ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-[20%] scale-95'}`}
            >
                {/* Background */}
                <div className="absolute inset-0 bg-white" />
                
                {/* 1. Header Section */}
                <div 
                    className="relative z-10 pt-20 pb-8 px-6 flex flex-col items-center bg-cover bg-top overflow-visible"
                    style={{ backgroundImage: "url('/images/Starlight-background-2.png')" }}
                >
                    <div className="absolute inset-0 bg-[#001D6E]/40" />
                    
                    {/* Top Row: Score Badges (Left) and Close Button (Right) */}
                    <div className="absolute top-4 left-0 right-0 px-6 flex flex-row justify-between items-start z-[200]">
                        <div className="flex flex-col gap-2 -translate-x-2">
                            {/* Star Score Badge */}
                            <div 
                                className={`flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 shadow-lg border border-white/40 transition-all duration-500 ease-out ${
                                    showScoreBadge 
                                    ? 'opacity-100 translate-y-0 scale-100' 
                                    : 'opacity-0 -translate-y-4 scale-75 pointer-events-none'
                                } ${isScorePulsing ? 'scale-110 border-yellow-400/60 bg-white/30' : ''}`}
                            >
                                <img src="/images/icon-star.png" alt="Star" className="w-6 h-6 mr-2 drop-shadow-sm" />
                                <span className="text-white font-black text-lg tracking-tight tabular-nums drop-shadow-sm">
                                    {displayScore}
                                </span>
                            </div>

                            {/* Gold Coin Badge */}
                            <div 
                                className={`flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 shadow-lg border border-white/40 transition-all duration-500 ease-out ${
                                    showGoldBadge 
                                    ? 'opacity-100 translate-y-0 scale-100' 
                                    : 'opacity-0 -translate-y-4 scale-75 pointer-events-none'
                                } ${isGoldPulsing ? 'scale-110 border-orange-400/60 bg-white/30' : ''}`}
                            >
                                <img src="/images/icon-gold.png" alt="Gold" className="w-6 h-6 mr-2 drop-shadow-sm" />
                                <span className="text-white font-black text-lg tracking-tight tabular-nums drop-shadow-sm">
                                    {displayGoldScore}
                                </span>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90"
                        >
                            <X className="w-5 h-5 text-[#001D6E]" strokeWidth={3} />
                        </button>
                    </div>

                    {/* Header Title */}
                    <div className="w-full flex justify-center items-center mb-16 relative -mt-8">
                        <h2 className="text-3xl font-black text-white tracking-[0.2em] drop-shadow-lg">成就任務</h2>
                    </div>

                    {/* Milestone Progress Bar */}
                    <div className="w-full px-8 mb-12">
                        <div className="relative h-20 flex items-center mb-10">
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-7 bg-[#3E4166] rounded-lg ring-1 ring-inset ring-white/35 shadow-[0_2px_6px_rgba(0,0,0,0.25),inset_0_4px_4px_rgba(0,0,0,0.4)] overflow-hidden">
                                {MILESTONES.slice(0, 2).map((m) => (
                                    <div 
                                        key={`divider-${m.score}`}
                                        className="absolute h-full w-[1.5px] bg-white/30 z-20" 
                                        style={{ left: `${m.pos}%`, transform: 'translateX(-50%)' }} 
                                    />
                                ))}

                                {/* Fix: Progress bar should stay if score > 0 */}
                                {displayScore > 0 && progressPercent > 0 && (
                                    <div 
                                        className="h-full transition-all duration-1000 ease-out relative rounded-l-[4px] z-10"
                                        style={{ 
                                            width: `${progressPercent}%`,
                                            background: 'linear-gradient(90deg, #6B5CFF 0%, #8A6CFF 40%, #FFD76A 100%)'
                                        }}
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-[35%] bg-white/30 rounded-t-[4px]" />
                                        <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-black/20" />
                                        <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-black/20" />
                                    </div>
                                )}
                            </div>

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
                                            {isClaimed && (
                                                <div className="absolute inset-x-0 -top-2 flex justify-center">
                                                    <div className="bg-yellow-400 rounded-full p-0.5 border-2 border-white shadow-md select-none">
                                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                            {isReached && !isClaimed && (
                                                <div className="absolute inset-0 bg-yellow-400/40 blur-xl rounded-full -z-10 animate-gift-glow" />
                                            )}
                                        </div>
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

                    {/* Tabs */}
                    <div className="absolute bottom-0 left-0 w-full flex px-4">
                        <button 
                            onClick={() => setActiveTab('daily')}
                            className={`flex-1 py-3 text-center rounded-t-2xl font-bold transition-all ${
                                activeTab === 'daily' 
                                ? 'bg-[#C5C3E3] text-[#001D6E] text-lg outline-none' 
                                : 'bg-white/20 text-white/60 text-sm hover:bg-white/30'
                            }`}
                        >
                            每日
                        </button>
                        <button 
                            onClick={() => setActiveTab('special')}
                            className={`flex-1 py-3 text-center rounded-t-2xl font-bold transition-all ${
                                activeTab === 'special' 
                                ? 'bg-[#C5C3E3] text-[#001D6E] text-lg outline-none' 
                                : 'bg-white/20 text-white/60 text-sm hover:bg-white/30'
                            }`}
                        >
                            特殊
                        </button>
                    </div>
                </div>

                {/* Task List */}
                <div className="flex-1 bg-[#C5C3E3] px-6 py-8 space-y-4 overflow-y-auto no-scrollbar relative z-10 pb-20">
                    {currentTasks && currentTasks
                        .slice()
                        .sort((a, b) => {
                            // Sort logic: Incomplete -> Can Claim -> Already Claimed (Bottom)
                            const getPriority = (task) => {
                                if (claimedTaskIds.includes(task.id)) return 3; // Bottom
                                const isCompleted = task.current >= task.target;
                                if (isCompleted) return 1; // Top
                                return 2; // Middle
                            };
                            return getPriority(a) - getPriority(b);
                        })
                        .map(task => (
                            <TaskCard 
                                key={task.id}
                                title={task.title} 
                                current={task.current}
                                target={task.target}
                                reward={task.reward} 
                                image="/images/icon-star.png"
                                isClaimed={claimedTaskIds.includes(task.id)}
                                onClaim={() => handleClaim(task.id, task.reward)}
                            />
                        ))}
                </div>

                {/* Reward Popups Overlay */}
                <div className="absolute inset-0 pointer-events-none z-[100]">
                    {popups.map(p => (
                        <div 
                            key={p.id}
                            className="absolute animate-reward-float text-3xl font-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] flex items-center gap-2 text-[#FFD700]"
                            style={{ 
                                left: p.x, 
                                top: p.y, 
                                filter: `drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))` 
                            }}
                        >
                            <img 
                                src={p.type === 'gold' ? "/images/icon-gold.png" : "/images/icon-star.png"} 
                                className="w-8 h-8 object-contain" 
                                alt="Reward Icon"
                            />
                            +{p.value}
                        </div>
                    ))}
                </div>

                {/* Reset Button (Bottom Left) */}
                {onReset && (
                    <button 
                        onClick={onReset}
                        className="absolute bottom-6 left-6 z-[100] bg-white/40 hover:bg-white/60 text-[#001D6E] text-xs font-black px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md transition-all active:scale-95"
                    >
                        重置進度
                    </button>
                )}
            </div>
            
             <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

                @keyframes gift-shake {
                    0%, 100% { transform: translateY(-36px) rotate(0deg); }
                    20% { transform: translateY(-36px) rotate(-8deg); }
                    40% { transform: translateY(-36px) rotate(8deg); }
                    60% { transform: translateY(-36px) rotate(-4deg); }
                    80% { transform: translateY(-36px) rotate(4deg); }
                }
                .animate-gift-shake { animation: gift-shake 0.6s ease-in-out infinite; }

                @keyframes gift-glow {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                .animate-gift-glow { animation: gift-glow 1.5s infinite ease-in-out; }

                @keyframes reward-float {
                    0% { transform: translate(-50%, 0) scale(0.5); opacity: 0; }
                    20% { transform: translate(-50%, -20px) scale(1.0); opacity: 1; }
                    100% { transform: translate(-50%, -150px) scale(1.4); opacity: 0; }
                }
                .animate-reward-float { animation: reward-float 1s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards; }

                @keyframes heartbeat {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(70, 0, 161, 0.7); }
                    14% { transform: scale(1.1); box-shadow: 0 0 20px 5px rgba(70, 0, 161, 0.4); }
                    28% { transform: scale(1); box-shadow: 0 0 0 0 rgba(70, 0, 161, 0.7); }
                    42% { transform: scale(1.1); box-shadow: 0 0 20px 5px rgba(70, 0, 161, 0.4); }
                    70% { transform: scale(1); box-shadow: 0 0 0 0 rgba(70, 0, 161, 0); }
                }
                .animate-heartbeat { animation: heartbeat 2.5s infinite cubic-bezier(0.21, 0.53, 0.56, 0.8); }
            `}</style>
        </div>
    );
};

const TaskCard = ({ title, current, target, reward, image, isClaimed, onClaim }) => {
    const isCompleted = current >= target;
    const canClaim = isCompleted && !isClaimed;

    return (
        <div className="bg-gray-50 rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between shrink-0 hover:shadow-md transition-shadow">
            <div className="flex-1">
                <h3 className={`font-bold text-base mb-4 transition-all duration-300 ${
                    isClaimed ? 'text-gray-400 line-through italic' : 'text-gray-700'
                }`}>
                    {title}
                </h3>
                <div className="w-[90%] h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                        className="h-full transition-all duration-500 rounded-full" 
                        style={{ 
                            width: `${Math.min((current / target) * 100, 100)}%`,
                            backgroundColor: isClaimed ? '#6F7CFF4D' : '#6F7CFF'
                        }}
                    />
                </div>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-400">{Math.min(current, target)}/{target}</p>
                </div>
            </div>
            <div className="ml-4 mr-2 flex flex-col items-center gap-3 w-24 shrink-0">
                <div className="w-full flex items-center justify-center text-sm font-bold text-gray-600 bg-yellow-100/80 py-2 rounded-xl whitespace-nowrap">
                    <img src={image} className="w-5 h-5 mr-1" alt="R" />
                    <span>+{reward}</span>
                </div>
                
                <button 
                    onClick={() => { if (canClaim) onClaim(); }}
                    disabled={!canClaim}
                    className={`text-sm py-2 rounded-full font-bold transition-all w-full whitespace-nowrap text-center ${
                        canClaim 
                        ? 'bg-[#4E56A6] text-white shadow-[0_0_15px_rgba(78,86,166,0.5)] animate-heartbeat cursor-pointer' 
                        : isClaimed
                        ? 'bg-gray-200 text-gray-400 cursor-default'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {isClaimed ? '已領取' : isCompleted ? '領取' : '未完成'}
                </button>
            </div>
        </div>
    );
};

export default AchievementModal;
