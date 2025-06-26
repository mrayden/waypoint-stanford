
import React from 'react';
import WaypointPlanner from '../components/WaypointPlanner';
import OnboardingFlow from '../components/OnboardingFlow';
import { useOnboarding } from '../hooks/useOnboarding';

const Index = () => {
  const { isOnboardingComplete, completeOnboarding } = useOnboarding();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <WaypointPlanner />
      
      {!isOnboardingComplete && (
        <OnboardingFlow onComplete={completeOnboarding} />
      )}
    </div>
  );
};

export default Index;
