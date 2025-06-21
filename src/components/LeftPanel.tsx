
import React, { useState } from 'react';
import { Plus, Search, BookOpen, Target, Briefcase, Trophy, MapPin, X, Clock, Users, ExternalLink } from 'lucide-react';
import { useGoalStore } from '../store/goalStore';
import AddGoalModal from './AddGoalModal';

interface LeftPanelProps {
  activeTab: 'local' | 'marketplace';
}

interface OpportunityDetails {
  id: string;
  title: string;
  organization: string;
  location: string;
  type: string;
  timeCommitment: string;
  description: string;
  requirements: string[];
  benefits: string[];
  contact: string;
  applicationDeadline?: string;
}

const LeftPanel = ({ activeTab }: LeftPanelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const localOpportunities: OpportunityDetails[] = [
    {
      id: 'local-research',
      title: 'Research Assistant Position',
      organization: 'University of Colorado Boulder',
      location: 'CU Boulder Campus',
      type: 'Research',
      timeCommitment: '8-12 hours/week',
      description: 'Join a cutting-edge research team in the Psychology Department studying cognitive development in adolescents. Gain hands-on experience with data collection, analysis, and research methodology.',
      requirements: [
        'High school junior or senior',
        'GPA of 3.5 or higher',
        'Interest in psychology or neuroscience',
        'Reliable schedule commitment'
      ],
      benefits: [
        'Research experience for college applications',
        'Potential co-authorship on publications',
        'Strong letter of recommendation',
        'Graduate school preparation'
      ],
      contact: 'Dr. Sarah Johnson - s.johnson@colorado.edu',
      applicationDeadline: 'Rolling basis'
    },
    {
      id: 'local-hospital',
      title: 'Hospital Volunteer Program',
      organization: 'Boulder Community Health',
      location: 'Boulder Community Hospital',
      type: 'Healthcare Volunteer',
      timeCommitment: '4-6 hours/week',
      description: 'Support patient services, assist nursing staff, and gain valuable healthcare exposure. Perfect for students interested in medical careers.',
      requirements: [
        'Must be 16 years or older',
        'Complete 20-hour training program',
        'Background check required',
        'Minimum 6-month commitment'
      ],
      benefits: [
        'Direct healthcare experience',
        'Patient interaction skills',
        'Medical field networking',
        'Community service hours'
      ],
      contact: 'Volunteer Services - (303) 415-7000',
      applicationDeadline: 'Apply 2 months in advance'
    },
    {
      id: 'local-government',
      title: 'City Hall Internship',
      organization: 'City of Boulder',
      location: 'Boulder City Hall',
      type: 'Government Internship',
      timeCommitment: '6-10 hours/week',
      description: 'Learn about local government operations, assist with community projects, and attend city council meetings. Great introduction to public service.',
      requirements: [
        'High school student',
        'Interest in government/politics',
        'Strong communication skills',
        'Professional attitude'
      ],
      benefits: [
        'Government experience',
        'Public speaking opportunities',
        'Civic engagement understanding',
        'Professional references'
      ],
      contact: 'Human Resources - hr@bouldercolorado.gov'
    },
    {
      id: 'local-business',
      title: 'Local Business Mentorship',
      organization: 'Boulder Chamber of Commerce',
      location: 'Various Boulder Businesses',
      type: 'Business/Entrepreneurship',
      timeCommitment: '3-5 hours/week',
      description: 'Shadow local business owners, learn about entrepreneurship, and potentially start your own project with mentorship support.',
      requirements: [
        'Entrepreneurial interest',
        'Self-motivated',
        'Professional communication',
        'Flexible schedule'
      ],
      benefits: [
        'Business skills development',
        'Entrepreneurship experience',
        'Professional networking',
        'Real-world application'
      ],
      contact: 'Boulder Chamber - info@boulderchamber.com'
    },
    {
      id: 'local-nonprofit',
      title: 'Community Service Leadership',
      organization: 'Boulder Community Foundation',
      location: 'Various Boulder Locations',
      type: 'Nonprofit/Service',
      timeCommitment: '5-8 hours/week',
      description: 'Lead volunteer projects, organize community events, and make a direct impact on local issues like homelessness, education, and environment.',
      requirements: [
        'Leadership potential',
        'Passion for community service',
        'Organizational skills',
        'Team collaboration'
      ],
      benefits: [
        'Leadership experience',
        'Community impact',
        'Event planning skills',
        'Service hours for college'
      ],
      contact: 'Community Programs - programs@bouldercommunityfoundation.org'
    }
  ];

  const filteredOpportunities = localOpportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const OpportunityModal = ({ opportunity, onClose }: { opportunity: OpportunityDetails; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{opportunity.title}</h3>
            <p className="text-slate-300">{opportunity.organization}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <MapPin size={16} />
              {opportunity.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock size={16} />
              {opportunity.timeCommitment}
            </div>
          </div>

          <div className="bg-indigo-900/20 border border-indigo-600/30 rounded-lg p-3">
            <span className="text-indigo-300 text-sm font-medium">{opportunity.type}</span>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Description</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{opportunity.description}</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Requirements</h4>
            <ul className="space-y-1">
              {opportunity.requirements.map((req, index) => (
                <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Benefits</h4>
            <ul className="space-y-1">
              {opportunity.benefits.map((benefit, index) => (
                <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Contact Information</h4>
            <p className="text-slate-300 text-sm">{opportunity.contact}</p>
            {opportunity.applicationDeadline && (
              <p className="text-yellow-400 text-sm mt-1">
                Application: {opportunity.applicationDeadline}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add to My Plan
            </button>
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
    <>
      <div className="w-80 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="text-green-400" size={20} />
            <h2 className="text-white font-semibold text-lg">Local Opportunities</h2>
          </div>
          
          <p className="text-slate-400 text-sm mb-4">
            Discover opportunities in the Boulder, CO area. Lower competition, easier to get started.
          </p>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg mb-6"
        >
          <Plus size={20} />
          Create New Goal
        </button>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Opportunities List */}
        <div className="space-y-3">
          <h3 className="text-slate-300 font-medium text-sm">Available Opportunities ({filteredOpportunities.length})</h3>
          
          <div className="space-y-3">
            {filteredOpportunities.map(opportunity => (
              <div
                key={opportunity.id}
                onClick={() => setSelectedOpportunity(opportunity)}
                className="p-4 bg-slate-700/40 hover:bg-slate-700/60 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white text-sm font-medium group-hover:text-indigo-300 transition-colors">
                    {opportunity.title}
                  </h4>
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-300" />
                </div>
                
                <p className="text-slate-400 text-xs mb-2">{opportunity.organization}</p>
                
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {opportunity.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {opportunity.timeCommitment}
                  </span>
                </div>
                
                <div className="inline-block px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded">
                  {opportunity.type}
                </div>
              </div>
            ))}
          </div>
          
          {filteredOpportunities.length === 0 && searchQuery && (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm">No opportunities found for "{searchQuery}"</p>
              <p className="text-xs mt-2">Try adjusting your search terms</p>
            </div>
          )}
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
    </>
  );
};

export default LeftPanel;
