import React, { useState } from 'react';
import { Search, Globe, Star, Users, Clock, ExternalLink, Plus, ArrowLeft, Filter, Sparkles, TrendingUp, Award, Target } from 'lucide-react';
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
  trending?: boolean;
  deadline?: string;
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
      description: 'Intensive computer science program for high school students interested in technology and programming.',
      tags: ['Computer Science', 'Technology', 'Programming', 'AI'],
      applicationUrl: 'https://buildyourfuture.withgoogle.com/programs/computer-science-summer-institute',
      featured: true,
      trending: true,
      deadline: 'March 15, 2025'
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
      description: 'Learn to start and run your own company with guidance from MIT faculty and successful entrepreneurs.',
      tags: ['Entrepreneurship', 'Business', 'Innovation', 'Startups'],
      applicationUrl: 'https://launch.mit.edu',
      featured: true,
      deadline: 'February 28, 2025'
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
      description: 'Conduct cutting-edge research alongside NASA scientists and engineers in space exploration.',
      tags: ['Research', 'STEM', 'Space', 'Engineering'],
      applicationUrl: 'https://intern.nasa.gov',
      trending: true,
      deadline: 'January 31, 2025'
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
      description: 'Gain hands-on experience in public health emergency preparedness and response strategies.',
      tags: ['Public Health', 'Medicine', 'Government', 'Policy'],
      applicationUrl: 'https://www.cdc.gov/careers',
      deadline: 'April 10, 2025'
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
      description: 'Conduct biomedical research in world-class NIH laboratories with leading scientists.',
      tags: ['Research', 'Medicine', 'Biology', 'Health', 'Biotech'],
      applicationUrl: 'https://www.training.nih.gov/programs/sip',
      deadline: 'March 1, 2025'
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
  const trendingOpportunities = filteredOpportunities.filter(opp => opp.trending && !opp.featured);
  const regularOpportunities = filteredOpportunities.filter(opp => !opp.featured && !opp.trending);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-200';
      case 'Advanced': return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'summer program': return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200';
      case 'internship': return 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200';
      case 'research program': return 'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  const OpportunityModal = ({ opportunity, onClose }: { opportunity: MarketplaceOpportunity; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-white/20 animate-scale-in">
        <div className="flex justify-between items-start mb-6">
          <div className="pr-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
              {opportunity.title}
            </h3>
            <p className="text-lg font-semibold text-blue-600">{opportunity.organization}</p>
            {opportunity.deadline && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-200">
                <Clock size={14} />
                Deadline: {opportunity.deadline}
              </div>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
          >
            <ExternalLink size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <Clock size={18} className="text-blue-600" />
              <div>
                <div className="text-sm text-blue-600 font-medium">Duration</div>
                <div className="font-bold text-gray-900">{opportunity.timeCommitment}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <Users size={18} className="text-green-600" />
              <div>
                <div className="text-sm text-green-600 font-medium">Participants</div>
                <div className="font-bold text-gray-900">{opportunity.participants}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100">
              <Star size={18} className="text-yellow-600" />
              <div>
                <div className="text-sm text-yellow-600 font-medium">Rating</div>
                <div className="font-bold text-gray-900">{opportunity.rating}/5.0</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1.5 text-sm font-medium rounded-xl border ${getDifficultyColor(opportunity.difficulty)}`}>
              {opportunity.difficulty}
            </span>
            <span className={`px-3 py-1.5 text-sm font-medium rounded-xl border ${getTypeColor(opportunity.type)}`}>
              {opportunity.type}
            </span>
            {opportunity.trending && (
              <span className="px-3 py-1.5 text-sm font-medium rounded-xl border bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200 flex items-center gap-1">
                <TrendingUp size={12} />
                Trending
              </span>
            )}
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">Description</h4>
            <p className="text-gray-700 leading-relaxed">{opportunity.description}</p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {opportunity.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-sm font-medium rounded-xl border border-gray-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setIsModalOpen(true);
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-green-500/25 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Add to My Plan
            </button>
            {opportunity.applicationUrl && (
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:scale-105 text-center flex items-center justify-center gap-2"
              >
                <ExternalLink size={18} />
                Apply Now
              </a>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-2xl font-bold transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-100/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-green-400/10 to-emerald-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Grainy texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.025'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-white/20 p-4 sm:p-6 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8 animate-fade-in">
              <button
                onClick={onBackToLocal}
                className="p-3 hover:bg-white/80 rounded-2xl transition-all duration-200 sm:hidden shadow-md border border-white/30"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                  <Sparkles className="text-white relative z-10" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-800 via-pink-700 to-indigo-800 bg-clip-text text-transparent">
                    Opportunities
                  </h1>
                  <p className="text-gray-600 font-medium">Discover national programs and competitive opportunities</p>
                </div>
              </div>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 animate-slide-in-right">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg font-medium transition-all duration-200"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['all', 'summer program', 'internship', 'research program', 'beginner', 'intermediate', 'advanced'].map((filter, index) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 whitespace-nowrap animate-scale-in ${
                      selectedFilter === filter
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                        : 'bg-white/80 text-gray-600 border border-white/30 hover:bg-white hover:shadow-md backdrop-blur-sm'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
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
            <div className="mb-12 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-yellow-800 bg-clip-text text-transparent">
                  Featured Opportunities
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredOpportunities.map((opportunity, index) => (
                  <div
                    key={opportunity.id}
                    onClick={() => setSelectedOpportunity(opportunity)}
                    className="relative p-8 bg-gradient-to-br from-blue-50/80 via-white/90 to-indigo-50/80 backdrop-blur-sm hover:from-blue-100/80 hover:to-indigo-100/80 rounded-3xl border border-white/40 hover:border-blue-300/50 transition-all duration-300 cursor-pointer group shadow-xl hover:shadow-2xl hover:scale-[1.02] animate-scale-in"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="absolute top-6 right-6 flex gap-2">
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 text-xs font-bold rounded-xl border border-orange-200">
                        <Sparkles size={12} />
                        Featured
                      </div>
                      {opportunity.trending && (
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                          <TrendingUp size={12} />
                          Trending
                        </div>
                      )}
                    </div>
                    
                    <div className="pr-24">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {opportunity.title}
                      </h3>
                      <p className="text-blue-600 font-bold mb-4">{opportunity.organization}</p>
                      <p className="text-gray-700 text-sm mb-6 line-clamp-3 leading-relaxed">{opportunity.description}</p>
                      
                      <div className="flex items-center gap-6 text-xs text-gray-600 mb-6">
                        <span className="flex items-center gap-2">
                          <Clock size={14} />
                          {opportunity.timeCommitment}
                        </span>
                        <span className="flex items-center gap-2">
                          <Star size={14} className="text-yellow-500" />
                          {opportunity.rating}
                        </span>
                        <span className="flex items-center gap-2">
                          <Users size={14} />
                          {opportunity.participants}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1.5 text-xs font-medium rounded-xl border ${getDifficultyColor(opportunity.difficulty)}`}>
                          {opportunity.difficulty}
                        </span>
                        <span className={`px-3 py-1.5 text-xs font-medium rounded-xl border ${getTypeColor(opportunity.type)}`}>
                          {opportunity.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Section */}
          {trendingOpportunities.length > 0 && (
            <div className="mb-12 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <TrendingUp size={18} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-pink-800 bg-clip-text text-transparent">
                  Trending Now
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {trendingOpportunities.map((opportunity, index) => (
                  <OpportunityCard 
                    key={opportunity.id} 
                    opportunity={opportunity} 
                    onClick={() => setSelectedOpportunity(opportunity)}
                    delay={index * 100}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Opportunities */}
          <div className="mb-6 animate-fade-in">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent mb-2">
              All Opportunities
            </h2>
            <p className="text-gray-600 font-medium">Browse through our complete collection of programs and internships</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
            {regularOpportunities.map((opportunity, index) => (
              <OpportunityCard 
                key={opportunity.id} 
                opportunity={opportunity} 
                onClick={() => setSelectedOpportunity(opportunity)}
                delay={index * 75}
              />
            ))}
          </div>
          
          {filteredOpportunities.length === 0 && (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Search size={32} className="text-gray-400" />
              </div>
              <p className="text-xl text-gray-600 mb-3 font-semibold">No opportunities found</p>
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

// Separate component for opportunity cards
const OpportunityCard = ({ opportunity, onClick, delay }: { 
  opportunity: any; 
  onClick: () => void; 
  delay: number;
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-200';
      case 'Advanced': return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'summer program': return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200';
      case 'internship': return 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200';
      case 'research program': return 'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div
      onClick={onClick}
      className="p-6 bg-white/90 backdrop-blur-sm hover:bg-white rounded-2xl border border-white/40 hover:border-gray-300/50 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl hover:scale-[1.02] animate-scale-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-4">
          <h4 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-2 mb-2">
            {opportunity.title}
          </h4>
          {opportunity.trending && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 text-xs font-bold rounded-lg border border-red-200 mb-2">
              <TrendingUp size={10} />
              Trending
            </div>
          )}
        </div>
        <ExternalLink size={16} className="text-gray-400 group-hover:text-gray-600 mt-1 flex-shrink-0 transition-colors duration-200" />
      </div>
      
      <p className="text-purple-600 font-bold mb-3 text-sm">{opportunity.organization}</p>
      <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">{opportunity.description}</p>
      
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {opportunity.timeCommitment}
        </span>
        <span className="flex items-center gap-1">
          <Star size={12} className="text-yellow-500" />
          {opportunity.rating}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} />
          {opportunity.participants}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getDifficultyColor(opportunity.difficulty)}`}>
          {opportunity.difficulty}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getTypeColor(opportunity.type)}`}>
          {opportunity.type}
        </span>
      </div>
    </div>
  );
};

export default MarketplaceView;
