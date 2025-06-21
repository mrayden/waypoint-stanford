
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Target, Calendar, Users, Briefcase } from 'lucide-react';
import { useGoalStore } from '../store/goalStore';

interface OnboardingFlowProps {
  onComplete: () => void;
}

interface University {
  name: string;
  country: string;
  'state-province': string;
  web_pages: string[];
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    grade: '',
    interests: [] as string[],
    goals: [] as string[],
    targetUniversities: [] as string[]
  });
  
  const { addGoal } = useGoalStore();

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Waypoint',
      subtitle: 'Your Visual Future Planner',
      content: 'WelcomeStep'
    },
    {
      id: 'account',
      title: 'Create Your Account',
      subtitle: 'Let\'s get you set up',
      content: 'AccountStep'
    },
    {
      id: 'profile',
      title: 'Tell Us About Yourself',
      subtitle: 'Help us personalize your experience',
      content: 'ProfileStep'
    },
    {
      id: 'universities',
      title: 'Target Universities',
      subtitle: 'Which schools interest you?',
      content: 'UniversitiesStep'
    },
    {
      id: 'interests',
      title: 'What Interests You?',
      subtitle: 'Select areas you want to explore',
      content: 'InterestsStep'
    },
    {
      id: 'first-goals',
      title: 'Set Your First Goals',
      subtitle: 'Let\'s add some goals to get started',
      content: 'FirstGoalsStep'
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      subtitle: 'Ready to start planning your future',
      content: 'CompleteStep'
    }
  ];

  const searchUniversities = async (query: string) => {
    if (query.length < 2) {
      setUniversities([]);
      return;
    }
    
    setLoadingUniversities(true);
    try {
      const response = await fetch(`https://universities.hipolabs.com/search?country=United+States&name=${encodeURIComponent(query)}`);
      const data = await response.json();
      setUniversities(data.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error('Error fetching universities:', error);
      setUniversities([]);
    } finally {
      setLoadingUniversities(false);
    }
  };

  const saveUserData = () => {
    const userData = {
      ...userProfile,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    // Save to cookies (expires in 1 year)
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `waypoint_user=${encodeURIComponent(JSON.stringify(userData))}; expires=${expires.toUTCString()}; path=/`;
    
    console.log('User data saved:', userData);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      saveUserData();
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addInterest = (interest: string) => {
    setUserProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const addUniversity = (university: string) => {
    setUserProfile(prev => ({
      ...prev,
      targetUniversities: prev.targetUniversities.includes(university)
        ? prev.targetUniversities.filter(u => u !== university)
        : [...prev.targetUniversities, university]
    }));
  };

  const addFirstGoal = (goal: { title: string; type: string; category: string; icon: string }) => {
    setUserProfile(prev => ({
      ...prev,
      goals: [...prev.goals, goal.title]
    }));
    
    addGoal({
      title: goal.title,
      type: goal.type as any,
      category: goal.category,
      semester: 'fall-2025',
      description: '',
      status: 'planned',
      dependencies: [],
      icon: goal.icon
    });
  };

  const renderStepContent = () => {
    switch (steps[currentStep].content) {
      case 'WelcomeStep':
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-3xl">
              W
            </div>
            <div className="space-y-4">
              <p className="text-xl text-slate-300 leading-relaxed">
                Waypoint helps students like you plan your academic journey, summer programs, 
                extracurriculars, and career goals in one beautiful visual timeline.
              </p>
              <p className="text-lg text-slate-400">
                Think of it as your personal roadmap to success — structured, clear, and actionable.
              </p>
            </div>
          </div>
        );

      case 'AccountStep':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-slate-300 font-medium mb-2">What grade are you in? *</label>
                <select
                  value={userProfile.grade}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, grade: e.target.value }))}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select your grade</option>
                  <option value="6th">6th Grade</option>
                  <option value="7th">7th Grade</option>
                  <option value="8th">8th Grade</option>
                  <option value="9th">9th Grade (Freshman)</option>
                  <option value="10th">10th Grade (Sophomore)</option>
                  <option value="11th">11th Grade (Junior)</option>
                  <option value="12th">12th Grade (Senior)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'ProfileStep':
        return (
          <div className="space-y-6">
            <p className="text-slate-300">
              Great! Now let's learn a bit more about your academic interests.
            </p>
            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
              <h4 className="text-white font-medium mb-2">Your Profile:</h4>
              <div className="space-y-1 text-sm text-slate-300">
                <div>Name: {userProfile.name}</div>
                <div>Grade: {userProfile.grade}</div>
                <div>Email: {userProfile.email}</div>
              </div>
            </div>
          </div>
        );

      case 'UniversitiesStep':
        return (
          <div className="space-y-6">
            <p className="text-slate-300">
              Search for universities you're interested in. This helps us suggest relevant courses and programs.
            </p>
            
            <div>
              <label className="block text-slate-300 font-medium mb-2">Search Universities</label>
              <input
                type="text"
                onChange={(e) => searchUniversities(e.target.value)}
                placeholder="Type university name (e.g., Stanford, Harvard, MIT)"
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {loadingUniversities && (
              <div className="text-center text-slate-400">Searching universities...</div>
            )}

            {universities.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <h4 className="text-white font-medium">Search Results:</h4>
                {universities.map((uni, index) => (
                  <button
                    key={index}
                    onClick={() => addUniversity(uni.name)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      userProfile.targetUniversities.includes(uni.name)
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-medium">{uni.name}</div>
                    <div className="text-sm text-slate-400">{uni['state-province']}</div>
                  </button>
                ))}
              </div>
            )}

            {userProfile.targetUniversities.length > 0 && (
              <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                <h4 className="text-white font-medium mb-2">Selected Universities:</h4>
                <div className="space-y-1">
                  {userProfile.targetUniversities.map(uni => (
                    <div key={uni} className="text-sm text-slate-300 flex items-center justify-between">
                      <span>• {uni}</span>
                      <button
                        onClick={() => addUniversity(uni)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'InterestsStep':
        const interests = [
          'Science & Research', 'Computer Science', 'Arts & Design', 
          'Business & Finance', 'Law & Government', 'Medicine & Health',
          'Environment & Sustainability', 'Engineering', 'Literature & Writing',
          'International Relations', 'Theater & Performance', 'Media & Film'
        ];
        
        return (
          <div className="space-y-6">
            <p className="text-slate-300">
              Select areas that interest you. This helps us suggest relevant goals and opportunities.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {interests.map(interest => (
                <button
                  key={interest}
                  onClick={() => addInterest(interest)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    userProfile.interests.includes(interest)
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-sm">{interest}</span>
                </button>
              ))}
            </div>
            <p className="text-slate-400 text-sm">
              Selected: {userProfile.interests.length} interests
            </p>
          </div>
        );

      case 'FirstGoalsStep':
        const suggestedGoals = [
          { title: 'AP Computer Science', type: 'course', category: 'school', icon: 'CS' },
          { title: 'Summer Research Program', type: 'summer', category: 'summer', icon: 'RS' },
          { title: 'Student Government', type: 'extracurricular', category: 'extracurricular', icon: 'SG' },
          { title: 'College Applications', type: 'career', category: 'career', icon: 'CA' },
          { title: 'Varsity Soccer', type: 'sports', category: 'sports', icon: 'VS' },
          { title: 'National Honor Society', type: 'extracurricular', category: 'extracurricular', icon: 'NHS' }
        ];
        
        return (
          <div className="space-y-6">
            <p className="text-slate-300">
              Choose a few goals to get started. You can always add more later!
            </p>
            <div className="grid grid-cols-1 gap-3">
              {suggestedGoals.map(goal => (
                <button
                  key={goal.title}
                  onClick={() => addFirstGoal(goal)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    userProfile.goals.includes(goal.title)
                      ? 'bg-green-600/20 border-green-500 text-white'
                      : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-600 rounded flex items-center justify-center text-xs font-medium text-white">
                      {goal.icon}
                    </div>
                    <div>
                      <div className="font-medium">{goal.title}</div>
                      <div className="text-sm text-slate-400 capitalize">{goal.type} • {goal.category}</div>
                    </div>
                    {userProfile.goals.includes(goal.title) && (
                      <CheckCircle className="ml-auto text-green-400" size={20} />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-slate-400 text-sm">
              Selected: {userProfile.goals.length} goals
            </p>
          </div>
        );

      case 'CompleteStep':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-white" />
            </div>
            <div className="space-y-4">
              <p className="text-xl text-slate-300">
                Great job, {userProfile.name}! Your Waypoint account is ready.
              </p>
              <p className="text-slate-400">
                You can now start planning your journey by dragging goals around the timeline, 
                adding new ones, and tracking your progress.
              </p>
              <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600 text-left">
                <h4 className="text-white font-medium mb-2">Your Profile Summary:</h4>
                <div className="space-y-1 text-sm text-slate-300">
                  <div>• Grade: {userProfile.grade}</div>
                  <div>• Interests: {userProfile.interests.length} selected</div>
                  <div>• Target Universities: {userProfile.targetUniversities.length} selected</div>
                  <div>• Starting Goals: {userProfile.goals.length} selected</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].content) {
      case 'AccountStep':
        return userProfile.name.trim() && userProfile.email.trim() && userProfile.grade;
      case 'InterestsStep':
        return userProfile.interests.length > 0;
      case 'FirstGoalsStep':
        return userProfile.goals.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-sm">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-slate-400 text-sm">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{steps[currentStep].title}</h1>
            <p className="text-slate-400 text-lg">{steps[currentStep].subtitle}</p>
          </div>

          {/* Step Content */}
          <div className="mb-8 min-h-[300px]">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              <ArrowLeft size={18} />
              Previous
            </button>

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-indigo-500'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:scale-100"
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
