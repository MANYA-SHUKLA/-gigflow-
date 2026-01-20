'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, Briefcase, DollarSign, FileText,
  Calendar, Tag, Globe, Clock,
  CheckCircle
} from 'lucide-react';
import { gigAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function CreateGigPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
    duration: '',
  });

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.budget) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await gigAPI.createGig({
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget),
      });
      toast.success('Gig created successfully!');
      router.push('/my-gigs');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create gig');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Web Development',
    'Mobile Development',
    'Graphic Design',
    'Writing & Translation',
    'Digital Marketing',
    'Video & Animation',
    'Music & Audio',
    'Business',
    'Data Science',
  ];

  const durations = [
    'Less than 1 week',
    '1-2 weeks',
    '2-4 weeks',
    '1-3 months',
    '3-6 months',
    'More than 6 months',
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors group mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create Your <span className="gradient-text">Gig</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Share your project details and find the perfect freelancer
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Card */}
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mr-4">
                <Briefcase className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                <p className="text-gray-600">Tell us about your project</p>
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-900 mb-3">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field text-lg py-4"
                placeholder="e.g., Build a responsive e-commerce website"
                required
              />
            </div>

            {/* Category & Budget */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3">
                  <Tag className="w-5 h-5 inline mr-2" />
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-3">
                  <DollarSign className="w-5 h-5 inline mr-2" />
                  Budget ($) *
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 5001"
                  required
                  min="1"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-3">
                <Clock className="w-5 h-5 inline mr-2" />
                Expected Duration *
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select duration</option>
                {durations.map((duration) => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Details Card */}
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Project Details</h2>
                <p className="text-gray-600">Describe what you need in detail</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-3">
                Project Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field min-h-[200px]"
                placeholder="Describe your project in detail. Include requirements, goals, and any specific technologies or skills needed."
                required
                rows={8}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Be specific to get better proposals</span>
                <span>{formData.description.length}/2000 characters</span>
              </div>
            </div>

          </div>

          {/* Tips Card */}
          <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 text-blue-600 mr-3" />
              Tips for a Successful Gig
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">Be specific about your requirements</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">Set a realistic budget</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt=0.5 mr-3">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">Include clear timelines</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">Mention preferred skills</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">Add examples if possible</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <p className="text-gray-700">Specify communication preferences</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary px-10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-12"
            >
              {isSubmitting ? 'Creating Gig...' : 'Create Gig'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}