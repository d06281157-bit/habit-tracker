import React from 'react';
import { Plus } from 'lucide-react';

const BottomNav = ({ activeTab = 'home', onNavigate, onOpenAdd, onOpenTask }) => { // 1. Accept Prop

    const NavItem = ({ name, icon, label, onClickOverride }) => {
        const isActive = activeTab === name;
        return (
            <button
                className="relative"
                onClick={() => {
                    if (onClickOverride) {
                        onClickOverride();
                    } else if (onNavigate) {
                        onNavigate(name);
                    }
                }}
            >
                {isActive && <div className="absolute inset-0 bg-[#FFF8D6] rounded-xl -m-2 z-0" />}
                <div className={`relative z-10 flex flex-col items-center gap-1 transition-transform active:scale-95 ${isActive ? '' : 'opacity-50 hover:opacity-100'}`}>
                    <img src={icon} alt={label} className="w-8 h-8 object-contain" />
                </div>
            </button>
        );
    };

    return (
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 pb-10 pt-6 px-6 flex justify-between items-center rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)] text-gray-400 z-50">

            {/* Navigation Items */}
            <NavItem name="home" icon="/images/nav-task.png" label="Task List" />
            <NavItem name="incubate" icon="/images/nav-egg.png" label="Incubate" />
            <NavItem name="alien" icon="/images/nav-alien.png" label="Alien" />
            {/* <NavItem name="ufo" icon="/images/nav-ufo.png" label="UFO" /> */}
            {/* <NavItem name="astronaut" icon="/images/nav-astronaut.png" label="Astronaut" /> */}

            <NavItem 
                name="rocket" 
                icon="/images/icon-rocket.png" 
                label="Rocket" 
                onClickOverride={onOpenTask} 
            />
            <NavItem 
                name="planet" 
                icon="/images/icon-planet.png" 
                label="Planet" 
            />

            {/* Floating Action Button - Only show on Home Screen */}
            {activeTab === 'home' && (
                <button 
                    onClick={onOpenAdd}
                    className="absolute bottom-24 right-6 w-14 h-14 bg-[#061756] rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:shadow-xl z-50"
                >
                    <Plus className="w-8 h-8 text-white" strokeWidth={2.5} />
                </button>
            )}
        </div>
    );
};

export default BottomNav;
