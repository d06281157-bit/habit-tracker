import React, { useState, useEffect } from 'react';
import { initialAliensData } from '../data/aliensData';
import AlienCard from './AlienCard';

// --- 0. 屬性資料定義 ---
const attributesList = [
    { id: 'all', name: '全部', icon: '/images/icon-attr-all.png' },
    { id: 'grass', name: '草', icon: '/images/icon-attr-grass.png' },
    { id: 'fire', name: '火', icon: '/images/icon-attr-fire.png' },
    { id: 'water', name: '水', icon: '/images/icon-attr-water.png' },
    { id: 'ice', name: '冰', icon: '/images/icon-attr-ice.png' },
    { id: 'ground', name: '地', icon: '/images/icon-attr-ground.png' },
];

// --- 3. 主頁面組件 ---
const AlienCollection = ({ unlockedIds = [], highlightId = null, onClearHighlight, onNavVisibilityChange, onSelectAlien }) => {
    // === 狀態管理 ===
    const [aliens, setAliens] = useState(() => {
        // Initialize with locked state from data, then apply unlockedIds
        return initialAliensData.map(alien => ({
            ...alien,
            isLocked: !unlockedIds.includes(alien.id)
        }));
    });
    const [coins, setCoins] = useState(6000); 
    const [filter, setFilter] = useState('all'); 

    // Sync unlocked status from parent
    useEffect(() => {
        setAliens(prev => prev.map(alien => ({
            ...alien,
            isLocked: !unlockedIds.includes(alien.id)
        })));
    }, [unlockedIds]);

    // Auto-clear highlight after focus
    useEffect(() => {
        if (highlightId && onClearHighlight) {
            const timer = setTimeout(() => {
                onClearHighlight();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [highlightId, onClearHighlight]);

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

    // === 篩選與排序邏輯 ===
    const filteredAliens = aliens
        .filter(alien => {
            if (filter === 'all') return true;
            return alien.attribute === filter;
        })
        .sort((a, b) => {
            // 已解鎖 (isLocked: false) 的排在前面
            if (a.isLocked !== b.isLocked) {
                return a.isLocked ? 1 : -1;
            }
            // 若狀態相同，則按原本 ID 排序
            return a.id - b.id;
        });

    return (
        <div className="flex flex-col min-h-full pb-32 bg-[#9B9FDE] relative">
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
                                onClick={() => onSelectAlien && onSelectAlien(alien)}
                                onUnlock={handleUnlock}
                                isHighlighted={alien.id === highlightId}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AlienCollection;