
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Plus, MapPin, Globe, RotateCcw, Edit, User, ChevronDown, LogOut } from 'lucide-react';
import PlanningGrid from './PlanningGrid';
import GoalCard from './GoalCard';
import AddGoalModal from './AddGoalModal';
import MarketplaceView from './MarketplaceView';
import Sidebar from './Sidebar';
import { useGoalStore } from '../store/goalStore';
import { useOnboarding } from '../hooks/useOnboarding';
import { clearUserData, getUserData } from '../utils/cookieUtils';
import { Goal } from '../types/Goal';

const WaypointPlanner = () => {
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'local' | 'marketplace'>('local');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { moveGoal, resetGoals } = useGoalStore();
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
      const dropZoneId = over.id as string;
      const [category, semester] = dropZoneId.split('-').slice(0, 2);
      
      if (category && semester) {
        moveGoal(active.id as string, category, semester);
      }
    }
    
    setActiveGoal(null);
  };

  const handleDragCancel = () => {
    setActiveGoal(null);
  };

  const handleReset = () => {
    resetGoals();
    clearUserData();
    resetOnboarding();
    window.location.reload();
  };

  const renderContent = () => {
    if (activeTab === 'marketplace') {
      return <MarketplaceView onBackToLocal={() => setActiveTab('local')} />;
    }
    
    return (
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-50/50 via-white/30 to-slate-100/50 dark:from-slate-950/50 dark:via-slate-900/30 dark:to-slate-950/50">
            <PlanningGrid />
            
            {/* Floating Action Button */}
            <div className="absolute bottom-8 right-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                Add Goal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <DndContext 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Enhanced Header */}
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">W</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Waypoint</h1>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Plan Your Academic Journey</span>
                </div>
              </div>
              
              {/* Enhanced Tab Navigation */}
              <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('local')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'local'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <MapPin size={16} />
                  Planning
                </button>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'marketplace'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Globe size={16} />
                  Marketplace
                </button>
              </div>
            </div>
            
            {/* Account Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => resetOnboarding()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200"
              >
                <Edit size={16} />
                Edit Profile
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <RotateCcw size={16} />
                Reset All
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {userData?.name || 'Student'}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {userData?.grade || 'Grade Not Set'}
                    </div>
                  </div>
                  <ChevronDown size={16} className="text-slate-400" />
                </button>
                
                {showAccountMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                    <button
                      onClick={() => {
                        resetOnboarding();
                        setShowAccountMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 flex items-center gap-2"
                    >
                      <Edit size={14} />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        handleReset();
                        setShowAccountMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      Reset & Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {renderContent()}
        </div>
        
        {/* Drag Overlay */}
        <DragOverlay>
          {activeGoal && (
            <div className="transform rotate-2 scale-110 animate-pulse">
              <GoalCard goal={activeGoal} isDragging />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Add Goal Modal */}
      <AddGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default WaypointPlanner;
