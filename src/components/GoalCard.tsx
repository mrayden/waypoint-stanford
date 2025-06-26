
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Goal } from '../types/Goal';
import { Move, Edit, Trash2, MoreVertical } from 'lucide-react';
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
      case 'completed': return 'bg-green-50 border-green-200 text-green-800';
      case 'in-progress': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'in-progress': return '○';
      default: return '○';
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
            group cursor-grab active:cursor-grabbing
            ${isDragging ? 'opacity-50' : ''}
          `}
          {...listeners}
          {...attributes}
        >
          <div className={`
            bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200
            hover:border-gray-300 group-hover:scale-[1.02]
            ${isDragging ? 'shadow-lg' : ''}
          `}>
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm">{goal.icon}</span>
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {goal.title}
                </h3>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <div className={`
                  w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium
                  ${getStatusColor(goal.status)}
                `}>
                  {getStatusIcon(goal.status)}
                </div>
                <MoreVertical size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {goal.source && (
              <p className="text-xs text-gray-500 mb-2">
                {goal.source}
              </p>
            )}

            {goal.description && (
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                {goal.description}
              </p>
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg">
        <ContextMenuItem 
          onClick={() => setShowMoveOptions(!showMoveOptions)}
          className="text-gray-700 hover:bg-gray-50 cursor-pointer"
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
                  className="text-gray-600 hover:bg-gray-50 cursor-pointer text-xs"
                >
                  {category.name} - {semester.name}
                </ContextMenuItem>
              ))
            )}
          </div>
        )}
        
        <ContextMenuItem 
          onClick={handleEdit}
          className="text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={handleDelete}
          className="text-red-600 hover:bg-red-50 cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default GoalCard;
