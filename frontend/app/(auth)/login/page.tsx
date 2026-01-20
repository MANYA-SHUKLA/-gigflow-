'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back! Login successful.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pb-32 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center animate-fade-in">
          <Link href="/" className="inline-flex items-center space-x-3 mb-10 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-2xl">G</span>
              </div>
            </div>
            <span className="text-4xl font-extrabold gradient-text group-hover:scale-105 transition-transform duration-300">GigFlow</span>
          </Link>
          
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 animate-slide-up">
            Welcome Back
          </h2>
          <p className="text-xl text-gray-600 font-medium">
            Sign in to your account to continue your journey
          </p>
        </div>

        {/* Enhanced Form Card */}
        <div className="glass-card rounded-3xl shadow-2xl p-10 animate-fade-in border-2 border-white/30 relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-200/20 to-accent-200/20 rounded-full blur-3xl -z-10"></div>
          
          <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
            {/* Enhanced Email Input */}
            <div className="group">
              <label className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-600" />
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary-600 transition-colors">
                  <Mail className="h-6 w-6 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12 pr-4 text-lg py-4 border-2"
                  placeholder="shuklamanya99@gmail.com"
                />
              </div>
            </div>

            {/* Enhanced Password Input */}
            <div className="group">
              <label className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary-600" />
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary-600 transition-colors">
                  <Lock className="h-6 w-6 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 pr-12 text-lg py-4 border-2"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform"
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6 text-gray-400 hover:text-primary-600 transition-colors" />
                  ) : (
                    <Eye className="h-6 w-6 text-gray-400 hover:text-primary-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary group relative text-lg py-5 font-bold shadow-2xl hover:shadow-3xl"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                <LogIn className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
              </span>
              <span className="relative z-10">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Signing in...
                  </span>
                ) : (
                  'Sign in to your account'
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to GigFlow?</span>
              </div>
            </div>

            {/* Enhanced Sign Up Link */}
            <div className="mt-8 text-center">
              <Link
                href="/register"
                className="btn-secondary w-full inline-flex items-center justify-center group text-lg py-4 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-4 h-4 mr-2 text-primary-600 group-hover:rotate-12 transition-transform duration-300" />
                Create your free account
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            By signing in, you agree to our{' '}
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
              Terms of Service
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}