
import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Star, Clock, Users, Globe, Plus, ExternalLink, Trophy, BookOpen, Zap, MapPin, Building } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import AddGoalModal from './AddGoalModal';

interface MarketplaceViewProps {
  onBackToLocal: () => void;
}

const MarketplaceView = ({ onBackToLocal }: MarketplaceViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);

  const categories = [
    { id: 'all', name: 'All Categories', icon: Globe },
    { id: 'academic', name: 'Academic', icon: BookOpen },
    { id: 'summer', name: 'Summer Programs', icon: Zap },
    { id: 'competitions', name: 'Competitions', icon: Trophy },
    { id: 'internships', name: 'Internships', icon: Building },
    { id: 'research', name: 'Research', icon: Star },
  ];

  const opportunities = [
    {
      id: '1',
      title: 'Stanford AI4ALL Summer Program',
      organization: 'Stanford University',
      category: 'summer',
      type: 'Summer Program',
      deadline: '2025-03-15',
      duration: '6 weeks',
      location: 'Stanford, CA',
      difficulty: 'Intermediate',
      description: 'AI summer program for underrepresented students in technology',
      tags: ['AI', 'Machine Learning', 'Diversity'],
      rating: 4.8,
      participants: 450,
      featured: true,
      icon: '🤖'
    },
    {
      id: '2',
      title: 'Intel Science & Engineering Fair',
      organization: 'Intel Corporation',
      category: 'competitions',
      type: 'Competition',
      deadline: '2025-01-30',
      duration: '1 week',
      location: 'Various locations',
      difficulty: 'Advanced',
      description: 'International science and engineering competition for high school students',
      tags: ['Science', 'Engineering', 'Research'],
      rating: 4.9,
      participants: 1200,
      trending: true,
      icon: '🔬'
    },
    {
      id: '3',
      title: 'AP Biology Course',
      organization: 'College Board',
      category: 'academic',
      type: 'Course',
      deadline: '2025-08-30',
      duration: '1 year',
      location: 'Your school',
      difficulty: 'Advanced',
      description: 'Advanced placement biology course covering molecular biology, genetics, and ecology',
      tags: ['Biology', 'AP', 'Science'],
      rating: 4.6,
      participants: 2500,
      icon: '🧬'
    },
    {
      id: '4',
      title: 'Google Summer Internship',
      organization: 'Google',
      category: 'internships',
      type: 'Internship',
      deadline: '2025-02-01',
      duration: '12 weeks',
      location: 'Mountain View, CA',
      difficulty: 'Advanced',
      description: 'Software engineering internship at Google for college students',
      tags: ['Software', 'Engineering', 'Tech'],
      rating: 4.9,
      participants: 180,
      featured: true,
      icon: '💻'
    },
    {
      id: '5',
      title: 'NASA USRP Research Program',
      organization: 'NASA',
      category: 'research',
      type: 'Research',
      deadline: '2025-03-01',
      duration: '10 weeks',
      location: 'Various NASA centers',
      difficulty: 'Intermediate',
      description: 'Undergraduate Student Research Program at NASA centers nationwide',
      tags: ['Space', 'Research', 'STEM'],
      rating: 4.7,
      participants: 320,
      trending: true,
      icon: '🚀'
    },
    {
      id: '6',
      title: 'Harvard Summer School',
      organization: 'Harvard University',
      category: 'summer',
      type: 'Summer Program',
      deadline: '2025-04-15',
      duration: '8 weeks',
      location: 'Cambridge, MA',
      difficulty: 'Intermediate',
      description: 'College-level courses during summer at Harvard University',
      tags: ['Liberal Arts', 'University', 'Academic'],
      rating: 4.8,
      participants: 890,
      icon: '🎓'
    }
  ];

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredOpportunities = opportunities.filter(opp => opp.featured);
  const trendingOpportunities = opportunities.filter(opp => opp.trending);

  const handleAddToMyPlan = (opportunity: any) => {
    setSelectedOpportunity(opportunity);
    setIsAddGoalModalOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-50';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'Advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const OpportunityCard = ({ opportunity }: { opportunity: any }) => (
    <Card className="group hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-gray-300 animate-fade-in bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="text-2xl flex-shrink-0">{opportunity.icon}</div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {opportunity.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                {opportunity.organization}
              </CardDescription>
            </div>
          </div>
          {(opportunity.featured || opportunity.trending) && (
            <div className={`text-xs px-2 py-1 rounded-full font-medium ${
              opportunity.featured 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                : 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
            }`}>
              {opportunity.featured ? 'Featured' : 'Trending'}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0">
        <p className="text-sm text-gray-600 line-clamp-2">
          {opportunity.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {opportunity.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{opportunity.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span className="truncate">{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{opportunity.participants} participants</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={12} />
            <span>{opportunity.rating}/5.0</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(opportunity.difficulty)}`}>
            {opportunity.difficulty}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 px-3 hover:bg-gray-50"
            >
              <ExternalLink size={12} className="mr-1" />
              Learn More
            </Button>
            <Button
              onClick={() => handleAddToMyPlan(opportunity)}
              size="sm"
              className="text-xs h-8 px-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-sm"
            >
              <Plus size={12} className="mr-1" />
              Add to Plan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={onBackToLocal}
              variant="outline"
              size="sm"
              className="lg:hidden flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Planning
            </Button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                <Globe size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
                  Opportunities
                </h2>
                <p className="text-gray-600 font-medium">Discover programs, competitions, and experiences</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {categories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <CategoryIcon size={16} />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Section */}
        {featuredOpportunities.length > 0 && selectedCategory === 'all' && (
          <div className="mb-8 animate-slide-in-right">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="text-yellow-500" size={20} />
              Featured Opportunities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          </div>
        )}

        {/* Trending Section */}
        {trendingOpportunities.length > 0 && selectedCategory === 'all' && (
          <div className="mb-8 animate-slide-in-right" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="text-orange-500" size={20} />
              Trending Now
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          </div>
        )}

        {/* All Opportunities */}
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Filter size={20} />
            {selectedCategory === 'all' ? 'All Opportunities' : `${categories.find(c => c.id === selectedCategory)?.name} Opportunities`}
            <span className="text-sm text-gray-500 font-normal">({filteredOpportunities.length})</span>
          </h3>
          
          {filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity, index) => (
                <div key={opportunity.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <OpportunityCard opportunity={opportunity} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h4>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Goal Modal */}
      <AddGoalModal 
        isOpen={isAddGoalModalOpen} 
        onClose={() => {
          setIsAddGoalModalOpen(false);
          setSelectedOpportunity(null);
        }}
        prefilledData={selectedOpportunity ? {
          title: selectedOpportunity.title,
          description: selectedOpportunity.description,
          icon: selectedOpportunity.icon,
          source: selectedOpportunity.organization
        } : undefined}
      />
    </div>
  );
};

export default MarketplaceView;
