import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, GraduationCap, User, MapPin, Heart, Target, Building, DollarSign, TrendingUp, School, BookOpen, Calendar, SkipForward, X } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { saveUserData } from '../utils/cookieUtils';
import WaypointPlanner from './WaypointPlanner';

interface University {
  name: string;
  country: string;
  domains: string[];
  web_pages: string[];
  'state-province'?: string;
  alpha_two_code: string;
}

interface Degree {
  degree_title: string;
  degree_reference: string;
  degree_level: string;
}

interface HighSchool {
  name: string;
  location: {
    state: {
      name: string;
      abbr: string;
    };
  };
  district: string;
  level: string;
  type: string;
  charterSchool: string;
  magnetSchool: string;
  locale: string;
  grades: {
    lowest: string;
    highest: string;
  };
  students: string;
  fte: string;
  pupilTeacherRatio: string;
}

const OnboardingFlow = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    location: '',
    selectedState: '',
    currentSchool: '',
    schoolType: '',
    gpa: '',
    weightedGpa: '',
    apCourses: [] as string[],
    ibCourses: [] as string[],
    regularCourses: [] as string[],
    collegePrepCourses: [] as string[],
    plannedCourses: [] as string[],
    financialSituation: '',
    interests: [] as string[],
    goals: [] as string[],
    targetUniversities: [] as string[],
    targetDegrees: [] as string[],
    extracurriculars: [] as string[],
    summerPlans: [] as string[],
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
  const [loadUniversities, setLoadUniversities] = useState(false);
  const [loadHighSchools, setLoadHighSchools] = useState(false);

  const stateAbbreviations = [
    { abbr: 'AK', name: 'Alaska' },
    { abbr: 'AL', name: 'Alabama' },
    { abbr: 'AR', name: 'Arkansas' },
    { abbr: 'AZ', name: 'Arizona' },
    { abbr: 'CA', name: 'California' },
    { abbr: 'CO', name: 'Colorado' },
    { abbr: 'CT', name: 'Connecticut' },
    { abbr: 'DC', name: 'District of Columbia' },
    { abbr: 'DE', name: 'Delaware' },
    { abbr: 'FL', name: 'Florida' },
    { abbr: 'GA', name: 'Georgia' },
    { abbr: 'HI', name: 'Hawaii' },
    { abbr: 'IA', name: 'Iowa' },
    { abbr: 'ID', name: 'Idaho' },
    { abbr: 'IL', name: 'Illinois' },
    { abbr: 'IN', name: 'Indiana' },
    { abbr: 'KS', name: 'Kansas' },
    { abbr: 'KY', name: 'Kentucky' },
    { abbr: 'LA', name: 'Louisiana' },
    { abbr: 'MA', name: 'Massachusetts' },
    { abbr: 'MD', name: 'Maryland' },
    { abbr: 'ME', name: 'Maine' },
    { abbr: 'MI', name: 'Michigan' },
    { abbr: 'MN', name: 'Minnesota' },
    { abbr: 'MO', name: 'Missouri' },
    { abbr: 'MS', name: 'Mississippi' },
    { abbr: 'MT', name: 'Montana' },
    { abbr: 'NC', name: 'North Carolina' },
    { abbr: 'ND', name: 'North Dakota' },
    { abbr: 'NE', name: 'Nebraska' },
    { abbr: 'NH', name: 'New Hampshire' },
    { abbr: 'NJ', name: 'New Jersey' },
    { abbr: 'NM', name: 'New Mexico' },
    { abbr: 'NV', name: 'Nevada' },
    { abbr: 'NY', name: 'New York' },
    { abbr: 'OH', name: 'Ohio' },
    { abbr: 'OK', name: 'Oklahoma' },
    { abbr: 'OR', name: 'Oregon' },
    { abbr: 'PA', name: 'Pennsylvania' },
    { abbr: 'RI', name: 'Rhode Island' },
    { abbr: 'SC', name: 'South Carolina' },
    { abbr: 'SD', name: 'South Dakota' },
    { abbr: 'TN', name: 'Tennessee' },
    { abbr: 'TX', name: 'Texas' },
    { abbr: 'UT', name: 'Utah' },
    { abbr: 'VA', name: 'Virginia' },
    { abbr: 'VT', name: 'Vermont' },
    { abbr: 'WA', name: 'Washington' },
    { abbr: 'WI', name: 'Wisconsin' },
    { abbr: 'WV', name: 'West Virginia' },
    { abbr: 'WY', name: 'Wyoming' }
  ];

  useEffect(() => {
    fetchDegrees();
  }, []);

  const fetchUniversities = async () => {
    setIsLoadingUniversities(true);
    try {
      const response = await fetch('https://raw.githubusercontent.com/Hipo/university-domains-list/refs/heads/master/world_universities_and_domains.json');
      if (!response.ok) throw new Error('Failed to fetch universities');
      const data = await response.json();
      
      const usUniversities = data.filter((uni: University) => uni.alpha_two_code === 'US');
      usUniversities.sort((a: University, b: University) => a.name.localeCompare(b.name));
      
      setUniversities(usUniversities);
      console.log(`Loaded ${usUniversities.length} US universities`);
    } catch (error) {
      console.log('University API failed:', error);
      setUniversities([
        { name: 'Harvard University', country: 'United States', domains: ['harvard.edu'], web_pages: ['https://www.harvard.edu/'], alpha_two_code: 'US' },
        { name: 'Stanford University', country: 'United States', domains: ['stanford.edu'], web_pages: ['https://www.stanford.edu/'], alpha_two_code: 'US' },
        { name: 'Massachusetts Institute of Technology', country: 'United States', domains: ['mit.edu'], web_pages: ['https://www.mit.edu/'], alpha_two_code: 'US' },
        { name: 'University of California, Berkeley', country: 'United States', domains: ['berkeley.edu'], web_pages: ['https://www.berkeley.edu/'], alpha_two_code: 'US' },
        { name: 'Princeton University', country: 'United States', domains: ['princeton.edu'], web_pages: ['https://www.princeton.edu/'], alpha_two_code: 'US' },
      ]);
    } finally {
      setIsLoadingUniversities(false);
    }
  };

  const fetchDegrees = async () => {
    setIsLoadingDegrees(true);
    try {
      const response = await fetch('https://gist.githubusercontent.com/cblanquera/21c925d1312e9a4de3c269be3adecf64382edd5f7291ef2065/certs.json');
      if (!response.ok) throw new Error('Failed to fetch degrees');
      const data = await response.json();
      
      const sortedDegrees = data.sort((a: Degree, b: Degree) => a.degree_title.localeCompare(b.degree_title));
      setDegrees(sortedDegrees);
      console.log(`Loaded ${sortedDegrees.length} degrees`);
    } catch (error) {
      console.log('Degrees API failed:', error);
      setDegrees([]);
    } finally {
      setIsLoadingDegrees(false);
    }
  };

  const fetchHighSchools = async (stateAbbr: string) => {
    if (isLoadingSchools) return;
    
    setIsLoadingSchools(true);
    setHighSchools([]);
    
    try {
      const response = await fetch(`https://raw.githubusercontent.com/nicelion/schools-and-districts/refs/heads/master/schools/${stateAbbr}.json`);
      if (!response.ok) throw new Error(`Failed to fetch schools for ${stateAbbr}`);
      const data = await response.json();
      
      const highSchoolsOnly = data.filter((school: HighSchool) => 
        school.level && (
          school.level.toLowerCase().includes('high') || 
          school.level.toLowerCase().includes('secondary') ||
          school.grades?.highest?.includes('12')
        )
      );
      
      highSchoolsOnly.sort((a: HighSchool, b: HighSchool) => a.name.localeCompare(b.name));
      
      setHighSchools(highSchoolsOnly);
      console.log(`Loaded ${highSchoolsOnly.length} high schools for ${stateAbbr}`);
    } catch (error) {
      console.log(`High schools API failed for ${stateAbbr}:`, error);
      setHighSchools([]);
    } finally {
      setIsLoadingSchools(false);
    }
  };

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(universitySearch.toLowerCase())
  );

  const filteredDegrees = degrees.filter(degree =>
    degree.degree_title.toLowerCase().includes(degreeSearch.toLowerCase())
  );

  const filteredHighSchools = highSchools.filter(school =>
    school.name.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const apCourses = [
    'AP Biology', 'AP Chemistry', 'AP Physics 1', 'AP Physics 2', 'AP Physics C',
    'AP Calculus AB', 'AP Calculus BC', 'AP Statistics', 'AP Computer Science A',
    'AP Computer Science Principles', 'AP English Language', 'AP English Literature',
    'AP World History', 'AP US History', 'AP European History', 'AP Government',
    'AP Economics (Macro)', 'AP Economics (Micro)', 'AP Psychology', 'AP Art History',
    'AP Studio Art', 'AP Music Theory', 'AP Spanish', 'AP French', 'AP German',
    'AP Chinese', 'AP Latin', 'AP Environmental Science', 'AP Human Geography'
  ];

  const ibCourses = [
    'IB Mathematics HL', 'IB Mathematics SL', 'IB Physics HL', 'IB Physics SL',
    'IB Chemistry HL', 'IB Chemistry SL', 'IB Biology HL', 'IB Biology SL',
    'IB English A HL', 'IB English A SL', 'IB History HL', 'IB History SL',
    'IB Economics HL', 'IB Economics SL', 'IB Psychology HL', 'IB Psychology SL',
    'IB Computer Science HL', 'IB Computer Science SL', 'IB Visual Arts HL',
    'IB Visual Arts SL', 'IB Music HL', 'IB Music SL', 'IB Spanish HL',
    'IB Spanish SL', 'IB French HL', 'IB French SL', 'IB Geography HL',
    'IB Geography SL', 'IB Business Management HL', 'IB Business Management SL'
  ];

  const regularCourses = [
    'English 9/10/11/12', 'Algebra I', 'Algebra II', 'Geometry', 'Pre-Calculus',
    'Biology', 'Chemistry', 'Physics', 'Earth Science', 'World History',
    'US History', 'Government', 'Economics', 'Spanish I/II/III/IV',
    'French I/II/III/IV', 'Art I/II/III/IV', 'Music Theory', 'Band/Orchestra',
    'Physical Education', 'Health', 'Computer Applications', 'Creative Writing'
  ];

  const collegePrepCourses = [
    'Honors English', 'Honors Algebra II', 'Honors Geometry', 'Honors Pre-Calculus',
    'Honors Biology', 'Honors Chemistry', 'Honors Physics', 'Honors World History',
    'Honors US History', 'Honors Spanish', 'Honors French', 'Advanced Art',
    'Advanced Music', 'Dual Enrollment English', 'Dual Enrollment Math',
    'Dual Enrollment Science', 'Dual Enrollment History'
  ];

  const extracurricularOptions = [
    'Student Government', 'Debate Team', 'Model UN', 'National Honor Society',
    'Key Club', 'Drama/Theater', 'Band/Orchestra', 'Choir', 'Art Club',
    'Science Olympiad', 'Math Team', 'Robotics Club', 'Computer Science Club',
    'Environmental Club', 'Volunteer Work', 'Community Service', 'Sports Teams',
    'Academic Decathlon', 'Mock Trial', 'Yearbook/Newspaper', 'Language Clubs',
    'Cultural Clubs', 'Religious Organizations', 'Part-time Job', 'Internships'
  ];

  const summerOpportunities = [
    'Research Internships', 'Hospital Volunteering', 'Summer Job', 'Academic Camps',
    'Leadership Programs', 'Community College Courses', 'Online Courses (Coursera, etc)',
    'Coding Bootcamps', 'Art/Music Workshops', 'Sports Camps', 'Language Immersion',
    'Mission Trips/Service Learning', 'Starting a Business', 'Creating Content/Blog',
    'Teaching/Tutoring Others', 'Environmental Conservation', 'Political Campaigns',
    'Local Government Internships', 'Museum/Library Work', 'Tech Company Programs'
  ];

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
      location: formData.location,
      selectedState: formData.selectedState,
      currentSchool: formData.currentSchool,
      schoolType: formData.schoolType,
      gpa: formData.gpa,
      weightedGpa: formData.weightedGpa,
      apCourses: formData.apCourses,
      ibCourses: formData.ibCourses,
      regularCourses: formData.regularCourses,
      collegePrepCourses: formData.collegePrepCourses,
      plannedCourses: formData.plannedCourses,
      financialSituation: formData.financialSituation,
      interests: formData.interests,
      goals: formData.goals,
      targetUniversities: formData.targetUniversities,
      targetDegrees: formData.targetDegrees,
      extracurriculars: formData.extracurriculars,
      summerPlans: formData.summerPlans,
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
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <GraduationCap size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Plan Your Academic Journey</h2>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Academic Information',
      icon: School,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Grade Level
            </label>
            <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9th">9th Grade (Freshman)</SelectItem>
                <SelectItem value="10th">10th Grade (Sophomore)</SelectItem>
                <SelectItem value="11th">11th Grade (Junior)</SelectItem>
                <SelectItem value="12th">12th Grade (Senior)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current GPA (approximate)
            </label>
            <Select value={formData.gpa} onValueChange={(value) => setFormData({ ...formData, gpa: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select GPA range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4.0+">4.0+</SelectItem>
                <SelectItem value="3.5-3.9">3.5-3.9</SelectItem>
                <SelectItem value="3.0-3.4">3.0-3.4</SelectItem>
                <SelectItem value="2.5-2.9">2.5-2.9</SelectItem>
                <SelectItem value="2.0-2.4">2.0-2.4</SelectItem>
                <SelectItem value="Below 2.0">Below 2.0</SelectItem>
                <SelectItem value="Not sure">Not sure</SelectItem>
              </SelectContent>
            </Select>
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
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Are you currently located in the United States?
            </label>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setFormData({ ...formData, location: 'US' })}
                className={`p-4 rounded-lg border text-left transition-all ${
                  formData.location === 'US'
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">Yes, I'm in the United States</div>
                <div className="text-sm opacity-75">Access to all US universities and programs</div>
              </button>
              <button
                onClick={() => setFormData({ ...formData, location: 'International' })}
                className={`p-4 rounded-lg border text-left transition-all ${
                  formData.location === 'International'
                    ? 'bg-orange-50 border-orange-200 text-orange-900'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">No, I'm located outside the US</div>
                <div className="text-sm opacity-75">Limited features - US-focused planning only</div>
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Interests & Goals',
      icon: Target,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              What are your main academic interests? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {['Computer Science', 'Engineering', 'Medicine', 'Business', 'Arts & Design', 'Mathematics', 'Sciences', 'Literature', 'History', 'Psychology'].map(interest => (
                <button
                  key={interest}
                  onClick={() => {
                    const newInterests = formData.interests.includes(interest)
                      ? formData.interests.filter(i => i !== interest)
                      : [...formData.interests, interest];
                    setFormData({ ...formData, interests: newInterests });
                  }}
                  className={`p-2 text-sm rounded-lg border transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const canClose = currentStep >= 4; // Can close after first 5 slides

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return formData.name && formData.email;
      case 2: return formData.grade && formData.gpa;
      case 3: return formData.location;
      case 4: return formData.interests.length > 0;
      default: return true;
    }
  };

  const handleSkipRest = () => {
    // Save current data and complete onboarding
    saveUserData({
      name: formData.name,
      email: formData.email,
      grade: formData.grade,
      location: formData.location,
      selectedState: formData.selectedState,
      currentSchool: formData.currentSchool,
      schoolType: formData.schoolType,
      gpa: formData.gpa,
      weightedGpa: formData.weightedGpa,
      apCourses: formData.apCourses,
      ibCourses: formData.ibCourses,
      regularCourses: formData.regularCourses,
      collegePrepCourses: formData.collegePrepCourses,
      plannedCourses: formData.plannedCourses,
      financialSituation: formData.financialSituation,
      interests: formData.interests,
      goals: formData.goals,
      targetUniversities: formData.targetUniversities,
      targetDegrees: formData.targetDegrees,
      extracurriculars: formData.extracurriculars,
      summerPlans: formData.summerPlans,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });
    onComplete();
  };

  if (!showOnboarding) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Blurred Dashboard Background */}
      <div className="absolute inset-0">
        <div className="blur-md scale-105">
          <WaypointPlanner />
        </div>
        {/* Grainy gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white/85 via-gray-50/75 to-blue-50/70"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Onboarding Modal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg">
          {/* Main Card */}
          <div className="bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
            {/* Close Button (after first 5 slides) */}
            {canClose && (
              <button
                onClick={() => setShowOnboarding(false)}
                className="absolute top-4 right-4 z-20 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-gray-600" />
              </button>
            )}

            {/* Progress Bar */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-gray-500 font-medium">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {Math.round(((currentStep + 1) / steps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <currentStepData.icon size={20} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">{currentStepData.title}</h1>
              </div>

              {/* Step Content */}
              <div className="mb-8">
                {currentStepData.content}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 0}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft size={14} />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {/* Skip button appears after step 4 (index 4) */}
                  {currentStep >= 4 && !isLastStep && (
                    <Button
                      onClick={handleSkipRest}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <SkipForward size={14} />
                      Skip & Start
                    </Button>
                  )}
                  
                  {isLastStep ? (
                    <Button
                      onClick={handleFinish}
                      disabled={!canProceed()}
                      size="sm"
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                    >
                      Complete Setup
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={!canProceed()}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight size={14} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
