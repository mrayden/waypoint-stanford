
import React from 'react';
import { Plus, Target, BookOpen, TrendingUp } from 'lucide-react';
import { useGoalStore } from '../store/goalStore';
import { getUserData } from '../utils/cookieUtils';

interface SidebarProps {
  onAddGoal: () => void;
}

const Sidebar = ({ onAddGoal }: SidebarProps) => {
  const { goals, categories } = useGoalStore();
  const userData = getUserData();

  const completionRate = goals.length > 0 ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100) : 0;

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Target size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {userData?.name || 'Student'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {userData?.grade || 'Grade Not Set'}
            </p>
          </div>
        </div>
        
        {/* Simple Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium text-foreground">{completionRate}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{goals.filter(g => g.status === 'completed').length} completed</span>
            <span>{goals.length} total</span>
          </div>
        </div>
      </div>

      {/* Add Goal Button */}
      <div className="p-6">
        <button
          onClick={onAddGoal}
          className="w-full flex items-center gap-3 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm"
        >
          <Plus size={20} />
          Add New Goal
        </button>
      </div>

      {/* Quick Stats */}
      <div className="px-6 pb-6 space-y-4">
        <h4 className="text-sm font-medium text-foreground">
          Overview
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">Active Goals</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {goals.filter(g => g.status === 'in-progress').length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">Categories</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {categories.length}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-auto pb-6">
        <h4 className="text-sm font-medium text-foreground mb-4">
          Quick Actions
        </h4>
        <div className="space-y-2">
          <button className="w-full p-3 text-left rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-200 flex items-center gap-3">
            <TrendingUp size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
