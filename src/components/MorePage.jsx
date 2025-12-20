import React from 'react';

const MorePage = () => {
    // Feature cards data with row colors
    const features = [
        { id: 1, icon: '⌚', label: '錶盤', rowColor: 'bg-[#C8E0F4]' },
        { id: 2, icon: '🧩', label: '小工具', rowColor: 'bg-[#C8E0F4]' },
        { id: 3, icon: '😊', label: '心情', rowColor: 'bg-[#E8D4F0]' },
        { id: 4, icon: '📋', label: '待辦事項', rowColor: 'bg-[#E8D4F0]' },
        { id: 5, icon: '⏱️', label: '專注計時器', rowColor: 'bg-[#E8D4A0]' },
        { id: 6, icon: '💰', label: '支出追蹤', rowColor: 'bg-[#E8D4A0]' },
        { id: 7, icon: '📅', label: '紀念日', rowColor: 'bg-[#E8E4E8]' },
        { id: 8, icon: '💬', label: '肯定語', rowColor: 'bg-[#E8E4E8]' },
    ];

    return (
        <div className="flex flex-col min-h-screen pb-32 relative overflow-hidden">
            
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/images/collection-background-3.png)' }}
            />

            {/* Hero Area with Astronaut on Moon */}
            <div className="relative z-10 flex flex-col items-center pt-16 pb-8">
                <div className="relative">
                    <img 
                        src="/images/astronaut-moon.png" 
                        alt="Astronaut on Moon" 
                        className="w-48 h-48 object-contain"
                    />
                </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="relative z-10 px-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                    {features.map((feature) => (
                        <button
                            key={feature.id}
                            className={`${feature.rowColor} rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98] border border-white/50`}
                        >
                            <div className="w-10 h-10 flex items-center justify-center text-2xl">
                                {feature.icon}
                            </div>
                            <span className="text-[16px] font-semibold text-[#4A4A6A]">
                                {feature.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MorePage;
