'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Menu, X, Bell, User, LogOut, Award, XCircle, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { notifications, markAsRead, clearAllNotifications, unreadCount } = useSocket();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="glass-card sticky top-0 z-50 w-full border-b border-white/20 shadow-lg backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-3">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img src="/logo-g.svg" alt="GigFlow logo" className="w-12 h-12 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-extrabold gradient-text group-hover:scale-105 transition-transform duration-300">GigFlow</span>
            </Link>
          </div>


          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                <Link href="/gigs" className="nav-link">
                  Browse Gigs
                </Link>
                <Link href="/my-gigs" className="nav-link">
                  My Gigs
                </Link>
                <Link href="/my-bids" className="nav-link">
                  My Bids
                </Link>
                

                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-3 rounded-xl hover:bg-gradient-to-br hover:from-primary-50 hover:to-accent-50 transition-all duration-300 group shadow-md hover:shadow-lg"
                  >
                    <Bell className="w-6 h-6 text-gray-700 group-hover:text-primary-600 transition-all duration-300 group-hover:scale-110" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-96 glass-card rounded-3xl shadow-2xl border border-white/30 py-2 z-50 animate-fade-in backdrop-blur-xl">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-gray-900">Notifications</h3>
                          <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                              <button
                                onClick={() => {
                                  notifications.forEach(n => markAsRead(n.id));
                                }}
                                className="text-sm text-primary-600 hover:text-primary-700"
                              >
                                Mark all read
                              </button>
                            )}
                            <button
                              onClick={clearAllNotifications}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              Clear all
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                                !notification.read ? 'bg-blue-50/50' : ''
                              }`}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  notification.type === 'hired'
                                    ? 'bg-gradient-to-r from-green-100 to-green-200'
                                    : notification.type === 'rejected'
                                    ? 'bg-gradient-to-r from-gray-100 to-gray-200'
                                    : 'bg-gradient-to-r from-blue-100 to-blue-200'
                                }`}>
                                  {notification.type === 'hired' ? (
                                    <Award className="w-5 h-5 text-green-600" />
                                  ) : notification.type === 'rejected' ? (
                                    <XCircle className="w-5 h-5 text-gray-600" />
                                  ) : (
                                    <Bell className="w-5 h-5 text-blue-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900 mb-1">{notification.message}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">
                                      {new Date(notification.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                    {!notification.read && (
                                      <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                                    )}
                                  </div>
                                  {notification.gigId && (
                                    <Link
                                      href={`/gigs/${notification.gigId}`}
                                      className="text-xs text-primary-600 hover:text-primary-700 mt-1 inline-block"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      View Gig →
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No notifications</p>
                            <p className="text-sm text-gray-400 mt-1">
                              You&apos;ll see notifications here
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                        <Link
                          href="/my-bids"
                          className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center justify-center"
                        >
                          View all notifications
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 shadow-md">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-accent-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-800">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-5 py-2.5 text-gray-700 hover:text-white rounded-xl hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-black">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="nav-link text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/gigs"
                    className="nav-link text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Browse Gigs
                  </Link>
                  <Link
                    href="/my-gigs"
                    className="nav-link text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Gigs
                  </Link>
                  <Link
                    href="/my-bids"
                    className="nav-link text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bids
                  </Link>
                  {notifications.length > 0 && (
                    <div className="px-4 py-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Notifications:</span>
                        <span className="badge badge-info">{notifications.length}</span>
                      </div>
                    </div>
                  )}
                  <div className="px-4 py-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">{user?.name}</span>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="btn-secondary w-full text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary text-black w-full text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;