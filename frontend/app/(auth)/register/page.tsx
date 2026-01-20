'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, Check, Sparkles, ArrowLeft, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Account created successfully! Welcome to GigFlow.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { label: 'At least 6 characters', met: formData.password.length >= 6 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'Contains number', met: /\d/.test(formData.password) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pb-32 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12 animate-fade-in">
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
            Start Your Journey
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 font-medium">
            Join thousands of freelancers and clients on GigFlow
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Enhanced Form Card */}
          <div className="glass-card rounded-3xl shadow-2xl p-10 animate-slide-up border-2 border-white/30 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary-200/30 to-accent-200/30 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full blur-2xl -z-10"></div>
            
            <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
              {/* Enhanced Name Input */}
              <div className="group">
                <label className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-600" />
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary-600 transition-colors">
                    <User className="h-6 w-6 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field pl-12 pr-4 text-lg py-4 border-2"
                    placeholder="Manya Shukla"
                  />
                </div>
              </div>

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
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-12 pr-12 text-lg py-4 border-2"
                    placeholder="Create a password"
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

              {/* Enhanced Confirm Password */}
              <div className="group">
                <label className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary-600" />
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field text-lg py-4 border-2"
                  placeholder="Confirm your password"
                />
              </div>

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary mt-8 text-lg py-5 font-bold shadow-2xl hover:shadow-3xl relative overflow-hidden"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating Account...
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Create Account
                    <span className="text-2xl">✨</span>
                  </span>
                )}
              </button>

              {/* Enhanced Login Link */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  Already have an account?
                </p>
                <Link
                  href="/login"
                  className="btn-secondary w-full inline-flex items-center justify-center group text-lg py-4 shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  Sign in here
                </Link>
              </div>
            </form>
          </div>

          {/* Enhanced Password Requirements & Benefits */}
          <div className="space-y-8">
            {/* Enhanced Password Requirements */}
            <div className="glass-card rounded-3xl p-8 border-2 border-white/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-2xl -z-10"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary-600" />
                Password Requirements
              </h3>
              <div className="space-y-4">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-4 group">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                      req.met 
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg scale-110' 
                        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                    }`}>
                      {req.met && <Check className="w-4 h-4" />}
                    </div>
                    <span className={`text-base font-medium transition-colors duration-300 ${
                      req.met ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Benefits */}
            <div className="glass-card rounded-3xl p-8 border-2 border-white/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-primary-200/20 to-accent-200/20 rounded-full blur-2xl -z-10"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 animate-pulse" />
                Why Join GigFlow?
              </h3>
              <div className="space-y-5">
                <div className="flex items-start space-x-4 group hover:scale-105 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Free to Join</h4>
                    <p className="text-sm text-gray-600">No upfront costs or hidden fees</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group hover:scale-105 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Secure Platform</h4>
                    <p className="text-sm text-gray-600">Protected payments and data</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group hover:scale-105 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Global Opportunities</h4>
                    <p className="text-sm text-gray-600">Work with clients worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="text-center text-sm text-gray-600">
              <p>
                By creating an account, you agree to our{' '}
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Terms of Service
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}