
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Calendar } from 'lucide-react';
import { useGoalStore } from '../store/goalStore';
import GoalCard from './GoalCard';

const PlanningGrid = () => {
  const { goals, categories, semesters } = useGoalStore();

  const getGoalsForCell = (categoryId: string, semesterId: string) => {
    return goals.filter(goal => 
      goal.category === categoryId && goal.semester === semesterId
    );
  };

  return (
    <div className="h-full overflow-auto p-6">
      <div className="min-w-max">
        {/* Header Row */}
        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `200px repeat(6, 250px)` }}>
          <div className="text-slate-400 font-medium flex items-center gap-2">
            <Calendar size={16} />
            Categories
          </div>
          {semesters.map(semester => (
            <div key={semester.id} className="text-center bg-slate-800/30 rounded-lg p-3 border border-slate-700">
              <div className="text-white font-semibold">{semester.name}</div>
              <div className="text-slate-400 text-sm">{semester.season} {semester.year}</div>
            </div>
          ))}
        </div>

        {/* Grid Rows */}
        {categories.map(category => (
          <div key={category.id} className="grid gap-4 mb-4" style={{ gridTemplateColumns: `200px repeat(6, 250px)` }}>
            {/* Category Header */}
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className={`w-4 h-4 rounded-full bg-${category.color}-500`}></div>
              <div>
                <div className="text-white font-medium">{category.name}</div>
              </div>
            </div>

            {/* Semester Cells */}
            {semesters.map(semester => (
              <DropCell
                key={`${category.id}-${semester.id}`}
                id={`${category.id}-${semester.id}`}
                goals={getGoalsForCell(category.id, semester.id)}
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
}

const DropCell = ({ id, goals }: DropCellProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        p-3 rounded-lg border-2 border-dashed transition-all duration-200 relative min-h-[120px]
        ${isOver 
          ? 'border-indigo-400 bg-indigo-400/10' 
          : 'border-slate-600 bg-slate-800/30'
        }
        hover:border-slate-500 hover:bg-slate-800/50
      `}
    >
      <div className="space-y-2">
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
      
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
