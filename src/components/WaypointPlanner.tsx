
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { User, RotateCcw } from 'lucide-react';
import PlanningGrid from './PlanningGrid';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import GoalCard from './GoalCard';
import { useGoalStore } from '../store/goalStore';
import { useOnboarding } from '../hooks/useOnboarding';
import { getUserData, clearUserData } from '../utils/cookieUtils';
import { Goal } from '../types/Goal';

const WaypointPlanner = () => {
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
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

  return (
    <div className="h-screen flex overflow-hidden relative">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Left Panel */}
        <LeftPanel />
        
        {/* Main Planning Grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                  W
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Waypoint</h1>
                  <span className="text-sm text-slate-400">Visual Future Planner</span>
                </div>
              </div>
              
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
          </header>
          
          <div className="flex-1 overflow-hidden">
            <PlanningGrid />
          </div>
        </div>
        
        {/* Right Panel */}
        <RightPanel />
        
        {/* Reset Button - Bottom Left */}
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
        
        {/* Drag Overlay */}
        <DragOverlay>
          {activeGoal && (
            <div className="transform rotate-3 scale-105">
              <GoalCard goal={activeGoal} isDragging />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default WaypointPlanner;
