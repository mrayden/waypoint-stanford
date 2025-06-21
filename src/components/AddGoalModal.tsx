
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useGoalStore } from '../store/goalStore';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddGoalModal = ({ isOpen, onClose }: AddGoalModalProps) => {
  const { addGoal, categories, semesters } = useGoalStore();
  const [formData, setFormData] = useState({
    title: '',
    type: 'course' as const,
    category: 'school',
    semester: 'fall-2025',
    description: '',
    status: 'planned' as const,
  });

  const typeIcons = {
    course: '📚',
    summer: '☀️',
    extracurricular: '🎯',
    career: '💼',
    sports: '⚽',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    addGoal({
      ...formData,
      dependencies: [],
      icon: typeIcons[formData.type],
    });

    // Reset form
    setFormData({
      title: '',
      type: 'course',
      category: 'school',
      semester: 'fall-2025',
      description: '',
      status: 'planned',
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-white font-semibold text-lg">Add New Goal</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200 hover:scale-110"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div className="animate-fade-in">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Goal Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., AP Biology, Stanford Summer Program..."
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 focus:scale-102"
              required
            />
          </div>

          {/* Type */}
          <div className="animate-fade-in">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-slate-700/70"
            >
              <option value="course">Course</option>
              <option value="summer">Summer Program</option>
              <option value="extracurricular">Extracurricular</option>
              <option value="career">Career Goal</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          {/* Category */}
          <div className="animate-fade-in">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-slate-700/70"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div className="animate-fade-in">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Target Semester
            </label>
            <select
              value={formData.semester}
              onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-slate-700/70"
            >
              {semesters.map(semester => (
                <option key={semester.id} value={semester.id}>
                  {semester.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="animate-fade-in">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add more details about this goal..."
              rows={3}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200 focus:scale-102"
            />
          </div>

          {/* Status */}
          <div className="animate-fade-in">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-slate-700/70"
            >
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 animate-fade-in">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
            >
              Add Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;
