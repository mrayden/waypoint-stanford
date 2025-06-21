
import { create } from 'zustand';
import { Goal, Category, Semester } from '../types/Goal';

interface GoalStore {
  goals: Goal[];
  categories: Category[];
  semesters: Semester[];
  filters: {
    category: string;
    semester: string;
  };
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  removeGoal: (id: string) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  moveGoal: (id: string, category: string, semester: string) => void;
  setFilter: (key: 'category' | 'semester', value: string) => void;
}

const defaultCategories: Category[] = [
  { id: 'school', name: 'School', color: 'blue', icon: '📚' },
  { id: 'summer', name: 'Summer', color: 'yellow', icon: '☀️' },
  { id: 'extracurricular', name: 'Extracurricular', color: 'green', icon: '🎯' },
  { id: 'career', name: 'Career', color: 'purple', icon: '💼' },
  { id: 'sports', name: 'Sports', color: 'red', icon: '⚽' },
];

const defaultSemesters: Semester[] = [
  { id: 'fall-2024', name: 'Fall 2024', year: 2024, season: 'Fall' },
  { id: 'spring-2025', name: 'Spring 2025', year: 2025, season: 'Spring' },
  { id: 'summer-2025', name: 'Summer 2025', year: 2025, season: 'Summer' },
  { id: 'fall-2025', name: 'Fall 2025', year: 2025, season: 'Fall' },
  { id: 'spring-2026', name: 'Spring 2026', year: 2026, season: 'Spring' },
  { id: 'summer-2026', name: 'Summer 2026', year: 2026, season: 'Summer' },
];

const defaultGoals: Goal[] = [
  {
    id: 'goal-1',
    type: 'course',
    title: 'AP Biology',
    category: 'school',
    semester: 'fall-2025',
    description: 'Advanced high school biology course',
    source: 'SCED',
    status: 'planned',
    dependencies: [],
    color: 'blue',
    icon: '🧬'
  },
  {
    id: 'goal-2',
    type: 'summer',
    title: 'Stanford AI4ALL',
    category: 'summer',
    semester: 'summer-2025',
    description: 'AI summer program for underrepresented students',
    source: 'Stanford University',
    status: 'planned',
    dependencies: [],
    color: 'yellow',
    icon: '🤖'
  },
  {
    id: 'goal-3',
    type: 'sports',
    title: 'Varsity Basketball',
    category: 'sports',
    semester: 'fall-2024',
    description: 'Join varsity basketball team',
    status: 'in-progress',
    dependencies: [],
    color: 'red',
    icon: '🏀'
  }
];

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: defaultGoals,
  categories: defaultCategories,
  semesters: defaultSemesters,
  filters: {
    category: 'all',
    semester: 'all',
  },
  addGoal: (goalData) => set((state) => ({
    goals: [...state.goals, { ...goalData, id: `goal-${Date.now()}` }]
  })),
  removeGoal: (id) => set((state) => ({
    goals: state.goals.filter(goal => goal.id !== id)
  })),
  updateGoal: (id, updates) => set((state) => ({
    goals: state.goals.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    )
  })),
  moveGoal: (id, category, semester) => {
    console.log(`Moving goal ${id} to category: ${category}, semester: ${semester}`);
    set((state) => ({
      goals: state.goals.map(goal =>
        goal.id === id ? { ...goal, category, semester } : goal
      )
    }));
  },
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
}));
