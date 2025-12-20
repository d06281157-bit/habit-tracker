import React, { useState } from 'react';
import { initialAliensData } from '../data/aliensData';


// --- 0. 屬性資料定義 ---
const attributesList = [
    { id: 'all', name: '全部', icon: '/images/icon-attr-all.png' },
    { id: 'grass', name: '草', icon: '/images/icon-attr-grass.png' },
    { id: 'fire', name: '火', icon: '/images/icon-attr-fire.png' },
    { id: 'water', name: '水', icon: '/images/icon-attr-water.png' },
    { id: 'ice', name: '冰', icon: '/images/icon-attr-ice.png' },
    { id: 'ground', name: '地', icon: '/images/icon-attr-ground.png' },
];

// --- 2. AlienCard Component ---
const AlienCard = ({ data, onClick, onUnlock, isInteractive = true, isExpanded = false }) => {
    // 自動取得屬性圖示
    const attrInfo = attributesList.find(a => a.id === data.attribute) || attributesList[0];
    const attributeIcon = attrInfo.icon;

    // 根據屬性動態產生背景色
    const getAttrBg = (attr) => {
        switch(attr) {
            case 'fire': return 'from-[#FFD6D6] to-[#FFE9E9]';
            case 'water': return 'from-[#D6E6FF] to-[#E9F2FF]';
            case 'grass': return 'from-[#D6FFD6] to-[#E9FFE9]';
            case 'ice': return 'from-[#D6F8FF] to-[#E9FBFF]';
            case 'ground': return 'from-[#F5EAD6] to-[#FAF5E9]';
            default: return 'from-[#C0E3E5] to-[#E9F4F5]';
        }
    };

    const containerClass = isExpanded
        ? "w-full max-w-sm aspect-[3/4.5] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden relative"
        : `h-full flex flex-col bg-white rounded-xl shadow-sm overflow-hidden relative ${isInteractive ? 'cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(255,255,255,0.4)]' : ''}`;

    const topSectionHeight = isExpanded ? "h-[60%]" : "h-[62%]";
    const topSectionHeightUnlocked = "h-[66%]";

    const imageSize = isExpanded ? "w-56 h-56" : "w-20 h-20";
    const silhouetteSize = isExpanded ? "w-48 h-48" : "w-20 h-20";

    const titleSize = isExpanded ? "text-2xl" : "text-[10px]";
    const quoteSize = isExpanded ? "text-sm mt-1" : "text-[5px]";
    const labelSize = isExpanded ? "text-base" : "text-[8px]";
    const iconSize = isExpanded ? "w-8 h-8" : "w-4 h-4";
    const starSize = isExpanded ? "w-6 h-6" : "w-2 h-2";
    const heartSize = isExpanded ? "w-5 h-5" : "w-2.5 h-2.5";
    const lockSize = isExpanded ? "w-16 h-16" : "w-7 h-7";

    const contentPadding = isExpanded ? "px-8 py-6 gap-3" : "px-3 pb-2 pt-1 gap-0.5";
    const lockPadding = isExpanded ? "pb-8" : "pb-4";

    // === 樣式 A: 未解鎖 (Locked) ===
    if (data.isLocked) {
        return (
            <div className={containerClass} onClick={onClick}>
                <div className={`${topSectionHeight} m-1 mb-0 rounded-t-[10px] rounded-b-none bg-[#F2F2F2] p-4 pb-2 flex flex-col items-center justify-end relative`}>
                    <img src={data.silhouetteImage} alt="Silhouette" className={`${silhouetteSize} object-contain opacity-100`} />
                </div>
                <div className="w-full px-1 my-0"><div className="w-full border-t border-solid border-[#E9EBE0]"></div></div>
                <div className={`flex-1 bg-white flex flex-col justify-between ${isExpanded ? 'px-6 py-6' : 'px-3 pb-2 pt-1'}`}>
                    <div className={`flex-1 flex items-center justify-center ${lockPadding}`}>
                        <img src="/images/icon-lock.png" alt="Locked" className={`${lockSize} object-contain opacity-100`} />
                    </div>
                    {/* 價格按鈕：綁定 onUnlock 事件，並阻止冒泡 */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation(); // 防止觸發卡片點擊 (Modal)
                            if (onUnlock) onUnlock(data.id, data.price);
                        }}
                        className="bg-[#C7D9B2] hover:bg-[#D5E5C2] active:bg-[#94B36F] text-white rounded-full flex items-center justify-center font-bold w-full shadow-[0_4px_12px_rgba(255,236,153,0.5)] active:shadow-inner active:scale-95 transition-all cursor-pointer select-none"
                        style={{
                            padding: isExpanded ? '12px 0' : '4px 0',
                            fontSize: isExpanded ? '1.25rem' : '0.75rem',
                            gap: isExpanded ? '0.5rem' : '0.25rem'
                        }}
                    >
                        <img src="/images/icon-gold.png" alt="Coin" className={isExpanded ? "w-6 h-6" : "w-3.5 h-3.5"} />
                        <span>{data.price}</span>
                    </div>
                </div>
            </div>
        );
    }

    // === 樣式 B: 已解鎖 (Unlocked) ===
    return (
        <div className={containerClass} onClick={onClick}>
            <div className={`${topSectionHeightUnlocked} m-1 mb-0 rounded-t-[10px] rounded-b-none bg-gradient-to-b ${getAttrBg(data.attribute)} p-1 pb-4 flex flex-col justify-end items-center relative`}>
                <div className="absolute top-2 left-2">
                    <img src={attributeIcon} alt="Attr" className={`${iconSize} object-contain`} />
                </div>
                <div className={`absolute top-2 right-2 font-bold text-gray-400 ${labelSize}`}>Lv.{data.level}</div>
                <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/15 rounded-[100%] blur-[2px] z-0 pointer-events-none ${isExpanded ? 'w-40 h-4' : 'w-16 h-2'}`}></div>
                <div className="w-full flex items-center justify-center relative z-10">
                    <img src={data.image} alt={data.name} className={`${imageSize} object-contain drop-shadow-sm`} />
                </div>
            </div>
            <div className="w-full px-1 my-0"><div className="w-full border-t border-solid border-[#E9EBE0]"></div></div>
            <div className={`flex-1 bg-white flex flex-col ${contentPadding}`}>
                <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between items-center whitespace-nowrap">
                        <h3 className={`${titleSize} font-bold text-gray-800 leading-none`}>{data.name}</h3>
                        <div className="flex items-center justify-start w-auto pl-1">
                            {[...Array(data.rarity || 1)].map((_, i) => (
                                <img key={i} src="/images/icon-star-yellow.png" alt="star" className={`${starSize} object-contain block ${i > 0 ? '-ml-[0px]' : ''}`} />
                            ))}
                        </div>
                    </div>
                    <p className={`${quoteSize} text-gray-400 leading-none`}>{data.quote || '...'}</p>
                </div>
                <div className={`flex flex-col ${isExpanded ? 'gap-2 mt-4' : 'gap-0.5 mt-1.5'}`}>
                    <div className="flex items-center justify-between">
                        <p className={`${labelSize} text-gray-600 font-bold leading-none`}>棲息地 : <span className="font-normal text-gray-500">{data.location || '未知'}</span></p>
                        <span className={`bg-[#C0E3E5]/50 text-[#5A8D91] px-1 rounded-sm scale-90 origin-right ${isExpanded ? 'text-sm' : 'text-[6px]'}`}>No. 001</span>
                    </div>
                    <div className="flex items-center gap-1 whitespace-nowrap">
                        <span className={`${labelSize} text-gray-600 font-bold leading-none`}>好感程度 :</span>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <img key={i} src={i < (data.likes || 0) ? "/images/icon-heart-filled.png" : "/images/icon-heart-empty.png"} alt="heart" className={`${heartSize} object-contain`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// import AchievementModal from './AchievementModal'; // Removed unused import

// --- 3. 主頁面組件 ---
const AlienCollection = () => {
    // === 狀態管理 ===
    const [aliens, setAliens] = useState(initialAliensData); // 角色資料狀態
    const [coins, setCoins] = useState(6000); // 錢包狀態
    const [filter, setFilter] = useState('all'); // 篩選器
    const [selectedAlien, setSelectedAlien] = useState(null); // Modal
// const [showAchievementModal, setShowAchievementModal] = useState(false); // Removed unused state

    // === 計算進度 ===
    const totalAliens = aliens.length;
    const unlockedCount = aliens.filter(alien => !alien.isLocked).length;
    const progressPercentage = (unlockedCount / totalAliens) * 100;

    // === 解鎖功能 ===
    const handleUnlock = (id, price) => {
        if (coins >= price) {
            setCoins(prevCoins => prevCoins - price);
            setAliens(prevAliens => prevAliens.map(alien =>
                alien.id === id ? { ...alien, isLocked: false } : alien
            ));
        } else {
            alert(`金幣不足！還差 ${price - coins} 金幣`);
        }
    };

    // === 篩選邏輯 ===
    const filteredAliens = aliens.filter(alien => {
        if (filter === 'all') return true;
        return alien.attribute === filter;
    });

    return (
        <div className="flex flex-col min-h-screen pb-32 bg-[#9B9FDE] relative">
            <div className="absolute inset-0 z-0 opacity-100" style={{ backgroundImage: 'url(/images/collection-background-3.png)', backgroundSize: 'cover', backgroundPosition: 'top' }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#8C91D3]/10 via-[#8C91D3]/50 to-[#9B9FDE] pointer-events-none z-[1]" />

            <div className="relative z-10 p-6 flex-1 flex flex-col items-center">
                <h1 className="text-white text-2xl font-bold text-center mb-6 drop-shadow-md">角色圖鑑卡</h1>

                {/* Header Card */}
                <div className="w-full max-w-lg mx-auto min-h-[168px] flex flex-col justify-center gap-6 bg-white/15 backdrop-blur-[14px] border border-white/20 rounded-[2rem] px-4 py-6 shadow-lg mb-6">
                    <div className="flex w-full justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img src="/images/icon-book.png" alt="Book" className="w-12 h-12 object-contain" />
                            <span className="text-white font-bold text-xl drop-shadow-md">已收集 {unlockedCount}/{totalAliens}</span>
                        </div>
                        <div className="flex items-center relative">
                            <img src="/images/icon-gold.png" alt="Gold" className="w-12 h-12 object-contain relative z-20 -mr-8" />
                            <div className="bg-white/20 rounded-full pl-9 pr-4 py-1.5 backdrop-blur-sm border border-white min-w-[110px] flex justify-center relative z-10">
                                <span className="text-white font-bold text-xl drop-shadow-md">{coins}</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="w-full h-6 bg-[#E6E6E6] rounded-full shadow-[inset_0_4px_6px_rgba(0,0,0,0.11),0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden relative">
                            <div className="h-full bg-[#ECBFA3] border-2 border-[#E6E6E6] rounded-full shadow-[inset_0_4px_4px_rgba(255,255,255,0.25)] transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* 屬性篩選膠囊 */}
                <div className="mb-6 w-full max-w-lg mx-auto">
                    <div className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-6 py-2 flex items-center justify-between shadow-sm">
                        {attributesList.map((attr) => (
                            <button
                                key={attr.id}
                                onClick={() => setFilter(attr.id)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${filter === attr.id
                                    ? 'bg-white scale-110 shadow-md ring-2 ring-white/50'
                                    : 'hover:bg-white/20 opacity-70 hover:opacity-100'
                                    }`}
                            >
                                <img src={attr.icon} alt={attr.name} className="w-7 h-7 object-contain" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* 卡片列表 */}
                <div className="w-full max-w-lg grid grid-cols-3 gap-3 pb-10">
                    {filteredAliens.map((alien) => (
                        <div key={alien.id} className="aspect-[3/4.5]">
                            <AlienCard
                                data={alien}
                                onClick={() => setSelectedAlien(alien)}
                                onUnlock={handleUnlock}
                            />
                        </div>
                    ))}
                </div>
            </div>

{/* Alien Card Modal */}
            {selectedAlien && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-[fadeIn_0.2s_ease-out]"
                    onClick={() => setSelectedAlien(null)}
                >
                    <div
                        className="relative w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: 'flipIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                        {/* 確保 Modal 顯示最新資料 */}
                        <AlienCard 
                            data={aliens.find(a => a.id === selectedAlien.id) || selectedAlien} 
                            isExpanded={true}
                            onUnlock={handleUnlock}
                        />
                    </div>
                    <style>{`
                        @keyframes flipIn {
                            0% { transform: rotateY(90deg) scale(0.8); opacity: 0; }
                            100% { transform: rotateY(0deg) scale(1); opacity: 1; }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default AlienCollection;