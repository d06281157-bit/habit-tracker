import React, { useState, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { planetsData } from '../data/planetsData';

// Adding coordinates to the imported planets data for the map view
const planetsWithCoords = planetsData.map((planet, index) => {
    // Map existing coordinates to the data
    const coords = [
        { x: 35, y: 300 },
        { x: 75, y: 530 },
        { x: 22, y: 760 },
        { x: 78, y: 990 },
        { x: 28, y: 1220 },
        { x: 70, y: 1450 },
        { x: 25, y: 1680 },
        { x: 72, y: 1910 }
    ];
    return { 
        ...planet, 
        ...(coords[index] || { x: 50, y: 300 + index * 200 }) 
    };
});

const PlanetMap = ({ onBack, onSetBackground }) => {
    const [viewMode, setViewMode] = useState('map'); 
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [demoUnlockAll, setDemoUnlockAll] = useState(false);
    const mapContainerRef = useRef(null);

    // Presentation Mode Shortcut (Shift + S)
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.shiftKey && e.key.toUpperCase() === 'S') {
                e.preventDefault();
                setDemoUnlockAll(prev => !prev);
                console.log('Demo mode toggled:', !demoUnlockAll);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [demoUnlockAll]);

    // Track scroll for header effect
    const handleScroll = (e) => {
        if (e.target.scrollTop > 20) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

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
     * Hand-crafted Organic Path segments
     */
    const getSegmentPath = (i) => {
        const p1 = planetsWithCoords[i];
        const p2 = planetsWithCoords[i+1];
        if (!p1 || !p2) return "";

        // Determine control points based on segment index to keep the "S" shape
        let cp1x, cp1y, cp2x, cp2y;
        if (i % 2 === 0) { // Moving right
            cp1x = 85; cp1y = p1.y + 60;
            cp2x = 95; cp2y = p2.y - 60;
        } else { // Moving left
            cp1x = 15; cp1y = p1.y + 60;
            cp2x = 5; cp2y = p2.y - 60;
        }

        return `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-[#1A1135] text-white font-sans overflow-hidden select-none flex justify-center">
            <div className="relative w-full max-w-md h-full bg-[#1A1135] shadow-2xl overflow-hidden flex flex-col">
                
                {/* Fixed Universe Backdrop */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <img 
                        src="/images/universe-background-2.jpeg" 
                        alt="Universe"
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-[#1A1135]/40" />
                    
                    {/* Fixed depth overlays */}
                    <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#1A1135] via-[#1A1135]/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#1A1135] via-[#1A1135]/60 to-transparent" />
                </div>

                {/* 1. Map View */}
                <div className={`absolute inset-0 z-10 flex flex-col transition-all duration-700 ease-in-out ${viewMode === 'map' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    
                    {/* Soft Header */}
                    <div className={`absolute top-0 left-0 right-0 z-40 px-6 pt-12 pb-6 flex items-center justify-between transition-all duration-300 ${
                        isScrolled ? 'bg-white/5 backdrop-blur-lg border-b border-white/5' : ''
                    }`}>
                        <button onClick={onBack} className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center border border-white/20 shadow-lg active:scale-95 transition-all">
                            <ChevronLeft className="w-6 h-6 text-white" strokeWidth={3} />
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="text-[11px] tracking-[0.4em] text-amber-200/80 font-bold uppercase mb-0.5">My Adventure</span>
                            <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-md">Planet Map</h2>
                        </div>
                        <div className="w-10" />
                    </div>

                    {/* Content Scroll Area */}
                    <div 
                        className="relative flex-1 overflow-y-auto no-scrollbar scroll-smooth" 
                        ref={mapContainerRef}
                        onScroll={handleScroll}
                    >
                        <div className="relative w-full pt-28 pb-60 px-4" style={{ height: '1800px' }}>
                            {/* Inner Trajectory and Planets */}

                            {/* Organic Trajectory SVG - Segmented for locking states */}
                            <svg 
                                className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
                                viewBox="0 0 100 1800"
                                preserveAspectRatio="none"
                            >
                                <defs>
                                    <linearGradient id="activeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#FFE08A" stopOpacity="0.4" />
                                        <stop offset="50%" stopColor="#FFFFFF" />
                                        <stop offset="100%" stopColor="#FFE08A" stopOpacity="0.4" />
                                    </linearGradient>
                                </defs>
                                
                                {planetsWithCoords.slice(0, -1).map((_, i) => {
                                    const nextPlanet = planetsWithCoords[i+1];
                                    const pathUnlocked = demoUnlockAll || nextPlanet.isUnlocked;
                                    
                                    return (
                                        <g key={`path-segment-${i}`}>
                                            {/* Glowing Soft Shadow */}
                                            {pathUnlocked && (
                                                <path 
                                                    d={getSegmentPath(i)} 
                                                    fill="none" 
                                                    stroke="rgba(255,255,255,0.3)" 
                                                    strokeWidth="6" 
                                                    strokeLinecap="round"
                                                    className="blur-[6px]"
                                                />
                                            )}
                                            {/* Main Path - Soft Pinkish/White */}
                                            <path 
                                                d={getSegmentPath(i)} 
                                                fill="none" 
                                                stroke={pathUnlocked ? "url(#activeGradient)" : "rgba(255,255,255,0.15)"} 
                                                strokeWidth={pathUnlocked ? "3" : "1.5"} 
                                                strokeLinecap="round"
                                                strokeDasharray={pathUnlocked ? "4 8" : "2 6"}
                                                className={`transition-all duration-1000 ${pathUnlocked ? 'drop-shadow-[0_0_8px_rgba(255,184,224,0.6)]' : ''}`}
                                            />
                                        </g>
                                    );
                                })}
                            </svg>

                            {/* Planets */}
                            {planetsWithCoords.map((planet) => (
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
                                        <div className="relative w-44 h-44 md:w-52 md:h-52 transform transition-transform group-hover:scale-110 active:scale-95 z-20">
                                            {/* Hover Glow Effect */}
                                            {planet.isUnlocked && (
                                                <div className="absolute inset-4 bg-white/20 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            )}
                                            
                                            <img 
                                                src={planet.image} 
                                                alt={planet.name}
                                                className={`w-full h-full object-contain transition-all duration-700 ${
                                                    !(demoUnlockAll || planet.isUnlocked) 
                                                    ? 'grayscale brightness-[0.35]' 
                                                    : 'animate-float drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_40px_rgba(255,184,224,0.6)]'
                                                } ${planet.image.includes('planet-Patchring') ? 'rotate-[35deg]' : ''}`}
                                            />
                                            {!(demoUnlockAll || planet.isUnlocked) && (
                                                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                                    <img 
                                                        src="/images/icon-gold-lock.png" 
                                                        alt="Locked" 
                                                        className="w-14 h-14 object-contain filter drop-shadow-[0_0_12px_rgba(255,215,0,0.6)]" 
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        {/* Name Label */}
                                        <div className={`
                                            absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col
                                            ${planet.x > 50 ? 'right-[115%]' : 'left-[115%]'}
                                            ${planet.x > 50 ? 'items-end' : 'items-start'}
                                        `}>
                                            <div className={`
                                                px-5 py-1.5 rounded-full border-2 transition-all duration-300 shadow-xl whitespace-nowrap
                                                ${!(demoUnlockAll || planet.isUnlocked) 
                                                    ? 'bg-white/10 border-white/5 opacity-40' 
                                                    : 'bg-[#FFF9E5] border-[#E6D5B8]'
                                                }
                                            `}>
                                                <span className={`text-[15px] font-bold transition-colors duration-300 ${
                                                    !(demoUnlockAll || planet.isUnlocked) ? 'text-white/40' : 'text-[#5D4037]'
                                                }`}>
                                                    {planet.name}
                                                </span>
                                            </div>
                                            
                                            {/* Small English Subtitle */}
                                            {(demoUnlockAll || planet.isUnlocked) && (
                                                <span className={`text-[10px] font-bold text-white/60 tracking-widest uppercase mt-1 drop-shadow-md px-2 ${
                                                    planet.x > 50 ? 'text-right' : 'text-left'
                                                }`}>
                                                    {planet.englishName}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Detail View */}
                <div 
                    className={`absolute inset-0 z-50 transition-all duration-700 flex flex-col overflow-hidden bg-[#1A1135] ${
                        viewMode === 'detail' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
                    }`}
                >
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        <img 
                            src="/images/universe-background.jpeg" 
                            alt="Universe"
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1135] via-transparent to-[#1A1135]" />
                    </div>

                    <div className="relative z-10 px-6 py-12 flex items-center justify-between">
                        <button onClick={handleBackToMap} className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 active:scale-90">
                            <ChevronLeft className="w-8 h-8 text-white" />
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] tracking-[0.3em] text-amber-200/80 font-bold uppercase mb-1">Planet Info</span>
                            <h2 className="text-2xl font-black text-white">{selectedPlanet?.name}</h2>
                        </div>
                        <div className="w-12" />
                    </div>

                    <div className="flex-1 relative z-10 overflow-y-auto no-scrollbar flex flex-col items-center justify-start p-8 pt-6 pb-20">
                        <div className="relative w-72 h-72 mb-10 flex items-center justify-center">
                            {/* Layered Orbitals */}
                            <div className="absolute inset-[-10%] border-2 border-dashed border-amber-200/20 rounded-full animate-spin-slow opacity-60" />
                            <div className="absolute inset-[-25%] border border-dotted border-white/20 rounded-full animate-spin-reverse">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#FFD700] rounded-full shadow-[0_0_15px_rgba(255,215,0,0.8)]" />
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-[#FF8E8E] rounded-full shadow-[0_0_10px_rgba(255,142,142,0.6)]" />
                            </div>
                            <div className="absolute inset-[-42%] border border-white/5 rounded-full" />
                            
                            <img 
                                src={selectedPlanet?.image} 
                                alt={selectedPlanet?.name}
                                className={`relative z-30 w-full h-full object-contain drop-shadow-[0_0_50px_rgba(78,86,166,0.3)] transition-all duration-1000 ${
                                    !(demoUnlockAll || selectedPlanet?.isUnlocked) ? 'grayscale brightness-50 contrast-125' : 'animate-float-high'
                                }`}
                            />

                            {/* Floating Unlock Condition Container */}
                            {!(demoUnlockAll || selectedPlanet?.isUnlocked) && (
                                <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
                                    <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-5 text-center shadow-2xl max-w-[90%] scale-90 animate-pulse-subtle">
                                        <span className="text-[10px] text-amber-200/80 font-black uppercase tracking-[0.2em] mb-2 block">解鎖條件</span>
                                        <p className="text-white text-[15px] font-bold leading-relaxed">{selectedPlanet?.unlockCondition}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative w-full mt-4 animate-slide-up">
                            <div className="bg-[#FFFBEB] rounded-[3rem] border-4 border-white p-8 shadow-xl text-center">
                                <h2 className="text-4xl font-black text-[#5D4037] tracking-tighter mb-1">{selectedPlanet?.name}</h2>
                                <span className="text-[#8D6E63] font-bold text-sm tracking-[0.2em] uppercase mb-6 block">{selectedPlanet?.englishName}</span>
                                <div className="w-full h-px bg-[#5D4037]/10 mb-6" />
                                
                                <div className="flex flex-col gap-4 mb-8">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">屬性</span>
                                        <span className="text-stone-700 font-bold">{selectedPlanet?.attribute}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-1">星球簡介</span>
                                        <p className="text-[#5D4037]/80 text-base font-medium leading-relaxed px-2">{selectedPlanet?.description}</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => {
                                        if (demoUnlockAll || selectedPlanet?.isUnlocked) {
                                            // Map planet image to background
                                            const planetImage = selectedPlanet?.image || '';
                                            let bg = 'desert-background.jpeg';
                                            if (planetImage.includes('planet-water')) bg = 'water-background.jpg';
                                            else if (planetImage.includes('planet-lava')) bg = 'lava-background.jpg';
                                            else if (planetImage.includes('planet-ice')) bg = 'ice-background.jpeg';
                                            else if (planetImage.includes('planet-Sandroot')) bg = 'Sandroot-background.png';
                                            else if (planetImage.includes('planet-Patchring')) bg = 'Patchring-background.png';
                                            
                                            if (onSetBackground) onSetBackground(bg);
                                            onBack();
                                        }
                                    }}
                                    className={`w-full py-5 rounded-[2rem] font-black tracking-[0.1em] text-xl transition-all active:scale-95 ${
                                    !(demoUnlockAll || selectedPlanet?.isUnlocked) 
                                    ? 'bg-amber-100 text-[#5D4037] shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
                                    : 'bg-[#FFF4D6] text-[#5D4037] shadow-[0_2px_4px_rgba(0,0,0,0.25),inset_0_-2px_4px_rgba(255,163,18,0.25),inset_0_4px_4px_rgba(255,255,255,0.25)] hover:brightness-105'
                                }`}>
                                    {!(demoUnlockAll || selectedPlanet?.isUnlocked) ? `支付 ${selectedPlanet?.price} 金幣解鎖` : '開始探索'}
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

                @keyframes spin-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .animate-spin-reverse { animation: spin-reverse 25s linear infinite; }

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
