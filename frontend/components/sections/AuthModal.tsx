'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, signup } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (loginTab: boolean) => {
    setIsLoginTab(loginTab);
    setFormErrors(null);
    setFormData({ username: '', email: '', password: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors(null);
    setIsSubmitting(true);

    try {
      if (isLoginTab) {
        if (!formData.email || !formData.password) {
          setFormErrors('Please fill in all fields');
          setIsSubmitting(false);
          return;
        }
        const res = await login(formData.email, formData.password);
        if (!res.success) {
          setFormErrors(res.error || 'Login failed');
        }
      } else {
        if (!formData.username || !formData.email || !formData.password) {
          setFormErrors('Please fill in all fields');
          setIsSubmitting(false);
          return;
        }
        const res = await signup(formData.username, formData.email, formData.password);
        if (!res.success) {
          setFormErrors(res.error || 'Signup failed');
        }
      }
    } catch (error) {
      setFormErrors('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
          >
            <X size={18} />
          </button>

          {/* Modal Header */}
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              {isLoginTab ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              {isLoginTab ? 'Sign in to access your stats and play daily' : 'Create an account to play competitive modes'}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800/80">
            <button
              onClick={() => handleTabChange(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
                isLoginTab ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              LOG IN
            </button>
            <button
              onClick={() => handleTabChange(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
                !isLoginTab ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              SIGN UP
            </button>
          </div>

          {/* Error Message */}
          {formErrors && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-medium"
            >
              {formErrors}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginTab && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block pl-1">
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your trainer username"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-purple-500 focus:outline-none rounded-xl text-sm text-white placeholder-slate-600 transition-all duration-300"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block pl-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:outline-none rounded-xl text-sm text-white placeholder-slate-600 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block pl-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 focus:outline-none rounded-xl text-sm text-white placeholder-slate-600 transition-all duration-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 mt-2 rounded-xl text-white font-extrabold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                isLoginTab
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/10'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-purple-500/10'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : isLoginTab ? (
                'LOG IN'
              ) : (
                'SIGN UP'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
