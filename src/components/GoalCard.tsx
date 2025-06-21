
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Goal } from '../types/Goal';
import { Trash2, Edit } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  isDragging?: boolean;
}

const GoalCard = ({ goal, isDragging = false }: GoalCardProps) => {
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // TODO: Implement edit functionality
    console.log('Edit goal:', goal.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // TODO: Implement delete functionality
    console.log('Delete goal:', goal.id);
  };

  return (
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

        {/* Actions (appear on hover) - prevent dragging when clicked */}
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <button 
              onClick={handleEdit}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="p-1 bg-slate-800/80 rounded text-slate-300 hover:text-white text-xs"
            >
              <Edit size={10} />
            </button>
            <button 
              onClick={handleDelete}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="p-1 bg-red-600/80 rounded text-white hover:bg-red-600 text-xs"
            >
              <Trash2 size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
