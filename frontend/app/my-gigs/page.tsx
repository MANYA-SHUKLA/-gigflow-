'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase, DollarSign, Users, Clock,
  CheckCircle, XCircle, MoreVertical,
  Trash2, Eye, TrendingUp,
  PlusCircle, Filter
} from 'lucide-react';
import { gigAPI } from '../services/api';
import toast from 'react-hot-toast';

interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  ownerId: string;
  status: 'open' | 'assigned';
  createdAt: string;
  bids?: number;
}

export default function MyGigsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'assigned'>('all');
  const [gigToDelete, setGigToDelete] = useState<Gig | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      fetchMyGigs();
    }
  }, [isAuthenticated, authLoading, router, filter]);

  const fetchMyGigs = async () => {
    try {
      setIsLoading(true);
      const response = await gigAPI.getMyGigs({ status: filter === 'all' ? undefined : filter });
      setGigs(response.data.data);
    } catch (error) {
      toast.error('Failed to load your gigs');
      console.error('Error fetching gigs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGig = async () => {
    if (!gigToDelete) return;

    setIsDeleting(true);
    try {
      await gigAPI.deleteGig(gigToDelete._id);
      toast.success('Gig deleted successfully');
      setGigs((prev) => prev.filter((gig) => gig._id !== gigToDelete._id));
      setGigToDelete(null);
    } catch (error) {
      toast.error('Failed to delete gig');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-green-600 bg-green-100';
      case 'assigned':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircle className="w-4 h-4" />;
      case 'assigned':
        return <Users className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredGigs = filter === 'all' 
    ? gigs 
    : gigs.filter(gig => gig.status === filter);

  const stats = {
    total: gigs.length,
    open: gigs.filter(g => g.status === 'open').length,
    assigned: gigs.filter(g => g.status === 'assigned').length,
    totalBudget: gigs.reduce((sum, gig) => sum + gig.budget, 0),
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Delete confirmation modal */}
        {gigToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => {
                if (!isDeleting) setGigToDelete(null);
              }}
            />
            <div className="relative w-full max-w-md mx-4 glass-card rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Delete gig?</h3>
                  <p className="text-gray-600 mt-2">
                    This will permanently delete <span className="font-semibold">{gigToDelete.title}</span>.
                  </p>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="btn-secondary px-6"
                      disabled={isDeleting}
                      onClick={() => setGigToDelete(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-primary px-6 bg-red-600 hover:bg-red-700"
                      disabled={isDeleting}
                      onClick={handleDeleteGig}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My <span className="gradient-text">Gigs</span>
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your posted gigs and track applications
              </p>
            </div>
            <Link
              href="/gigs/create"
              className="btn-primary inline-flex items-center group"
            >
              <PlusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
              Post New Gig
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="glass-card rounded-2xl p-6">
              <div className="text-3xl font-bold gradient-text mb-2">{stats.total}</div>
              <div className="text-gray-600 font-medium">Total Gigs</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="text-3xl font-bold gradient-text mb-2">{stats.open}</div>
              <div className="text-gray-600 font-medium">Open Gigs</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="text-3xl font-bold gradient-text mb-2">{stats.assigned}</div>
              <div className="text-gray-600 font-medium">Assigned Gigs</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="text-3xl font-bold gradient-text mb-2">
                ${stats.totalBudget.toLocaleString()}
              </div>
              <div className="text-gray-600 font-medium">Total Budget</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="text-black">All Gigs ({stats.total})</span>
              </button>
              <button
                onClick={() => setFilter('open')}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  filter === 'open'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Open ({stats.open})
              </button>
              <button
                onClick={() => setFilter('assigned')}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  filter === 'assigned'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Assigned ({stats.assigned})
              </button>
            </div>
          </div>
        </div>

        {/* Gigs Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredGigs.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {filter === 'all' ? 'No gigs yet' : `No ${filter} gigs`}
            </h3>
            <p className="text-gray-600 mb-8">
              {filter === 'all' 
                ? 'Start by posting your first gig'
                : `You don't have any ${filter} gigs`
              }
            </p>
            {filter === 'all' && (
              <Link href="/gigs/create" className="btn-primary">
                Post Your First Gig
              </Link>
            )}
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Project</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Budget</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Posted</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Bids</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredGigs.map((gig) => (
                    <tr 
                      key={gig._id} 
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="py-5 px-6">
                        <div>
                          <Link 
                            href={`/gigs/${gig._id}`}
                            className="font-semibold text-gray-900 hover:text-primary-600 transition-colors block mb-1"
                          >
                            {gig.title}
                          </Link>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {gig.description.substring(0, 60)}...
                          </p>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(gig.status)}`}>
                          {getStatusIcon(gig.status)}
                          <span className="ml-1.5">
                            {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                          <span className="font-bold text-gray-900">
                            ${gig.budget.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="text-gray-600">{formatDate(gig.createdAt)}</div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium">{gig.bids || 0}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-3">
                          <Link
                            href={`/gigs/${gig._id}`}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </Link>
                          {gig.status === 'open' && (
                            <Link
                              href={`/gigs/${gig._id}/edit`}
                              className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <MoreVertical className="w-4 h-4 text-blue-600" />
                            </Link>
                          )}
                          <button
                            onClick={() => setGigToDelete(gig)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}