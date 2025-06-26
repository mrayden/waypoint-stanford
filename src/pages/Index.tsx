
import React from 'react';
import WaypointPlanner from '../components/WaypointPlanner';
import OnboardingFlow from '../components/OnboardingFlow';
import { useOnboarding } from '../hooks/useOnboarding';

const Index = () => {
  const { isOnboardingComplete, completeOnboarding } = useOnboarding();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Main app content */}
      <WaypointPlanner />
      
      {/* Onboarding overlay */}
      {!isOnboardingComplete && (
        <OnboardingFlow onComplete={completeOnboarding} />
      )}
    </div>
  );
};

export default Index;
