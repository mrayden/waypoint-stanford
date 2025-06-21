
import React, { useState } from 'react';
import { Search, MapPin, Clock, ExternalLink, Filter } from 'lucide-react';

const MarketplaceView = () => {
  const [searchQuery, setSearchQuery] = useState('');

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
      postedDays: 3,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop'
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
      postedDays: 1,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=200&fit=crop'
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
      postedDays: 5,
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=200&fit=crop'
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
      postedDays: 2,
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=200&fit=crop'
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
      postedDays: 7,
      image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=200&fit=crop'
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
      postedDays: 4,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop'
    }
  ];

  const filteredListings = marketplaceListings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-slate-900 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Boulder Area Opportunities</h1>
          <p className="text-slate-400">Find meaningful experiences and build your future</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
            <Filter size={20} />
            Filters
          </button>
        </div>

        {/* Location indicator */}
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
          <MapPin size={16} />
          <span>Showing {filteredListings.length} opportunities in Boulder, CO area</span>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
            <div
              key={listing.id}
              className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:bg-slate-700/50 transition-all cursor-pointer group hover:scale-105 duration-200"
            >
              {/* Image */}
              <div className="h-48 bg-slate-700 overflow-hidden">
                <img 
                  src={listing.image} 
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold text-lg group-hover:text-blue-300 transition-colors">
                    {listing.title}
                  </h3>
                  <ExternalLink size={16} className="text-slate-400 group-hover:text-slate-300" />
                </div>
                
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {listing.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {listing.timeCommitment}
                  </span>
                </div>
                
                <div className="inline-block px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded mb-3">
                  {listing.type}
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-3 line-clamp-3">
                  {listing.description}
                </p>
                
                <div className="text-xs text-slate-400 mb-3">
                  <span className="font-medium">Requirements:</span> {listing.requirements}
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-slate-600/30">
                  <span className="text-xs text-slate-400">
                    Posted {listing.postedDays} days ago
                  </span>
                  <span className="text-xs text-blue-400 font-medium">
                    View Details
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredListings.length === 0 && searchQuery && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg">No opportunities found for "{searchQuery}"</p>
            <p className="text-sm mt-2">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceView;
