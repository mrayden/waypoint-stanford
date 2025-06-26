
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Calendar, BookOpen, Trophy, Users, Briefcase, Zap } from 'lucide-react';
import { useGoalStore } from '../store/goalStore';
import GoalCard from './GoalCard';

const PlanningGrid = () => {
  const { goals, categories, semesters } = useGoalStore();

  const getGoalsForCell = (categoryId: string, semesterId: string) => {
    return goals.filter(goal => 
      goal.category === categoryId && goal.semester === semesterId
    );
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'school': return BookOpen;
      case 'summer': return Zap;
      case 'extracurricular': return Users;
      case 'career': return Briefcase;
      case 'sports': return Trophy;
      default: return BookOpen;
    }
  };

  const getCategoryGradient = (categoryId: string) => {
    switch (categoryId) {
      case 'school': return 'from-blue-500 to-indigo-600';
      case 'summer': return 'from-yellow-500 to-orange-600';
      case 'extracurricular': return 'from-green-500 to-emerald-600';
      case 'career': return 'from-purple-500 to-violet-600';
      case 'sports': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  return (
    <div className="h-full overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8 lg:mb-10 animate-fade-in">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Academic Planning Grid
              </h2>
              <p className="text-gray-600 font-medium">Organize your goals by category and semester</p>
            </div>
          </div>
        </div>

        {/* Mobile View - Stacked */}
        <div className="block lg:hidden space-y-8 animate-fade-in">
          {semesters.map((semester, index) => (
            <div key={semester.id} className="space-y-6" style={{ animationDelay: `${index * 100}ms` }}>
              {/* Semester Header */}
              <div className="bg-gradient-to-r from-white/90 via-white/95 to-white/90 backdrop-blur-sm border border-white/30 rounded-lg p-6 shadow-sm animate-scale-in">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 mb-1">{semester.name}</div>
                  <div className="text-sm text-gray-600 font-medium">{semester.season} {semester.year}</div>
                </div>
              </div>

              {/* Categories for this semester */}
              {categories.map((category, catIndex) => {
                const CategoryIcon = getCategoryIcon(category.id);
                const gradient = getCategoryGradient(category.id);
                
                return (
                  <div key={`${category.id}-${semester.id}`} className="space-y-3" style={{ animationDelay: `${(index * categories.length + catIndex) * 50}ms` }}>
                    <div className="flex items-center gap-3 px-2">
                      <div className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center shadow-sm`}>
                        <CategoryIcon size={16} className="text-white" />
                      </div>
                      <span className="text-base font-semibold text-gray-800">{category.name}</span>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {getGoalsForCell(category.id, semester.id).length} goals
                      </div>
                    </div>
                    <DropCell
                      id={`${category.id}-${semester.id}`}
                      goals={getGoalsForCell(category.id, semester.id)}
                      categoryId={category.id}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Desktop View - Grid */}
        <div className="hidden lg:block animate-fade-in">
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Header Row */}
              <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: `320px repeat(${semesters.length}, 280px)` }}>
                <div className="text-lg font-bold text-gray-700 flex items-center px-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg py-4">
                  Categories
                </div>
                {semesters.map((semester, index) => (
                  <div key={semester.id} className="bg-gradient-to-r from-white/90 via-white/95 to-white/90 backdrop-blur-sm border border-white/30 rounded-lg p-6 shadow-sm animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 mb-1">{semester.name}</div>
                      <div className="text-sm text-gray-600 font-medium">{semester.season} {semester.year}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid Rows */}
              {categories.map((category, index) => {
                const CategoryIcon = getCategoryIcon(category.id);
                const gradient = getCategoryGradient(category.id);
                
                return (
                  <div key={category.id} className="grid gap-6 mb-8 animate-slide-in-right" style={{ 
                    gridTemplateColumns: `320px repeat(${semesters.length}, 280px)`,
                    animationDelay: `${index * 150}ms`
                  }}>
                    {/* Category Header */}
                    <div className="bg-gradient-to-r from-white/90 via-white/95 to-white/90 backdrop-blur-sm border border-white/30 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center shadow-sm`}>
                          <CategoryIcon size={20} className="text-white" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900 mb-1">{category.name}</div>
                          <div className="text-sm text-gray-600 font-medium">
                            {goals.filter(g => g.category === category.id).length} goals total
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Semester Cells */}
                    {semesters.map((semester, semIndex) => (
                      <DropCell
                        key={`${category.id}-${semester.id}`}
                        id={`${category.id}-${semester.id}`}
                        goals={getGoalsForCell(category.id, semester.id)}
                        categoryId={category.id}
                        style={{ animationDelay: `${(index * semesters.length + semIndex) * 75}ms` }}
                      />
                    ))}
                  </div>
                );
              })}
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
  categoryId: string;
  style?: React.CSSProperties;
}

const DropCell = ({ id, goals, categoryId, style }: DropCellProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const getCategoryGradient = (categoryId: string) => {
    switch (categoryId) {
      case 'school': return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'summer': return 'from-yellow-50 to-orange-50 border-orange-200';
      case 'extracurricular': return 'from-green-50 to-emerald-50 border-emerald-200';
      case 'career': return 'from-purple-50 to-violet-50 border-violet-200';
      case 'sports': return 'from-red-50 to-pink-50 border-pink-200';
      default: return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const gradient = getCategoryGradient(categoryId);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-gradient-to-br ${gradient} border-2 border-dashed rounded-lg p-4 min-h-[140px] lg:min-h-[200px] 
        transition-all duration-300 hover:shadow-md group animate-scale-in
        ${isOver 
          ? 'border-blue-400 bg-gradient-to-br from-blue-100 to-indigo-100 shadow-lg shadow-blue-500/15 scale-105' 
          : 'hover:border-opacity-60 hover:shadow-sm'
        }
      `}
    >
      <div className="space-y-3">
        {goals.map((goal, index) => (
          <div key={goal.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <GoalCard goal={goal} />
          </div>
        ))}
      </div>
      
      {goals.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400 text-sm text-center font-medium group-hover:text-gray-500 transition-colors duration-200">
            <div className="mb-2">✨</div>
            Drop goals here
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningGrid;
