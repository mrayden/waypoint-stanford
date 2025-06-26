
import React, { useState } from 'react';
import { Search, Star, Users, Clock, ExternalLink, Plus, ArrowLeft, Filter, Sparkles, Award, BookOpen, Code, Briefcase } from 'lucide-react';
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
  category: 'STEM' | 'Business' | 'Arts' | 'Public Service' | 'Research';
  applicationUrl?: string;
  featured?: boolean;
}

const MarketplaceView = ({ onBackToLocal }: MarketplaceViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<MarketplaceOpportunity | null>(null);

  const categories = [
    { id: 'all', name: 'All Categories', icon: Sparkles },
    { id: 'STEM', name: 'STEM & Tech', icon: Code },
    { id: 'Business', name: 'Business', icon: Briefcase },
    { id: 'Research', name: 'Research', icon: BookOpen },
    { id: 'Public Service', name: 'Public Service', icon: Award },
  ];

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
      tags: ['Computer Science', 'Technology', 'Programming', 'Web Development'],
      category: 'STEM',
      featured: true,
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
      description: 'Learn to start and run your own company with guidance from MIT faculty and successful entrepreneurs.',
      tags: ['Entrepreneurship', 'Business', 'Innovation', 'Startup'],
      category: 'Business',
      featured: true,
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
      description: 'Conduct cutting-edge research alongside NASA scientists and engineers in aerospace technology.',
      tags: ['Research', 'STEM', 'Space', 'Engineering', 'Physics'],
      category: 'Research',
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
      description: 'Gain hands-on experience in public health emergency preparedness and response strategies.',
      tags: ['Public Health', 'Medicine', 'Government', 'Policy'],
      category: 'Public Service',
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
      description: 'Conduct biomedical research in world-class NIH laboratories with leading scientists.',
      tags: ['Research', 'Medicine', 'Biology', 'Health', 'Science'],
      category: 'Research',
      applicationUrl: 'https://www.training.nih.gov/programs/sip'
    }
  ];

  const filteredOpportunities = marketplaceOpportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredOpportunities = filteredOpportunities.filter(opp => opp.featured);
  const regularOpportunities = filteredOpportunities.filter(opp => !opp.featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : BookOpen;
  };

  const OpportunityCard = ({ opportunity, featured = false }: { opportunity: MarketplaceOpportunity; featured?: boolean }) => {
    const CategoryIcon = getCategoryIcon(opportunity.category);
    
    return (
      <div
        onClick={() => setSelectedOpportunity(opportunity)}
        className={`group cursor-pointer bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
          featured ? 'ring-2 ring-blue-200 dark:ring-blue-800/50 shadow-lg' : 'shadow-sm hover:shadow-lg'
        }`}
      >
        {featured && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles size={12} className="text-white" />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                <CategoryIcon size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {opportunity.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{opportunity.organization}</p>
              </div>
            </div>
            <ExternalLink size={16} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          </div>
          
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">
            {opportunity.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {opportunity.timeCommitment}
            </div>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-500" />
              {opportunity.rating}
            </div>
            <div className="flex items-center gap-1">
              <Users size={12} />
              {opportunity.participants.toLocaleString()}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(opportunity.difficulty)}`}>
                {opportunity.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-xs font-medium rounded-full">
                {opportunity.type}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OpportunityModal = ({ opportunity, onClose }: { opportunity: MarketplaceOpportunity; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              {React.createElement(getCategoryIcon(opportunity.category), { size: 24, className: "text-white" })}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{opportunity.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium">{opportunity.organization}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ExternalLink size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
              <Clock size={20} className="text-slate-600 dark:text-slate-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-slate-900 dark:text-white">{opportunity.timeCommitment}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Duration</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
              <Users size={20} className="text-slate-600 dark:text-slate-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-slate-900 dark:text-white">{opportunity.participants.toLocaleString()}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Participants</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
              <Star size={20} className="text-yellow-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-slate-900 dark:text-white">{opportunity.rating}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Rating</div>
            </div>
          </div>

          <div className="flex gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(opportunity.difficulty)}`}>
              {opportunity.difficulty}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-sm font-medium rounded-full">
              {opportunity.type}
            </span>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">About This Program</h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{opportunity.description}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {opportunity.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => {
                setIsModalOpen(true);
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Plus size={16} className="inline mr-2" />
              Add to My Plan
            </button>
            {opportunity.applicationUrl && (
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Apply Now
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50/50 via-white/30 to-slate-100/50 dark:from-slate-950/50 dark:via-slate-900/30 dark:to-slate-950/50">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBackToLocal}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Marketplace</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Discover national opportunities and competitive programs</p>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <category.icon size={16} />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Featured Opportunities */}
        {featuredOpportunities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-yellow-500" />
              Featured Programs
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredOpportunities.map(opportunity => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Opportunities */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            All Programs ({filteredOpportunities.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {regularOpportunities.map(opportunity => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </div>
        
        {filteredOpportunities.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">No opportunities found</p>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search terms or filters</p>
          </div>
        )}
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
