
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { MoreVertical, Calendar, Target, Clock, CheckCircle } from 'lucide-react';
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
        return <CheckCircle size={16} className="text-green-500" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-500" />;
      default:
        return <Target size={16} className="text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (goal.status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const isCurrentlyDragging = isDragging || dndIsDragging;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md ${
        isCurrentlyDragging ? 'opacity-50 rotate-2 scale-105' : ''
      } bg-card border`}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
            {goal.title}
          </h4>
          
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon()}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {goal.status.replace('-', ' ')}
            </span>
          </div>

          {goal.deadline && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={12} />
              <span>{new Date(goal.deadline).toLocaleDateString()}</span>
            </div>
          )}
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
                className="h-8 w-8 p-0 hover:bg-accent"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuItem onClick={() => handleStatusChange('planned')}>
                Mark as Planned
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('in-progress')}>
                Mark as In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive"
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
