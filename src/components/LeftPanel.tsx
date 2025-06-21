
import React, { useState } from 'react';
import { Plus, Search, BookOpen, Sun, Target, Briefcase, Trophy } from 'lucide-react';
import { useGoalStore } from '../store/goalStore';
import AddGoalModal from './AddGoalModal';

const LeftPanel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('add');

  const quickActions = [
    { id: 'course', icon: BookOpen, label: 'Add Course', color: 'blue' },
    { id: 'summer', icon: Sun, label: 'Summer Program', color: 'yellow' },
    { id: 'extracurricular', icon: Target, label: 'Extracurricular', color: 'green' },
    { id: 'career', icon: Briefcase, label: 'Career Goal', color: 'purple' },
    { id: 'sports', icon: Trophy, label: 'Sports', color: 'red' },
  ];

  return (
    <>
      <div className="w-80 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-white font-semibold text-lg mb-4">Plan Your Future</h2>
          
          {/* Tabs */}
          <div className="flex bg-slate-700/50 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'add' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Add Goals
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'search' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Explore
            </button>
          </div>
        </div>

        {activeTab === 'add' && (
          <div className="space-y-4">
            {/* Quick Add Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Plus size={20} />
              Create New Goal
            </button>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-slate-300 font-medium text-sm">Quick Add</h3>
              {quickActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-200 hover:text-white transition-all duration-200 hover:scale-105 group"
                >
                  <action.icon size={18} className="text-slate-400 group-hover:text-white" />
                  <span className="text-sm">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Recent Suggestions */}
            <div className="mt-6 space-y-3">
              <h3 className="text-slate-300 font-medium text-sm">Suggestions</h3>
              <div className="space-y-2">
                {[
                  { title: 'AP Computer Science', type: 'course', icon: '💻' },
                  { title: 'NASA USRP Internship', type: 'summer', icon: '🚀' },
                  { title: 'Debate Team', type: 'extracurricular', icon: '🗣️' },
                ].map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-slate-500 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{suggestion.icon}</span>
                      <div>
                        <p className="text-white text-sm font-medium">{suggestion.title}</p>
                        <p className="text-slate-400 text-xs capitalize">{suggestion.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search courses, programs, careers..."
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Search Categories */}
            <div className="space-y-3">
              <h3 className="text-slate-300 font-medium text-sm">Browse by Category</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Universities', icon: '🎓', count: '2,847' },
                  { name: 'Courses', icon: '📚', count: '450' },
                  { name: 'Programs', icon: '🌟', count: '180' },
                  { name: 'Careers', icon: '💼', count: '320' },
                ].map(category => (
                  <button
                    key={category.name}
                    className="p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors text-left"
                  >
                    <div className="text-lg mb-1">{category.icon}</div>
                    <div className="text-white text-sm font-medium">{category.name}</div>
                    <div className="text-slate-400 text-xs">{category.count} options</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <AddGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default LeftPanel;
