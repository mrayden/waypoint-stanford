
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Plus, Settings, RotateCcw, MapPin, Globe } from 'lucide-react';
import PlanningGrid from './PlanningGrid';
import GoalCard from './GoalCard';
import AddGoalModal from './AddGoalModal';
import MarketplaceView from './MarketplaceView';
import { useGoalStore } from '../store/goalStore';
import { useOnboarding } from '../hooks/useOnboarding';
import { clearUserData } from '../utils/cookieUtils';
import { Goal } from '../types/Goal';

const WaypointPlanner = () => {
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'local' | 'marketplace'>('local');
  const { moveGoal, resetGoals } = useGoalStore();
  const { resetOnboarding } = useOnboarding();

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
      <div className="flex-1 overflow-hidden">
        <PlanningGrid />
        
        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6 z-10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border border-gray-200 shadow-lg hover:shadow-xl rounded-2xl px-5 py-3 font-medium transition-all duration-200 hover:scale-105"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`,
            }}
          >
            <div className="flex items-center gap-2">
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
              Add Goal
            </div>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative">
      {/* Grainy texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.015'/%3E%3C/svg%3E")`,
        }}
      />
      
      <DndContext 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-40 relative">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`,
            }}
          />
          <div className="max-w-7xl mx-auto px-6 py-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-sm">W</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Waypoint</h1>
                  <p className="text-sm text-gray-500">Plan your academic journey</p>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl backdrop-blur-sm">
                <button
                  onClick={() => setActiveTab('local')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'local'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MapPin size={16} />
                  Local Planning
                </button>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'marketplace'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Globe size={16} />
                  Marketplace
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => resetOnboarding()}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-colors duration-200"
                >
                  <Settings size={16} />
                  <span className="text-sm">Modify</span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50/80 rounded-lg transition-colors duration-200"
                >
                  <RotateCcw size={16} />
                  <span className="text-sm">Reset</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 relative">
          {renderContent()}
        </main>
        
        {/* Drag Overlay */}
        <DragOverlay>
          {activeGoal && (
            <div className="transform rotate-2 scale-105">
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
