
export interface UserData {
  name: string;
  email: string;
  grade: string;
  location?: string;
  currentSchool?: string;
  schoolType?: string;
  gpa?: string;
  weightedGpa?: string;
  apCourses?: string[];
  ibCourses?: string[];
  regularCourses?: string[];
  collegePrepCourses?: string[];
  plannedCourses?: string[];
  financialSituation?: string;
  interests: string[];
  goals: string[];
  targetUniversities: string[];
  targetDegrees?: string[];
  extracurriculars?: string[];
  summerPlans?: string[];
  createdAt: string;
  lastUpdated: string;
}

export const getUserData = (): UserData | null => {
  try {
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(cookie => cookie.trim().startsWith('waypoint_user='));
    
    if (!userCookie) return null;
    
    const userData = userCookie.split('=')[1];
    return JSON.parse(decodeURIComponent(userData));
  } catch (error) {
    console.error('Error reading user data from cookies:', error);
    return null;
  }
};

export const saveUserData = (userData: UserData): void => {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `waypoint_user=${encodeURIComponent(JSON.stringify(userData))}; expires=${expires.toUTCString()}; path=/`;
};

export const updateUserData = (updates: Partial<UserData>): void => {
  const currentData = getUserData();
  if (!currentData) return;
  
  const updatedData = {
    ...currentData,
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `waypoint_user=${encodeURIComponent(JSON.stringify(updatedData))}; expires=${expires.toUTCString()}; path=/`;
};

export const clearUserData = (): void => {
  document.cookie = 'waypoint_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};
