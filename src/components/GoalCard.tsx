
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Goal } from '../types/Goal';
import { Move, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { useGoalStore } from '../store/goalStore';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './ui/context-menu';

interface GoalCardProps {
  goal: Goal;
  isDragging?: boolean;
}

const GoalCard = ({ goal, isDragging = false }: GoalCardProps) => {
  const { removeGoal, categories, semesters, moveGoal } = useGoalStore();
  const [showMoveOptions, setShowMoveOptions] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: goal.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'from-green-500/90 to-emerald-600/90 border-green-200 dark:border-green-800';
      case 'in-progress': return 'from-yellow-500/90 to-orange-600/90 border-yellow-200 dark:border-yellow-800';
      default: return 'from-slate-600/90 to-slate-700/90 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      default: return '📅';
    }
  };

  const handleEdit = () => {
    console.log('Edit goal:', goal.id);
  };

  const handleDelete = () => {
    removeGoal(goal.id);
  };

  const handleMove = (categoryId: string, semesterId: string) => {
    moveGoal(goal.id, categoryId, semesterId);
    setShowMoveOptions(false);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          className={`
            relative group cursor-grab active:cursor-grabbing transform transition-all duration-200
            ${isDragging ? 'opacity-70 scale-105 rotate-2' : 'hover:scale-[1.02]'}
          `}
          {...listeners}
          {...attributes}
        >
          <div className={`
            p-4 rounded-2xl shadow-sm border transition-all duration-200
            bg-gradient-to-br ${getStatusColor(goal.status)}
            hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-800/50
            ${isDragging ? 'shadow-xl ring-2 ring-blue-400 dark:ring-blue-500' : ''}
          `}>
            {/* Status indicator */}
            <div className="absolute -top-1 -right-1 text-sm drop-shadow-sm">
              {getStatusIcon(goal.status)}
            </div>

            {/* Main content */}
            <div className="flex items-start gap-3 mb-3">
              <span className="text-xl drop-shadow-sm">{goal.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm leading-tight mb-1 drop-shadow-sm">
                  {goal.title}
                </h3>
                {goal.source && (
                  <p className="text-white/80 text-xs font-medium drop-shadow-sm">
                    {goal.source}
                  </p>
                )}
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded-lg transition-all duration-200">
                <MoreHorizontal size={14} className="text-white" />
              </button>
            </div>

            {goal.description && (
              <p className="text-white/90 text-xs leading-relaxed line-clamp-2 drop-shadow-sm">
                {goal.description}
              </p>
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-56 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xl rounded-xl">
        <ContextMenuItem 
          onClick={() => setShowMoveOptions(!showMoveOptions)}
          className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer rounded-lg"
        >
          <Move className="mr-2 h-4 w-4" />
          Move to...
        </ContextMenuItem>
        
        {showMoveOptions && (
          <div className="pl-6 space-y-1 max-h-32 overflow-y-auto">
            {categories.map(category => 
              semesters.map(semester => (
                <ContextMenuItem
                  key={`${category.id}-${semester.id}`}
                  onClick={() => handleMove(category.id, semester.id)}
                  className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-xs rounded-lg"
                >
                  {category.name} - {semester.name}
                </ContextMenuItem>
              ))
            )}
          </div>
        )}
        
        <ContextMenuItem 
          onClick={handleEdit}
          className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer rounded-lg"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={handleDelete}
          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer rounded-lg"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default GoalCard;
