'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { gigAPI } from '../../../services/api';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function EditGigPage() {
  const router = useRouter();
  const params = useParams();
  const gigId = params.id as string;
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && gigId) {
      fetchGig();
    }
  }, [isAuthenticated, authLoading, gigId, router]);

  const fetchGig = async () => {
    try {
      setIsLoading(true);
      const response = await gigAPI.getGig(gigId);
      const gig = response.data.data;
      
      // Check if user is the owner
      if (gig.ownerId._id !== user?._id) {
        toast.error('You are not authorized to edit this gig');
        router.push('/my-gigs');
        return;
      }

      setFormData({
        title: gig.title,
        description: gig.description,
        budget: gig.budget.toString(),
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load gig');
      router.push('/my-gigs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.budget) {
      toast.error('Please fill in all fields');
      return;
    }

    const budget = parseFloat(formData.budget);
    if (isNaN(budget) || budget < 1) {
      toast.error('Budget must be a valid number greater than 0');
      return;
    }

    setIsSaving(true);
    try {
      await gigAPI.updateGig(gigId, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget: budget,
      });
      toast.success('Gig updated successfully!');
      router.push(`/gigs/${gigId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update gig');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/gigs/${gigId}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Gig
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Edit Gig</h1>
          <p className="text-gray-600">Update your gig details</p>
        </div>

        {/* Form */}
        <div className="glass-card rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="input-field text-lg"
                placeholder="e.g., Build a responsive website"
                maxLength={100}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={8}
                className="input-field resize-none text-base"
                placeholder="Describe your project in detail..."
                maxLength={1000}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-sm font-semibold text-gray-800 mb-2">
                Budget (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  $
                </span>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  required
                  min="1"
                  step="0.01"
                  value={formData.budget}
                  onChange={handleChange}
                  className="input-field pl-8 text-lg"
                  placeholder="1000"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary flex-1 group relative"
              >
                {isSaving ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin inline" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2 inline" />
                    Update Gig
                  </>
                )}
              </button>
              <Link
                href={`/gigs/${gigId}`}
                className="btn-secondary px-8"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
