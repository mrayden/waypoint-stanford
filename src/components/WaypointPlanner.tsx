
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Plus, MapPin, Globe, RotateCcw, Edit } from 'lucide-react';
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
    
    // Only move if dropped over a valid drop zone
    if (over && active.id !== over.id) {
      const dropZoneId = over.id as string;
      const [category, semester] = dropZoneId.split('-').slice(0, 2);
      
      if (category && semester) {
        moveGoal(active.id as string, category, semester);
      }
    }
    
    // Always clear the active goal when drag ends
    setActiveGoal(null);
  };

  const handleDragCancel = () => {
    // Clear active goal when drag is cancelled
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-950/50 via-slate-900/50 to-slate-950/50">
          <PlanningGrid />
          
          {/* Floating Action Buttons */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg animate-fade-in group"
            >
              <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
              Add Goal
            </button>
            <button
              onClick={() => resetOnboarding()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600/90 hover:bg-blue-500 backdrop-blur-sm text-white rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg animate-fade-in"
            >
              <Edit size={18} />
              Modify Path
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-red-600/90 hover:bg-red-500 backdrop-blur-sm text-white rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg animate-fade-in"
            >
              <RotateCcw size={18} />
              Reset All
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DndContext 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Enhanced Header */}
        <header className="bg-slate-800/60 backdrop-blur-lg border-b border-slate-700/50 p-6 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                W
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Waypoint</h1>
                <span className="text-sm text-slate-400 font-medium">Plan Your Academic Journey</span>
              </div>
            </div>
            
            {/* Enhanced Tab Navigation */}
            <div className="flex gap-3 bg-slate-700/30 backdrop-blur-sm p-2 rounded-xl border border-slate-600/50">
              <button
                onClick={() => setActiveTab('local')}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'local'
                    ? 'bg-green-600 text-white shadow-lg scale-105 shadow-green-600/25'
                    : 'bg-transparent text-slate-300 hover:bg-slate-600/50 hover:text-white hover:scale-102'
                }`}
              >
                <MapPin size={18} />
                Local Planning
              </button>
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'marketplace'
                    ? 'bg-blue-600 text-white shadow-lg scale-105 shadow-blue-600/25'
                    : 'bg-transparent text-slate-300 hover:bg-slate-600/50 hover:text-white hover:scale-102'
                }`}
              >
                <Globe size={18} />
                Marketplace
              </button>
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
            <div className="transform rotate-3 scale-110 animate-scale-in">
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
