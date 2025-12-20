import React, { useState, useRef } from 'react';
import { ChevronLeft, Lock } from 'lucide-react';

// Hand-tuned planet positions to sit perfectly on the "organic" trajectory
const planetsInfo = [
    { 
        id: 1, 
        name: '翠微星', 
        enName: 'VERIDIA', 
        desc: '充滿綠意與水晶的初始之地，這裡孕育著最原始的自然能量。', 
        image: '/images/planet-grass.png', 
        isLocked: false,
        x: 35, 
        y: 120, 
    },
    { 
        id: 2, 
        name: '砂岩星', 
        enName: 'SANDORA', 
        desc: '廣袤的沙漠與風蝕岩層，是岩系生命體的理想家園。', 
        image: '/images/planet-swamp.png', 
        isLocked: false,
        x: 75,
        y: 320,
    },
    { 
        id: 3, 
        name: '水靈界', 
        enName: 'AQUARIS', 
        desc: '被無盡海洋覆蓋的高密度水流體星球，重力極不穩定。', 
        image: '/images/planet-water.png', 
        isLocked: true,
        x: 22,
        y: 540,
    },
    { 
        id: 4, 
        name: '珊瑚海', 
        enName: 'CORALLIA', 
        desc: '漂浮在粉色雲霧中的珊瑚礁島嶼，景色美如夢境一般。', 
        image: '/images/planet-coral.png', 
        isLocked: true,
        x: 78,
        y: 760,
    },
    { 
        id: 5, 
        name: '寒霜境', 
        enName: 'FROSTORA', 
        desc: '氣溫低至零下兩百度的冰封星球，隱藏著古老的冰晶文明。', 
        image: '/images/planet-ice.png', 
        isLocked: true,
        x: 28,
        y: 980,
    },
    { 
        id: 6, 
        name: '熾焰星', 
        enName: 'VOLCANIS', 
        desc: '位於星系邊陲的火球，內核不斷噴湧出高能等離子體。', 
        image: '/images/planet-lava.png', 
        isLocked: true,
        x: 70,
        y: 1180,
    },
];

