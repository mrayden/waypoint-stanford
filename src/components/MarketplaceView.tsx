
import React, { useState } from 'react';
import { Search, Globe, Star, Users, Clock, ExternalLink, Plus, ArrowLeft } from 'lucide-react';
import AddGoalModal from './AddGoalModal';

interface MarketplaceViewProps {
  onBackToLocal: () => void;
}

interface MarketplaceOpportunity {
  id: string;
  title: string;
  organization: string;
  type: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeCommitment: string;
  participants: number;
  rating: number;
  description: string;
  tags: string[];
  applicationUrl?: string;
}

const MarketplaceView = ({ onBackToLocal }: MarketplaceViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<MarketplaceOpportunity | null>(null);

  const marketplaceOpportunities: MarketplaceOpportunity[] = [
    {
      id: 'google-cssi',
      title: 'Google Computer Science Summer Institute',
      organization: 'Google',
      type: 'Summer Program',
      difficulty: 'Intermediate',
      timeCommitment: '3 weeks',
      participants: 1200,
      rating: 4.8,
      description: 'Intensive computer science program for high school students interested in technology.',
      tags: ['Computer Science', 'Technology', 'Programming'],
      applicationUrl: 'https://buildyourfuture.withgoogle.com/programs/computer-science-summer-institute'
    },
    {
      id: 'mit-launch',
      title: 'MIT Launch Entrepreneurship Program',
      organization: 'MIT',
      type: 'Summer Program',
      difficulty: 'Advanced',
      timeCommitment: '4 weeks',
      participants: 800,
      rating: 4.9,
      description: 'Learn to start and run your own company with guidance from MIT faculty.',
      tags: ['Entrepreneurship', 'Business', 'Innovation'],
      applicationUrl: 'https://launch.mit.edu'
    },
    {
      id: 'nasa-usrp',
      title: 'NASA Undergraduate Student Research Program',
      organization: 'NASA',
      type: 'Research Program',
      difficulty: 'Advanced',
      timeCommitment: '10 weeks',
      participants: 500,
      rating: 4.7,
      description: 'Conduct research alongside NASA scientists and engineers.',
      tags: ['Research', 'STEM', 'Space', 'Engineering'],
      applicationUrl: 'https://intern.nasa.gov'
    },
    {
      id: 'cdc-prep',
      title: 'CDC Public Health Preparedness Program',
      organization: 'CDC',
      type: 'Internship',
      difficulty: 'Intermediate',
      timeCommitment: '8 weeks',
      participants: 300,
      rating: 4.6,
      description: 'Gain experience in public health emergency preparedness and response.',
      tags: ['Public Health', 'Medicine', 'Government'],
      applicationUrl: 'https://www.cdc.gov/careers'
    },
    {
      id: 'nih-sip',
      title: 'NIH Summer Internship Program',
      organization: 'National Institutes of Health',
      type: 'Research Internship',
      difficulty: 'Intermediate',
      timeCommitment: '8-10 weeks',
      participants: 1500,
      rating: 4.5,
      description: 'Conduct biomedical research in NIH laboratories.',
      tags: ['Research', 'Medicine', 'Biology', 'Health'],
      applicationUrl: 'https://www.training.nih.gov/programs/sip'
    }
  ];

  const filteredOpportunities = marketplaceOpportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-900/30';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-900/30';
      case 'Advanced': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const OpportunityModal = ({ opportunity, onClose }: { opportunity: MarketplaceOpportunity; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{opportunity.title}</h3>
            <p className="text-slate-300">{opportunity.organization}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <ExternalLink size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock size={16} />
              {opportunity.timeCommitment}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Users size={16} />
              {opportunity.participants} participants
            </div>
          </div>

          <div className="flex gap-2">
            <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(opportunity.difficulty)}`}>
              {opportunity.difficulty}
            </span>
            <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded">
              {opportunity.type}
            </span>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Description</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{opportunity.description}</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {opportunity.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add to My Plan
            </button>
            {opportunity.applicationUrl && (
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                Apply
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="w-full">
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBackToLocal}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-400" />
            </button>
            <Globe className="text-blue-400" size={20} />
            <h1 className="text-2xl font-bold text-white">Marketplace</h1>
          </div>
          
          <p className="text-slate-400 text-sm mb-4">
            Discover national opportunities and competitive programs.
          </p>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </header>

        {/* Opportunities Grid */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map(opportunity => (
              <div
                key={opportunity.id}
                onClick={() => setSelectedOpportunity(opportunity)}
                className="p-6 bg-slate-700/40 hover:bg-slate-700/60 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-white text-lg font-medium group-hover:text-blue-300 transition-colors">
                    {opportunity.title}
                  </h4>
                  <ExternalLink size={16} className="text-slate-400 group-hover:text-slate-300" />
                </div>
                
                <p className="text-slate-400 text-sm mb-3">{opportunity.organization}</p>
                
                <p className="text-slate-300 text-sm mb-4 line-clamp-2">{opportunity.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {opportunity.timeCommitment}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={12} />
                    {opportunity.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {opportunity.participants}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(opportunity.difficulty)}`}>
                    {opportunity.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded">
                    {opportunity.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {filteredOpportunities.length === 0 && searchQuery && (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg">No opportunities found for "{searchQuery}"</p>
              <p className="text-sm mt-2">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {selectedOpportunity && (
        <OpportunityModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}
    </div>
  );
};

export default MarketplaceView;
