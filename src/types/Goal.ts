
export interface Goal {
  id: string;
  type: 'course' | 'summer' | 'extracurricular' | 'career' | 'sports';
  title: string;
  category: string;
  semester: string;
  description?: string;
  source?: string;
  dependencies?: string[];
  status: 'planned' | 'in-progress' | 'completed';
  color?: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Semester {
  id: string;
  name: string;
  year: number;
  season: 'Fall' | 'Spring' | 'Summer';
}
