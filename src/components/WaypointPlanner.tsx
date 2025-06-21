
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Plus, MapPin, Globe, RotateCcw, Info, Settings, Edit } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import PlanningGrid from './PlanningGrid';
import GoalCard from './GoalCard';
import AddGoalModal from './AddGoalModal';
import MarketplaceView from './MarketplaceView';
import { useGoalStore } from '../store/goalStore';
import { useOnboarding } from '../hooks/useOnboarding';
import { getUserData } from '../utils/cookieUtils';
import { Goal } from '../types/Goal';

const WaypointPlanner = () => {
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'local' | 'marketplace'>('local');
  const { moveGoal, resetGoals, goals, categories, semesters } = useGoalStore();
  const { resetOnboarding } = useOnboarding();
  const userData = getUserData();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const goal = useGoalStore.getState().goals.find(g => g.id === active.id);
    setActiveGoal(goal || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const dropZoneId = over.id as string;
      const [category, semester] = dropZoneId.split('-').slice(0, 2);
      
      if (category && semester) {
        moveGoal(active.id as string, category, semester);
      }
    }
    
    setActiveGoal(null);
  };

  const handleReset = () => {
    resetGoals();
    resetOnboarding();
  };

  const renderContent = () => {
    if (activeTab === 'marketplace') {
      return <MarketplaceView onBackToLocal={() => setActiveTab('local')} />;
    }
    
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 relative overflow-hidden">
          <PlanningGrid />
          
          {/* Floating Create Goal Section */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full font-medium transition-all duration-200 hover:scale-105 shadow-lg animate-fade-in"
            >
              <Plus size={20} />
              Add Goal
            </button>
            <button
              onClick={() => resetOnboarding()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all duration-200 hover:scale-105 shadow-lg animate-fade-in"
            >
              <Edit size={16} />
              Modify Path
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full font-medium transition-all duration-200 hover:scale-105 shadow-lg animate-fade-in"
            >
              <RotateCcw size={16} />
              Reset All
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* Header with Navigation */}
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                W
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Waypoint</h1>
                <span className="text-sm text-slate-400">Plan Your Future</span>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('local')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'local'
                    ? 'bg-green-600 text-white scale-105'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-102'
                }`}
              >
                <MapPin size={16} />
                Local Planning
              </button>
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'marketplace'
                    ? 'bg-blue-600 text-white scale-105'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-102'
                }`}
              >
                <Globe size={16} />
                Marketplace
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {renderContent()}
          
          {/* Fixed Debug Summary Box - Scrollable at bottom */}
          <div className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 animate-fade-in">
            <div className="flex items-center gap-2 px-4 pt-3 pb-2">
              <Info size={14} className="text-slate-400" />
              <span className="text-slate-300 text-sm font-medium">Debug Info</span>
            </div>
            
            <ScrollArea className="h-24 px-4 pb-3">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-xs font-mono">
                {/* User Data Section */}
                {userData && (
                  <div className="space-y-1 text-slate-400">
                    <div className="text-slate-300 font-semibold mb-2">User Info</div>
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="text-slate-200 truncate ml-2 max-w-20">{userData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Grade:</span>
                      <span className="text-slate-200">{userData.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>School:</span>
                      <span className="text-slate-200 truncate ml-2 max-w-20">{userData.currentSchool || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interests:</span>
                      <span className="text-slate-200">{userData.interests?.length || 0}</span>
                    </div>
                  </div>
                )}
                
                {/* Goal Statistics Section */}
                <div className="space-y-1 text-slate-400">
                  <div className="text-slate-300 font-semibold mb-2">Goals</div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="text-slate-200">{goals.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span className="text-slate-200">{categories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Semesters:</span>
                    <span className="text-slate-200">{semesters.length}</span>
                  </div>
                </div>
                
                {/* Status Breakdown Section */}
                <div className="space-y-1 text-slate-400">
                  <div className="text-slate-300 font-semibold mb-2">Status</div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="text-green-400">{goals.filter(g => g.status === 'completed').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Progress:</span>
                    <span className="text-yellow-400">{goals.filter(g => g.status === 'in-progress').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Planned:</span>
                    <span className="text-blue-400">{goals.filter(g => g.status === 'planned').length}</span>
                  </div>
                </div>

                {/* Additional User Data */}
                {userData && (
                  <>
                    <div className="space-y-1 text-slate-400">
                      <div className="text-slate-300 font-semibold mb-2">Academic</div>
                      <div className="flex justify-between">
                        <span>GPA:</span>
                        <span className="text-slate-200">{userData.gpa || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AP Courses:</span>
                        <span className="text-slate-200">{userData.apCourses?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Financial:</span>
                        <span className="text-slate-200 truncate ml-2 max-w-20">{userData.financialSituation || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-slate-400">
                      <div className="text-slate-300 font-semibold mb-2">Future Plans</div>
                      <div className="flex justify-between">
                        <span>Universities:</span>
                        <span className="text-slate-200">{userData.targetUniversities?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Degrees:</span>
                        <span className="text-slate-200">{userData.targetDegrees?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Extracurriculars:</span>
                        <span className="text-slate-200">{userData.extracurriculars?.length || 0}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-slate-400">
                      <div className="text-slate-300 font-semibold mb-2">Location</div>
                      <div className="flex justify-between">
                        <span>State:</span>
                        <span className="text-slate-200 truncate ml-2 max-w-20">{userData.selectedState || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="text-slate-200 truncate ml-2 max-w-20">{userData.location || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>School Type:</span>
                        <span className="text-slate-200 truncate ml-2 max-w-20">{userData.schoolType || 'N/A'}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        {/* Drag Overlay */}
        <DragOverlay>
          {activeGoal && (
            <div className="transform rotate-3 scale-105 animate-scale-in">
              <GoalCard goal={activeGoal} isDragging />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Add Goal Modal */}
      <AddGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default WaypointPlanner;
