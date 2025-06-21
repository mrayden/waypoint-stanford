
import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'waypoint-onboarding-completed';

export const useOnboarding = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(() => {
    const stored = localStorage.getItem(ONBOARDING_KEY);
    return stored === 'true';
  });

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOnboardingComplete(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    setIsOnboardingComplete(false);
  };

  return {
    isOnboardingComplete,
    completeOnboarding,
    resetOnboarding
  };
};
