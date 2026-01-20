'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, Filter, MapPin, Clock, DollarSign, 
  Briefcase, Star, Users, TrendingUp,
  PlusCircle, ChevronRight, Calendar
} from 'lucide-react';
import { gigAPI } from '../services/api';
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

export default function GigsPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'open',
    minBudget: '',
    maxBudget: '',
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchGigs();
  }, [isAuthenticated, loading, router]);

  const fetchGigs = async () => {
    try {
      setIsLoading(true);
      const response = await gigAPI.getGigs({
        search: searchQuery || undefined,
        status: filters.status,
      });
      setGigs(response.data.data);
    } catch (error) {
      toast.error('Failed to load gigs');
      console.error('Error fetching gigs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGigs();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
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
                Find Your Next <span className="gradient-text">Opportunity</span>
              </h1>
              <p className="text-gray-600 text-lg">
                Browse thousands of gigs from clients worldwide
              </p>
            </div>
            {isAuthenticated && (
              <Link
                href="/gigs/create"
                className="btn-primary inline-flex items-center group"
              >
                <PlusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                Post a Gig
              </Link>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-12 pr-4"
                  placeholder="Search gigs by title, skills, or keywords..."
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 btn-primary py-2 px-6"
                >
                  Search
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Filter className="w-4 h-4 inline mr-2" />
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="open">Open Gigs</option>
                    <option value="assigned">Assigned Gigs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Min Budget
                  </label>
                  <input
                    type="number"
                    value={filters.minBudget}
                    onChange={(e) => setFilters({ ...filters, minBudget: e.target.value })}
                    className="input-field"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Max Budget
                  </label>
                  <input
                    type="number"
                    value={filters.maxBudget}
                    onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
                    className="input-field"
                    placeholder="$10000"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="text-3xl font-bold gradient-text mb-2">{gigs.length}</div>
            <div className="text-gray-600 font-medium">Total Gigs</div>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="text-3xl font-bold gradient-text mb-2">
              {gigs.filter(g => g.status === 'open').length}
            </div>
            <div className="text-gray-600 font-medium">Open Gigs</div>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="text-3xl font-bold gradient-text mb-2">
              ${gigs.reduce((sum, gig) => sum + gig.budget, 0).toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">Total Budget</div>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="text-3xl font-bold gradient-text mb-2">24h</div>
            <div className="text-gray-600 font-medium">Avg. Response Time</div>
          </div>
        </div>

        {/* Gigs Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card rounded-3xl overflow-hidden animate-pulse">
                <div className="h-1 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                <div className="p-8">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
                  <div className="h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6"></div>
                  <div className="flex justify-between">
                    <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                    <div className="h-10 bg-gray-300 rounded-lg w-28"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No gigs found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({ status: 'open', minBudget: '', maxBudget: '' });
                fetchGigs();
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gigs.map((gig, index) => (
              <div
                key={gig._id}
                className="glass-card rounded-3xl overflow-hidden card-hover group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Top Border */}
                <div className={`h-1 bg-gradient-to-r ${
                  gig.status === 'open' 
                    ? 'from-green-400 via-emerald-500 to-green-400' 
                    : 'from-blue-400 via-cyan-500 to-blue-400'
                }`}></div>
                
                <div className="p-8">
                  {/* Gig Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`badge px-3 py-1.5 text-xs font-bold ${
                          gig.status === 'open' ? 'badge-success' : 'badge-info'
                        } shadow-md`}>
                          {gig.status === 'open' ? '✨ Open' : '✓ Assigned'}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatDate(gig.createdAt)}
                        </span>
                      </div>
                      <Link href={`/gigs/${gig._id}`}>
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-primary-600 transition-all duration-300 line-clamp-2 leading-tight">
                          {gig.title}
                        </h3>
                      </Link>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-8 line-clamp-3 leading-relaxed text-sm">
                    {truncateDescription(gig.description)}
                  </p>

                  {/* Budget */}
                  <div className="flex items-center justify-between mb-8 p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">Budget</div>
                        <div className="text-3xl font-extrabold gradient-text">
                          ${gig.budget.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600 font-medium">Posted by</div>
                      <div className="font-bold text-gray-900">{gig.ownerId.name}</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between pt-6 border-t-2 border-gray-100">
                    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 group-hover:bg-gradient-to-r group-hover:from-primary-50 group-hover:to-accent-50 transition-all duration-300">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-md">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Multiple bids</span>
                    </div>
                    <Link
                      href={`/gigs/${gig._id}`}
                      className="btn-primary group inline-flex items-center px-6 py-3 text-sm font-semibold"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination or Load More */}
        {gigs.length > 0 && !isLoading && (
          <div className="mt-12 text-center">
            <button
              onClick={() => {
                // Implement pagination or load more
                toast.success('Loading more gigs...');
              }}
              className="btn-primary inline-flex items-center group"
            >
              <TrendingUp className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Load More Gigs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}