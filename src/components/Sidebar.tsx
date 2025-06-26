
import React from 'react';
import { BarChart3, Calendar, Target, User, Settings, BookOpen, TrendingUp, Award, Clock } from 'lucide-react';
import { useGoalStore } from '../store/goalStore';
import { getUserData } from '../utils/cookieUtils';

const Sidebar = () => {
  const { goals, categories } = useGoalStore();
  const userData = getUserData();

  const stats = [
    {
      label: 'Total Goals',
      value: goals.length,
      icon: Target,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Completed',
      value: goals.filter(g => g.status === 'completed').length,
      icon: Award,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'In Progress',
      value: goals.filter(g => g.status === 'in-progress').length,
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      label: 'Categories',
      value: categories.length,
      icon: BookOpen,
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  const completionRate = goals.length > 0 ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100) : 0;

  return (
    <div className="w-80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {userData?.name || 'Student'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {userData?.grade || 'Grade Not Set'}
            </p>
          </div>
        </div>
        
        {/* Progress Overview */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{completionRate}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 space-y-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          Statistics
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={16} className={stat.color} />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {stat.label}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 mt-auto">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-4">
          Quick Actions
        </h4>
        <div className="space-y-2">
          <button className="w-full p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 flex items-center gap-3">
            <BarChart3 size={16} className="text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">View Analytics</span>
          </button>
          <button className="w-full p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 flex items-center gap-3">
            <Calendar size={16} className="text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Calendar View</span>
          </button>
          <button className="w-full p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all duration-200 flex items-center gap-3">
            <Settings size={16} className="text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
