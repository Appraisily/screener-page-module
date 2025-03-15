import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Calendar, Search, Stamp, DollarSign, Mail, ArrowRight, Loader2, Star, CheckCircle } from 'lucide-react';
import { useValueEstimation } from '../hooks/useValueEstimation';
import { validateEmail } from '../utils/validation';
import { cn } from '../lib/utils';
import type { DetailedAnalysis } from '../types';
import AuctionResults from './AuctionResults';

interface ServicePanelsProps {
  analysis: DetailedAnalysis;
  sessionId: string;
  onEmailSubmit: (email: string) => Promise<boolean>;
  hasEmailBeenSubmitted: boolean;
  className?: string;
}

export default function ServicePanels({ 
  analysis, 
  sessionId, 
  onEmailSubmit, 
  hasEmailBeenSubmitted,
  className 
}: ServicePanelsProps) {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isCalculatingValue, setIsCalculatingValue] = React.useState(false);
  const [showAuctionResults, setShowAuctionResults] = React.useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = React.useState(0);

  const loadingMessages = [
    'Initializing database...',
    'Searching auction records...',
    'Analyzing market trends...',
    'Calculating value range...',
    'Preparing final estimate...'
  ];

  // Rotate loading messages
  React.useEffect(() => {
    if (!isCalculatingValue) {
      setLoadingMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex(current => 
        current < loadingMessages.length - 1 ? current + 1 : current
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isCalculatingValue]);

  const {
    getValueEstimation,
    isLoading: isLoadingValue,
    result: valueResult,
    error: valueError
  } = useValueEstimation(import.meta.env.VITE_API_URL);

  const handleGetValueEstimation = useCallback(async () => {
    if (!sessionId) return;
    setIsCalculatingValue(true);
    try {
      await getValueEstimation(sessionId);
      setShowAuctionResults(true);
    } finally {
      setIsCalculatingValue(false);
    }
  }, [sessionId, getValueEstimation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (!sessionId) {
        throw new Error('Session ID is missing. Please try again.');
      }

      const success = await onEmailSubmit(email);
      
      if (success) {
        setIsSubmitted(true);
        setEmail('');
      } else {
        throw new Error('Failed to submit email. Please try again.');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      id: 'maker',
      name: 'Maker Analysis',
      mainText: analysis.maker_analysis.creator_name,
      description: analysis.maker_analysis.reasoning,
      icon: User,
      gradient: 'from-blue-500/20 via-indigo-500/10 to-blue-600/20'
    },
    {
      id: 'origin',
      name: 'Origin Analysis',
      mainText: analysis.origin_analysis.likely_origin,
      description: analysis.origin_analysis.reasoning,
      icon: MapPin,
      gradient: 'from-emerald-500/20 via-teal-500/10 to-emerald-600/20'
    },
    {
      id: 'age',
      name: 'Age Analysis',
      mainText: analysis.age_analysis.estimated_date_range,
      description: analysis.age_analysis.reasoning,
      icon: Calendar,
      gradient: 'from-amber-500/20 via-orange-500/10 to-amber-600/20'
    },
    {
      id: 'marks',
      name: 'Marks Recognition',
      mainText: analysis.marks_recognition.marks_identified,
      description: analysis.marks_recognition.interpretation,
      icon: Stamp,
      gradient: 'from-purple-500/20 via-fuchsia-500/10 to-purple-600/20'
    },
    {
      id: 'visual',
      name: 'Visual Search',
      mainText: analysis.visual_search.similar_artworks,
      description: analysis.visual_search.notes,
      icon: Search,
      gradient: 'from-rose-500/20 via-pink-500/10 to-rose-600/20'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const renderServicePanel = (service: typeof services[0]) => {
    const IconComponent = service.icon;
    
    return (
      <motion.div
        key={service.id}
        variants={item}
        className="group relative overflow-hidden transform transition-all duration-500 hover:scale-[1.02]"
      >
        <div className="relative bg-white backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-sm 
                     border border-gray-100/50 hover:border-gray-200/50 transition-all duration-500
                     hover:shadow-xl group-hover:-translate-y-1">
          <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]",
            service.gradient
          )} />
          
          <div className="relative flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center
                         group-hover:scale-110 group-hover:rotate-3 transition-all duration-500
                         shadow-sm group-hover:shadow-md">
              <IconComponent className="w-6 h-6 text-gray-600 group-hover:text-gray-900 
                                    transition-colors duration-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-900
                          transition-colors duration-500">
                {service.name}
              </h3>
              <div className="h-0.5 w-0 group-hover:w-full bg-gray-900/10 
                          transition-all duration-500" />
            </div>
          </div>
          
          <div className="relative space-y-4">
            <p className="text-3xl font-bold text-gray-900 leading-tight
                       group-hover:text-gray-900 transition-colors duration-500
                       [text-wrap:balance]">
              {service.mainText}
            </p>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed
                       group-hover:text-gray-700 transition-colors duration-500
                       [text-wrap:pretty]">
              {service.description}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderValueAssessment = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-16 bg-gradient-to-br from-[#007bff]/10 via-[#007bff]/5 to-[#007bff]/20 
                 rounded-2xl p-8 lg:p-10 border border-[#007bff]/20 relative overflow-hidden 
                 space-y-8 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-500"
    >
      <div className="flex items-start gap-8">
        <div className="w-20 h-20 rounded-2xl bg-[#007bff]/20 flex items-center justify-center flex-shrink-0
                       shadow-inner transition-shadow duration-500 relative">
          <DollarSign className="w-8 h-8 text-[#007bff]" />
          {!hasEmailBeenSubmitted && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#007bff] rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3 [text-wrap:balance]">
              Preliminary Value Assessment
            </h3>
            {valueResult ? (
              <div className="space-y-4">
                <div className="text-4xl font-bold bg-clip-text text-transparent 
                               bg-gradient-to-r from-[#007bff] to-blue-600 flex items-baseline gap-2">
                  <span>
                    ${valueResult.minValue.toLocaleString()} - ${valueResult.maxValue.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-600 font-normal">USD</span>
                </div>
                <div className="flex items-center gap-2 text-lg text-gray-700">
                  <span>Most likely value:</span>
                  <span className="font-semibold">${valueResult.mostLikelyValue.toLocaleString()}</span>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-gray-700">{valueResult.explanation}</p>
                </div>
                {showAuctionResults && valueResult.auctionResults && (
                  <AuctionResults results={valueResult.auctionResults} />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleGetValueEstimation}
                  disabled={isCalculatingValue}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#007bff] text-white 
                           rounded-lg hover:bg-[#007bff]/90 transition-colors duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculatingValue ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {loadingMessages[loadingMessageIndex]}
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-5 h-5" />
                      Get Value Estimate
                    </>
                  )}
                </button>
                {valueError && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-sm text-red-600">{valueError}</p>
                  </div>
                )}
              </div>
            )}
            {hasEmailBeenSubmitted && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Full report will be emailed to you</span>
              </div>
            )}
          </div>
          <p className="text-lg text-gray-600 [text-wrap:pretty]">
            {valueResult && hasEmailBeenSubmitted 
              ? 'Based on our initial analysis, your item shows significant value potential. Your detailed valuation report with market comparables and expert insights is being prepared.'
              : 'Unlock the hidden potential of your artwork! Our initial review suggests that your piece could be worth much more than you think. Claim your FREE, in-depth valuation report—complete with market comparables, expert insights, and exclusive details about your artwork—by simply entering your email below. Discover the true value of your masterpiece today!'}
          </p>
          
          {!hasEmailBeenSubmitted && !isSubmitted && (
            <div className="mt-6 bg-[#007bff]/5 rounded-xl p-6 border border-[#007bff]/10">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#007bff]" />
                Get Your Free Report
              </h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      error ? 'border-red-300' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:border-transparent
                      placeholder:text-gray-400 text-gray-900`}
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 
                           bg-[#007bff] text-white rounded-lg font-semibold
                           hover:bg-[#007bff]/90 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Get Free Report
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-[#007bff] hover:underline">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-[#007bff] hover:underline">Privacy Policy</a>.
                  {' '}No credit card required.
                </p>
              </form>
            </div>
          )}
          
          {isSubmitted && (
            <div className="mt-6 bg-green-50 rounded-lg p-6 border border-green-100">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-green-800">Report Requested!</h4>
                  <p className="text-sm text-green-700">
                    Your complete valuation report is being prepared.
                    <br />
                    We'll email it to you in the next few minutes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={cn("space-y-12", className)}>
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
        variants={container}
        initial="hidden"
        animate="show"
        viewport={{ once: true }}
      >
        {services.map(renderServicePanel)}
      </motion.div>
      {renderValueAssessment()}
    </div>
  );
}