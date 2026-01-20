'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { 
  ArrowLeft, Calendar, DollarSign, MapPin, 
  Clock, User, Briefcase, MessageSquare,
  CheckCircle, Award, Star, Users,
  Share2, Bookmark, ExternalLink, XCircle, AlertTriangle
} from 'lucide-react';
import { gigAPI, bidAPI } from '../../services/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  ownerId: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'open' | 'assigned';
  createdAt: string;
}

interface Bid {
  _id: string;
  freelancerId: {
    _id: string;
    name: string;
    email: string;
  };
  message: string;
  price: number;
  status: 'pending' | 'hired' | 'rejected';
  createdAt: string;
}

export default function GigDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { socket } = useSocket();
  const [gig, setGig] = useState<Gig | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidForm, setBidForm] = useState({
    price: '',
    message: '',
  });
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [showHireModal, setShowHireModal] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);

  const gigId = params.id as string;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      fetchGigDetails();
    }
  }, [isAuthenticated, authLoading, router, gigId]);

  // Listen for Socket.io notifications related to this gig
  useEffect(() => {
    if (!socket || !gig) return;

    const handleNotification = (data: any) => {
      // If notification is about this gig, refresh the page data
      if (data.gigId === gigId) {
        console.log('🔄 Refreshing gig details due to notification:', data.type);
        
        // Check if current user is the owner
        const currentUserIsOwner = gig?.ownerId._id === user?._id;
        
        // If it's a new bid notification and user is the owner, refresh immediately
        if (data.type === 'new_bid' && currentUserIsOwner) {
          // Show toast notification
          toast.success(`New bid received from ${data.freelancerName || 'a freelancer'}! Amount: $${data.bidAmount?.toLocaleString() || ''}`, {
            icon: '🎉',
            duration: 5000,
          });
          // Refresh bids immediately
          setTimeout(() => {
            fetchGigDetails();
          }, 300);
        } else {
          // For other notifications (hired/rejected), refresh after delay
          setTimeout(() => {
            fetchGigDetails();
          }, 500);
        }
      }
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, gigId, gig, user]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!showHireModal) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowHireModal(false);
        setSelectedBidId(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showHireModal]);

  const fetchGigDetails = async () => {
    try {
      setIsLoading(true);
      const gigResponse = await gigAPI.getGig(gigId);
      const gigData = gigResponse.data.data;
      setGig(gigData);
      
      // Only fetch bids if user is the owner
      const isOwner = gigData.ownerId._id === user?._id;
      if (isOwner) {
        try {
          const bidsResponse = await bidAPI.getBidsByGig(gigId);
          setBids(bidsResponse.data.data || []);
        } catch (bidError: any) {
          // If user is not owner, bids will fail - that's expected
          if (bidError.response?.status !== 401) {
            console.error('Error fetching bids:', bidError);
          }
          setBids([]);
        }
      } else {
        setBids([]);
      }
    } catch (error) {
      toast.error('Failed to load gig details');
      console.error('Error fetching gig details:', error);
      router.push('/gigs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit a bid');
      return;
    }

    // Validate form fields
    if (!bidForm.price || !bidForm.message) {
      toast.error('Please fill in both bid amount and proposal');
      return;
    }

    const price = Number(bidForm.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    if (gig?.budget && price > gig.budget) {
      toast.error(`Bid amount cannot exceed the project budget of $${gig.budget.toLocaleString()}`);
      return;
    }

    if (bidForm.message.trim().length < 10) {
      toast.error('Please provide a more detailed proposal (at least 10 characters)');
      return;
    }

    setIsSubmittingBid(true);
    try {
      console.log('Submitting bid:', { gigId, price, message: bidForm.message.substring(0, 50) + '...' });
      
      const response = await bidAPI.createBid({
        gigId,
        price: price,
        message: bidForm.message.trim(),
      });
      
      console.log('Bid submitted successfully:', response.data);
      
      toast.success('Bid submitted successfully! The client will be notified.');
      setShowBidForm(false);
      setBidForm({ price: '', message: '' });
      
      // Refresh gig details to show the bid was submitted
      await fetchGigDetails();
      
      // Show success message and redirect to My Bids after delay
      setTimeout(() => {
        router.push('/my-bids');
      }, 1500);
    } catch (error: any) {
      console.error('Error submitting bid:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to submit bid';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const handleHireClick = (bidId: string) => {
    setSelectedBidId(bidId);
    setShowHireModal(true);
  };

  const handleHireCancel = () => {
    setShowHireModal(false);
    setSelectedBidId(null);
  };

  const handleHireConfirm = async () => {
    if (!selectedBidId) return;
    
    setShowHireModal(false);
    await handleHireFreelancer(selectedBidId);
    setSelectedBidId(null);
  };

  const handleHireFreelancer = async (bidId: string) => {
    try {
      // Optimistically update UI
      setBids(prevBids => 
        prevBids.map(bid => {
          if (bid._id === bidId) {
            return { ...bid, status: 'hired' as const };
          }
          if (bid.status === 'pending') {
            return { ...bid, status: 'rejected' as const };
          }
          return bid;
        })
      );
      
      if (gig) {
        setGig({ ...gig, status: 'assigned' as const });
      }

      const response = await bidAPI.hireFreelancer(bidId);
      toast.success('Freelancer hired successfully! The gig status has been updated to "Assigned" and all other bids have been rejected.');
      
      // Refresh gig and bids to get latest data from server
      await fetchGigDetails();
    } catch (error: any) {
      // Revert optimistic update on error
      fetchGigDetails();
      
      // Handle race condition errors specifically
      if (error.response?.status === 409) {
        toast.error(error.response?.data?.error || 'This gig has already been assigned to another freelancer. Refreshing...');
        // Refresh to show current state
        setTimeout(() => {
          fetchGigDetails();
        }, 500);
      } else {
        toast.error(error.response?.data?.error || 'Failed to hire freelancer');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
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

  const isOwner = gig?.ownerId._id === user?._id;
  const hasBid = bids.some(bid => bid.freelancerId._id === user?._id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Gig not found</h3>
          <p className="text-gray-600 mb-8">The gig you're looking for doesn't exist or has been removed.</p>
          <Link href="/gigs" className="btn-primary">
            Browse Gigs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Gigs
          </button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Gig Details */}
          <div className="lg:col-span-2">
            {/* Gig Header */}
            <div className="glass-card rounded-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`badge ${
                      gig.status === 'open' ? 'badge-success' : 'badge-info'
                    } text-sm px-3 py-1.5`}>
                      {gig.status === 'open' ? 'Open for Bids' : 'Assigned'}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Posted {formatDate(gig.createdAt)}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {gig.title}
                  </h1>

                  {/* Budget Badge */}
                  <div className="inline-flex items-center px-4 py-3 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200">
                    <DollarSign className="w-6 h-6 text-primary-600 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Project Budget</div>
                      <div className="text-2xl font-bold gradient-text">${gig.budget.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-colors">
                    <Bookmark className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Client Info */}
              <div className="flex items-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Posted by {gig.ownerId.name}</h3>
                  <p className="text-gray-600 text-sm">{gig.ownerId.email}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium">4.9</span>
                    <span className="mx-1">•</span>
                    <span>24 Projects</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex space-x-1 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-6 py-3 font-medium text-lg rounded-t-lg transition-colors ${
                    activeTab === 'details'
                      ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Briefcase className="w-5 h-5 inline mr-2" />
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('bids')}
                  data-tab="bids"
                  className={`px-6 py-3 font-medium text-lg rounded-t-lg transition-colors ${
                    activeTab === 'bids'
                      ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-5 h-5 inline mr-2" />
                  Bids ({bids.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="glass-card rounded-b-2xl rounded-tr-2xl p-8">
                {activeTab === 'details' ? (
                  <div className="prose max-w-none">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Description</h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {gig.description}
                    </div>

                    {/* Requirements */}
                    <div className="mt-10 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                        Requirements
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">Strong experience with similar projects</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">Good communication skills</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">Ability to meet deadlines</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">Portfolio of relevant work</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div>
                    {isOwner ? (
                      <>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                          Bids Received ({bids.length})
                        </h3>
                        {bids.length === 0 ? (
                          <div className="text-center py-12">
                            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No bids received yet</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {bids.map((bid) => (
                              <div
                                key={bid._id}
                                className={`p-6 rounded-xl border-2 ${
                                  bid.status === 'hired'
                                    ? 'border-green-500 bg-green-50'
                                    : bid.status === 'rejected'
                                    ? 'border-gray-300 bg-gray-50'
                                    : 'border-gray-200 hover:border-primary-300 bg-white'
                                } transition-all duration-300`}
                              >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                  <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center">
                                      <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-gray-900">{bid.freelancerId.name}</h4>
                                      <p className="text-sm text-gray-600">{bid.freelancerId.email}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                      <div className="text-2xl font-bold gradient-text">${bid.price.toLocaleString()}</div>
                                      <div className="text-sm text-gray-600">Bid Amount</div>
                                    </div>
                                    <span className={`badge ${
                                      bid.status === 'hired'
                                        ? 'badge-success'
                                        : bid.status === 'rejected'
                                        ? 'badge-error'
                                        : 'badge-warning'
                                    }`}>
                                      {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                                    </span>
                                  </div>
                                </div>

                                <p className="text-gray-700 mb-4 p-4 bg-gray-50 rounded-lg">
                                  {bid.message}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                  <div className="text-sm text-gray-500">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    {formatDateTime(bid.createdAt)}
                                  </div>
                                  
                                  {bid.status === 'pending' && gig?.status === 'open' && (
                                    <button
                                      onClick={() => handleHireClick(bid._id)}
                                      className="btn-primary flex items-center space-x-2"
                                    >
                                      <Award className="w-4 h-4" />
                                      <span>Hire Freelancer</span>
                                    </button>
                                  )}
                                  {bid.status === 'hired' && (
                                    <div className="flex items-center space-x-2 text-green-600 font-semibold">
                                      <CheckCircle className="w-5 h-5" />
                                      <span>Hired</span>
                                    </div>
                                  )}
                                  {bid.status === 'rejected' && (
                                    <div className="flex items-center space-x-2 text-gray-500">
                                      <XCircle className="w-5 h-5" />
                                      <span>Rejected</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                          {hasBid ? 'Your Bid' : 'Submit Your Bid'}
                        </h3>
                        
                        {hasBid ? (
                          <div className="text-center py-12">
                            <Award className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h4 className="text-xl font-bold text-gray-900 mb-2">Bid Submitted!</h4>
                            <p className="text-gray-600 mb-6">
                              Your bid has been submitted successfully. The client will review all bids and get back to you.
                            </p>
                            <Link href="/my-bids" className="btn-primary">
                              View My Bids
                            </Link>
                          </div>
                        ) : gig?.status === 'open' ? (
                          showBidForm ? (
                            <form onSubmit={handleBidSubmit} className="space-y-6 animate-fade-in" id="bid-form">
                              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800 font-medium">
                                  💡 Fill in your bid amount and proposal below. Make sure your proposal is detailed and compelling!
                                </p>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Your Bid Amount ($) *
                                </label>
                                <input
                                  type="number"
                                  name="price"
                                  value={bidForm.price}
                                  onChange={(e) => setBidForm({ ...bidForm, price: e.target.value })}
                                  className="input-field"
                                  placeholder="Enter your bid amount"
                                  required
                                  min="1"
                                  max={gig?.budget || 999999}
                                  step="0.01"
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                  Project budget: ${gig?.budget?.toLocaleString() || 'N/A'}
                                </p>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Your Proposal *
                                </label>
                                <textarea
                                  name="message"
                                  value={bidForm.message}
                                  onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                                  className="input-field min-h-[200px]"
                                  placeholder="Describe why you're the best fit for this project. Include your relevant experience, approach, and timeline."
                                  required
                                  rows={6}
                                  minLength={10}
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                  {bidForm.message.length} characters (minimum 10)
                                </p>
                              </div>

                              <div className="flex gap-4">
                                <button
                                  type="submit"
                                  disabled={isSubmittingBid || !bidForm.price || !bidForm.message.trim()}
                                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isSubmittingBid ? (
                                    <span className="flex items-center justify-center">
                                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                      Submitting...
                                    </span>
                                  ) : (
                                    'Submit Bid'
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowBidForm(false);
                                    setBidForm({ price: '', message: '' });
                                  }}
                                  className="btn-secondary"
                                  disabled={isSubmittingBid}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="text-center py-12">
                              <MessageSquare className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                              <h4 className="text-xl font-bold text-gray-900 mb-2">Ready to bid on this project?</h4>
                              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                                Submit a detailed proposal explaining why you're the best fit for this gig.
                                Include your experience, approach, and estimated timeline.
                              </p>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log('Submit Your Bid button clicked (main)');
                                  setActiveTab('bids'); // Ensure we're on Bids tab
                                  setShowBidForm(true); // Show the form
                                }}
                                className="btn-primary"
                                type="button"
                              >
                                Submit Your Bid
                              </button>
                            </div>
                          )
                        ) : (
                          <div className="text-center py-12">
                            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-xl font-bold text-gray-900 mb-2">This gig has been assigned</h4>
                            <p className="text-gray-600 mb-8">
                              This project is no longer accepting bids as a freelancer has been hired.
                            </p>
                            <Link href="/gigs" className="btn-primary">
                              Browse Other Gigs
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {/* Submit Bid Card */}
            {!isOwner && gig.status === 'open' && !hasBid && (
              <div className="glass-card rounded-2xl p-6 mb-8 bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Work?</h3>
                <p className="text-gray-700 mb-6">
                  Submit your bid to get started on this exciting project.
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Submit Your Bid button clicked (sidebar)');
                    setActiveTab('bids'); // Switch to Bids tab
                    setShowBidForm(true); // Show the form
                    // Scroll to form after a short delay to allow React to render
                    setTimeout(() => {
                      const formElement = document.getElementById('bid-form');
                      if (formElement) {
                        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      } else {
                        // Fallback: scroll to Bids tab
                        const bidsTab = document.querySelector('[data-tab="bids"]');
                        if (bidsTab) {
                          bidsTab.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }, 400);
                  }}
                  className="w-full btn-primary hover:scale-105 transition-transform"
                  type="button"
                >
                  Submit Your Bid
                </button>
                <div className="mt-6 pt-6 border-t border-primary-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Avg. response time: 24 hours</span>
                  </div>
                </div>
              </div>
            )}

            {/* Project Info */}
            <div className="glass-card rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Project Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`badge ${
                    gig.status === 'open' ? 'badge-success' : 'badge-info'
                  }`}>
                    {gig.status === 'open' ? 'Open' : 'Assigned'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-bold gradient-text">${gig.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-medium">{formatDate(gig.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bids Received</span>
                  <span className="font-medium">{bids.length}</span>
                </div>
              </div>
            </div>

          </div>
          </div>
        </div>

        {/* Hire Confirmation Modal */}
        {showHireModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => {
              setShowHireModal(false);
              setSelectedBidId(null);
            }}
          >
            <div 
              className="glass-card rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-primary-200 animate-scale-in relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowHireModal(false);
                  setSelectedBidId(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                type="button"
                aria-label="Close modal"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>

              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                Confirm Hiring
              </h3>
              
              <p className="text-gray-700 text-center mb-6 leading-relaxed">
                Are you sure you want to hire this freelancer? This will automatically reject all other bids for this gig.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">This action cannot be undone.</p>
                    <p>All other pending bids will be automatically marked as rejected.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowHireModal(false);
                    setSelectedBidId(null);
                  }}
                  className="btn-secondary flex-1"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleHireConfirm}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                  type="button"
                >
                  <Award className="w-4 h-4" />
                  <span>Yes, Hire Freelancer</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }