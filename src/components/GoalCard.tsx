
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Goal } from '../types/Goal';
import { Move, Edit, Trash2 } from 'lucide-react';
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
      case 'completed': return 'from-green-500 to-emerald-600';
      case 'in-progress': return 'from-yellow-500 to-orange-600';
      default: return 'from-slate-600 to-slate-700';
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
    // TODO: Implement edit functionality
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
            relative group cursor-grab active:cursor-grabbing
            ${isDragging ? 'opacity-50' : ''}
          `}
          {...listeners}
          {...attributes}
        >
          <div className={`
            p-3 rounded-lg shadow-lg border border-slate-600 transition-all duration-200
            bg-gradient-to-br ${getStatusColor(goal.status)}
            hover:ring-2 hover:ring-indigo-400 hover:ring-opacity-50
            hover:scale-105 hover:shadow-xl
            ${isDragging ? 'shadow-2xl ring-2 ring-indigo-400' : ''}
          `}>
            {/* Status indicator */}
            <div className="absolute -top-1 -right-1 text-xs">
              {getStatusIcon(goal.status)}
            </div>

            {/* Main content */}
            <div className="flex items-start gap-2 mb-2">
              <span className="text-lg">{goal.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm leading-tight truncate">
                  {goal.title}
                </h3>
                {goal.source && (
                  <p className="text-slate-300 text-xs mt-1 opacity-75">
                    {goal.source}
                  </p>
                )}
              </div>
            </div>

            {goal.description && (
              <p className="text-slate-200 text-xs leading-relaxed mb-2 line-clamp-2">
                {goal.description}
              </p>
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-56 bg-slate-800 border-slate-700">
        <ContextMenuItem 
          onClick={() => setShowMoveOptions(!showMoveOptions)}
          className="text-slate-200 hover:bg-slate-700 cursor-pointer"
        >
          <Move className="mr-2 h-4 w-4" />
          Move to...
        </ContextMenuItem>
        
        {showMoveOptions && (
          <div className="pl-6 space-y-1">
            {categories.map(category => 
              semesters.map(semester => (
                <ContextMenuItem
                  key={`${category.id}-${semester.id}`}
                  onClick={() => handleMove(category.id, semester.id)}
                  className="text-slate-300 hover:bg-slate-700 cursor-pointer text-xs"
                >
                  {category.name} - {semester.name}
                </ContextMenuItem>
              ))
            )}
          </div>
        )}
        
        <ContextMenuItem 
          onClick={handleEdit}
          className="text-slate-200 hover:bg-slate-700 cursor-pointer"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={handleDelete}
          className="text-red-400 hover:bg-red-900/20 cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default GoalCard;
