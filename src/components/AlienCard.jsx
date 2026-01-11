import React, { useState, useEffect } from 'react';

// --- 0. 屬性資料定義 ---
const attributesList = [
    { id: 'all', name: '全部', icon: '/images/icon-attr-all.png' },
    { id: 'grass', name: '草', icon: '/images/icon-attr-grass.png' },
    { id: 'fire', name: '火', icon: '/images/icon-attr-fire.png' },
    { id: 'water', name: '水', icon: '/images/icon-attr-water.png' },
    { id: 'ice', name: '冰', icon: '/images/icon-attr-ice.png' },
    { id: 'ground', name: '地', icon: '/images/icon-attr-ground.png' },
];

const AlienCard = ({ data, onClick, onUnlock, isInteractive = true, isExpanded = false, isHighlighted = false }) => {
    const [showFlip, setShowFlip] = useState(isHighlighted);

    useEffect(() => {
        if (isHighlighted) {
            setShowFlip(true);
            const timer = setTimeout(() => setShowFlip(false), 2000); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [isHighlighted]);
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
        ? "w-[280px] aspect-[3/5] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden relative"
        : `h-full flex flex-col bg-white rounded-xl shadow-sm overflow-hidden relative ${isInteractive ? 'cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(255,255,255,0.4)]' : ''} ${isHighlighted ? 'animate-card-flip animate-highlight-glow ring-4 ring-[#FFF8D6] z-20' : ''}`;

    const topSectionHeight = isExpanded ? "h-[60%]" : "h-[60%]";
    const topSectionHeightUnlocked = isExpanded ? "h-[60%]" : "h-[65%]";

    const imageSize = isExpanded ? "w-56 h-56" : "w-16 h-16";
    const silhouetteSize = isExpanded ? "w-48 h-48" : "w-14 h-14";

    const titleSize = isExpanded ? "text-2xl" : "text-[11px]";
    const quoteSize = isExpanded ? "text-sm mt-1" : "hidden"; // Hide in grid
    const labelSize = isExpanded ? "text-base" : "text-[9px]";
    const iconSize = isExpanded ? "w-8 h-8" : "w-3.5 h-3.5";
    const starSize = isExpanded ? "w-6 h-6" : "w-2.5 h-2.5";
    const heartSize = isExpanded ? "w-5 h-5" : "w-2.5 h-2.5";
    const lockSize = isExpanded ? "w-16 h-16" : "w-5 h-5";

    const contentPadding = isExpanded ? "px-5 pt-3 pb-4 gap-1" : "px-2 pb-1.5 pt-1 gap-0.5";
    const lockPadding = isExpanded ? "pb-4" : "pb-1";

    // === 樣樣 A: 未解鎖 (Locked) ===
    if (data.isLocked) {
        return (
            <div className={containerClass} onClick={onClick}>
                <div className={`${topSectionHeight} m-1 mb-0 rounded-t-[10px] rounded-b-none bg-[#F2F2F2] p-4 ${isExpanded ? 'pb-2 justify-center' : 'pb-2 justify-center'} flex flex-col items-center relative`}>
                    <img src={data.silhouetteImage} alt="Silhouette" className={`${silhouetteSize} object-contain opacity-100`} />
                </div>
                <div className="w-full px-1 my-0"><div className="w-full border-t border-solid border-[#E9EBE0]"></div></div>
                <div className={`flex-1 bg-white flex flex-col justify-between ${contentPadding}`}>
                    <div className={`flex-1 flex items-center justify-center ${lockPadding}`}>
                        <img src="/images/icon-lock.png" alt="Locked" className={`${lockSize} object-contain opacity-100`} />
                    </div>
                    {/* 價格按鈕：綁定 onUnlock 事件，並阻止冒泡 */}
                    <div
                        onClick={(e) => {
                            e.stopPropagation(); // 防止觸發卡片點貼 (Modal)
                            if (onUnlock) onUnlock(data.id, data.price);
                        }}
                        className="bg-[#C7D9B2] hover:bg-[#D5E5C2] active:bg-[#94B36F] text-white rounded-full flex items-center justify-center font-bold w-full shadow-[0_4px_12px_rgba(255,236,153,0.3)] active:shadow-inner active:scale-95 transition-all cursor-pointer select-none"
                        style={{
                            padding: isExpanded ? '10px 0' : '4px 0',
                            fontSize: isExpanded ? '1.1rem' : '0.75rem',
                            gap: isExpanded ? '0.4rem' : '0.2rem'
                        }}
                    >
                        <img src="/images/icon-gold.png" alt="Coin" className={isExpanded ? "w-5 h-5" : "w-3 h-3"} />
                        <span>{data.price}</span>
                    </div>
                </div>
            </div>
        );
    }

    // === 樣樣 B: 已解鎖 (Unlocked) ===
    return (
        <div className={containerClass} onClick={onClick}>
            <div className={`${topSectionHeightUnlocked} m-1 mb-0 rounded-t-[10px] rounded-b-none bg-gradient-to-b ${getAttrBg(data.attribute)} p-1 ${isExpanded ? 'pt-10 pb-0' : 'pt-1 pb-4'} flex flex-col justify-end items-center relative`}>
                <div className="absolute top-2 left-2">
                    <img src={attributeIcon} alt="Attr" className={`${iconSize} object-contain`} />
                </div>
                <div className={`absolute top-2 right-2 font-bold text-gray-400 ${labelSize}`}>Lv.{data.level}</div>
                <div className={`absolute ${isExpanded ? 'bottom-4' : 'bottom-2'} left-1/2 -translate-x-1/2 bg-black/15 rounded-[100%] blur-[2px] z-0 pointer-events-none ${isExpanded ? 'w-40 h-4' : 'w-16 h-2'}`}></div>
                <div className={`w-full flex items-center justify-center relative z-10 ${isExpanded ? '' : 'mb-1'}`}>
                    <img src={data.image} alt={data.name} className={`${imageSize} object-contain drop-shadow-sm`} />
                </div>
            </div>
            <div className="w-full px-1 my-0"><div className="w-full border-t border-solid border-[#E9EBE0]"></div></div>
            <div className={`flex-1 bg-white flex flex-col ${isExpanded ? 'justify-start' : 'justify-center'} ${contentPadding}`}>
                <div className="flex flex-col gap-0">
                    {isExpanded ? (
                        <h3 className={`${titleSize} font-bold text-gray-800 leading-tight truncate`}>{data.name}</h3>
                    ) : (
                        <div className="flex justify-between items-center whitespace-nowrap">
                            <h3 className={`${titleSize} font-bold text-gray-800 leading-tight truncate`}>{data.name}</h3>
                        </div>
                    )}
                    {isExpanded && <p className={`${quoteSize === 'hidden' ? '' : quoteSize} text-gray-400 leading-snug italic`}>{data.quote || '...'}</p>}
                </div>
                
                <div className={`flex flex-col ${isExpanded ? 'gap-2 mt-1' : 'gap-0 mt-0.5'}`}>
                    {/* Hide habitat in grid view, only show in expanded */}
                    {isExpanded && (
                        <div className="flex items-center justify-between">
                            <p className={`${labelSize} text-gray-600 font-bold leading-none`}>棲息地 : <span className="font-normal text-gray-500">{data.location || '未知'}</span></p>
                            <span className={`bg-[#C0E3E5]/50 text-[#5A8D91] px-1 rounded-sm scale-90 origin-right ${isExpanded ? 'text-xs' : 'text-[6px]'}`}>No. {String(data.id).padStart(3, '0')}</span>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-1 whitespace-nowrap">
                        <span className={`${labelSize} text-gray-500 font-bold scale-90 origin-left`}>好感度</span>
                        {isExpanded && <span className={`${labelSize} text-gray-600 font-bold leading-none`}> :</span>}
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <img key={i} src={i < (data.likes || 0) ? "/images/icon-heart-filled.png" : "/images/icon-heart-empty.png"} alt="heart" className={`${heartSize} object-contain`} />
                            ))}
                        </div>
                    </div>

                    {!isExpanded && (
                        <div className="flex items-center gap-1 whitespace-nowrap">
                            <span className={`${labelSize} text-gray-500 font-bold scale-90 origin-left`}>稀有度</span>
                            <div className="flex gap-0.5">
                                {[...Array(data.rarity || 1)].map((_, i) => (
                                    <img key={i} src="/images/icon-star-yellow.png" alt="star" className={`${starSize} object-contain block`} />
                                ))}
                            </div>
                        </div>
                    )}

                    {isExpanded && (
                        <div className="flex items-center gap-1 whitespace-nowrap">
                            <span className={`${labelSize} text-gray-600 font-bold leading-none`}>稀有度 :</span>
                            <div className="flex gap-0.5">
                                {[...Array(data.rarity || 1)].map((_, i) => (
                                    <img key={i} src="/images/icon-star-yellow.png" alt="star" className={`${starSize} object-contain block`} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isHighlighted && (
                <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
                    <div className="text-4xl animate-sparkle-pop">✨</div>
                    <div className="text-2xl absolute top-4 right-4 animate-sparkle-pop [animation-delay:0.2s]">⭐</div>
                    <div className="text-2xl absolute bottom-4 left-4 animate-sparkle-pop [animation-delay:0.4s]">✨</div>
                </div>
            )}
        </div>
    );
};

export default AlienCard;
