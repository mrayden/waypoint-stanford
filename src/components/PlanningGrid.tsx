
import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ZoomIn, ZoomOut, Calendar } from 'lucide-react';
import { useGoalStore } from '../store/goalStore';
import GoalCard from './GoalCard';

const PlanningGrid = () => {
  const { goals, categories, semesters, filters } = useGoalStore();
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = normal, 0.75 = zoomed out, 1.25 = zoomed in

  const filteredGoals = goals.filter(goal => {
    if (filters.category !== 'all' && goal.category !== filters.category) return false;
    if (filters.semester !== 'all' && goal.semester !== filters.semester) return false;
    return true;
  });

  const getGoalsForCell = (categoryId: string, semesterId: string) => {
    return filteredGoals.filter(goal => 
      goal.category === categoryId && goal.semester === semesterId
    );
  };

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 1.5));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));

  const getCellSize = () => {
    const baseSize = 200;
    return baseSize * zoomLevel;
  };

  return (
    <div className="h-full overflow-auto p-6 relative">
      {/* Calendar-style grid background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${getCellSize() + 16}px ${120 * zoomLevel + 16}px`
        }}
      />

      {/* Zoom Controls */}
      <div className="fixed top-20 right-96 z-10 flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm rounded-lg p-2 border border-slate-700">
        <Calendar size={16} className="text-slate-400" />
        <button
          onClick={zoomOut}
          className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
          disabled={zoomLevel <= 0.5}
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-slate-300 text-sm min-w-[3rem] text-center">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={zoomIn}
          className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
          disabled={zoomLevel >= 1.5}
        >
          <ZoomIn size={16} />
        </button>
      </div>

      <div className="min-w-max" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
        {/* Header Row */}
        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `200px repeat(6, ${getCellSize()}px)` }}>
          <div className="text-slate-400 font-medium flex items-center gap-2">
            <Calendar size={16} />
            Categories
          </div>
          {semesters.map(semester => (
            <div key={semester.id} className="text-center bg-slate-800/30 rounded-lg p-3 border border-slate-700">
              <div className="text-white font-semibold">{semester.name}</div>
              <div className="text-slate-400 text-sm">{semester.season} {semester.year}</div>
              <div className="text-xs text-slate-500 mt-1">
                {filteredGoals.filter(g => g.semester === semester.id).length} goals
              </div>
            </div>
          ))}
        </div>

        {/* Grid Rows */}
        {categories.map(category => (
          <div key={category.id} className="grid gap-4 mb-4" style={{ gridTemplateColumns: `200px repeat(6, ${getCellSize()}px)` }}>
            {/* Category Header */}
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className={`w-4 h-4 rounded-full bg-${category.color}-500`}></div>
              <div>
                <div className="text-white font-medium">{category.name}</div>
                <div className="text-slate-400 text-sm">
                  {filteredGoals.filter(g => g.category === category.id).length} goals
                </div>
              </div>
            </div>

            {/* Semester Cells */}
            {semesters.map(semester => (
              <DropCell
                key={`${category.id}-${semester.id}`}
                id={`${category.id}-${semester.id}`}
                goals={getGoalsForCell(category.id, semester.id)}
                cellSize={getCellSize()}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

interface DropCellProps {
  id: string;
  goals: any[];
  cellSize: number;
}

const DropCell = ({ id, goals, cellSize }: DropCellProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        p-3 rounded-lg border-2 border-dashed transition-all duration-200 relative
        ${isOver 
          ? 'border-indigo-400 bg-indigo-400/10' 
          : 'border-slate-600 bg-slate-800/30'
        }
        hover:border-slate-500 hover:bg-slate-800/50
      `}
      style={{ 
        minHeight: `${120}px`,
        width: `${cellSize}px`,
        backgroundImage: `
          linear-gradient(to right, rgba(148, 163, 184, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148, 163, 184, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}
    >
      <div className="space-y-2">
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
      
      {/* Calendar-style date indicator */}
      {goals.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-slate-600 text-xs text-center">
            Drop goals here
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningGrid;
