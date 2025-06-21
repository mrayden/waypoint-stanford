
import React, { useState } from 'react';
import { X, ChevronRight, Calendar, Target, Users, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';

interface WelcomeGuideProps {
  onClose: () => void;
}

const WelcomeGuide = ({ onClose }: WelcomeGuideProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Target,
      title: 'Welcome to Your Planning Dashboard',
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            This is where you'll organize your academic journey from now until graduation. 
            Each semester represents a time period where you can plan courses, activities, and goals.
          </p>
          <div className="bg-indigo-900/20 border border-indigo-600/30 rounded-lg p-4">
            <p className="text-indigo-200 text-sm">
              Use drag and drop to move goals between semesters and categories to visualize your timeline.
            </p>
          </div>
        </div>
      )
    },
    {
      icon: Calendar,
      title: 'Summer Plans Are Critical',
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            Summer opportunities often matter more than test scores for college admissions. 
            They show initiative, passion, and real-world impact that sets you apart.
          </p>
          <div className="space-y-3">
            <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-3">
              <h4 className="text-purple-200 font-medium mb-2">High-Impact Summer Activities:</h4>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Research internships at local universities</li>
                <li>• Starting a community project or business</li>
                <li>• Competitive summer programs</li>
                <li>• Teaching or mentoring others</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Users,
      title: 'Local vs. Marketplace Opportunities',
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            We've organized opportunities into two main categories to help you find the right fit:
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
              <h4 className="text-green-200 font-medium mb-2">Local Opportunities</h4>
              <p className="text-green-200 text-sm">
                Programs, internships, and activities in your area. These often have less competition 
                and can lead to meaningful local connections.
              </p>
            </div>
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
              <h4 className="text-blue-200 font-medium mb-2">Marketplace</h4>
              <p className="text-blue-200 text-sm">
                National programs, online opportunities, and competitive positions. 
                These are more selective but can have greater recognition.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Lightbulb,
      title: 'Pro Tips for Success',
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            Here are some strategies to maximize your college admissions potential:
          </p>
          <div className="space-y-3">
            <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-3">
              <ul className="text-amber-200 text-sm space-y-2">
                <li>• Focus on depth over breadth - colleges prefer commitment to a few areas</li>
                <li>• Document your impact with numbers and stories</li>
                <li>• Build relationships with mentors who can write recommendations</li>
                <li>• Start planning early - the best opportunities require advance notice</li>
                <li>• Don't just participate - take leadership roles and create new initiatives</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose();
    }
  };

  const skipGuide = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
              <slides[currentSlide].icon size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{slides[currentSlide].title}</h2>
              <p className="text-sm text-slate-400">Step {currentSlide + 1} of {slides.length}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="mb-8">
          {slides[currentSlide].content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={skipGuide}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            Skip guide
          </button>
          
          <Button onClick={nextSlide} className="flex items-center gap-2">
            {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuide;
