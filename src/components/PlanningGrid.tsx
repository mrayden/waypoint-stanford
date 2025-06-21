
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
    <div className="h-full overflow-auto p-8">
      <div className="min-w-max">
        {/* Enhanced Header Row */}
        <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: `240px repeat(6, 280px)` }}>
          <div className="text-slate-300 font-semibold flex items-center gap-3 text-lg">
            <Calendar size={20} className="text-indigo-400" />
            Categories
          </div>
          {semesters.map(semester => (
            <div key={semester.id} className="text-center bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-white font-bold text-lg">{semester.name}</div>
              <div className="text-slate-400 text-sm font-medium">{semester.season} {semester.year}</div>
            </div>
          ))}
        </div>

        {/* Enhanced Grid Rows */}
        {categories.map(category => (
          <div key={category.id} className="grid gap-6 mb-6" style={{ gridTemplateColumns: `240px repeat(6, 280px)` }}>
            {/* Enhanced Category Header */}
            <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-slate-800/70 to-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className={`w-5 h-5 rounded-full bg-${category.color}-500 shadow-lg`}></div>
              <div>
                <div className="text-white font-semibold text-lg">{category.name}</div>
                <div className="text-slate-400 text-sm">
                  {goals.filter(g => g.category === category.id).length} goals
                </div>
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
        p-4 rounded-xl border-2 border-dashed transition-all duration-300 relative min-h-[140px] backdrop-blur-sm
        ${isOver 
          ? 'border-indigo-400 bg-indigo-400/20 shadow-lg shadow-indigo-400/25 scale-102' 
          : 'border-slate-600/50 bg-slate-800/30'
        }
        hover:border-slate-500/70 hover:bg-slate-800/50 hover:shadow-lg
      `}
    >
      <div className="space-y-3">
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
      
      {goals.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-slate-500 text-sm text-center font-medium">
            Drop goals here
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningGrid;
