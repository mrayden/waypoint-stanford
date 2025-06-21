
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useGoalStore } from '../store/goalStore';
import GoalCard from './GoalCard';

const PlanningGrid = () => {
  const { goals, categories, semesters, filters } = useGoalStore();

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

  return (
    <div className="h-full overflow-auto p-6">
      <div className="min-w-max">
        {/* Header Row */}
        <div className="grid grid-cols-[200px_repeat(6,200px)] gap-4 mb-4">
          <div className="text-slate-400 font-medium">Categories</div>
          {semesters.map(semester => (
            <div key={semester.id} className="text-center">
              <div className="text-white font-semibold">{semester.name}</div>
              <div className="text-slate-400 text-sm">{semester.season} {semester.year}</div>
            </div>
          ))}
        </div>

        {/* Grid Rows */}
        {categories.map(category => (
          <div key={category.id} className="grid grid-cols-[200px_repeat(6,200px)] gap-4 mb-4">
            {/* Category Header */}
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <span className="text-2xl">{category.icon}</span>
              <div>
                <div className="text-white font-medium">{category.name}</div>
                <div className="text-slate-400 text-sm">
                  {getGoalsForCell(category.id, '').length} goals
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
        min-h-[120px] p-3 rounded-lg border-2 border-dashed transition-all duration-200
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
    </div>
  );
};

export default PlanningGrid;
