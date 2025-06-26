
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { MoreVertical, Target, Clock, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useGoalStore } from '../store/goalStore';
import { Goal } from '../types/Goal';

const GoalCard = ({ goal, isDragging }: { goal: Goal; isDragging?: boolean }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { updateGoal, removeGoal } = useGoalStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: dndIsDragging,
  } = useDraggable({
    id: goal.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleStatusChange = (newStatus: 'planned' | 'in-progress' | 'completed') => {
    updateGoal(goal.id, { status: newStatus });
    setShowDropdown(false);
  };

  const handleDelete = () => {
    removeGoal(goal.id);
    setShowDropdown(false);
  };

  const getStatusIcon = () => {
    switch (goal.status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600 dark:text-green-400" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-600 dark:text-blue-400" />;
      default:
        return <Target size={16} className="text-slate-600 dark:text-slate-400" />;
    }
  };

  const getStatusColor = () => {
    switch (goal.status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300';
      case 'in-progress':
        return 'bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 dark:from-blue-900/30 dark:to-sky-900/30 dark:text-blue-300';
      default:
        return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 dark:from-slate-800 dark:to-gray-800 dark:text-slate-300';
    }
  };

  const getCardGradient = () => {
    switch (goal.status) {
      case 'completed':
        return 'bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 dark:from-slate-900 dark:via-green-900/10 dark:to-emerald-900/20';
      case 'in-progress':
        return 'bg-gradient-to-br from-white via-blue-50/30 to-sky-50/50 dark:from-slate-900 dark:via-blue-900/10 dark:to-sky-900/20';
      default:
        return 'bg-gradient-to-br from-white via-slate-50/30 to-gray-50/50 dark:from-slate-900 dark:via-slate-800/30 dark:to-gray-800/20';
    }
  };

  const isCurrentlyDragging = isDragging || dndIsDragging;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
        isCurrentlyDragging ? 'opacity-50 rotate-2 scale-105 shadow-xl' : ''
      } ${getCardGradient()} border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm relative overflow-hidden`}
      {...listeners}
      {...attributes}
    >
      {/* Subtle grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:20px_20px] pointer-events-none" />
      
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-900 dark:text-slate-100 text-sm mb-2 line-clamp-2">
            {goal.title}
          </h4>
          
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon()}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {goal.status.replace('-', ' ')}
            </span>
          </div>
        </div>

        <div 
          className="flex-shrink-0"
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400 backdrop-blur-sm"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-700 backdrop-blur-lg"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuItem 
                onClick={() => handleStatusChange('planned')}
                className="text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
              >
                Mark as Planned
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusChange('in-progress')}
                className="text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
              >
                Mark as In Progress
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusChange('completed')}
                className="text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
              >
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20"
              >
                Delete Goal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};

export default GoalCard;
