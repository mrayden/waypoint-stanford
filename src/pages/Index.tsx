
import React from 'react';
import WaypointPlanner from '../components/WaypointPlanner';
import OnboardingFlow from '../components/OnboardingFlow';
import { useOnboarding } from '../hooks/useOnboarding';

const Index = () => {
  const { isOnboardingComplete, completeOnboarding } = useOnboarding();

  if (!isOnboardingComplete) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <WaypointPlanner />
    </div>
  );
};

export default Index;