const PlanetMap = ({ onBack }) => {
    const [viewMode, setViewMode] = useState('map'); 
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const mapContainerRef = useRef(null);

    const handlePlanetClick = (planet) => {
        if (viewMode === 'map') {
            setSelectedPlanet(planet);
            setViewMode('detail');
        }
    };

    const handleBackToMap = () => {
        setViewMode('map');
    };

    /**
     * Hand-crafted Organic Path
     * Creating extra curvature that "overshoots" for a more adventurous feel.
     */
    const getOrganicPath = () => {
        // Path logic: Starts at Planet 1, swings WIDE right, swings WIDE left, etc.
        return "M 35,120 " + 
               "C 80,180 120,260 75,320 " +  // P1 to P2 with a deep curve right
               "C 10,400 -20,480 22,540 " +   // P2 to P3 with a deep curve left
               "C 80,620 120,700 78,760 " +   // P3 to P4 wide right
               "C 20,840 -10,920 28,980 " +   // P4 to P5 wide left
               "C 80,1060 110,1120 70,1180";  // P5 to P6
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-[#0A0C14] text-white font-sans overflow-hidden select-none flex justify-center">
            <div className="relative w-full max-w-md h-full bg-[#0A0C14] shadow-2xl overflow-hidden flex flex-col">
                
                {/* Space Backdrop */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[#0A0C14]" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse-slow" />
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-900/10 blur-[100px] rounded-full" />
                    <div className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-indigo-900/10 blur-[120px] rounded-full" />
                </div>

                {/* 1. Map View */}
                <div className={`absolute inset-0 z-10 transition-all duration-700 ease-in-out ${viewMode === 'map' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 z-30 px-6 pt-10 pb-4 flex items-center justify-between bg-gradient-to-b from-[#0A0C14] to-transparent">
                        <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/5 shadow-xl">
                            <ChevronLeft className="w-6 h-6 text-white/80" strokeWidth={2.5} />
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] tracking-[0.6em] text-indigo-400 font-black uppercase mb-1 opacity-80">Exploration</span>
                            <h2 className="text-xl font-black tracking-[0.2em] text-white uppercase italic">Planet Map</h2>
                        </div>
                        <div className="w-10" />
                    </div>

                    {/* Content Scroll Area */}
                    <div ref={mapContainerRef} className="h-full overflow-y-auto no-scrollbar pt-28 pb-60 relative px-4">
                        <div className="relative w-full" style={{ height: '1350px' }}>
                            {/* Organic Trajectory SVG */}
                            <svg 
                                className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
                                viewBox="0 0 100 1350"
                                preserveAspectRatio="none"
                            >
                                <defs>
                                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                                        <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
                                        <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                                    </linearGradient>
                                </defs>
                                <path 
                                    d={getOrganicPath()} 
                                    fill="none" 
                                    stroke="url(#pathGradient)" 
                                    strokeWidth="2.5" 
                                    strokeLinecap="round"
                                    strokeDasharray="1 8" // Stylized "Star Trail" dash
                                    className="opacity-80 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-1000"
                                />
                                {/* Optional: Glow layer */}
                                <path 
                                    d={getOrganicPath()} 
                                    fill="none" 
                                    stroke="rgba(255,255,255,0.15)" 
                                    strokeWidth="6" 
                                    strokeLinecap="round"
                                    className="blur-sm"
                                />
                            </svg>

                            {/* Planets */}
                            {planetsInfo.map((planet) => (
                                <div 
                                    key={planet.id}
                                    className="absolute z-20 group cursor-pointer transition-all duration-500"
                                    style={{ 
                                        left: `${planet.x}%`, 
                                        top: `${planet.y}px`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                    onClick={() => handlePlanetClick(planet)}
                                >
                                    <div className="relative flex flex-col items-center">
                                        <div className="relative w-36 h-36 md:w-40 md:h-40 transform transition-transform group-hover:scale-110 active:scale-95 z-20">
                                            <img 
                                                src={planet.image} 
                                                alt={planet.name}
                                                className={`w-full h-full object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-700 ${
                                                    planet.isLocked ? 'grayscale brightness-40 opacity-70' : 'animate-float'
                                                }`}
                                            />
                                            {planet.isLocked && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-2xl">
                                                        <Lock className="w-6 h-6 text-white/50" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute top-[105%] flex flex-col items-center pointer-events-none">
                                            <span className={`text-[12px] font-black tracking-[0.3em] uppercase whitespace-nowrap transition-colors duration-300 ${
                                                planet.isLocked ? 'text-white/20' : 'text-white drop-shadow-md'
                                            }`}>
                                                {planet.enName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Detail View */}
                <div 
                    className={`absolute inset-0 z-50 transition-all duration-700 flex flex-col overflow-hidden bg-[#0A0C14] ${
                        viewMode === 'detail' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
                    }`}
                >
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#11122D] via-[#0A0C14] to-[#0A0C14]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-900/10 blur-[150px] rounded-full animate-pulse-slow" />
                        <div className="absolute top-32 left-1/2 -translate-x-1/2 whitespace-nowrap leading-none font-black text-6xl text-white/5 opacity-5 select-none italic tracking-widest uppercase">COSMOS</div>
                    </div>

                    <div className="relative z-10 px-6 py-12 flex items-center justify-between">
                        <button onClick={handleBackToMap} className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-90">
                            <ChevronLeft className="w-8 h-8 text-white/80" />
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] tracking-[0.5em] text-white/40 font-black uppercase mb-1">Analysis</span>
                            <h2 className="text-xl font-black tracking-[0.2em] text-white uppercase italic">Planet Details</h2>
                        </div>
                        <div className="w-12" />
                    </div>

                    <div className="flex-1 relative z-10 flex flex-col items-center justify-start p-8 pt-10">
                        <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
                            <div className="absolute inset-[-15%] border-2 border-dashed border-white/5 rounded-full animate-spin-slow opacity-60" />
                            <img 
                                src={selectedPlanet?.image} 
                                alt={selectedPlanet?.name}
                                className={`w-full h-full object-contain drop-shadow-[0_0_50px_rgba(78,86,166,0.3)] transition-all duration-1000 ${
                                    selectedPlanet?.isLocked ? 'grayscale brightness-50 contrast-125' : 'animate-float-high'
                                }`}
                            />
                        </div>

                        <div className="relative w-full mt-4 animate-slide-up">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-white/30" />
                            <div className="bg-[#1A1C30]/50 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.6)] text-center">
                                <h2 className="text-4xl font-black text-white italic tracking-tighter leading-none mb-2">{selectedPlanet?.name}</h2>
                                <span className="text-[#4E56A6] font-black text-sm tracking-[0.3em] uppercase mb-6 block">{selectedPlanet?.enName}</span>
                                <p className="text-white/70 text-sm leading-relaxed mb-10">{selectedPlanet?.desc}</p>
                                <button className="w-full py-4 rounded-2xl font-black tracking-[0.2em] text-lg bg-white text-[#0A0C14] hover:bg-cyan-50 shadow-xl transition-transform active:scale-95">
                                    {selectedPlanet?.isLocked ? 'LOCKED' : 'ENTER'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-12px) rotate(1deg); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }

                @keyframes float-high {
                    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
                    50% { transform: translateY(-15px) rotate(2deg) scale(1.02); }
                }
                .animate-float-high { animation: float-high 10s ease-in-out infinite; }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow { animation: spin-slow 40s linear infinite; }

                @keyframes slide-up {
                    from { transform: translateY(40px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
            `}</style>
        </div>
    );
};

export default PlanetMap;
