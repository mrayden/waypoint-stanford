
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { User, RotateCcw, MapPin, Globe, HelpCircle } from 'lucide-react';
import PlanningGrid from './PlanningGrid';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import MarketplaceView from './MarketplaceView';
import GoalCard from './GoalCard';
import WelcomeGuide from './WelcomeGuide';
import { useGoalStore } from '../store/goalStore';
import { useOnboarding } from '../hooks/useOnboarding';
import { getUserData, clearUserData } from '../utils/cookieUtils';
import { Goal } from '../types/Goal';

const WaypointPlanner = () => {
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [activeTab, setActiveTab] = useState<'local' | 'marketplace'>('local');
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(() => {
    return !localStorage.getItem('waypoint-welcome-seen');
  });
  const { moveGoal } = useGoalStore();
  const { resetOnboarding } = useOnboarding();
  const userData = getUserData();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const goal = useGoalStore.getState().goals.find(g => g.id === active.id);
    setActiveGoal(goal || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const [category, semester] = (over.id as string).split('-');
      moveGoal(active.id as string, category, semester);
    }
    
    setActiveGoal(null);
  };

  const handleResetAccount = () => {
    if (confirm('Are you sure you want to reset your account? This will clear all your data and restart the onboarding process.')) {
      clearUserData();
      resetOnboarding();
      window.location.reload();
    }
  };

  const handleCloseWelcomeGuide = () => {
    localStorage.setItem('waypoint-welcome-seen', 'true');
    setShowWelcomeGuide(false);
  };

  const showWelcomeGuideAgain = () => {
    setShowWelcomeGuide(true);
  };

  return (
    <div className="h-screen flex overflow-hidden relative">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Left Panel - only show for local tab */}
        {activeTab === 'local' && <LeftPanel activeTab={activeTab} />}
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                    W
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Waypoint</h1>
                    <span className="text-sm text-slate-400">Visual Future Planner</span>
                  </div>
                </div>

                {/* Local/Marketplace Tab Switcher */}
                <div className="flex bg-slate-700/50 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('local')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'local' 
                        ? 'bg-green-600 text-white shadow-lg' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                    }`}
                  >
                    <MapPin size={16} />
                    My Plan
                  </button>
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'marketplace' 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                    }`}
                  >
                    <Globe size={16} />
                    Marketplace
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={showWelcomeGuideAgain}
                  className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition-colors"
                  title="Show welcome guide"
                >
                  <HelpCircle size={18} />
                  <span className="text-sm">Guide</span>
                </button>

                {userData && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <User size={18} />
                    <div className="text-right">
                      <div className="text-sm font-medium">{userData.name}</div>
                      <div className="text-xs text-slate-400">{userData.grade}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tab Description - only show for local tab */}
            {activeTab === 'local' && (
              <div className="mt-3 p-3 rounded-lg bg-slate-700/30 border border-slate-600/50">
                <p className="text-slate-300 text-sm">
                  <span className="text-green-400 font-medium">My Plan:</span> Organize your academic journey with visual planning. 
                  Drag and drop goals between semesters and track your progress towards graduation.
                </p>
              </div>
            )}
          </header>
          
          <div className="flex-1 overflow-hidden">
            {activeTab === 'local' ? <PlanningGrid /> : <MarketplaceView />}
          </div>
        </div>
        
        {/* Right Panel - only show for local tab */}
        {activeTab === 'local' && <RightPanel />}
        
        {/* Reset Button - Bottom Left - only show for local tab */}
        {activeTab === 'local' && (
          <div className="absolute bottom-6 left-6 z-50">
            <button
              onClick={handleResetAccount}
              className="flex items-center gap-2 px-4 py-3 bg-slate-800/90 hover:bg-slate-700/90 backdrop-blur-sm text-slate-300 hover:text-white rounded-lg text-sm transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50 shadow-lg"
              title="Reset account and restart onboarding"
            >
              <RotateCcw size={16} />
              Reset Account
            </button>
          </div>
        )}
        
        {/* Drag Overlay - only for local tab */}
        {activeTab === 'local' && (
          <DragOverlay>
            {activeGoal && (
              <div className="transform rotate-3 scale-105">
                <GoalCard goal={activeGoal} isDragging />
              </div>
            )}
          </DragOverlay>
        )}
      </DndContext>

      {/* Welcome Guide */}
      {showWelcomeGuide && (
        <WelcomeGuide onClose={handleCloseWelcomeGuide} />
      )}
    </div>
  );
};

export default WaypointPlanner;
