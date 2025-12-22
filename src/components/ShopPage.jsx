import React, { useState } from 'react';
import { ShoppingBag, RotateCw, Lock } from 'lucide-react';

const ShopPage = ({ score = 3085 }) => {
    const [activeCategory, setActiveCategory] = useState('clothing');

    const categories = [
        { id: 'clothing', label: '服裝', icon: '👕' },
        { id: 'garden', label: '園藝佈置', icon: '🌲' },
        { id: 'world', label: '世界', icon: '/images/icon-planet.png', isImage: true },
    ];

    const items = [
        { id: 1, name: '蕾絲邊頭飾', price: 600, locked: false, image: null },
        { id: 2, name: '醫師袍', price: 550, locked: false, image: null },
        { id: 3, name: '簡約手錶', price: 600, locked: false, image: null },
        { id: 4, name: '經典黑裙', price: 500, locked: true, image: null },
        { id: 5, name: '橘色長靴', price: 500, locked: true, image: null },
        { id: 6, name: '哥德風連身裙', price: 700, locked: true, image: null },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#9B7BBE] overflow-x-hidden">
            {/* Top Store Header (Awning & Hero Section) */}
            <div className="relative pt-12 pb-6 bg-[#FFFDE7] rounded-b-[2rem] shadow-sm">
                {/* Awning Background Pattern */}
                <div className="absolute top-0 left-0 right-0 h-32 flex z-0 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={i} 
                            className={`flex-1 h-32 rounded-b-[2.5rem] shadow-[inset_0_-8px_12px_rgba(0,0,0,0.05),inset_0_4px_10px_rgba(0,0,0,0.08)] ${
                                i % 2 === 0 ? 'bg-[#F2B36A]' : 'bg-[#F5C27A]'
                            }`}
                        />
                    ))}
                    {/* Glowing lights on awning - darker now for contrast */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-around px-16">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_rgba(242,179,106,1)] opacity-100" />
                        ))}
                    </div>
                </div>

                {/* Top Controls Overlay */}
                <div className="relative z-20 flex justify-between items-center px-4 mb-6">
                    {/* Left: Star Score Badge */}
                    <div className="bg-white/95 backdrop-blur-md rounded-full pl-1 pr-5 py-1 flex items-center shadow-lg border border-[#F2B36A]/20">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center">
                            <img src="/images/icon-star.png" alt="Star" className="w-7 h-7 object-contain drop-shadow-sm" />
                        </div>
                        <span className="text-[#F2B36A] font-black text-xl ml-1">{score}</span>
                    </div>

                    {/* Right: Backpack Button */}
                    <button className="w-14 h-14 bg-white/90 rounded-[1.25rem] flex items-center justify-center shadow-lg border border-[#F2B36A]/20 active:scale-95 transition-transform">
                        <div className="w-10 h-10 bg-[#B39AD6] rounded-xl flex items-center justify-center text-white shadow-inner">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                    </button>
                </div>

                {/* Hero Section (Character and Banner) */}
                <div className="relative z-10 flex items-end justify-between px-4 mt-2">
                    {/* Left: Shop Owl Character */}
                    <div className="w-44 h-44 relative group">
                        <img 
                            src="/images/shop-owl.png" 
                            alt="Shop Owl" 
                            className="w-full h-full object-contain drop-shadow-lg"
                        />
                    </div>

                    {/* Right: Premium Banner */}
                    <div className="flex-1 ml-4 mb-4 bg-white/90 rounded-[2rem] p-5 shadow-2xl border border-[#F2B36A]/10 relative overflow-hidden flex flex-col items-center">
                        <div className="absolute -top-1 -right-1 w-10 h-10 flex items-center justify-center opacity-60 animate-pulse">✨</div>
                        <h3 className="text-[#F2B36A] font-black text-lg mb-3 tracking-tighter">解鎖所有裝飾</h3>
                        <button className="w-full bg-gradient-to-b from-[#FFD36A] to-[#FFCC4D] rounded-full py-2.5 px-6 shadow-[0_4px_0_#D4A017] flex items-center justify-center active:translate-y-1 active:shadow-none transition-all">
                            <span className="text-[#8B4513] font-black italic text-lg tracking-tight">Premium</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex bg-[#B39AD6] z-20 border-t border-white/10">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex-1 py-5 flex flex-col items-center gap-1.5 transition-all relative ${
                            activeCategory === cat.id 
                            ? 'bg-[#9B7BBE] shadow-[inset_0_4px_12px_rgba(0,0,0,0.08)]' 
                            : 'hover:bg-[#a98ccf] opacity-80'
                        }`}
                    >
                        {cat.isImage ? (
                            <div className={`transition-transform duration-300 ${activeCategory === cat.id ? 'scale-110' : 'scale-100 grayscale-[0.2]'}`}>
                                <img src={cat.icon} className="w-9 h-9 object-contain drop-shadow-md" alt={cat.label} />
                            </div>
                        ) : (
                            <span className={`text-3xl transition-transform duration-300 ${activeCategory === cat.id ? 'scale-110' : 'scale-100 opacity-60'}`}>
                                {cat.icon}
                            </span>
                        )}
                        <span className={`text-white text-sm font-black tracking-widest ${activeCategory === cat.id ? 'opacity-100' : 'opacity-70'}`}>
                            {cat.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Main Shop Container */}
            <div className="flex-1 relative bg-[#9B7BBE] px-5 pb-40 overflow-y-auto no-scrollbar shadow-[inset_0_10px_20px_rgba(0,0,0,0.08)]">
                {/* Refresh Bar */}
                <div className="flex justify-between items-center py-5">
                    <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-bold opacity-70">道具刷新：</span>
                        <span className="text-white text-xl font-black tracking-[0.2em] tabular-nums">23:35</span>
                    </div>
                    <button className="bg-[#FFD36A] text-[#8B4513] px-5 py-2 rounded-full text-base font-black flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all border-b-4 border-[#FFCC4D]">
                        <span>免費</span>
                        <RotateCw className="w-5 h-5" />
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-3 gap-5">
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-col items-center group">
                            <div className="relative w-full aspect-square bg-[#A98CCF] rounded-[2.5rem] flex items-center justify-center p-5 shadow-xl transition-transform group-active:scale-95 border border-white/10">
                                {/* Inner Card Shadow Effect */}
                                <div className="absolute inset-2 bg-black/5 rounded-[2rem] shadow-inner" />
                                
                                {/* Item Placeholder */}
                                <div className="relative z-10 w-full h-full rounded-2xl flex items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-dashed border-white/25 rounded-full animate-spin-slow" />
                                </div>
                                
                                {item.locked && (
                                    <div className="absolute top-2 right-2 w-9 h-9 bg-[#E6C37A] rounded-full flex items-center justify-center border-4 border-[#A98CCF] shadow-lg z-20">
                                        <Lock size={16} className="text-[#8B4513] fill-current" />
                                    </div>
                                )}
                            </div>
                            
                            {/* Price Label */}
                            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-white/10 transition-colors">
                                <img src="/images/icon-star.png" alt="Star" className="w-6 h-6 object-contain" />
                                <span className="text-white font-black text-xl tracking-tight">{item.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default ShopPage;
