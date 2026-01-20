'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Globe, Linkedin, Github, MessageCircle, Sparkles, Code, Rocket } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full z-30 shadow-2xl mt-auto">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 bg-[length:200%_100%] animate-gradientShift"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15)_0%,transparent_70%)]"></div>
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-gray-900/40"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
      <div className="absolute top-0 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/30 rounded-xl blur-lg group-hover:opacity-75 transition-opacity"></div>
                <img src="/logo-g.svg" alt="GigFlow" className="w-12 h-12 relative z-10 rounded-xl group-hover:scale-110 transition-transform duration-300 brightness-0 invert" />
              </div>
              <span className="text-2xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">GigFlow</span>
            </div>
            <p className="text-white text-sm mb-4 leading-relaxed font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              Connect talented freelancers with amazing opportunities. Building the future of remote work.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-white text-xs font-bold">
              <Code className="w-4 h-4 text-yellow-300 drop-shadow-lg" />
              <span className="drop-shadow-sm">Built with Next.js & Express</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg mb-5 flex items-center justify-center md:justify-start gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              <Rocket className="w-5 h-5 text-yellow-300 drop-shadow-lg" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/gigs" className="text-white hover:text-yellow-200 transition-all duration-300 text-sm font-bold flex items-center justify-center md:justify-start gap-3 group py-2 px-3 rounded-lg hover:bg-white/20 backdrop-blur-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                  <span className="w-2.5 h-2.5 bg-yellow-300 rounded-full group-hover:bg-yellow-200 group-hover:scale-150 transition-all duration-300 shadow-lg"></span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Browse Gigs</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-white hover:text-yellow-200 transition-all duration-300 text-sm font-bold flex items-center justify-center md:justify-start gap-3 group py-2 px-3 rounded-lg hover:bg-white/20 backdrop-blur-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                  <span className="w-2.5 h-2.5 bg-yellow-300 rounded-full group-hover:bg-yellow-200 group-hover:scale-150 transition-all duration-300 shadow-lg"></span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/gigs/create" className="text-white hover:text-yellow-200 transition-all duration-300 text-sm font-bold flex items-center justify-center md:justify-start gap-3 group py-2 px-3 rounded-lg hover:bg-white/20 backdrop-blur-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                  <span className="w-2.5 h-2.5 bg-yellow-300 rounded-full group-hover:bg-yellow-200 group-hover:scale-150 transition-all duration-300 shadow-lg"></span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Post a Gig</span>
                </Link>
              </li>
              <li>
                <a href="http://localhost:5001/api-docs" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-200 transition-all duration-300 text-sm font-bold flex items-center justify-center md:justify-start gap-3 group py-2 px-3 rounded-lg hover:bg-white/20 backdrop-blur-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                  <span className="w-2.5 h-2.5 bg-yellow-300 rounded-full group-hover:bg-yellow-200 group-hover:scale-150 transition-all duration-300 shadow-lg"></span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">API Documentation</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg mb-5 flex items-center justify-center md:justify-start gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              <Mail className="w-5 h-5 text-yellow-300 drop-shadow-lg" />
              Connect
            </h3>
            <div className="space-y-4 mb-6">
              <a 
                href="mailto:shuklamanya99@gmail.com" 
                className="text-white hover:text-yellow-200 transition-all duration-300 text-sm font-bold flex items-center justify-center md:justify-start gap-3 group py-2.5 px-4 rounded-lg hover:bg-white/20 border-2 border-white/30 hover:border-yellow-300/70 backdrop-blur-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 group-hover:text-yellow-300 transition-all duration-300 drop-shadow-lg" />
                <span className="break-all drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">shuklamanya99@gmail.com</span>
              </a>
              <div className="flex items-center justify-center md:justify-start gap-2 text-white text-sm font-bold px-4 py-2.5 rounded-lg bg-white/15 border-2 border-white/30 backdrop-blur-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse drop-shadow-lg" />
                <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Available for opportunities</span>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              <a
                href="https://manya-shukla.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center hover:scale-110 hover:rotate-6"
                title="Portfolio"
              >
                <Globe className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <a
                href="https://www.linkedin.com/in/manya-shukla99/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 rounded-xl bg-white/10 hover:bg-blue-500/30 backdrop-blur-sm border border-white/20 hover:border-blue-400/50 transition-all duration-300 flex items-center justify-center hover:scale-110 hover:rotate-6"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <a
                href="https://github.com/MANYA-SHUKLA"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 rounded-xl bg-white/10 hover:bg-gray-800/50 backdrop-blur-sm border border-white/20 hover:border-gray-300/50 transition-all duration-300 flex items-center justify-center hover:scale-110 hover:rotate-6"
                title="GitHub"
              >
                <Github className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-800/0 to-gray-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <a
                href="https://wa.me/8005586588"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 rounded-xl bg-white/10 hover:bg-green-500/30 backdrop-blur-sm border border-white/20 hover:border-green-400/50 transition-all duration-300 flex items-center justify-center hover:scale-110 hover:rotate-6"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/0 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Bar */}
        <div className="border-t-2 border-white/40 pt-6 mt-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-white text-sm font-bold flex-wrap justify-center sm:justify-start drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              <span className="flex items-center gap-2">
                <span>Made with</span>
                <Heart className="w-5 h-5 text-red-400 animate-pulse fill-red-400 drop-shadow-lg" />
                <span>by</span>
              </span>
              <span className="font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-base">
                Manya Shukla
              </span>
              <span className="text-white drop-shadow-sm">© {currentYear}</span>
            </div>

            <div className="flex items-center gap-4 text-white text-xs font-bold flex-wrap justify-center sm:justify-end drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/30">
                <Code className="w-4 h-4" />
                Full Stack Developer
              </span>
              <span className="hidden sm:inline text-white/70">•</span>
              <span className="hidden sm:inline px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/30">Open to Opportunities</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}