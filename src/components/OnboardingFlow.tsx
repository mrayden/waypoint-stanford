import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, GraduationCap, User, MapPin, Heart, Target, Building, DollarSign, TrendingUp, School, BookOpen, Calendar, SkipForward, X } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { saveUserData } from '../utils/cookieUtils';

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
  const [showOptionalSteps, setShowOptionalSteps] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    location: '',
    selectedState: '', // for high school search and user location
    currentSchool: '',
    schoolType: '', // public, private, or custom
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
    // Load degrees immediately when component mounts
    fetchDegrees();
  }, []);

  const fetchUniversities = async () => {
    setIsLoadingUniversities(true);
    try {
      const response = await fetch('https://raw.githubusercontent.com/Hipo/university-domains-list/refs/heads/master/world_universities_and_domains.json');
      if (!response.ok) throw new Error('Failed to fetch universities');
      const data = await response.json();
      
      // Filter for US universities and sort alphabetically
      const usUniversities = data.filter((uni: University) => uni.alpha_two_code === 'US');
      usUniversities.sort((a: University, b: University) => a.name.localeCompare(b.name));
      
      setUniversities(usUniversities);
      console.log(`Loaded ${usUniversities.length} US universities`);
    } catch (error) {
      console.log('University API failed:', error);
      // Fallback data
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
      const response = await fetch('https://gist.githubusercontent.com/cblanquera/21c925d1312e9a4de3c269be134f3a6c/raw/4e227bcf3ac9be3adecf64382edd5f7291ef2065/certs.json');
      if (!response.ok) throw new Error('Failed to fetch degrees');
      const data = await response.json();
      
      // Load all degrees and sort alphabetically
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
    setHighSchools([]); // Clear previous results
    
    try {
      const response = await fetch(`https://raw.githubusercontent.com/nicelion/schools-and-districts/refs/heads/master/schools/${stateAbbr}.json`);
      if (!response.ok) throw new Error(`Failed to fetch schools for ${stateAbbr}`);
      const data = await response.json();
      
      // Filter for high schools and sort alphabetically
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
      apCourses: formData.apCourses,
      ibCourses: formData.ibCourses,
      regularCourses: formData.regularCourses,
      collegePrepCourses: formData.collegePrepCourses,
      extracurriculars: formData.extracurriculars,
      summerPlans: formData.summerPlans,
      financialSituation: formData.financialSituation,
      interests: formData.interests,
      goals: formData.goals,
      targetUniversities: formData.targetUniversities,
      targetDegrees: formData.targetDegrees,
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
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <GraduationCap size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">College Stat Boost & Academic Map</h2>
            <p className="text-slate-700 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
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
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">
              Are you currently located in the United States?
            </label>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setFormData({ ...formData, location: 'US' })}
                className={`p-4 rounded-lg border text-left transition-all ${
                  formData.location === 'US'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'
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
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <div className="font-medium">No, I'm located outside the US</div>
                <div className="text-sm opacity-75">Limited features - US-focused planning only</div>
              </button>
            </div>
            {formData.location === 'International' && (
              <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-600/30 rounded-lg">
                <p className="text-orange-800 dark:text-orange-200 text-sm">
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
      title: 'State Selection',
      icon: MapPin,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">
              Which state are you located in?
            </label>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              This helps us find your local high schools and provide relevant information.
            </p>
            <Select
              value={formData.selectedState}
              onValueChange={(value) => {
                setFormData({ ...formData, selectedState: value, currentSchool: '' });
                setHighSchools([]);
                setLoadHighSchools(false);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose your state..." />
              </SelectTrigger>
              <SelectContent>
                {stateAbbreviations.map(state => (
                  <SelectItem key={state.abbr} value={state.abbr}>
                    {state.name} ({state.abbr})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">
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
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          {formData.location === 'US' && formData.selectedState && (
            <div>
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">
                What type of school do you attend?
              </label>
              <div className="grid grid-cols-1 gap-3 mb-4">
                <button
                  onClick={() => setFormData({ ...formData, schoolType: 'public', currentSchool: '' })}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.schoolType === 'public'
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="font-medium">Public School</div>
                  <div className="text-sm opacity-75">Search from {formData.selectedState} public schools database</div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, schoolType: 'private', currentSchool: '' })}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.schoolType === 'private'
                      ? 'bg-orange-600 border-orange-500 text-white'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'
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
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'
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
                      fetchHighSchools(formData.selectedState);
                    }}
                    className={`w-full p-3 rounded-lg border transition-all mb-4 ${
                      loadHighSchools 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'
                    }`}
                    disabled={isLoadingSchools}
                  >
                    {isLoadingSchools ? `Loading ${formData.selectedState} schools...` : 
                     loadHighSchools ? `${highSchools.length} schools loaded` : 
                     `Load High Schools for ${formData.selectedState}`}
                  </button>
                  
                  {loadHighSchools && (
                    <div>
                      <input
                        type="text"
                        value={schoolSearch}
                        onChange={(e) => setSchoolSearch(e.target.value)}
                        placeholder="Search your high school..."
                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
                      />
                      
                      {isLoadingSchools ? (
                        <div className="text-center text-slate-400 py-4">Loading schools...</div>
                      ) : (
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {filteredHighSchools.slice(0, 20).map((school, index) => (
                            <button
                              key={index}
                              onClick={() => setFormData({ ...formData, currentSchool: school.name })}
                              className={`w-full p-3 rounded-lg border text-left transition-all ${
                                formData.currentSchool === school.name
                                  ? 'bg-indigo-600 border-indigo-500 text-white'
                                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'
                              }`}
                            >
                              <div className="font-medium">{school.name}</div>
                              <div className="text-sm opacity-75">
                                {school.district} • {school.level} • {school.type}
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
                  <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
                    Enter your school name
                  </label>
                  <input
                    type="text"
                    value={formData.currentSchool}
                    onChange={(e) => setFormData({ ...formData, currentSchool: e.target.value })}
                    placeholder="Enter your school name..."
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Academic Performance & Courses',
      icon: TrendingUp,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">
              What is your current unweighted GPA range?
            </label>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {gpaRanges.map(gpa => (
                <button
                  key={gpa}
                  onClick={() => setFormData({ ...formData, gpa })}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    formData.gpa === gpa
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                >
                  {gpa}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">
              Course Types You're Taking or Planning
            </label>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Select courses based on their level. Advanced courses (AP/IB/Honors) can boost your weighted GPA.
            </p>
            
            <div className="space-y-6">
              {/* AP Courses */}
              <div>
                <h4 className="text-slate-900 dark:text-white font-medium mb-3">AP (Advanced Placement) Courses</h4>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {apCourses.map(course => (
                    <button
                      key={course}
                      onClick={() => toggleArrayItem(
                        formData.apCourses, 
                        course, 
                        (items) => setFormData({ ...formData, apCourses: items })
                      )}
                      className={`p-2 rounded-lg border text-left transition-all text-sm ${
                        formData.apCourses.includes(course)
                          ? 'bg-green-600 border-green-500 text-white'
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-green-400 dark:hover:border-green-500'
                      }`}
                    >
                      {course}
                    </button>
                  ))}
                </div>
              </div>

              {/* IB Courses */}
              <div>
                <h4 className="text-slate-900 dark:text-white font-medium mb-3">IB (International Baccalaureate) Courses</h4>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {ibCourses.map(course => (
                    <button
                      key={course}
                      onClick={() => toggleArrayItem(
                        formData.ibCourses, 
                        course, 
                        (items) => setFormData({ ...formData, ibCourses: items })
                      )}
                      className={`p-2 rounded-lg border text-left transition-all text-sm ${
                        formData.ibCourses.includes(course)
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500'
                      }`}
                    >
                      {course}
                    </button>
                  ))}
                </div>
              </div>

              {/* College Prep/Honors Courses */}
              <div>
                <h4 className="text-slate-900 dark:text-white font-medium mb-3">Honors/College Prep Courses</h4>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {collegePrepCourses.map(course => (
                    <button
                      key={course}
                      onClick={() => toggleArrayItem(
                        formData.collegePrepCourses, 
                        course, 
                        (items) => setFormData({ ...formData, collegePrepCourses: items })
                      )}
                      className={`p-2 rounded-lg border text-left transition-all text-sm ${
                        formData.collegePrepCourses.includes(course)
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-purple-400 dark:hover:border-purple-500'
                      }`}
                    >
                      {course}
                    </button>
                  ))}
                </div>
              </div>

              {/* Regular Courses */}
              <div>
                <h4 className="text-slate-900 dark:text-white font-medium mb-3">Regular/Standard Courses</h4>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {regularCourses.map(course => (
                    <button
                      key={course}
                      onClick={() => toggleArrayItem(
                        formData.regularCourses, 
                        course, 
                        (items) => setFormData({ ...formData, regularCourses: items })
                      )}
                      className={`p-2 rounded-lg border text-left transition-all text-sm ${
                        formData.regularCourses.includes(course)
                          ? 'bg-gray-600 border-gray-500 text-white'
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      {course}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-600/30 rounded-lg">
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              Tip: Advanced courses (AP/IB/Honors) typically add weight to your GPA. 
              Taking challenging courses shows colleges you're ready for rigorous academics!
            </p>
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
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">
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
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500'
                  }`}
                >
                  {situation}
                </button>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600/30 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
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
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">
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
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500'
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
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">
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
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500'
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
      title: 'Extracurricular Activities',
      icon: Calendar,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">
              Current Extracurricular Activities
            </label>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Select activities you're currently involved in or planning to join. These help you stand out!
            </p>
            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {extracurricularOptions.map(activity => (
                <button
                  key={activity}
                  onClick={() => toggleArrayItem(
                    formData.extracurriculars, 
                    activity, 
                    (items) => setFormData({ ...formData, extracurriculars: items })
                  )}
                  className={`p-3 rounded-lg border text-left transition-all text-sm ${
                    formData.extracurriculars.includes(activity)
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Summer & Local Opportunities',
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">
              Summer Plans & Local Opportunities
            </label>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Summer activities and local opportunities are CRUCIAL for standing out in college applications. 
              These experiences often matter more than test scores - they show initiative, passion, and real-world impact.
            </p>
            <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
              {summerOpportunities.map(opportunity => (
                <button
                  key={opportunity}
                  onClick={() => toggleArrayItem(
                    formData.summerPlans, 
                    opportunity, 
                    (items) => setFormData({ ...formData, summerPlans: items })
                  )}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    formData.summerPlans.includes(opportunity)
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-purple-400 dark:hover:border-purple-500'
                  }`}
                >
                  {opportunity}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-600/30 rounded-lg">
            <h4 className="text-purple-800 dark:text-purple-200 font-medium mb-2">Pro Tips for Standing Out:</h4>
            <ul className="text-purple-800 dark:text-purple-200 text-sm space-y-1">
              <li>• Research internships show intellectual curiosity</li>
              <li>• Starting something new demonstrates leadership</li>
              <li>• Community service shows commitment to others</li>
              <li>• Building skills (coding, languages) shows initiative</li>
              <li>• Local connections can lead to recommendation letters</li>
              <li>• Unique experiences create compelling essay topics</li>
            </ul>
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
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">
              Which universities are you interested in?
            </label>
            
            <button
              onClick={() => {
                setLoadUniversities(true);
                fetchUniversities();
              }}
              className={`w-full p-3 rounded-lg border transition-all mb-4 ${
                loadUniversities 
                  ? 'bg-indigo-600 border-indigo-500 text-white' 
                  : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500'
              }`}
              disabled={isLoadingUniversities}
            >
              {isLoadingUniversities ? 'Loading university database...' : 
               loadUniversities ? `${universities.length} universities loaded` : 
               'Load US Universities Database'}
            </button>
            
            {loadUniversities && (
              <div>
                <input
                  type="text"
                  value={universitySearch}
                  onChange={(e) => setUniversitySearch(e.target.value)}
                  placeholder="Search universities..."
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
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
                          university.name, 
                          (items) => setFormData({ ...formData, targetUniversities: items })
                        )}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          formData.targetUniversities.includes(university.name)
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500'
                        }`}
                      >
                        <div className="font-medium">{university.name}</div>
                        <div className="text-sm opacity-75">
                          {university['state-province'] || university.country}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
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
            <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">
              Are you interested in any specific degrees or certifications?
            </label>
            
            {isLoadingDegrees ? (
              <div className="text-center text-slate-400 py-8">Loading degrees database...</div>
            ) : (
              <div>
                <input
                  type="text"
                  value={degreeSearch}
                  onChange={(e) => setDegreeSearch(e.target.value)}
                  placeholder="Search degrees and certifications..."
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
                />
                
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
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500'
                      }`}
                    >
                      <div className="font-medium">{degree.degree_title}</div>
                      <div className="text-sm opacity-75">
                        {degree.degree_reference} • {degree.degree_level}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isRequiredStep = currentStep < 5; // First 5 steps are required
  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return formData.name && formData.email;
      case 2: return formData.location;
      case 3: return formData.location === 'International' || formData.selectedState;
      case 4: return formData.grade && (formData.location === 'International' || formData.schoolType);
      default: return true;
    }
  };

  const handleFinishRequired = () => {
    if (currentStep === 4) {
      // Show option to continue or finish after required steps
      setShowOptionalSteps(true);
    }
  };

  const handleSkipOptional = () => {
    saveUserData({
      name: formData.name,
      email: formData.email,
      grade: formData.grade,
      location: formData.location,
      selectedState: formData.selectedState,
      currentSchool: formData.currentSchool,
      schoolType: formData.schoolType,
      gpa: formData.gpa,
      apCourses: formData.apCourses,
      ibCourses: formData.ibCourses,
      regularCourses: formData.regularCourses,
      collegePrepCourses: formData.collegePrepCourses,
      extracurriculars: formData.extracurriculars,
      summerPlans: formData.summerPlans,
      financialSituation: formData.financialSituation,
      interests: formData.interests,
      goals: formData.goals,
      targetUniversities: formData.targetUniversities,
      targetDegrees: formData.targetDegrees,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    });
    onComplete();
  };

  const handleContinueOptional = () => {
    setShowOptionalSteps(false);
    setCurrentStep(5);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Close button - always visible */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm transition-colors"
        >
          <X size={20} />
        </button>

        {/* Progress Bar */}
        <div className="mb-6 px-2">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-white/90 font-medium">
              Step {currentStep + 1} of {steps.length}
              {isRequiredStep && <span className="text-red-400 ml-1">*</span>}
            </span>
            <span className="text-sm text-white/90 font-medium">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Card - Scrollable */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex-1 flex flex-col min-h-0">
          {/* Optional Steps Decision Modal */}
          {showOptionalSteps && (
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Target size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Great Progress!</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed mb-6">
                  You've completed the essential setup. Would you like to continue with optional steps to personalize your experience further?
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleSkipOptional}
                  variant="outline"
                  className="px-8 py-3 rounded-xl"
                >
                  Start Planning
                </Button>
                <Button
                  onClick={handleContinueOptional}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                >
                  Continue Setup
                </Button>
              </div>
            </div>
          )}

          {/* Regular Step Content */}
          {!showOptionalSteps && (
            <>
              {/* Header */}
              <div className="text-center p-8 pb-4 flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <currentStepData.icon size={28} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{currentStepData.title}</h1>
                {!isRequiredStep && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">This step is optional - you can skip it</p>
                )}
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-8 pb-4">
                <div className="space-y-6">
                  {currentStepData.content}
                </div>
              </div>

              {/* Navigation - Fixed at bottom */}
              <div className="flex justify-between items-center p-8 pt-4 border-t dark:border-gray-800 flex-shrink-0">
                <Button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  variant="outline"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl"
                >
                  <ChevronLeft size={16} />
                  Previous
                </Button>

                <div className="flex gap-3">
                  {!isRequiredStep && !isLastStep && (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      variant="ghost"
                      className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-6 py-3 rounded-xl"
                    >
                      <SkipForward size={16} />
                      Skip
                    </Button>
                  )}

                  {isLastStep ? (
                    <Button
                      onClick={handleSkipOptional}
                      disabled={!canProceed()}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg"
                    >
                      Complete Setup
                    </Button>
                  ) : currentStep === 4 ? (
                    <Button
                      onClick={handleFinishRequired}
                      disabled={!canProceed()}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={!canProceed()}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl"
                    >
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
