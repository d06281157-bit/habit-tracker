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
import MorePage from './components/MorePage';
import AlienCard from './components/AlienCard';

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
  const [selectedDate, setSelectedDate] = useState('今天');
  const [selectedAlienCard, setSelectedAlienCard] = useState(null);
  const [showNav, setShowNav] = useState(true);

  // Incubation State Management (Persisted)
  const [incubationStatus, setIncubationStatus] = useState(() => {
    return localStorage.getItem('incubation_status') || 'idle'; // idle | incubating | ready
  });
  const [incubationStartTime, setIncubationStartTime] = useState(() => {
    const saved = localStorage.getItem('incubation_start_time');
    return saved ? parseInt(saved) : null;
  });
  const [eggProgress, setEggProgress] = useState(() => {
    return parseInt(localStorage.getItem('egg_progress') || '0');
  });

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

  // Hero Background State (Persisted)
  const [heroBackground, setHeroBackground] = useState(() => {
    return localStorage.getItem('hero_background') || 'desert-background.jpeg';
  });

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

  // Incubation Persistence
  useEffect(() => {
    localStorage.setItem('incubation_status', incubationStatus);
  }, [incubationStatus]);

  useEffect(() => {
    if (incubationStartTime) {
      localStorage.setItem('incubation_start_time', incubationStartTime.toString());
    } else {
      localStorage.removeItem('incubation_start_time');
    }
  }, [incubationStartTime]);

  useEffect(() => {
    localStorage.setItem('egg_progress', eggProgress.toString());
  }, [eggProgress]);

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
    const habit = habits.find(h => h.id === habitId);
    const wasCompleted = habit?.completed;
    
    setHabits(prev => prev.map(h => 
        h.id === habitId ? { ...h, completed: !h.completed } : h
    ));
    
    // Update egg progress only if in idle mode
    if (incubationStatus === 'idle') {
        if (!wasCompleted) {
            // Completing a habit: add 5 points (cap at 20)
            setEggProgress(prev => Math.min(prev + 5, 20));
        } else {
            // Uncompleting a habit: subtract 5 points (floor at 0)
            setEggProgress(prev => Math.max(prev - 5, 0));
        }
    }
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
      if (incubationStatus === 'idle' && eggProgress >= 20) {
          setIncubationStatus('incubating');
          setIncubationStartTime(Date.now());
      }
  };
  
  const handleEggClick = () => {
     if (incubationStatus === 'idle' && eggProgress >= 20) {
         handleStartIncubation();
         setCurrentView('incubate');
     } else if (incubationStatus === 'incubating' || incubationStatus === 'ready') {
         // If already incubating, just navigate to incubate page
         setCurrentView('incubate');
     }
  };

  // Reset incubation after taking pet home
  const handleTakePetHome = (targetView) => {
    const petId = 3; // Bloomthorn
    if (!unlockedAlienIds.includes(petId)) {
        setUnlockedAlienIds(prev => [...prev, petId]);
    }
    setHighlightAlienId(petId);
    // Move to completed state instead of idle
    setIncubationStatus('completed');
    setIncubationStartTime(null);
    setCurrentView(targetView);
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

  // Store incubationStatus in a ref for keyboard handler
  const incubationStatusRef = React.useRef(incubationStatus);
  React.useEffect(() => {
    incubationStatusRef.current = incubationStatus;
  }, [incubationStatus]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key.toUpperCase() === 'F') {
        e.preventDefault();
        handleResetDebug();
      }
      // Demo Mode Shortcut (Shift + D) - Fast forward incubation to last 5 seconds
      if (e.shiftKey && e.key.toUpperCase() === 'D') {
        e.preventDefault();
        console.log('[DEBUG] Shift+D pressed! Current status:', incubationStatusRef.current);
        
        // Force start incubation if not already incubating
        if (incubationStatusRef.current === 'idle') {
          setIncubationStatus('incubating');
        }
        
        // Fast forward to 5 seconds remaining
        const fastForwardTime = Date.now() - (7195 * 1000);
        setIncubationStartTime(fastForwardTime);
        console.log('[DEBUG] Incubation fast-forwarded to last 5 seconds');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty array is fine now because we use ref

  // Calculated Stats
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  const progressPercentage = totalHabits === 0 ? 0 : (completedHabits / totalHabits) * 100;
  
  // Daily Habit Score: Only for frog progress bar (X/20)
  const dailyHabitScore = completedHabits * 5;
  
  // Total Achievement Score (used for some displays but NOT for star badge in modal)
  const totalScore = dailyHabitScore + bonusScore;

  // Demo: Filter habits based on date
  // Switch to Mock Data when '2' is selected to show functionality
  const filteredHabits = selectedDate === '今天' 
    ? habits 
    : [
        { id: 991, title: '晨間冥想', icon: 'icon-plant', frequency: '1次, 每天', completed: false, reward: 5 },
        { id: 992, title: '閱讀 10 頁', icon: 'icon-book', frequency: '1次, 每天', completed: false, reward: 5 }
      ];

  // Logic: Which dates have been 'Fully Completed' (to show orange circle)
  // Demo Mock logic:
  const isDateCompleted = (date) => {
      if (date === '今天') return habits.length > 0 && habits.every(h => h.completed);
      if (date === '1' || date === '3') return true; // Mock that day 1 and 3 are done
      return false;
  };

  return (
    <div className="mockup-container">
      <div className="iphone-wrapper">
        <div className="iphone-notch" />
        <div className="iphone-screen">
          <div className={`flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar relative transition-colors duration-300 ${currentView === 'alien' ? 'bg-[#9B9FDE]' : 'bg-[#FFFFF0]'}`}
               onClick={() => activeSwipeId !== null && setActiveSwipeId(null)}>
            {currentView === 'home' && (
              <>
                <div className="absolute inset-x-0 bg-[#FFFFF0] z-0 h-[50vh] transition-all" />
                <div className="absolute inset-0 top-[50vh] bg-[#FFFFF0] z-0" />
              </>
            )}

            <div className="relative z-10 font-sans min-h-screen flex flex-col">
              {currentView === 'home' ? (
                <>
                  <div className="sticky top-0 left-0 w-full z-30">
                      <Header 
                          onOpenTask={() => setIsTaskModalOpen(true)} 
                          onOpenPlanet={() => setCurrentView('planet')}
                          selectedDate={selectedDate}
                          onSelectDate={setSelectedDate}
                          checkCompleted={isDateCompleted}
                      />
                  </div>
                  <div className="-mt-[204px]">
                      <Hero 
                         completed={selectedDate === '今天' ? completedHabits : 0} 
                         total={filteredHabits.length} 
                         progress={selectedDate === '今天' ? progressPercentage : 0}
                         score={selectedDate === '今天' ? eggProgress : 0}
                         incubationStatus={incubationStatus}
                         incubationStartTime={incubationStartTime}
                         onEggClick={handleEggClick}
                         backgroundImage={heroBackground}
                      />
                  </div>
                  
                  <div className="mt-6 px-6 space-y-4">
                    {filteredHabits.map(habit => (
                      <div 
                          key={habit.id}
                          onPointerDown={(e) => {
                              clickStartPos.current = { x: e.clientX, y: e.clientY };
                          }}
                          onClick={(e) => {
                              const moveX = Math.abs(e.clientX - clickStartPos.current.x || 0);
                              const moveY = Math.abs(e.clientY - clickStartPos.current.y || 0);
                              
                              if (activeSwipeId !== null) {
                                  setActiveSwipeId(null);
                                  return;
                              }
                              if (moveX > 10 || moveY > 10) {
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
                  onNavVisibilityChange={setShowNav}
                  onSelectAlien={setSelectedAlienCard}
                />
              ) : currentView === 'incubate' ? (
                <IncubatePage 
                  incubationStatus={incubationStatus}
                  incubationStartTime={incubationStartTime}
                  onStatusChange={setIncubationStatus}
                  onNavigateHome={(target = 'home') => {
                      if (target === 'alien') {
                          handleTakePetHome(target);
                      } else {
                          setCurrentView(target);
                      }
                  }}
                  onNavVisibilityChange={setShowNav}
                />
              ) : currentView === 'planet' ? (
                  <PlanetMap 
                    onBack={() => setCurrentView('home')} 
                    onSetBackground={(bg) => {
                      setHeroBackground(bg);
                      localStorage.setItem('hero_background', bg);
                    }}
                  />
              ) : currentView === 'ufo' ? (
                  <ShopPage score={totalScore} />
              ) : currentView === 'astronaut' ? (
                  <MorePage />
              ) : null}
            </div>
          </div>

          {/* Modals - Outside scrolling but inside iphone-screen */}
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

          {/* Alien Card Modal - Centered and Fixed within iphone-screen */}
          {selectedAlienCard && (
              <div
                  className="absolute inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
                  onClick={() => setSelectedAlienCard(null)}
              >
                  <div
                      className="relative w-[280px] aspect-[3/4.5]"
                      onClick={(e) => e.stopPropagation()}
                      style={{ animation: 'flipIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  >
                      {/* Note: In a real app we'd need to pass the full alien data or have a data fetcher here. 
                          For now we'll assume the component can handle it or we pass it from AlienCollection. */}
                      <AlienCard 
                          data={selectedAlienCard} 
                          isExpanded={true}
                          onUnlock={(id, price) => {
                              // We could wire this up to handleUnlock if needed, 
                              // but for the visual fix this is enough.
                              setSelectedAlienCard(null);
                          }}
                      />
                  </div>
              </div>
          )}

          {/* Bottom Navigation - Fixed within iphone-screen */}
          {(currentView !== 'planet' && ((currentView !== 'incubate' && currentView !== 'alien') || showNav)) && (
            <BottomNav 
              activeTab={isTaskModalOpen ? 'rocket' : currentView} 
              onNavigate={(view) => {
                  setIsTaskModalOpen(false);
                  setCurrentView(view);
              }} 
              onOpenAdd={() => {
                  setIsTaskModalOpen(false);
                  setEditingHabit(null);
                  setIsAddModalOpen(true);
              }} 
              onOpenTask={() => setIsTaskModalOpen(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
