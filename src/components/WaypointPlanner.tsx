
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { MapPin, Globe, RotateCcw, Edit, User, ChevronDown, LogOut } from 'lucide-react';
import PlanningGrid from './PlanningGrid';
import GoalCard from './GoalCard';
import AddGoalModal from './AddGoalModal';
import MarketplaceView from './MarketplaceView';
import Sidebar from './Sidebar';
import { useGoalStore } from '../store/goalStore';
import { useOnboarding } from '../hooks/useOnboarding';
import { clearUserData, getUserData } from '../utils/cookieUtils';
import { Goal } from '../types/Goal';

const WaypointPlanner = () => {
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'local' | 'marketplace'>('local');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { moveGoal, resetGoals } = useGoalStore();
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

  const handleDragCancel = () => {
    setActiveGoal(null);
  };

  const handleReset = () => {
    resetGoals();
    clearUserData();
    resetOnboarding();
    window.location.reload();
  };

  const renderContent = () => {
    if (activeTab === 'marketplace') {
      return <MarketplaceView onBackToLocal={() => setActiveTab('local')} />;
    }
    
    return (
      <div className="flex-1 flex overflow-hidden">
        <Sidebar onAddGoal={() => setIsModalOpen(true)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative overflow-hidden">
            <PlanningGrid />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <DndContext 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Header */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">W</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground tracking-tight">Waypoint</h1>
                  <span className="text-xs text-muted-foreground font-medium">Plan Your Academic Journey</span>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex bg-secondary p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('local')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'local'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <MapPin size={16} />
                  Planning
                </button>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'marketplace'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Globe size={16} />
                  Local Opportunities
                </button>
              </div>
            </div>
            
            {/* Account Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => resetOnboarding()}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-all duration-200"
              >
                <Edit size={16} />
                Edit Profile
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-destructive hover:text-destructive/80 rounded-lg hover:bg-destructive/10 transition-all duration-200"
              >
                <RotateCcw size={16} />
                Reset All
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <User size={16} className="text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">
                      {userData?.name || 'Student'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {userData?.grade || 'Grade Not Set'}
                    </div>
                  </div>
                  <ChevronDown size={16} className="text-muted-foreground" />
                </button>
                
                {showAccountMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-lg shadow-lg border border-border py-2 z-50">
                    <button
                      onClick={() => {
                        resetOnboarding();
                        setShowAccountMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary flex items-center gap-2"
                    >
                      <Edit size={14} />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        handleReset();
                        setShowAccountMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
                    >
                      <LogOut size={14} />
                      Reset & Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {renderContent()}
        </div>
        
        {/* Drag Overlay */}
        <DragOverlay>
          {activeGoal && (
            <div className="transform rotate-2 scale-110 animate-pulse">
              <GoalCard goal={activeGoal} isDragging={true} />
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
