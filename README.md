# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Project Status: Star Habit Tracker
Date: 2025-12-13 Version: Beta 1.0 (UI Polish & Incubation Added)

📌 Project Overview
A gamified habit tracker featuring a "Frog" character, XP system, and "Alien/Egg" incubation mechanics. The UI uses a specific "Glassmorphism" + "Pastel" aesthetic.

✅ Completed Features

1. Core Architecture (
   App.jsx
   )
   State Management: Centralized state for habits, score, activeSwipeId, and isIncubating.
   Navigation: View-based routing (home | incubate | alien).
   Persistence: localStorage integration for habit data.
   Data Flow:
   handleSaveHabit
   manages both Add and Edit actions, ensuring immediate UI updates.
2. UI Components & Design
   Header: Glassmorphism style (bg-white/30, blur), carefully positioned to not overlap the Hero.
   Hero Section:
   Dynamic XP Bar (Shows Score/20).
   Interactive Egg: Glows/Pulses and becomes clickable only when Score >= 20.
   Habit Card ("Purple Card"):
   Design: Solid purple background (#E3E7FF), rounded corners, "Lid" effect.
   Swipe Interaction: "Drawer" style swipe (Lid slides left, buttons stay put).
   Exclusive State: Only one card can be swiped open at a time (centralized activeSwipeId).
   Desktop Support: Mouse-drag swipe enabled.
3. Gamification (Incubation)
   Incubate Page:
   Idle State: Cloud with "+" button (Unstarted).
   Incubating State: Spotted Egg on cloud + 3-hour countdown timer.
   Entry Points:
   Bottom Navigation Bar ("Incubate" tab).
   Hero Section (Clicking the unlocked Egg).
   🛠 Recent Fixes
   Navigation Flow: Saving a habit (Add/Edit) now forces a return to the Home screen and closes all modals.
   Swipe Logic: Fixed activeSwipeId reference error; refined Z-index layering for true "reveal" effect.
   Visuals: Adjusted Header height and Progress Bar logic.
   📋 Next Steps (Pending/Ideas)
   Alien Collection: The AlienCollection page is currently a placeholder; needs full implementation of the grid/unlock system.
   Incubation Logic: Connect the "Finish Incubation" state to actually unlocking a new Alien (currently just a timer demo).
   Mobile optimization: Further touch testing on actual mobile devices.
   📂 Key Files
   src/App.jsx
   : Main logic hub.
   src/components/HabitCard.jsx
   : Complex swipe & render logic.
   src/components/Hero.jsx
   : Score & Egg interaction.
   src/components/IncubatePage.jsx
   : Incubation UI.

Gamified Habit Tracker - 專案摘要 (Project Summary)
Date: 2025-12-17 Context: 用於延續開發進度的專案狀態總覽。

1. 專案概況 (Overview)
   這是一個結合 養成遊戲 (Gamification) 元素的習慣追蹤應用程式。用戶透過完成日常習慣 (Habits) 累積積分，孵化寵物 (Incubation)，並解鎖成就與星球。

Tech Stack: React (Vite), Tailwind CSS
Data Persistence: LocalStorage (my_habits_data) 2. 核心功能與組件 (Key Features & Components)
主畫面 (Home)
App.jsx
: 應用程式入口，管理 currentView (Home / Alien / Incubate / Planet) 與全域狀態 (Habits, Score)。
Hero.jsx: 顯示當前進度與積分。中間的寵物蛋有點擊互動 (滿 20 分進入孵化頁)。
HabitCard.jsx
: 習慣卡片，支援點擊查看詳情、滑動 (Swipe) 編輯/刪除。
Header.jsx
: 頂部導航，包含 Rocket Icon (成就) 與 Planet Icon (星球地圖)。
遊戲化系統 (Gamification)
星球地圖 (
PlanetMap.jsx
) [NEW]:
Layout: 採用 "Central Orbital Focus" (中央軌道焦點) 設計。
Interaction: 類似 Cover Flow 的左右切換，未解鎖星球顯示鎖定並變灰。
Visuals: 3D 懸浮動畫、星空背景、動態光影。
成就系統 (
AchievementModal.jsx
):
Layout: "Goal Board" 風格，使用 Flexbox 避免跑版。
Design: 里程碑節點為 "橫向膠囊 (Capsules)"，達成顯示紫色 (Purple)，未達成顯示灰色 (Gray)，統一樣式。
Logic: 積分達到且未領取時，按鈕顯示粉色 (Pink) 可點擊。
孵化系統 (IncubatePage.jsx):
點擊 Hero 蛋進入，顯示雲朵進度條 (CloudProgressBar)，狀態分為鎖定與孵化中。
收藏圖鑑 (AlienCollection.jsx): 展示已收集的外星寵物。
UI/UX 細節
Strict Click/Swipe Logic: 在
App.jsx
中實作了 5px 閾值的座標陷阱，防止滑動時誤觸卡片詳情。
Modals: 包含
AddHabitModal
(新增/編輯)、HabitDetailModal (詳情)、
IconSelectionModal
(圖標選擇)。 3. 最近一次更新 (Recent Updates)
Planet Map 重構: 從垂直列表改為 沉浸式中央旋轉展示。
Achievement UI 優化: 修正 1000 分里程碑被切到的問題，改用 Flexbox + Capsule 設計。
Git 初始化: 完成本地 Git init, commit, 並設定 remote origin。 4. 待辦事項/未來建議 (Future Roadmap)
後端整合: 目前資料僅存在 LocalStorage，未來可接 Firebase 或 Supabase。
孵化動畫: 實作從蛋孵化出寵物的實際過場動畫。
音效: 加入點擊、升級、完成任務的音效。
rwd: 手機版已優化，可檢查桌面版適配性。
此 MD 可在下次對話時提供，以便快速恢復開發環境與上下文。
