
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Plus, Settings, RotateCcw, MapPin, Globe, User, ChevronDown, Sparkles } from 'lucide-react';
import PlanningGrid from './PlanningGrid';
import GoalCard from './GoalCard';
import AddGoalModal from './AddGoalModal';
import MarketplaceView from './MarketplaceView';
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
  };

  const renderContent = () => {
    if (activeTab === 'marketplace') {
      return <MarketplaceView onBackToLocal={() => setActiveTab('local')} />;
    }
    
    return (
      <div className="flex-1 overflow-hidden relative">
        <PlanningGrid />
        
        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-purple-500/25 rounded-2xl px-6 py-4 font-semibold transition-all duration-300 hover:scale-105 animate-pulse hover:animate-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
            }}
          >
            <div className="flex items-center gap-2">
              <Plus size={20} className="group-hover:rotate-90 transition-all duration-200" />
              <span className="hidden sm:inline">Add Goal</span>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Grainy texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.025'/%3E%3C/svg%3E")`,
        }}
      />
      
      <DndContext 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40 relative shadow-lg shadow-blue-500/5">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white/80 to-purple-50/50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
            }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                  <Sparkles className="text-white relative z-10" size={20} />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent tracking-tight">
                    Waypoint
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">Plan your academic journey</p>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <div className={`flex items-center gap-1 bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-lg border border-white/30 ${activeTab === 'marketplace' ? 'hidden sm:flex' : ''}`}>
                <button
                  onClick={() => setActiveTab('local')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'local'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }`}
                >
                  <MapPin size={16} />
                  <span className="hidden sm:inline">Local Planning</span>
                </button>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'marketplace'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }`}
                >
                  <Globe size={16} />
                  <span className="hidden sm:inline">Opportunities</span>
                </button>
              </div>

              {/* Account & Action Buttons */}
              <div className="flex items-center gap-3">
                {userData && (
                  <div className="relative">
                    <button
                      onClick={() => setShowAccountMenu(!showAccountMenu)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:text-gray-900 bg-white/80 hover:bg-white backdrop-blur-sm rounded-2xl transition-all duration-200 border border-white/30 shadow-sm hover:shadow-md group"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors duration-200"></div>
                        <span className="text-white text-sm font-bold relative z-10">
                          {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className="hidden sm:block text-left">
                        <div className="text-sm font-semibold">{userData.name || 'User'}</div>
                        <div className="text-xs text-gray-500">{userData.grade || 'Student'}</div>
                      </div>
                      <ChevronDown size={14} className="hidden sm:block text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                    </button>

                    {/* Account Dropdown */}
                    {showAccountMenu && (
                      <div className="absolute right-0 top-full mt-3 w-72 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl py-3 z-50 animate-scale-in">
                        <div className="px-5 py-3 border-b border-gray-100">
                          <div className="font-semibold text-gray-900">{userData.name}</div>
                          <div className="text-sm text-gray-600">{userData.email}</div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                            <span>{userData.grade}</span>
                            <span>•</span>
                            <span>GPA: {userData.gpa}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            resetOnboarding();
                            setShowAccountMenu(false);
                          }}
                          className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-colors duration-200"
                        >
                          <Settings size={16} />
                          Edit Profile
                        </button>
                        <button
                          onClick={() => {
                            handleReset();
                            setShowAccountMenu(false);
                          }}
                          className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-200"
                        >
                          <RotateCcw size={16} />
                          Reset All Data
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {!userData && (
                  <button
                    onClick={() => resetOnboarding()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:scale-105"
                  >
                    <Settings size={16} />
                    <span className="hidden sm:inline text-sm font-semibold">Setup</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 relative z-10">
          {renderContent()}
        </main>
        
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

      {/* Click outside to close account menu */}
      {showAccountMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowAccountMenu(false)}
        />
      )}
    </div>
  );
};

export default WaypointPlanner;
