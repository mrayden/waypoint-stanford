
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import PlanningGrid from './PlanningGrid';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import GoalCard from './GoalCard';
import { useGoalStore } from '../store/goalStore';
import { Goal } from '../types/Goal';

const WaypointPlanner = () => {
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const { moveGoal } = useGoalStore();

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

  return (
    <div className="h-screen flex overflow-hidden">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Left Panel */}
        <LeftPanel />
        
        {/* Main Planning Grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
                🗺️
              </div>
              Waypoint
              <span className="text-sm font-normal text-slate-400 ml-2">Visual Future Planner</span>
            </h1>
          </header>
          
          <div className="flex-1 overflow-hidden">
            <PlanningGrid />
          </div>
        </div>
        
        {/* Right Panel */}
        <RightPanel />
        
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
