
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Calendar, BookOpen } from 'lucide-react';
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
        <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `280px repeat(6, 300px)` }}>
          <div className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-3 text-lg px-4">
            <BookOpen size={20} className="text-blue-500" />
            Categories
          </div>
          {semesters.map(semester => (
            <div key={semester.id} className="text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-slate-900 dark:text-white font-bold text-lg">{semester.name}</div>
              <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">{semester.season} {semester.year}</div>
            </div>
          ))}
        </div>

        {/* Enhanced Grid Rows */}
        {categories.map(category => (
          <div key={category.id} className="grid gap-4 mb-6" style={{ gridTemplateColumns: `280px repeat(6, 300px)` }}>
            {/* Enhanced Category Header */}
            <div className="flex items-center gap-4 p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className={`w-4 h-4 rounded-full bg-${category.color}-500 shadow-sm`}></div>
              <div>
                <div className="text-slate-900 dark:text-white font-semibold text-lg">{category.name}</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">
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
        p-4 rounded-2xl border-2 border-dashed transition-all duration-300 relative min-h-[160px] backdrop-blur-sm
        ${isOver 
          ? 'border-blue-400 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-md shadow-blue-200/50 dark:shadow-blue-500/20 scale-[1.02]' 
          : 'border-slate-300/50 dark:border-slate-600/50 bg-white/30 dark:bg-slate-800/30'
        }
        hover:border-slate-400/50 dark:hover:border-slate-500/50 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:shadow-sm
      `}
    >
      <div className="space-y-3">
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
      
      {goals.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-slate-500 dark:text-slate-400 text-sm text-center font-medium">
            Drop goals here
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningGrid;
