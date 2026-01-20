'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Briefcase, TrendingUp, Users, 
  PlusCircle, ArrowUpRight, Award,
  Target, Zap, CheckCircle, Bell, XCircle, Clock
} from 'lucide-react';
import { gigAPI, bidAPI } from '../services/api';
interface DashboardStats {
  totalGigs: number;
  activeGigs: number;
  totalBids: number;
}
type GigLike = {
  ownerId?: { _id?: string };
  status?: string;
};
const isGigLike = (value: unknown): value is GigLike => {
  return typeof value === 'object' && value !== null;
};
export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const { notifications, markAsRead, unreadCount } = useSocket();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalGigs: 0,
    activeGigs: 0,
    totalBids: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, loading, router]);

  const fetchDashboardData = async () => {
    try {
      const [gigsResponse, bidsResponse] = await Promise.all([
        gigAPI.getGigs(),
        bidAPI.getUserBids(),
      ]);

      const gigs: unknown[] = Array.isArray(gigsResponse.data.data) ? gigsResponse.data.data : [];
      const userGigs = gigs
        .filter(isGigLike)
        .filter((gig) => gig.ownerId?._id === user?._id);

      setStats({
        totalGigs: userGigs.length,
        activeGigs: userGigs.filter((gig) => gig.status === 'open').length,
        totalBids: bidsResponse.data.count || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, <span className="gradient-text">{user?.name}!</span>
              </h1>
              <p className="text-gray-600 text-lg">
                Here&apos;s what&apos;s happening with your account today.
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
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="glass-card rounded-3xl p-8 card-hover group animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-4xl font-extrabold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">{stats.totalGigs}</h3>
            <p className="text-gray-700 font-semibold">Total Gigs Posted</p>
            <div className="mt-4 h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-300"></div>
          </div>

          <div className="glass-card rounded-3xl p-8 card-hover group animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="p-2 rounded-lg bg-blue-100">
                <ArrowUpRight className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <h3 className="text-4xl font-extrabold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">{stats.activeGigs}</h3>
            <p className="text-gray-700 font-semibold">Active Gigs</p>
            <div className="mt-4 h-1 w-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-300"></div>
          </div>

          <div className="glass-card rounded-3xl p-8 card-hover group animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="p-2 rounded-lg bg-yellow-100">
                <Zap className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-4xl font-extrabold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">{stats.totalBids}</h3>
            <p className="text-gray-700 font-semibold">Total Bids</p>
            <div className="mt-4 h-1 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-300"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            {/* Real-time Notifications Section */}
            {notifications.length > 0 && (
              <div className="glass-card rounded-3xl p-8 mb-8 animate-fade-in border-2 border-primary-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 shadow-lg">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-gray-900 gradient-text">Real-time Notifications</h2>
                      <p className="text-sm text-gray-600">Stay updated with your latest activity</p>
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-full animate-pulse shadow-lg">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                        notification.type === 'hired'
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                          : notification.type === 'rejected'
                          ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
                          : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
                      } ${!notification.read ? 'ring-2 ring-primary-300' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl flex-shrink-0 ${
                          notification.type === 'hired'
                            ? 'bg-green-100'
                            : notification.type === 'rejected'
                            ? 'bg-gray-100'
                            : 'bg-blue-100'
                        }`}>
                          {notification.type === 'hired' ? (
                            <Award className="w-6 h-6 text-green-600" />
                          ) : notification.type === 'rejected' ? (
                            <XCircle className="w-6 h-6 text-gray-600" />
                          ) : (
                            <Bell className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-lg mb-1 ${
                            notification.type === 'hired' ? 'text-green-800' : 'text-gray-800'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-3 mt-2">
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>
                                {new Date(notification.timestamp).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            {notification.gigId && (
                              <Link
                                href={`/gigs/${notification.gigId}`}
                                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>View Gig</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="w-3 h-3 rounded-full bg-primary-500 flex-shrink-0 mt-2 animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {notifications.length > 5 && (
                  <div className="mt-6 text-center">
                    <Link
                      href="/my-bids"
                      className="text-primary-600 hover:text-primary-700 font-semibold flex items-center justify-center space-x-2"
                    >
                      <span>View all {notifications.length} notifications</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="glass-card rounded-3xl p-8 mb-8 animate-fade-in">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-8 gradient-text">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link
                  href="/gigs"
                  className="p-8 rounded-2xl border-2 border-primary-200 hover:border-primary-400 bg-gradient-to-br from-primary-50 via-white to-primary-50 hover:from-primary-100 hover:via-white hover:to-primary-100 transition-all duration-500 group card-hover shadow-lg hover:shadow-2xl"
                >
                  <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 flex-shrink-0 inline-flex items-center justify-center shadow-xl">
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">Browse Gigs</h3>
                      <p className="text-sm text-gray-600 font-medium">Find new opportunities</p>
                    </div>
                  </div>
                  <div className="mt-4 h-1 w-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-300"></div>
                </Link>

                <Link
                  href="/my-bids"
                  className="p-8 rounded-2xl border-2 border-accent-200 hover:border-accent-400 bg-gradient-to-br from-accent-50 via-white to-accent-50 hover:from-accent-100 hover:via-white hover:to-accent-100 transition-all duration-500 group card-hover shadow-lg hover:shadow-2xl"
                >
                  <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 flex-shrink-0 inline-flex items-center justify-center shadow-xl">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-accent-600 transition-colors">My Bids</h3>
                      <p className="text-sm text-gray-600 font-medium">Track your applications</p>
                    </div>
                  </div>
                  <div className="mt-4 h-1 w-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-300"></div>
                </Link>

                <Link
                  href="/my-gigs"
                  className="p-8 rounded-2xl border-2 border-green-200 hover:border-green-400 bg-gradient-to-br from-green-50 via-white to-green-50 hover:from-green-100 hover:via-white hover:to-green-100 transition-all duration-500 group card-hover shadow-lg hover:shadow-2xl"
                >
                  <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 flex-shrink-0 inline-flex items-center justify-center shadow-xl">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-green-600 transition-colors">My Gigs</h3>
                      <p className="text-sm text-gray-600 font-medium">Manage your projects</p>
                    </div>
                  </div>
                  <div className="mt-4 h-1 w-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-300"></div>
                </Link>
              </div>
            </div>
          </div>
          <div>
            <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tips for Success</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Add clear, specific details in your gig descriptions (scope, timeline, deliverables).
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    When bidding, tailor your proposal: mention the client’s goal + your approach + a quick estimate.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Reply quickly and keep updates frequent—short check-ins build trust and win repeat work.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Start with smaller projects to build momentum, then increase your rate as you collect successful deliveries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}