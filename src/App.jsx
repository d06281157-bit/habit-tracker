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
import PlanetMap from './components/PlanetMap';
import ShopPage from './components/ShopPage';

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
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Selection States
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [editingHabit, setEditingHabit] = useState(null);
  const [activeSwipeId, setActiveSwipeId] = useState(null);
  const [isIncubating, setIsIncubating] = useState(false);
  const [showNav, setShowNav] = useState(true);

  // Click Tracking Ref
  const clickStartPos = useRef({ x: 0, y: 0 });

  // Achievement and Persistence States
  const [bonusScore, setBonusScore] = useState(() => {
    return parseInt(localStorage.getItem('achievement_bonus_score') || '0');
  });
  const [goldScore, setGoldScore] = useState(() => {
    return parseInt(localStorage.getItem('achievement_gold_score') || '0');
  });
  const [claimedMilestones, setClaimedMilestones] = useState(() => {
    const saved = localStorage.getItem('claimed_milestones');
    return saved ? JSON.parse(saved) : [];
  });
  const [claimedTaskIds, setClaimedTaskIds] = useState(() => {
    const saved = localStorage.getItem('claimed_task_ids');
    return saved ? JSON.parse(saved) : [];
  });
  const [unlockedAlienIds, setUnlockedAlienIds] = useState(() => {
    const saved = localStorage.getItem('unlocked_alien_ids');
    return saved ? JSON.parse(saved) : [1]; // Start with ID 1 unlocked
  });
  const [highlightAlienId, setHighlightAlienId] = useState(null);

  // Data Persistence
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('my_habits_data');
    if (saved) {
        try { return JSON.parse(saved); } catch(e) { return DEFAULT_HABITS; }
    }
    return DEFAULT_HABITS;
  });

  // Auto-save effects
  useEffect(() => {
    localStorage.setItem('my_habits_data', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('achievement_bonus_score', bonusScore.toString());
  }, [bonusScore]);

  useEffect(() => {
    localStorage.setItem('achievement_gold_score', goldScore.toString());
  }, [goldScore]);

  useEffect(() => {
    localStorage.setItem('claimed_milestones', JSON.stringify(claimedMilestones));
  }, [claimedMilestones]);

  useEffect(() => {
    localStorage.setItem('claimed_task_ids', JSON.stringify(claimedTaskIds));
  }, [claimedTaskIds]);

  useEffect(() => {
    localStorage.setItem('unlocked_alien_ids', JSON.stringify(unlockedAlienIds));
  }, [unlockedAlienIds]);

  // Logic Functions
  const handleSaveHabit = (habitData) => {
      if (editingHabit) {
        setHabits(prev => prev.map(h => h.id === editingHabit.id ? { ...h, ...habitData } : h));
        setEditingHabit(null);
      } else {
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
      setEditingHabit(null);
      setSelectedHabit(null); 
      setIsDetailModalOpen(false);
  };

  const handleDeleteHabit = (habitId) => {
    if (window.confirm('確定要刪除這個星願嗎？')) {
        setHabits(prev => prev.filter(h => h.id !== habitId));
    }
  };

  const handleToggleHabit = (habitId) => {
    setHabits(prev => prev.map(h => 
        h.id === habitId ? { ...h, completed: !h.completed } : h
    ));
  };

  const handleStartEdit = (habit) => {
      setEditingHabit(habit);
      setIsDetailModalOpen(false);
      setIsAddModalOpen(true);
  };

  const handleOpenDetail = (habit) => {
      setSelectedHabit(habit);
      setIsDetailModalOpen(true);
  };

  const handleStartIncubation = () => {
      setIsIncubating(true);
  };
  
  const handleEggClick = () => {
     if (dailyHabitScore >= 20) {
         setIsIncubating(true);
         setCurrentView('incubate');
     }
  };

  const handleResetDebug = () => {
    console.log('[DEBUG] handleResetDebug initiated');
    setTimeout(() => {
      const confirmed = window.confirm('確定要重置所有積分與任務嗎？\n(注意：此操作將清除所有進度並刷新頁面)');
      if (confirmed) {
          setBonusScore(0);
          setGoldScore(0);
          setClaimedMilestones([]);
          setClaimedTaskIds([]);
          setHabits(prev => prev.map(h => ({ ...h, completed: false })));
          localStorage.clear(); 
          alert('已完成重置，頁面即將刷新。');
          window.location.reload(); 
      }
    }, 10);
  };

  useEffect(() => {
    window.resetApp = handleResetDebug;
  }, [habits, bonusScore, claimedMilestones, claimedTaskIds]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key.toUpperCase() === 'F') {
        e.preventDefault();
        handleResetDebug();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Calculated Stats
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  const progressPercentage = totalHabits === 0 ? 0 : (completedHabits / totalHabits) * 100;
  
  // Daily Habit Score: Only for frog progress bar (X/20)
  const dailyHabitScore = completedHabits * 5;
  
  // Total Achievement Score (used for some displays but NOT for star badge in modal)
  const totalScore = dailyHabitScore + bonusScore;

  return (
    <div className="min-h-screen bg-[#FFFFF0] pb-32 w-full max-w-md mx-auto relative overflow-x-hidden shadow-2xl">
      <div className="absolute inset-x-0 bg-pastel-yellow z-0 h-[50vh] transition-all" />
      <div className="absolute inset-0 top-[50vh] bg-[#FFFFF0] z-0" />

      <div className="relative z-10 font-sans min-h-screen flex flex-col">
        {currentView === 'home' ? (
          <>
            <div className="absolute top-0 left-0 w-full z-20">
                <Header 
                    onOpenTask={() => setIsTaskModalOpen(true)} 
                    onOpenPlanet={() => setCurrentView('planet')}
                />
            </div>
            
            <Hero 
               completed={completedHabits} 
               total={totalHabits} 
               progress={progressPercentage}
               score={dailyHabitScore}
               onEggClick={handleEggClick}
            />
            
            <div className="mt-6 px-6 space-y-4 pb-24">
              {habits.map(habit => (
                <div 
                    key={habit.id}
                    onPointerDown={(e) => {
                        clickStartPos.current = { x: e.clientX, y: e.clientY };
                    }}
                    onClick={(e) => {
                        const moveX = Math.abs(e.clientX - clickStartPos.current.x);
                        const moveY = Math.abs(e.clientY - clickStartPos.current.y);
                        if (moveX > 5 || moveY > 5) {
                            e.stopPropagation();
                            return;
                        }
                        handleOpenDetail(habit);
                    }}
                    className="touch-manipulation h-24"
                >
                    <HabitCard 
                      habit={habit}
                      activeSwipeId={activeSwipeId}
                      onSwipe={setActiveSwipeId}
                      onToggle={handleToggleHabit} 
                      onEdit={handleStartEdit}
                      onDelete={handleDeleteHabit}
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
          <AlienCollection 
            unlockedIds={unlockedAlienIds} 
            highlightId={highlightAlienId}
            onClearHighlight={() => setHighlightAlienId(null)}
          />
        ) : currentView === 'incubate' ? (
          <IncubatePage 
            isIncubating={isIncubating}
            onStartIncubation={handleStartIncubation}
            onNavigateHome={(target = 'home') => {
                if (target === 'alien') {
                    // Logic: Unlock ID 3 (Bloomthorn) for now
                    const petId = 3; 
                    if (!unlockedAlienIds.includes(petId)) {
                        setUnlockedAlienIds(prev => [...prev, petId]);
                    }
                    setHighlightAlienId(petId);
                }
                setCurrentView(target);
            }}
            onNavVisibilityChange={setShowNav}
          />
        ) : currentView === 'planet' ? (
            <PlanetMap onBack={() => setCurrentView('home')} />
        ) : currentView === 'ufo' ? (
            <ShopPage score={totalScore} />
        ) : null}
      </div>

       {/* Modals */}
       <AchievementModal 
          isOpen={isTaskModalOpen} 
          onClose={() => setIsTaskModalOpen(false)} 
          score={bonusScore}
          goldScore={goldScore}
          completedHabitsCount={completedHabits}
          claimedMilestones={claimedMilestones}
          onClaimMilestone={(mScore, reward) => {
             setClaimedMilestones(prev => [...prev, mScore]);
             setGoldScore(prev => prev + reward);
          }}
          claimedTaskIds={claimedTaskIds}
          onClaimTask={(id, points) => {
             setClaimedTaskIds(prev => [...prev, id]);
             setBonusScore(prev => prev + points);
          }}
          onReset={handleResetDebug}
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


      {currentView !== 'planet' && (currentView !== 'incubate' || showNav) && (
        <BottomNav 
          activeTab={currentView} 
          onNavigate={setCurrentView} 
          onOpenAdd={() => {
              setEditingHabit(null);
              setIsAddModalOpen(true);
          }} 
        />
      )}
    </div>
  );
}

export default App;
