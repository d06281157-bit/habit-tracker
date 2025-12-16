import React, { useState } from 'react';

const planets = [
    { id: 1, name: '翠微星 (Veridia)', desc: '充滿綠意與水晶的初始之地', image: '/images/planet-grass.png', isLocked: false },
    { id: 2, name: '砂岩星 (Sandora)', desc: '溫暖乾燥的地形，適合岩系星寵', image: '/images/planet-swamp.png', isLocked: false },
    { id: 3, name: '水靈界 (Aquaris)', desc: '寧靜的深藍水域，孕育無數生命', image: '/images/planet-water.png', isLocked: true },
    { id: 4, name: '珊瑚海 (Corallia)', desc: '粉色的夢幻珊瑚群落', image: '/images/planet-coral.png', isLocked: true },
    { id: 5, name: '寒霜境 (Frostora)', desc: '終年被冰雪覆蓋的純白世界', image: '/images/planet-ice.png', isLocked: true },
    { id: 6, name: '熾焰星 (Volcanis)', desc: '湧動著原始能量的熔岩核心', image: '/images/planet-lava.png', isLocked: true },
];

const PlanetMap = ({ onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % planets.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + planets.length) % planets.length);
    };

    const currentPlanet = planets[currentIndex];

    return (
        <div className="min-h-screen bg-[#0F111A] relative overflow-hidden flex flex-col text-white font-sans">
            {/* 1. Dynamic Background Layers */}
            <div className="absolute inset-0 z-0">
                {/* Starfield */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 animate-pulse-slow"></div>
                
                {/* Ambient Gradient based on active planet color tone (simplified to universal purple/blue for now) */}
                <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#1a1b26] via-[#2a2d3e]/80 to-[#0F111A] transition-colors duration-1000`} />
                
                {/* Background Rotating Ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] border border-white/5 rounded-full animate-spin-slow pointer-events-none" />
            </div>

            {/* 2. Header */}
            <div className="relative z-20 px-6 pt-12 flex items-center justify-between">
                <button 
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                <div className="text-sm font-bold tracking-widest text-white/50 uppercase">Planet System</div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* 3. Central Orbital Stage */}
            <div className="flex-1 relative z-10 flex flex-col items-center justify-center -mt-10">
                
                {/* Navigation Arrows (Absolute Side) */}
                <button 
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full text-white/30 hover:text-white hover:bg-white/5 transition-all"
                >
                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button 
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full text-white/30 hover:text-white hover:bg-white/5 transition-all"
                >
                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>

                {/* Main Planet Visualization */}
                <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full transition-all duration-700 ${currentPlanet.isLocked ? 'opacity-10' : 'opacity-40'}`} />

                    {/* Planet Image */}
                    <div className={`relative w-full h-full transition-all duration-700 ease-out transform ${currentPlanet.isLocked ? 'grayscale brightness-50 contrast-125' : 'filter-none scale-100 hover:scale-105'}`}>
                         <img 
                            key={currentPlanet.id} // Key change ensures animation triggers
                            src={currentPlanet.image} 
                            alt={currentPlanet.name} 
                            className="w-full h-full object-contain animate-float"
                            onError={(e) => e.target.src = 'https://placehold.co/300x300/2a2d3e/FFF?text=Planet'}
                        />
                        
                        {/* Lock Overlay */}
                        {currentPlanet.isLocked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Info Card (Bottom Anchored) */}
                <div className="mt-10 px-8 w-full max-w-sm text-center">
                    <div className="relative">
                        <h2 className="text-3xl font-black text-white tracking-wider mb-2 drop-shadow-lg">
                            {currentPlanet.name.split(' ')[0]}
                            <span className="block text-sm font-medium text-blue-300/80 mt-1 tracking-widest uppercase font-mono">
                                {currentPlanet.name.split('(')[1]?.replace(')', '') || 'Unknown'}
                            </span>
                        </h2>
                        
                        {/* Pagination Dots */}
                        <div className="flex justify-center gap-2 mb-6 mt-4">
                            {planets.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/20'}`} 
                                />
                            ))}
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                            <p className="text-blue-100/90 leading-relaxed text-sm">
                                {currentPlanet.desc}
                            </p>
                            
                            {/* Action Button */}
                            <button 
                                disabled={currentPlanet.isLocked}
                                className={`mt-6 w-full py-3 rounded-xl font-bold tracking-wide transition-all ${
                                    currentPlanet.isLocked 
                                    ? 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
                                    : 'bg-white text-[#0F111A] hover:bg-blue-50 shadow-lg active:scale-95'
                                }`}
                            >
                                {currentPlanet.isLocked ? '未解鎖' : '進入星球'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes spin-slow {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 60s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default PlanetMap;
