
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, GraduationCap, User, MapPin, Heart, Target, Building } from 'lucide-react';
import { Button } from './ui/button';
import { saveUserData } from '../utils/cookieUtils';

interface University {
  name: string;
  country: string;
  'state-province'?: string;
  web_pages?: string[];
}

// Fallback university data in case API fails
const fallbackUniversities = [
  { name: 'Harvard University', country: 'United States', 'state-province': 'Massachusetts' },
  { name: 'Stanford University', country: 'United States', 'state-province': 'California' },
  { name: 'Massachusetts Institute of Technology', country: 'United States', 'state-province': 'Massachusetts' },
  { name: 'University of California, Berkeley', country: 'United States', 'state-province': 'California' },
  { name: 'Princeton University', country: 'United States', 'state-province': 'New Jersey' },
  { name: 'Yale University', country: 'United States', 'state-province': 'Connecticut' },
  { name: 'Columbia University', country: 'United States', 'state-province': 'New York' },
  { name: 'University of Chicago', country: 'United States', 'state-province': 'Illinois' },
  { name: 'University of Pennsylvania', country: 'United States', 'state-province': 'Pennsylvania' },
  { name: 'Cornell University', country: 'United States', 'state-province': 'New York' },
];

const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    interests: [] as string[],
    goals: [] as string[],
    targetUniversities: [] as string[],
  });
  const [universities, setUniversities] = useState<University[]>([]);
  const [universitySearch, setUniversitySearch] = useState('');
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    setIsLoadingUniversities(true);
    try {
      const response = await fetch('https://universities.hipolabs.com/search?country=United+States');
      if (!response.ok) {
        throw new Error('API request failed');
      }
      const data = await response.json();
      setUniversities(data.slice(0, 100)); // Limit to first 100 for performance
    } catch (error) {
      console.log('University API failed, using fallback data:', error);
      setUniversities(fallbackUniversities);
    } finally {
      setIsLoadingUniversities(false);
    }
  };

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(universitySearch.toLowerCase())
  );

  const interests = [
    'Computer Science', 'Engineering', 'Medicine', 'Business', 'Arts & Design',
    'Mathematics', 'Sciences', 'Literature', 'History', 'Psychology',
    'Economics', 'Political Science', 'Environmental Science', 'Music',
    'Sports & Athletics', 'Public Service', 'Journalism', 'Architecture'
  ];

  const commonGoals = [
    'Get into top university', 'Maintain high GPA', 'Take advanced courses',
    'Join debate team', 'Start a club', 'Volunteer regularly',
    'Learn programming', 'Study abroad', 'Get leadership role',
    'Win academic competition', 'Complete internship', 'Write research paper'
  ];

  const gradeOptions = [
    '9th Grade (Freshman)', '10th Grade (Sophomore)', 
    '11th Grade (Junior)', '12th Grade (Senior)'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    saveUserData({
      name: formData.name,
      email: formData.email,
      grade: formData.grade,
      interests: formData.interests,
      goals: formData.goals,
      targetUniversities: formData.targetUniversities,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });
    onComplete();
  };

  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const steps = [
    {
      title: 'Welcome to Waypoint',
      icon: GraduationCap,
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto">
            <GraduationCap size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">Plan Your Academic Journey</h2>
            <p className="text-slate-300 max-w-md mx-auto">
              Waypoint helps you visualize and organize your path to college and beyond. 
              Let's start by getting to know you better.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Personal Information',
      icon: User,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Academic Level',
      icon: MapPin,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-4">
              What grade are you currently in?
            </label>
            <div className="grid grid-cols-1 gap-3">
              {gradeOptions.map(grade => (
                <button
                  key={grade}
                  onClick={() => setFormData({ ...formData, grade })}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.grade === grade
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Interests & Passions',
      icon: Heart,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-4">
              What subjects or fields interest you? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {interests.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleArrayItem(
                    formData.interests, 
                    interest, 
                    (items) => setFormData({ ...formData, interests: items })
                  )}
                  className={`p-3 rounded-lg border text-left transition-all text-sm ${
                    formData.interests.includes(interest)
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Academic Goals',
      icon: Target,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-4">
              What are your main academic goals? (Select all that apply)
            </label>
            <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
              {commonGoals.map(goal => (
                <button
                  key={goal}
                  onClick={() => toggleArrayItem(
                    formData.goals, 
                    goal, 
                    (items) => setFormData({ ...formData, goals: items })
                  )}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    formData.goals.includes(goal)
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Target Universities',
      icon: Building,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-4">
              Which universities are you interested in?
            </label>
            <input
              type="text"
              value={universitySearch}
              onChange={(e) => setUniversitySearch(e.target.value)}
              placeholder="Search universities..."
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
            />
            
            {isLoadingUniversities ? (
              <div className="text-center text-slate-400 py-8">Loading universities...</div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2">
                {filteredUniversities.slice(0, 50).map(university => (
                  <button
                    key={university.name}
                    onClick={() => toggleArrayItem(
                      formData.targetUniversities, 
                      university.name, 
                      (items) => setFormData({ ...formData, targetUniversities: items })
                    )}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      formData.targetUniversities.includes(university.name)
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-medium">{university.name}</div>
                    {university['state-province'] && (
                      <div className="text-sm opacity-75">{university['state-province']}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return formData.name && formData.email;
      case 2: return formData.grade;
      case 3: return formData.interests.length > 0;
      case 4: return formData.goals.length > 0;
      case 5: return formData.targetUniversities.length > 0;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-slate-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <currentStepData.icon size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{currentStepData.title}</h1>
          </div>

          {/* Content */}
          <div className="mb-8">
            {currentStepData.content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>

            {isLastStep ? (
              <Button
                onClick={handleFinish}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
              >
                Complete Setup
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
