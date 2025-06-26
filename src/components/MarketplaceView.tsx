
import React, { useState } from 'react';
import { Search, Globe, Star, Users, Clock, ExternalLink, Plus, ArrowLeft, Filter, Sparkles, TrendingUp } from 'lucide-react';
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
  featured?: boolean;
}

const MarketplaceView = ({ onBackToLocal }: MarketplaceViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<MarketplaceOpportunity | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

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
      applicationUrl: 'https://buildyourfuture.withgoogle.com/programs/computer-science-summer-institute',
      featured: true
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
      applicationUrl: 'https://launch.mit.edu',
      featured: true
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

  const filteredOpportunities = marketplaceOpportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
      opp.type.toLowerCase().includes(selectedFilter.toLowerCase()) ||
      opp.difficulty.toLowerCase() === selectedFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const featuredOpportunities = filteredOpportunities.filter(opp => opp.featured);
  const regularOpportunities = filteredOpportunities.filter(opp => !opp.featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'summer program': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'internship': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'research program': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const OpportunityModal = ({ opportunity, onClose }: { opportunity: MarketplaceOpportunity; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div className="pr-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{opportunity.title}</h3>
            <p className="text-lg text-gray-600">{opportunity.organization}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ExternalLink size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock size={18} className="text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-medium text-gray-900">{opportunity.timeCommitment}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Users size={18} className="text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Participants</div>
                <div className="font-medium text-gray-900">{opportunity.participants}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Star size={18} className="text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Rating</div>
                <div className="font-medium text-gray-900">{opportunity.rating}/5.0</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 text-sm rounded-full border ${getDifficultyColor(opportunity.difficulty)}`}>
              {opportunity.difficulty}
            </span>
            <span className={`px-3 py-1 text-sm rounded-full border ${getTypeColor(opportunity.type)}`}>
              {opportunity.type}
            </span>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
            <p className="text-gray-700 leading-relaxed">{opportunity.description}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {opportunity.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm"
            >
              Add to My Plan
            </button>
            {opportunity.applicationUrl && (
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors shadow-sm text-center"
              >
                Apply Now
              </a>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative">
      {/* Grainy texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.015'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={onBackToLocal}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors sm:hidden"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                  <Globe className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
                  <p className="text-gray-600 text-sm">Discover national opportunities and competitive programs</p>
                </div>
              </div>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>
              
              <div className="flex gap-2">
                {['all', 'summer program', 'internship', 'research program', 'beginner', 'intermediate', 'advanced'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                      selectedFilter === filter
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          {/* Featured Section */}
          {featuredOpportunities.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900">Featured Opportunities</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredOpportunities.map(opportunity => (
                  <div
                    key={opportunity.id}
                    onClick={() => setSelectedOpportunity(opportunity)}
                    className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl border border-blue-200/50 hover:border-blue-300/50 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                  >
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200">
                        <Sparkles size={12} />
                        Featured
                      </div>
                    </div>
                    
                    <div className="pr-20">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                        {opportunity.title}
                      </h3>
                      <p className="text-blue-600 font-medium mb-3">{opportunity.organization}</p>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{opportunity.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
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
                      
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full border ${getDifficultyColor(opportunity.difficulty)}`}>
                          {opportunity.difficulty}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(opportunity.type)}`}>
                          {opportunity.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Opportunities */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">All Opportunities</h2>
            <p className="text-gray-600 text-sm">Browse through our collection of programs and internships</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {regularOpportunities.map(opportunity => (
              <div
                key={opportunity.id}
                onClick={() => setSelectedOpportunity(opportunity)}
                className="p-6 bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all cursor-pointer group shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors pr-4">
                    {opportunity.title}
                  </h4>
                  <ExternalLink size={16} className="text-gray-400 group-hover:text-gray-600 mt-1 flex-shrink-0" />
                </div>
                
                <p className="text-gray-600 font-medium mb-3">{opportunity.organization}</p>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{opportunity.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
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
                
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getDifficultyColor(opportunity.difficulty)}`}>
                    {opportunity.difficulty}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(opportunity.type)}`}>
                    {opportunity.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {filteredOpportunities.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <p className="text-lg text-gray-600 mb-2">No opportunities found</p>
              <p className="text-sm text-gray-500">Try adjusting your search terms or filters</p>
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
