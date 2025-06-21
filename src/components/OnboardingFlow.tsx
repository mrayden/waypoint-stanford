import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, GraduationCap, User, MapPin, Heart, Target, Building, DollarSign, TrendingUp, School } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { saveUserData } from '../utils/cookieUtils';

interface University {
  institution: string;
  state?: string;
}

interface Degree {
  degree_title: string;
  degree_reference: string;
  degree_level: string;
}

interface HighSchool {
  'School Name': string;
  'State Name [Public School] Latest available year': string;
  'State Abbr [Public School] Latest available year': string;
  'School Type [Public School] 2019-20': string;
}

const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    location: '',
    currentSchool: '',
    schoolType: '', // public, private, or custom
    gpa: '',
    financialSituation: '',
    interests: [] as string[],
    goals: [] as string[],
    targetUniversities: [] as string[],
    targetDegrees: [] as string[],
  });

  const [universities, setUniversities] = useState<University[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [highSchools, setHighSchools] = useState<HighSchool[]>([]);
  const [universitySearch, setUniversitySearch] = useState('');
  const [degreeSearch, setDegreeSearch] = useState('');
  const [schoolSearch, setSchoolSearch] = useState('');
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const [isLoadingDegrees, setIsLoadingDegrees] = useState(false);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [loadHighSchools, setLoadHighSchools] = useState(false);

  useEffect(() => {
    fetchUniversities();
    fetchDegrees();
  }, []);

  const fetchUniversities = async () => {
    setIsLoadingUniversities(true);
    try {
      const response = await fetch('https://gist.githubusercontent.com/hakimelek/147f364c449104ba66da9a3baca9d0c0/raw/7e914fc578d3176f1f752f571f5b3761ea2b22fa/us_institutions.json');
      if (!response.ok) throw new Error('Failed to fetch universities');
      const data = await response.json();
      setUniversities(data.slice(0, 200)); // Limit for performance
    } catch (error) {
      console.log('University API failed:', error);
      // Fallback data
      setUniversities([
        { institution: 'Harvard University' },
        { institution: 'Stanford University' },
        { institution: 'Massachusetts Institute of Technology' },
        { institution: 'University of California, Berkeley' },
        { institution: 'Princeton University' },
      ]);
    } finally {
      setIsLoadingUniversities(false);
    }
  };

  const fetchDegrees = async () => {
    setIsLoadingDegrees(true);
    try {
      const response = await fetch('https://gist.githubusercontent.com/cblanquera/21c925d1312e9a4de3c269be134f3a6c/raw/4e227bcf3ac9be3adecf64382edd5f7291ef2065/certs.json');
      if (!response.ok) throw new Error('Failed to fetch degrees');
      const data = await response.json();
      setDegrees(data.slice(0, 100)); // Limit for performance
    } catch (error) {
      console.log('Degrees API failed:', error);
      setDegrees([]);
    } finally {
      setIsLoadingDegrees(false);
    }
  };

  const fetchHighSchools = async () => {
    if (isLoadingSchools || highSchools.length > 0) return;
    
    setIsLoadingSchools(true);
    try {
      const response = await fetch('https://raw.githubusercontent.com/nicelion/schools-and-districts/refs/heads/master/csv/schools.csv');
      if (!response.ok) throw new Error('Failed to fetch schools');
      const csvText = await response.text();
      
      // Parse CSV
      const lines = csvText.split('\n');
      const headers = lines[0].split(',');
      const schools = lines.slice(1, 1000).map(line => { // Limit to first 1000 for performance
        const values = line.split(',');
        const school: any = {};
        headers.forEach((header, index) => {
          school[header] = values[index];
        });
        return school as HighSchool;
      }).filter(school => school['School Name']);
      
      setHighSchools(schools);
    } catch (error) {
      console.log('High schools API failed:', error);
      setHighSchools([]);
    } finally {
      setIsLoadingSchools(false);
    }
  };

  const filteredUniversities = universities.filter(uni =>
    uni.institution.toLowerCase().includes(universitySearch.toLowerCase())
  );

  const filteredDegrees = degrees.filter(degree =>
    degree.degree_title.toLowerCase().includes(degreeSearch.toLowerCase())
  );

  const filteredHighSchools = highSchools.filter(school =>
    school['School Name'].toLowerCase().includes(schoolSearch.toLowerCase())
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

  const gpaRanges = [
    '4.0+', '3.5-3.9', '3.0-3.4', '2.5-2.9', '2.0-2.4', 'Below 2.0', 'Not sure'
  ];

  const financialSituations = [
    'No financial concerns', 'Moderate financial constraints', 
    'Significant financial constraints', 'Need full financial aid',
    'International student funding needed', 'Prefer not to say'
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
      title: 'Location & Eligibility',
      icon: MapPin,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-4">
              Are you currently located in the United States?
            </label>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setFormData({ ...formData, location: 'US' })}
                className={`p-4 rounded-lg border text-left transition-all ${
                  formData.location === 'US'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-medium">Yes, I'm in the United States</div>
                <div className="text-sm opacity-75">Access to all US universities and programs</div>
              </button>
              <button
                onClick={() => setFormData({ ...formData, location: 'International' })}
                className={`p-4 rounded-lg border text-left transition-all ${
                  formData.location === 'International'
                    ? 'bg-orange-600 border-orange-500 text-white'
                    : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-medium">No, I'm located outside the US</div>
                <div className="text-sm opacity-75">Limited features - US-focused planning only</div>
              </button>
            </div>
            {formData.location === 'International' && (
              <div className="mt-4 p-4 bg-orange-900/20 border border-orange-600/30 rounded-lg">
                <p className="text-orange-200 text-sm">
                  Note: Waypoint is currently optimized for US-based students. While you can still use the platform, 
                  some features like local high school data and specific financial aid information may not be applicable.
                </p>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Academic Level',
      icon: School,
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

          {formData.location === 'US' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-4">
                What type of school do you attend?
              </label>
              <div className="grid grid-cols-1 gap-3 mb-4">
                <button
                  onClick={() => setFormData({ ...formData, schoolType: 'public', currentSchool: '' })}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.schoolType === 'public'
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="font-medium">Public School</div>
                  <div className="text-sm opacity-75">Search from US public schools database</div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, schoolType: 'private', currentSchool: '' })}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.schoolType === 'private'
                      ? 'bg-orange-600 border-orange-500 text-white'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="font-medium">Private School</div>
                  <div className="text-sm opacity-75">Enter your school name manually</div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, schoolType: 'custom', currentSchool: '' })}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.schoolType === 'custom'
                      ? 'bg-green-600 border-green-500 text-white'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="font-medium">Can't find my school</div>
                  <div className="text-sm opacity-75">Enter your school name manually</div>
                </button>
              </div>

              {formData.schoolType === 'public' && (
                <div>
                  <button
                    onClick={() => {
                      setLoadHighSchools(true);
                      fetchHighSchools();
                    }}
                    className={`w-full p-3 rounded-lg border transition-all mb-4 ${
                      loadHighSchools 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {loadHighSchools ? 'Loading school database...' : 'Load US Public Schools Database'}
                  </button>
                  
                  {loadHighSchools && (
                    <div>
                      <input
                        type="text"
                        value={schoolSearch}
                        onChange={(e) => setSchoolSearch(e.target.value)}
                        placeholder="Search your public high school..."
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
                      />
                      
                      {isLoadingSchools ? (
                        <div className="text-center text-slate-400 py-4">Loading schools...</div>
                      ) : (
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {filteredHighSchools.slice(0, 20).map((school, index) => (
                            <button
                              key={index}
                              onClick={() => setFormData({ ...formData, currentSchool: school['School Name'] })}
                              className={`w-full p-3 rounded-lg border text-left transition-all ${
                                formData.currentSchool === school['School Name']
                                  ? 'bg-indigo-600 border-indigo-500 text-white'
                                  : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                              }`}
                            >
                              <div className="font-medium">{school['School Name']}</div>
                              <div className="text-sm opacity-75">
                                {school['State Name [Public School] Latest available year']} • {school['School Type [Public School] 2019-20']}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {(formData.schoolType === 'private' || formData.schoolType === 'custom') && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Enter your school name
                  </label>
                  <input
                    type="text"
                    value={formData.currentSchool}
                    onChange={(e) => setFormData({ ...formData, currentSchool: e.target.value })}
                    placeholder="Enter your school name..."
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Academic Performance',
      icon: TrendingUp,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-4">
              What is your current GPA range?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {gpaRanges.map(gpa => (
                <button
                  key={gpa}
                  onClick={() => setFormData({ ...formData, gpa })}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    formData.gpa === gpa
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {gpa}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Financial Situation',
      icon: DollarSign,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-4">
              How would you describe your financial situation for college?
            </label>
            <div className="space-y-3">
              {financialSituations.map(situation => (
                <button
                  key={situation}
                  onClick={() => setFormData({ ...formData, financialSituation: situation })}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    formData.financialSituation === situation
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {situation}
                </button>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
              <p className="text-blue-200 text-sm">
                This information helps us suggest appropriate universities, scholarships, and financial aid options.
              </p>
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
                {filteredUniversities.slice(0, 50).map((university, index) => (
                  <button
                    key={index}
                    onClick={() => toggleArrayItem(
                      formData.targetUniversities, 
                      university.institution, 
                      (items) => setFormData({ ...formData, targetUniversities: items })
                    )}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      formData.targetUniversities.includes(university.institution)
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-medium">{university.institution}</div>
                    {university.state && (
                      <div className="text-sm opacity-75">{university.state}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Degrees & Certifications',
      icon: GraduationCap,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-4">
              Are you interested in any specific degrees or certifications?
            </label>
            <input
              type="text"
              value={degreeSearch}
              onChange={(e) => setDegreeSearch(e.target.value)}
              placeholder="Search degrees and certifications..."
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
            />
            
            {isLoadingDegrees ? (
              <div className="text-center text-slate-400 py-8">Loading degrees...</div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2">
                {filteredDegrees.slice(0, 30).map((degree, index) => (
                  <button
                    key={index}
                    onClick={() => toggleArrayItem(
                      formData.targetDegrees, 
                      degree.degree_title, 
                      (items) => setFormData({ ...formData, targetDegrees: items })
                    )}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      formData.targetDegrees.includes(degree.degree_title)
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-medium">{degree.degree_title}</div>
                    <div className="text-sm opacity-75">
                      {degree.degree_reference} • {degree.degree_level}
                    </div>
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
      case 2: return formData.location;
      case 3: return formData.grade && (formData.location === 'International' || formData.schoolType);
      case 4: return formData.gpa;
      case 5: return formData.financialSituation;
      case 6: return formData.interests.length > 0;
      case 7: return formData.goals.length > 0;
      case 8: return formData.targetUniversities.length > 0;
      case 9: return true; // Degrees are optional
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
