import React, { useState } from 'react';
import { Plus, Search, BookOpen, Sun, Target, Briefcase, Trophy, MapPin, Globe, ExternalLink, Clock, Users } from 'lucide-react';
import { useGoalStore } from '../store/goalStore';
import AddGoalModal from './AddGoalModal';

interface LeftPanelProps {
  activeTab: 'local' | 'marketplace';
}

const LeftPanel = ({ activeTab }: LeftPanelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [panelTab, setPanelTab] = useState('add');
  const [searchQuery, setSearchQuery] = useState('');

  const localOpportunities = [
    { id: 'local-research', icon: BookOpen, label: 'University Research', color: 'blue', description: 'Reach out to local professors' },
    { id: 'local-hospital', icon: Target, label: 'Hospital Volunteer', color: 'red', description: 'Build medical experience locally' },
    { id: 'local-government', icon: Briefcase, label: 'City Hall Internship', color: 'purple', description: 'Learn about local politics' },
    { id: 'local-business', icon: Trophy, label: 'Local Business', color: 'green', description: 'Start or intern at local companies' },
    { id: 'local-nonprofit', icon: Target, label: 'Community Service', color: 'yellow', description: 'Lead local volunteer projects' },
  ];

  const marketplaceListings = [
    {
      id: 1,
      title: 'Library Helper - Boulder Public Library',
      location: 'Boulder, CO',
      type: 'Volunteer',
      timeCommitment: '5-10 hours/week',
      description: 'Help with children\'s reading programs and book organization. Great for students interested in education.',
      requirements: 'High school student, reliable schedule',
      contact: 'Apply online or visit in person',
      postedDays: 3
    },
    {
      id: 2,
      title: 'CU Research Assistant - Psychology Dept',
      location: 'University of Colorado Boulder',
      type: 'Research',
      timeCommitment: '8-12 hours/week',
      description: 'Assist with data collection for cognitive psychology studies. Opportunity to co-author research papers.',
      requirements: 'GPA 3.5+, psychology or neuroscience interest',
      contact: 'Email Dr. Sarah Johnson: s.johnson@colorado.edu',
      postedDays: 1
    },
    {
      id: 3,
      title: 'Math Tutor - Boulder High Schools',
      location: 'Various Boulder High Schools',
      type: 'Tutoring',
      timeCommitment: '3-6 hours/week',
      description: 'Peer tutoring program for algebra and calculus students. Build leadership and teaching skills.',
      requirements: 'Strong math background, completed calculus',
      contact: 'Contact school counselors',
      postedDays: 5
    },
    {
      id: 4,
      title: 'Environmental Lab Assistant',
      location: 'CU Environmental Science Building',
      type: 'Research',
      timeCommitment: '6-8 hours/week',
      description: 'Support water quality testing and environmental data analysis. Perfect for pre-med or environmental science students.',
      requirements: 'Chemistry background preferred',
      contact: 'Prof. Mike Chen: m.chen@colorado.edu',
      postedDays: 2
    },
    {
      id: 5,
      title: 'Youth Mentor - Boys & Girls Club',
      location: 'Boulder Boys & Girls Club',
      type: 'Mentoring',
      timeCommitment: '4-6 hours/week',
      description: 'Mentor middle school students in academics and life skills. Develop leadership and communication abilities.',
      requirements: 'Background check required, 16+',
      contact: 'Visit club or call (303) 442-2582',
      postedDays: 7
    },
    {
      id: 6,
      title: 'Hospital Volunteer - Boulder Community Health',
      location: 'Boulder Community Health',
      type: 'Healthcare',
      timeCommitment: '4 hours/week minimum',
      description: 'Support patient services, assist nursing staff, gain healthcare exposure. Great for pre-med students.',
      requirements: 'Complete volunteer training program',
      contact: 'Apply through hospital website',
      postedDays: 4
    }
  ];

  const filteredListings = marketplaceListings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {activeTab === 'marketplace' ? 'Browse' : 'Explore'}
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

            {/* Opportunity Categories - only show for local */}
            {activeTab === 'local' && (
              <>
                <div className="space-y-3">
                  <h3 className="text-slate-300 font-medium text-sm">Local Focus Areas</h3>
                  {localOpportunities.map(opportunity => (
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
                  <h4 className="text-white font-medium text-sm mb-2">Local Strategy Tips:</h4>
                  <ul className="text-slate-300 text-xs space-y-1">
                    <li>• Email professors at nearby universities</li>
                    <li>• Visit local hospitals, nonprofits, government offices</li>
                    <li>• Network through family, school connections</li>
                    <li>• Lower competition, easier to get started</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {panelTab === 'explore' && activeTab === 'local' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search local opportunities..."
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Browse Categories */}
            <div className="space-y-3">
              <h3 className="text-slate-300 font-medium text-sm">Browse Categories</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-white text-sm font-medium">Healthcare</div>
                  <div className="text-slate-400 text-xs">Hospitals, clinics, research</div>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-white text-sm font-medium">Government</div>
                  <div className="text-slate-400 text-xs">City hall, courts, agencies</div>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-white text-sm font-medium">Universities</div>
                  <div className="text-slate-400 text-xs">Research labs, professors</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {panelTab === 'explore' && activeTab === 'marketplace' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search opportunities in Boulder..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Location indicator */}
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <MapPin size={16} />
              <span>Boulder, CO area</span>
            </div>

            {/* Marketplace Listings */}
            <div className="space-y-3">
              <h3 className="text-slate-300 font-medium text-sm">
                Available Opportunities ({filteredListings.length})
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredListings.map(listing => (
                  <div
                    key={listing.id}
                    className="p-4 bg-slate-700/40 hover:bg-slate-700/60 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white text-sm font-medium group-hover:text-indigo-300 transition-colors">
                        {listing.title}
                      </h4>
                      <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-300" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {listing.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {listing.timeCommitment}
                        </span>
                      </div>
                      
                      <div className="inline-block px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded">
                        {listing.type}
                      </div>
                      
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {listing.description}
                      </p>
                      
                      <div className="text-xs text-slate-400">
                        <span className="font-medium">Requirements:</span> {listing.requirements}
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-slate-600/30">
                        <span className="text-xs text-slate-400">
                          Posted {listing.postedDays} days ago
                        </span>
                        <span className="text-xs text-indigo-400 font-medium">
                          {listing.contact}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredListings.length === 0 && searchQuery && (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm">No opportunities found for "{searchQuery}"</p>
                  <p className="text-xs mt-2">Try adjusting your search terms</p>
                </div>
              )}
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
