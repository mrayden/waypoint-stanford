
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
    <div className="h-full overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Academic Planning Grid</h2>
          </div>
          <p className="text-gray-600 text-sm">Organize your goals by category and semester</p>
        </div>

        {/* Mobile View - Stacked */}
        <div className="block lg:hidden space-y-6">
          {semesters.map(semester => (
            <div key={semester.id} className="space-y-4">
              {/* Semester Header */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{semester.name}</div>
                  <div className="text-sm text-gray-500">{semester.season} {semester.year}</div>
                </div>
              </div>

              {/* Categories for this semester */}
              {categories.map(category => (
                <div key={`${category.id}-${semester.id}`} className="space-y-2">
                  <div className="flex items-center gap-2 px-2">
                    <div className={`w-3 h-3 rounded-full bg-${category.color}-500`}></div>
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </div>
                  <DropCell
                    id={`${category.id}-${semester.id}`}
                    goals={getGoalsForCell(category.id, semester.id)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Desktop View - Grid */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Header Row */}
              <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `280px repeat(${semesters.length}, 240px)` }}>
                <div className="text-sm font-medium text-gray-500 flex items-center px-4">
                  Categories
                </div>
                {semesters.map(semester => (
                  <div key={semester.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">{semester.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{semester.season} {semester.year}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid Rows */}
              {categories.map(category => (
                <div key={category.id} className="grid gap-4 mb-6" style={{ gridTemplateColumns: `280px repeat(${semesters.length}, 240px)` }}>
                  {/* Category Header */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-${category.color}-500`}></div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{category.name}</div>
                        <div className="text-xs text-gray-500">
                          {goals.filter(g => g.category === category.id).length} goals
                        </div>
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
        </div>
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
        bg-white border-2 border-dashed rounded-xl p-3 min-h-[120px] lg:min-h-[160px] transition-all duration-200
        ${isOver 
          ? 'border-blue-300 bg-blue-50 shadow-sm' 
          : 'border-gray-200 hover:border-gray-300'
        }
      `}
    >
      <div className="space-y-2">
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
      
      {goals.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400 text-sm text-center">
            Drop goals here
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningGrid;
