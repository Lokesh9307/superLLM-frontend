"use client";
import { signIn } from "next-auth/react";
import '../../globals.css';
import Google from '@/public/icons/google.svg';
import GitHub from '@/public/icons/github.svg';
import Image from "next/image";
import { useState } from "react";

export default function SignInPage() {
   const [isHovering, setIsHovering] = useState('');
  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-violet-600/30 to-purple-600/30 rounded-full filter blur-3xl animate-pulse opacity-70"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 rounded-full filter blur-3xl animate-pulse opacity-70" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-gradient-to-r from-pink-600/20 to-rose-600/20 rounded-full filter blur-3xl animate-pulse opacity-50" style={{ animationDelay: '4s' }}></div>

        {/* Floating dots */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        {/* Main card with elegant design */}
        <div className="relative bg-gray-950/60 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-gray-800/50">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>

          {/* Header */}
          <div className="relative text-center mb-8">
            {/* Welcome text */}
            <div className="mb-6">
              <h1 className="text-4xl font-light text-white mb-2 tracking-wide">
                Welcome
              </h1>
              <div className="w-16 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 mx-auto mb-4 rounded-full"></div>
              <p className="text-gray-400 text-sm font-light">
                Sign in to continue to your account
              </p>
            </div>
          </div>

          {/* Login buttons */}
          <div className="space-y-4">
            {/* Google Button */}
            <button
              onClick={() => signIn("google")}
              onMouseEnter={() => setIsHovering('google')}
              onMouseLeave={() => setIsHovering('')}
              className="w-full group relative bg-gray-900/50 hover:bg-gray-900/80 border border-gray-700/50 hover:border-gray-600 rounded-2xl p-4 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-white/5"
            >
              <div className="flex items-center justify-center gap-4">
                {/* Google Icon with colorful design */}
                <div className="relative">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  {/* Glow effect on hover */}
                  {isHovering === 'google' && (
                    <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <div className="text-white font-medium text-lg">Continue with Google</div>
                  <div className="text-gray-400 text-sm">Sign in using your Google account</div>
                </div>

                {/* Arrow */}
                <div className={`transition-all duration-300 ${isHovering === 'google' ? 'translate-x-1' : ''}`}>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Elegant divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              </div>
              <div className="relative bg-black px-6">
                <span className="text-gray-500 text-sm font-light">or</span>
              </div>
            </div>

            {/* GitHub Button */}
            <button
              onClick={() => signIn("github")}
              onMouseEnter={() => setIsHovering('github')}
              onMouseLeave={() => setIsHovering('')}
              className="w-full group relative bg-gray-900/50 hover:bg-gray-900/80 border border-gray-700/50 hover:border-gray-600 rounded-2xl p-4 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-white/5"
            >
              <div className="flex items-center justify-center gap-4">
                {/* GitHub Icon with colorful design */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center shadow-lg border border-gray-700">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  {/* Glow effect on hover */}
                  {isHovering === 'github' && (
                    <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse"></div>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <div className="text-white font-medium text-lg">Continue with GitHub</div>
                  <div className="text-gray-400 text-sm">Sign in using your GitHub account</div>
                </div>

                {/* Arrow */}
                <div className={`transition-all duration-300 ${isHovering === 'github' ? 'translate-x-1' : ''}`}>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Security badge */}
          <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-xs">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secured with end-to-end encryption</span>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs leading-relaxed">
              By continuing, you agree to our{' '}
              <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors duration-200 underline decoration-violet-400/30">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors duration-200 underline decoration-violet-400/30">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
