
import React, { useState } from 'react';
import { Plus, Search, BookOpen, Sun, Target, Briefcase, Trophy, MapPin, Globe } from 'lucide-react';
import { useGoalStore } from '../store/goalStore';
import AddGoalModal from './AddGoalModal';

interface LeftPanelProps {
  activeTab: 'local' | 'marketplace';
}

const LeftPanel = ({ activeTab }: LeftPanelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [panelTab, setPanelTab] = useState('add');

  const localOpportunities = [
    { id: 'local-research', icon: BookOpen, label: 'University Research', color: 'blue', description: 'Reach out to local professors' },
    { id: 'local-hospital', icon: Target, label: 'Hospital Volunteer', color: 'red', description: 'Build medical experience locally' },
    { id: 'local-government', icon: Briefcase, label: 'City Hall Internship', color: 'purple', description: 'Learn about local politics' },
    { id: 'local-business', icon: Trophy, label: 'Local Business', color: 'green', description: 'Start or intern at local companies' },
    { id: 'local-nonprofit', icon: Target, label: 'Community Service', color: 'yellow', description: 'Lead local volunteer projects' },
  ];

  const marketplaceOpportunities = [
    { id: 'market-summer', icon: Sun, label: 'Competitive Programs', color: 'yellow', description: 'RSI, TASP, Governor\'s School' },
    { id: 'market-research', icon: BookOpen, label: 'National Research', color: 'blue', description: 'Science fairs, publications' },
    { id: 'market-internship', icon: Briefcase, label: 'Tech Internships', color: 'purple', description: 'Google, Microsoft, startups' },
    { id: 'market-competition', icon: Trophy, label: 'Competitions', color: 'green', description: 'USACO, USABO, debate nationals' },
    { id: 'market-online', icon: Target, label: 'Online Ventures', color: 'red', description: 'YouTube, apps, online business' },
  ];

  const currentOpportunities = activeTab === 'local' ? localOpportunities : marketplaceOpportunities;

  return (
    <>
      <div className="w-80 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            {activeTab === 'local' ? (
              <MapPin className="text-green-400" size={20} />
            ) : (
              <Globe className="text-blue-400" size={20} />
            )}
            <h2 className="text-white font-semibold text-lg">
              {activeTab === 'local' ? 'Local Opportunities' : 'Marketplace'}
            </h2>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-slate-700/50 rounded-lg p-1 mb-4">
            <button
              onClick={() => setPanelTab('add')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                panelTab === 'add' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Add Goals
            </button>
            <button
              onClick={() => setPanelTab('explore')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                panelTab === 'explore' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Explore
            </button>
          </div>
        </div>

        {panelTab === 'add' && (
          <div className="space-y-4">
            {/* Quick Add Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Plus size={20} />
              Create New Goal
            </button>

            {/* Opportunity Categories */}
            <div className="space-y-3">
              <h3 className="text-slate-300 font-medium text-sm">
                {activeTab === 'local' ? 'Local Focus Areas' : 'Competitive Areas'}
              </h3>
              {currentOpportunities.map(opportunity => (
                <button
                  key={opportunity.id}
                  onClick={() => setIsModalOpen(true)}
                  className="w-full p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all duration-200 hover:scale-105 group text-left"
                >
                  <div className="flex items-start gap-3">
                    <opportunity.icon size={18} className="text-slate-400 group-hover:text-white mt-0.5" />
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{opportunity.label}</div>
                      <div className="text-slate-400 text-xs mt-1">{opportunity.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Tips Section */}
            <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <h4 className="text-white font-medium text-sm mb-2">
                {activeTab === 'local' ? 'Local Strategy Tips:' : 'Marketplace Strategy Tips:'}
              </h4>
              <ul className="text-slate-300 text-xs space-y-1">
                {activeTab === 'local' ? (
                  <>
                    <li>• Email professors at nearby universities</li>
                    <li>• Visit local hospitals, nonprofits, government offices</li>
                    <li>• Network through family, school connections</li>
                    <li>• Lower competition, easier to get started</li>
                  </>
                ) : (
                  <>
                    <li>• Apply early - deadlines are often months ahead</li>
                    <li>• Strong application essays are crucial</li>
                    <li>• Build portfolio/credentials first</li>
                    <li>• Higher competition but greater recognition</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}

        {panelTab === 'explore' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder={`Search ${activeTab} opportunities...`}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Browse Categories */}
            <div className="space-y-3">
              <h3 className="text-slate-300 font-medium text-sm">Browse Categories</h3>
              <div className="grid grid-cols-1 gap-2">
                {activeTab === 'local' ? (
                  <>
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-lg mb-1">🏥</div>
                      <div className="text-white text-sm font-medium">Healthcare</div>
                      <div className="text-slate-400 text-xs">Hospitals, clinics, research</div>
                    </div>
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-lg mb-1">🏛️</div>
                      <div className="text-white text-sm font-medium">Government</div>
                      <div className="text-slate-400 text-xs">City hall, courts, agencies</div>
                    </div>
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-lg mb-1">🎓</div>
                      <div className="text-white text-sm font-medium">Universities</div>
                      <div className="text-slate-400 text-xs">Research labs, professors</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-lg mb-1">🚀</div>
                      <div className="text-white text-sm font-medium">STEM Programs</div>
                      <div className="text-slate-400 text-xs">RSI, Garcia, Clark Scholar</div>
                    </div>
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-lg mb-1">💼</div>
                      <div className="text-white text-sm font-medium">Business</div>
                      <div className="text-slate-400 text-xs">Internships, competitions</div>
                    </div>
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-lg mb-1">🎨</div>
                      <div className="text-white text-sm font-medium">Arts & Humanities</div>
                      <div className="text-slate-400 text-xs">Writing, debate, art programs</div>
                    </div>
                  </>
                )}
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
