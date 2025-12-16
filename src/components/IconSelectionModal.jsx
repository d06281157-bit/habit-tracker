import React from 'react';
import { X } from 'lucide-react';

const ICON_LIST = [
  'icon-plant', 
  'icon-sleep', 
  'icon-bath', 
  'icon-cake', 
  'icon-drink', 
  'icon-listen', 
  'icon-tablet'
];

const IconSelectionModal = ({ isOpen, onClose, onSelect, currentIcon }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Card (White Theme) */}
      <div className="relative bg-white w-[90%] max-w-md h-[60vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <X size={24} />
          </button>
          <span className="text-gray-800 font-bold text-lg">自定義圖標</span>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Grid Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-4 gap-4">
            {ICON_LIST.map((iconName) => (
              <button
                key={iconName}
                onClick={() => { onSelect(iconName); onClose(); }}
                className={`aspect-square rounded-2xl flex items-center justify-center transition-all p-2 ${
                  currentIcon === iconName 
                    ? 'bg-[#6B4EFF] ring-4 ring-[#6B4EFF]/20 scale-105 shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-400'
                }`}
              >
                <img 
                  src={`/images/${iconName}.png`} 
                  alt={iconName}
                  className="w-full h-full object-contain filter drop-shadow-sm"
                  onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerText = "📦"; 
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconSelectionModal;
