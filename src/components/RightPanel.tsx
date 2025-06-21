
import React from 'react';
import { Filter, BarChart3, Target, Clock, CheckCircle } from 'lucide-react';
import { useGoalStore } from '../store/goalStore';

const RightPanel = () => {
  const { goals, categories, semesters, filters, setFilter } = useGoalStore();

  const stats = {
    total: goals.length,
    planned: goals.filter(g => g.status === 'planned').length,
    inProgress: goals.filter(g => g.status === 'in-progress').length,
    completed: goals.filter(g => g.status === 'completed').length,
  };

  const categoryStats = categories.map(cat => ({
    ...cat,
    count: goals.filter(g => g.category === cat.id).length
  }));

  return (
    <div className="w-80 bg-slate-800/50 backdrop-blur-sm border-l border-slate-700 p-6 overflow-y-auto">
      {/* Stats Overview */}
      <div className="mb-8">
        <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <BarChart3 size={20} />
          Your Progress
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-4 rounded-lg border border-indigo-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-indigo-400" />
              <span className="text-slate-300 text-sm">Total Goals</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-4 rounded-lg border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-slate-300 text-sm">Completed</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.completed}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-300 mb-2">
            <span>Progress</span>
            <span>{Math.round((stats.completed / stats.total) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
            />
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-300">
              <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
              Planned
            </span>
            <span className="text-white font-medium">{stats.planned}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-300">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              In Progress
            </span>
            <span className="text-white font-medium">{stats.inProgress}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-300">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Completed
            </span>
            <span className="text-white font-medium">{stats.completed}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Filter size={20} />
          Filters
        </h3>
        
        {/* Category Filter */}
        <div className="mb-4">
          <label className="text-slate-300 text-sm font-medium mb-2 block">Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilter('category', e.target.value)}
            className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div className="mb-4">
          <label className="text-slate-300 text-sm font-medium mb-2 block">Semester</label>
          <select
            value={filters.semester}
            onChange={(e) => setFilter('semester', e.target.value)}
            className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Semesters</option>
            {semesters.map(semester => (
              <option key={semester.id} value={semester.id}>
                {semester.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 className="text-white font-semibold text-lg mb-4">By Category</h3>
        <div className="space-y-3">
          {categoryStats.map(category => (
            <div key={category.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg">{category.icon}</span>
                <span className="text-slate-200 text-sm">{category.name}</span>
              </div>
              <span className="text-white font-medium">{category.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
