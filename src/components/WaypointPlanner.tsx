
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Plus, MapPin, Globe, RotateCcw, Info } from 'lucide-react';
import PlanningGrid from './PlanningGrid';
import GoalCard from './GoalCard';
import AddGoalModal from './AddGoalModal';
import MarketplaceView from './MarketplaceView';
import { useGoalStore } from '../store/goalStore';
import { Goal } from '../types/Goal';

const WaypointPlanner = () => {
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'local' | 'marketplace'>('local');
  const { moveGoal, resetGoals, goals, categories, semesters } = useGoalStore();

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

  const renderContent = () => {
    if (activeTab === 'marketplace') {
      return <MarketplaceView onBackToLocal={() => setActiveTab('local')} />;
    }
    
    return (
      <div className="flex-1 relative overflow-hidden">
        <PlanningGrid />
        
        {/* Floating Create Goal Section */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full font-medium transition-all duration-200 hover:scale-105 shadow-lg animate-fade-in"
          >
            <Plus size={20} />
            Add Goal
          </button>
          <button
            onClick={resetGoals}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full font-medium transition-all duration-200 hover:scale-105 shadow-lg animate-fade-in"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        {/* Summary Section */}
        <div className="absolute bottom-6 left-6 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-4 max-w-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-indigo-400" />
            <h3 className="text-white font-medium">Planning Summary</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Total Goals:</span>
              <span className="text-white font-medium">{goals.length}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Categories:</span>
              <span className="text-white font-medium">{categories.length}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Semesters:</span>
              <span className="text-white font-medium">{semesters.length}</span>
            </div>
            <div className="pt-2 border-t border-slate-600">
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Completed:</span>
                <span className="text-green-400 font-medium">
                  {goals.filter(g => g.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>In Progress:</span>
                <span className="text-yellow-400 font-medium">
                  {goals.filter(g => g.status === 'in-progress').length}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Planned:</span>
                <span className="text-blue-400 font-medium">
                  {goals.filter(g => g.status === 'planned').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Header with Navigation */}
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                W
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Waypoint</h1>
                <span className="text-sm text-slate-400">Plan Your Future</span>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('local')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'local'
                    ? 'bg-green-600 text-white scale-105'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-102'
                }`}
              >
                <MapPin size={16} />
                Local Planning
              </button>
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'marketplace'
                    ? 'bg-blue-600 text-white scale-105'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-102'
                }`}
              >
                <Globe size={16} />
                Marketplace
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        {renderContent()}
        
        {/* Drag Overlay */}
        <DragOverlay>
          {activeGoal && (
            <div className="transform rotate-3 scale-105 animate-scale-in">
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
