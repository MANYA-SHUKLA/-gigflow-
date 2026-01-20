'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase, Users, Rocket, Star, TrendingUp, Shield, Globe, Sparkles, Zap } from 'lucide-react';
import { useAuth } from './context/AuthContext';

export default function HomePage() {
  const { isAuthenticated, user, loading } = useAuth();

  const features = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Find Perfect Gigs",
      description: "Browse thousands of projects matching your skills and interests.",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect with Talent",
      description: "Work with top-rated freelancers from around the world.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payments",
      description: "Protected transactions with our secure payment system.",
      color: "from-green-500 to-emerald-400",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Access opportunities from clients worldwide.",
      color: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Freelancers" },
    { value: "100K+", label: "Projects Completed" },
    { value: "$10M+", label: "Paid to Freelancers" },
    { value: "95%", label: "Client Satisfaction" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
      </div>

      <section className="relative overflow-hidden py-20 md:py-32 z-10">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center space-x-3 mb-10 px-6 py-3 rounded-full bg-gradient-to-r from-primary-100 via-accent-100 to-primary-100 border-2 border-primary-200/50 shadow-xl backdrop-blur-md animate-slide-up group hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <Rocket className="w-6 h-6 text-primary-600 animate-bounce group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-primary-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
              </div>
              <span className="text-sm font-bold text-primary-700 tracking-wide">
                The Future of Freelancing is Here
              </span>
              <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
            </div>
            
            {/* Enhanced Hero Title */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-10 leading-[1.1] tracking-tight">
              <span className="block text-gray-900 animate-fade-in drop-shadow-lg" style={{ animationDelay: '0.1s' }}>
                Find Your
              </span>
              <span className="block gradient-text mt-4 animate-fade-in bg-clip-text" style={{ animationDelay: '0.2s' }}>
                Dream Freelance
              </span>
              <span className="block text-gray-900 mt-4 animate-fade-in drop-shadow-lg" style={{ animationDelay: '0.3s' }}>
                Opportunities
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto mb-14 leading-relaxed font-medium animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Connect with top talent or find amazing gigs. GigFlow brings clients and freelancers 
              together in a <span className="font-bold gradient-text">seamless, secure marketplace</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              {!loading && isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="btn-primary group inline-flex items-center justify-center text-lg px-12 py-6 shadow-2xl relative overflow-hidden"
                  >
                    <Sparkles className="absolute left-4 w-5 h-5 text-white/50 animate-pulse" />
                    <span className="relative z-10">Go to Dashboard{user?.name ? `, ${user.name}` : ''}</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                  </Link>
                  <Link 
                    href="/gigs" 
                    className="btn-secondary text-lg px-12 py-6 shadow-xl hover:shadow-2xl"
                  >
                    Browse Gigs
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/register" 
                    className="btn-primary group inline-flex items-center justify-center text-lg px-12 py-6 shadow-2xl relative overflow-hidden"
                  >
                    <Zap className="absolute left-4 w-5 h-5 text-white/50 animate-pulse" />
                    <span className="relative z-10">Get Started Free</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                  </Link>
                  <Link 
                    href="/login" 
                    className="btn-secondary text-lg px-12 py-6 shadow-xl hover:shadow-2xl"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/gigs" 
                    className="btn-secondary text-lg px-12 py-6 shadow-xl hover:shadow-2xl"
                  >
                    Browse Gigs
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20 relative z-20">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="glass-card p-8 rounded-3xl text-center card-hover group animate-fade-in"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-extrabold gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-gray-700 font-semibold text-sm md:text-base">
                  {stat.label}
                </div>
                <div className="mt-4 h-1 w-16 mx-auto bg-gradient-to-r from-primary-500 to-accent-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
              Why Choose <span className="gradient-text">GigFlow</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Experience the best freelance marketplace with features designed for success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass-card p-10 rounded-3xl card-hover group animate-fade-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                  <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-6 h-1 w-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {!loading && !isAuthenticated && (
        <section className="py-24 relative overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-100 via-accent-100 to-primary-100 bg-[length:200%_100%] animate-gradientShift z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3)_0%,transparent_70%)] z-0 pointer-events-none" />
          
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center space-x-2 mb-8 px-6 py-3 rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-primary-200">
                <Star className="w-6 h-6 text-yellow-500 animate-spin-slow" />
                <span className="text-sm font-bold text-gray-900">
                  Start Your Journey Today
                </span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-8">
                Ready to Transform Your Career?
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto mb-12 leading-relaxed">
                Join thousands of successful freelancers and clients who trust GigFlow 
                for their projects.
              </p>
               
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                 <Link
                   href="/register"
                   className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center group border-2 border-primary-200 hover:border-primary-400"
                 >
                   Join Now - It&apos;s Free
                   <TrendingUp className="ml-2 w-5 h-5 group-hover:translate-y-[-2px] transition-transform duration-300" />
                 </Link>
                 <Link
                   href="/gigs"
                   className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                 >
                   Browse Opportunities
                 </Link>
               </div>
            </div>
          </div>
        </section>
      )}

      {!loading && isAuthenticated && (
        <section className="py-24 relative overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-100 via-accent-100 to-primary-100 bg-[length:200%_100%] animate-gradientShift z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3)_0%,transparent_70%)] z-0 pointer-events-none" />
          
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center space-x-2 mb-8 px-6 py-3 rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-primary-200">
                <Rocket className="w-6 h-6 text-primary-600 animate-bounce" />
                <span className="text-sm font-bold text-gray-900">
                  Welcome back, {user?.name || 'User'}!
                </span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-8">
                Ready to Find Your Next Opportunity?
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto mb-12 leading-relaxed">
                Explore amazing gigs or post your own project. Your next success story starts here.
              </p>
               
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                 <Link
                   href="/gigs"
                   className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center group border-2 border-primary-200 hover:border-primary-400"
                 >
                   Browse All Gigs
                   <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                 </Link>
                 <Link
                   href="/gigs/create"
                   className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                 >
                   Post a Gig
                 </Link>
                 <Link
                   href="/dashboard"
                   className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center border-2 border-white/20 hover:border-white/40 drop-shadow-lg group"
                 >
                   <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Go to Dashboard</span>
                   <ArrowRight className="ml-2 w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group-hover:translate-x-1 transition-transform duration-300" />
                 </Link>
               </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}