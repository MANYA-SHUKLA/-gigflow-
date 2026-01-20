'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Award, DollarSign, Clock, Calendar,
  CheckCircle, XCircle, Clock as ClockIcon,
  TrendingUp, Filter, ExternalLink,
  MessageSquare, Eye, Briefcase,
  ChevronRight, Star
} from 'lucide-react';
import { bidAPI } from '../services/api';
import toast from 'react-hot-toast';

interface Bid {
  _id: string;
  gigId: {
    _id: string;
    title: string;
    description: string;
    budget: number;
    ownerId: {
      name: string;
      email: string;
    };
    status: 'open' | 'assigned';
  };
  price: number;
  message: string;
  status: 'pending' | 'hired' | 'rejected';
  createdAt: string;
}

export default function MyBidsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { socket } = useSocket();
  const router = useRouter();
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'hired' | 'rejected'>('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      fetchMyBids();
    }
  }, [isAuthenticated, authLoading, router]);

  // Listen for Socket.io notifications to refresh bids
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data: any) => {
      // Refresh bids if status changed (hired/rejected) or new bid was submitted
      if (data.type === 'hired' || data.type === 'rejected' || data.type === 'new_bid') {
        console.log('🔄 Refreshing My Bids due to notification:', data.type);
        setTimeout(() => {
          fetchMyBids();
        }, 500);
      }
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket]);

  const fetchMyBids = async () => {
    try {
      setIsLoading(true);
      const response = await bidAPI.getUserBids();
      setBids(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load your bids');
      console.error('Error fetching bids:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hired':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'rejected':
        return 'bg-gradient-to-r from-gray-500 to-gray-700 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hired':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getGigStatusColor = (status: string) => {
    return status === 'open' 
      ? 'text-green-600 bg-green-100 border-green-200'
      : 'text-blue-600 bg-blue-100 border-blue-200';
  };

  const stats = {
    total: bids.length,
    pending: bids.filter(b => b.status === 'pending').length,
    hired: bids.filter(b => b.status === 'hired').length,
    rejected: bids.filter(b => b.status === 'rejected').length,
    totalValue: bids.reduce((sum, bid) => sum + bid.price, 0),
  };

  const filteredBids = filter === 'all' 
    ? bids 
    : bids.filter(bid => bid.status === filter);

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
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My <span className="gradient-text">Bids</span>
              </h1>
              <p className="text-gray-600 text-lg">
                Track and manage all your submitted bids
              </p>
            </div>
            <Link
              href="/gigs"
              className="btn-primary inline-flex items-center group"
            >
              <Briefcase className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Browse New Gigs
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
            <div className="glass-card rounded-2xl p-6">
              <div className="text-3xl font-bold gradient-text mb-2">{stats.total}</div>
              <div className="text-gray-600 font-medium">Total Bids</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="text-3xl font-bold gradient-text mb-2">{stats.pending}</div>
              <div className="text-gray-600 font-medium">Pending</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="text-3xl font-bold gradient-text mb-2">{stats.hired}</div>
              <div className="text-gray-600 font-medium">Hired</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="text-3xl font-bold gradient-text mb-2">{stats.rejected}</div>
              <div className="text-gray-600 font-medium">Rejected</div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="text-3xl font-bold gradient-text mb-2">
                ${stats.totalValue.toLocaleString()}
              </div>
              <div className="text-gray-600 font-medium">Total Value</div>
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
                <span className="text-black">All Bids ({stats.total})</span>
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  filter === 'pending'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <ClockIcon className="w-4 h-4 inline mr-2" />
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilter('hired')}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  filter === 'hired'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Hired ({stats.hired})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  filter === 'rejected'
                    ? 'bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <XCircle className="w-4 h-4 inline mr-2" />
                Rejected ({stats.rejected})
              </button>
            </div>
          </div>
        </div>

        {/* Bids List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredBids.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {filter === 'all' ? 'No bids yet' : `No ${filter} bids`}
            </h3>
            <p className="text-gray-600 mb-8">
              {filter === 'all' 
                ? 'Start by submitting your first bid'
                : `You don't have any ${filter} bids`
              }
            </p>
            {filter === 'all' && (
              <Link href="/gigs" className="btn-primary">
                Browse Gigs to Bid
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBids.map((bid) => (
              <div
                key={bid._id}
                className="glass-card rounded-2xl overflow-hidden card-hover group"
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                    {/* Left: Gig Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getGigStatusColor(bid.gigId.status)}`}>
                          {bid.gigId.status.charAt(0).toUpperCase() + bid.gigId.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {formatDate(bid.createdAt)}
                        </span>
                      </div>
                      
                      <Link href={`/gigs/${bid.gigId._id}`}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                          {bid.gigId.title}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <span className="flex items-center mr-4">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {bid.gigId.ownerId.name}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Gig Budget: ${bid.gigId.budget.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Right: Bid Info */}
                    <div className="lg:text-right">
                      <div className="mb-4">
                        <div className={`inline-flex items-center px-4 py-2 rounded-xl font-bold ${getStatusColor(bid.status)}`}>
                          {getStatusIcon(bid.status)}
                          <span className="ml-2">
                            {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-3xl font-bold gradient-text">
                        ${bid.price.toLocaleString()}
                      </div>
                      <div className="text-gray-600">Your Bid</div>
                    </div>
                  </div>

                  {/* Bid Message Preview */}
                  <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                    <div className="flex items-center mb-3">
                      <MessageSquare className="w-5 h-5 text-gray-400 mr-2" />
                      <h4 className="font-medium text-gray-900">Your Proposal</h4>
                    </div>
                    <p className="text-gray-700 line-clamp-2">
                      {bid.message}
                    </p>
                  </div>

                  {/* Actions & Timeline */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Submitted: {formatDateTime(bid.createdAt)}
                      </div>
                      
                      {bid.status === 'pending' && (
                        <div className="flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
                          <ClockIcon className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm font-medium text-yellow-800">Awaiting Response</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4">
                      <Link
                        href={`/gigs/${bid.gigId._id}`}
                        className="btn-secondary inline-flex items-center group"
                      >
                        View Gig
                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      
                      {bid.status === 'hired' && (
                        <button className="btn-primary inline-flex items-center group">
                          Start Project
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Performance Insights */}
        {bids.length > 0 && (
          <div className="mt-12">
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bid Performance Insights</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg bg-green-500 mr-4">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stats.hired > 0 ? ((stats.hired / stats.total) * 100).toFixed(1) : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Hire Rate</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Percentage of bids that get hired
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg bg-blue-500 mr-4">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">24h</div>
                      <div className="text-sm text-gray-600">Avg. Response Time</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Average time for client responses
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg bg-purple-500 mr-4">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        ${stats.totalValue > 0 ? (stats.totalValue / stats.total).toFixed(0) : 0}
                      </div>
                      <div className="text-sm text-gray-600">Avg. Bid Value</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Average value of your bids
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg bg-orange-500 mr-4">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">4.8</div>
                      <div className="text-sm text-gray-600">Avg. Client Rating</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Average rating from hired projects
                  </p>
                </div>
              </div>

              {/* Tips Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tips for Better Bids</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Personalize Your Proposal</h4>
                      <p className="text-sm text-gray-600">
                        Mention specific details from the project description
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent-600 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Show Relevant Experience</h4>
                      <p className="text-sm text-gray-600">
                        Include examples of similar projects you've completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Be Clear About Timeline</h4>
                      <p className="text-sm text-gray-600">
                        Provide realistic delivery timelines
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Ask Questions</h4>
                      <p className="text-sm text-gray-600">
                        Show interest by asking clarifying questions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {bids.length === 0 && (
          <div className="mt-12 text-center">
            <div className="glass-card rounded-2xl p-12 bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-200">
              <Award className="w-16 h-16 text-primary-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Start Your Freelance Journey?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Submit your first bid and get hired for amazing projects. 
                Browse thousands of opportunities waiting for your skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/gigs" className="btn-primary">
                  Browse Available Gigs
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}