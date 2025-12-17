import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HabitCard from './components/HabitCard';
import BottomNav from './components/BottomNav';
import AddHabitModal from './components/AddHabitModal';
import HabitDetailModal from './components/HabitDetailModal';
import AlienCollection from './components/AlienCollection';
import AchievementModal from './components/AchievementModal';
import IncubatePage from './components/IncubatePage';
import PlanetMap from './components/PlanetMap'; // Import

// Default Data (Fallback if storage is empty)
const DEFAULT_HABITS = [
  { id: 1, title: '早睡早起', icon: 'icon-plant', frequency: '1次, 每天', reminder: '每日 07:00', reward: 5, completed: false },
  { id: 2, title: '喝水 2000cc', icon: 'icon-drink', frequency: '8次, 每天', reminder: '每日 10:00', reward: 5, completed: false },
  { id: 3, title: '睡前閱讀', icon: 'icon-sleep', frequency: '1次, 每天', reminder: '每日 22:00', reward: 5, completed: false },
];

function App() {
  const [currentView, setCurrentView] = useState('home');
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false); // For Rocket button in Header

  // Selection States
  const [selectedHabit, setSelectedHabit] = useState(null); // For Detail View
  const [editingHabit, setEditingHabit] = useState(null);   // For Edit Mode
  const [activeSwipeId, setActiveSwipeId] = useState(null); // For Exclusive Swipe
  const [isIncubating, setIsIncubating] = useState(false);  // Incubation State

  // Click Tracking Ref (Coordinate Trap)
  const clickStartPos = useRef({ x: 0, y: 0 });

  // 1. Data Persistence (LocalStorage)
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('my_habits_data');
    if (saved) {
        try { return JSON.parse(saved); } catch(e) { return DEFAULT_HABITS; }
    }
    return DEFAULT_HABITS;
  });

  // Auto-save whenever habits change
  useEffect(() => {
    localStorage.setItem('my_habits_data', JSON.stringify(habits));
  }, [habits]);

  // 2. Logic Functions

  // Handle Add OR Edit Habit
  const handleSaveHabit = (habitData) => {
      if (editingHabit) {
        // Update Existing
        setHabits(prev => prev.map(h => h.id === editingHabit.id ? { ...h, ...habitData } : h));
        setEditingHabit(null);
      } else {
        // Create New
        const newHabit = {
          id: Date.now(),
          title: habitData.title,
          icon: habitData.icon || 'icon-plant',
          frequency: habitData.frequency || '1次, 每天',
          reminder: habitData.reminder || '每日 09:00',
          reward: 5,
          completed: false,
        };
        setHabits(prev => [...prev, newHabit]);
      }
      setIsAddModalOpen(false);
      
      // CRITICAL: Close all modals and clear selection to return to Home
      setEditingHabit(null);
      setSelectedHabit(null); 
      setIsDetailModalOpen(false);
  };

  // Handle Delete
  const handleDeleteHabit = (habitId) => {
    if (window.confirm('確定要刪除這個星願嗎？')) {
        setHabits(prev => prev.filter(h => h.id !== habitId));
    }
  };

  // Handle Checkbox Toggle
  const handleToggleHabit = (habitId) => {
    setHabits(prev => prev.map(h => 
        h.id === habitId ? { ...h, completed: !h.completed } : h
    ));
  };

  // Start Editing (From Card Slide or Detail Modal)
  const handleStartEdit = (habit) => {
      setEditingHabit(habit);
      setIsDetailModalOpen(false);
      setIsAddModalOpen(true);
  };

  // Open Detail Modal (If clicking the card body)
  const handleOpenDetail = (habit) => {
      setSelectedHabit(habit);
      setIsDetailModalOpen(true);
  };

  // Handle Start Incubation
  const handleStartIncubation = () => {
      setIsIncubating(true);
  };
  
  // Handle Hero Egg Click
  const handleEggClick = () => {
     if (totalScore >= 20) {
         setIsIncubating(true); // Trigger incubation immediately
         setCurrentView('incubate');
     }
  };

  // 3. Calculated Stats for Hero Section
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  // Use count/total logic or just count if previously requested, but standard is percentage
  const progressPercentage = totalHabits === 0 ? 0 : (completedHabits / totalHabits) * 100;
  const totalScore = completedHabits * 5;

  return (
    <div className="min-h-screen bg-[#FFFFF0] pb-32 max-w-md mx-auto relative overflow-hidden shadow-2xl">
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-pastel-yellow z-0 h-[50vh]" />
      <div className="absolute inset-0 top-[50vh] bg-[#FFFFF0] z-0" />

      <div className="relative z-10 font-sans min-h-screen flex flex-col">
        {currentView === 'home' ? (
          <>
            {/* Header with Rocket Trigger - Absolute Positioned to overlay Hero */}
            <div className="absolute top-0 left-0 w-full z-20">
                <Header 
                    onOpenTask={() => setIsTaskModalOpen(true)} 
                    onOpenPlanet={() => setCurrentView('planet')}
                />
            </div>
            
            {/* Hero with Dynamic Stats */}
            <Hero 
               completed={completedHabits} 
               total={totalHabits} 
               progress={progressPercentage}
               score={totalScore}
               onEggClick={handleEggClick} // Pass Handler
            />
            
            {/* Habit List */}
            <div className="mt-6 px-6 space-y-4 pb-24">
              {habits.map(habit => (
                <div 
                    key={habit.id}
                    onPointerDown={(e) => {
                        // Record exact screen coordinates when finger touches screen
                        clickStartPos.current = { x: e.clientX, y: e.clientY };
                    }}
                    onClick={(e) => {
                        // Calculate how far the cursor/finger moved
                        const moveX = Math.abs(e.clientX - clickStartPos.current.x);
                        const moveY = Math.abs(e.clientY - clickStartPos.current.y);

                        // THRESHOLD: 5px. If moved more than 5px, IT IS A SWIPE/DRAG.
                        if (moveX > 5 || moveY > 5) {
                            console.log("Swipe detected, click blocked.");
                            e.stopPropagation(); // Stop event bubbling
                            return; // EXIT IMMEDIATELY - DO NOT OPEN MODAL
                        }

                        // Only runs if movement was minimal (A pure tap)
                        handleOpenDetail(habit);
                    }}
                    className="touch-manipulation" // Optimize for touch
                >
                    <HabitCard 
                      habit={habit}
                      activeSwipeId={activeSwipeId}
                      onSwipe={setActiveSwipeId}
                      onToggle={handleToggleHabit} 
                      onEdit={handleStartEdit}
                      onDelete={handleDeleteHabit}
                      // onClick removed, handled by wrapper
                    />
                </div>
              ))}
              {habits.length === 0 && (
                  <div className="text-center text-gray-400 py-10 opacity-60">
                    目前沒有星願<br/>點擊下方 + 開始建立
                  </div>
              )}
            </div>
          </>
        ) : currentView === 'alien' ? (
          <AlienCollection />
        ) : currentView === 'incubate' ? (
          <IncubatePage 
            isIncubating={isIncubating}
            onStartIncubation={handleStartIncubation}
          />
        ) : currentView === 'planet' ? (
            <PlanetMap onBack={() => setCurrentView('home')} />
        ) : null}
      </div>

       {/* Modals placed outside the main flow */}
       <AchievementModal 
          isOpen={isTaskModalOpen} 
          onClose={() => setIsTaskModalOpen(false)} 
          score={totalScore}
       />

       <HabitDetailModal 
          isOpen={isDetailModalOpen}
          habit={selectedHabit}
          onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedHabit(null);
          }}
          onEdit={handleStartEdit}
       />

       <AddHabitModal 
          isOpen={isAddModalOpen} 
          onClose={() => {
              setIsAddModalOpen(false);
              setEditingHabit(null);
          }}
          onSave={handleSaveHabit}
          initialData={editingHabit}
       />

      <BottomNav 
        activeTab={currentView} 
        onNavigate={setCurrentView} 
        onOpenAdd={() => {
            setEditingHabit(null);
            setIsAddModalOpen(true);
        }} 
      />
    </div>
  );
}

export default App;
