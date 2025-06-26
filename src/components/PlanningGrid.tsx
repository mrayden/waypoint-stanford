
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
    <div className="h-full overflow-auto p-8 bg-background">
      <div className="min-w-max">
        {/* Header Row */}
        <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `280px repeat(6, 300px)` }}>
          <div className="text-muted-foreground font-semibold flex items-center gap-3 text-lg px-4">
            <BookOpen size={20} className="text-primary" />
            Categories
          </div>
          {semesters.map(semester => (
            <div key={semester.id} className="text-center bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-foreground font-bold text-lg">{semester.name}</div>
              <div className="text-muted-foreground text-sm font-medium">{semester.season} {semester.year}</div>
            </div>
          ))}
        </div>

        {/* Grid Rows */}
        {categories.map(category => (
          <div key={category.id} className="grid gap-4 mb-6" style={{ gridTemplateColumns: `280px repeat(6, 300px)` }}>
            {/* Category Header */}
            <div className="flex items-center gap-4 p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className={`w-4 h-4 rounded-full bg-${category.color}-500`}></div>
              <div>
                <div className="text-foreground font-semibold text-lg">{category.name}</div>
                <div className="text-muted-foreground text-sm">
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
        p-4 rounded-xl border-2 border-dashed transition-all duration-300 relative min-h-[160px]
        ${isOver 
          ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' 
          : 'border-border bg-card/50'
        }
        hover:border-primary/50 hover:bg-card/80 hover:shadow-sm
      `}
    >
      <div className="space-y-3">
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
      
      {goals.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground text-sm text-center font-medium">
            Drop goals here
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningGrid;
