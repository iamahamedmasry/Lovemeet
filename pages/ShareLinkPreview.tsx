import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, Clock, MapPin, ChevronRight, Mail, MessageCircle, Zap } from 'lucide-react';
import { DatePlanData } from '../types';

interface ShareLinkPreviewProps {
  planData: DatePlanData;
  onViewDetails: () => void;
  onRSVP?: (response: 'yes' | 'no' | 'maybe') => void;
  selectedResponse?: 'yes' | 'no' | 'maybe' | null;
  shareUrl?: string;
}

export const ShareLinkPreview: React.FC<ShareLinkPreviewProps> = ({ 
  planData, 
  onViewDetails,
  onRSVP,
  selectedResponse,
  shareUrl 
}) => {
  const [showShare, setShowShare] = useState(false);
  
  const dateObj = new Date(planData.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const daysDiff = Math.ceil((dateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const daysText = daysDiff > 0 ? `in ${daysDiff} days` : 'Today!';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <AnimatePresence mode="wait">
        {!showShare ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full max-w-md"
          >
            {/* Main Card */}
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-[3rem] blur-2xl" />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative glass-card rounded-[3rem] p-8 md:p-12 border border-white/80 shadow-2xl"
              >
                {/* Heart Animation */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="flex justify-center mb-8"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-rose-300 to-pink-300 rounded-full flex items-center justify-center shadow-lg">
                    <Heart className="w-12 h-12 text-white" fill="white" />
                  </div>
                </motion.div>

                {/* Header Text */}
                <h1 className="text-center text-3xl md:text-4xl font-black text-gray-900 mb-2">
                  💕 You're Invited! 💕
                </h1>
                {planData.creatorName && (
                  <p className="text-center text-rose-600 font-black text-lg mb-3">
                    From: <span className="text-pink-600">{planData.creatorName}</span>
                  </p>
                )}
                <p className="text-center text-gray-600 font-black uppercase text-[10px] tracking-[0.2em] mb-8">
                  To A Special Date
                </p>

                {/* Creator Message */}
                {planData.creatorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 p-5 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border-2 border-rose-200"
                  >
                    <p className="text-center text-gray-800 font-bold italic text-sm leading-relaxed">
                      "{planData.creatorMessage}"
                    </p>
                  </motion.div>
                )}

                {/* Details Grid */}
                <div className="space-y-6 mb-8">
                  {/* Date */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center space-x-4 p-4 bg-white/40 rounded-2xl border border-white/60"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-rose-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Date</p>
                      <p className="text-lg font-black text-gray-900">{formattedDate}</p>
                      <p className="text-xs font-bold text-rose-500">{daysText}</p>
                    </div>
                  </motion.div>

                  {/* Time */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center space-x-4 p-4 bg-white/40 rounded-2xl border border-white/60"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Time</p>
                      <p className="text-lg font-black text-gray-900">{planData.time}</p>
                      <p className="text-xs font-bold text-gray-500">See you then!</p>
                    </div>
                  </motion.div>

                  {/* Location */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center space-x-4 p-4 bg-white/40 rounded-2xl border border-white/60"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Location</p>
                      <p className="text-lg font-black text-gray-900">
                        {planData.city}
                        {planData.district && `, ${planData.district}`}
                      </p>
                      <p className="text-xs font-bold text-gray-500">{planData.country}</p>
                    </div>
                  </motion.div>
                </div>

                {/* RSVP Buttons */}
                <div className="mb-8">
                  <p className="text-center text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
                    Will you join? 💕
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onRSVP?.('yes')}
                      className={`py-3 px-2 rounded-xl font-black text-xs uppercase transition-all ${
                        selectedResponse === 'yes'
                          ? 'bg-green-500 text-white shadow-lg scale-105'
                          : 'bg-white/40 text-gray-700 border border-green-200 hover:bg-green-100'
                      }`}
                    >
                      ✅ YES!
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onRSVP?.('maybe')}
                      className={`py-3 px-2 rounded-xl font-black text-xs uppercase transition-all ${
                        selectedResponse === 'maybe'
                          ? 'bg-amber-500 text-white shadow-lg scale-105'
                          : 'bg-white/40 text-gray-700 border border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      🤔 MAYBE
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onRSVP?.('no')}
                      className={`py-3 px-2 rounded-xl font-black text-xs uppercase transition-all ${
                        selectedResponse === 'no'
                          ? 'bg-red-500 text-white shadow-lg scale-105'
                          : 'bg-white/40 text-gray-700 border border-red-200 hover:bg-red-100'
                      }`}
                    >
                      ❌ NO
                    </motion.button>
                  </div>
                  {selectedResponse && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-[10px] font-black text-rose-500 mt-3 uppercase"
                    >
                      {selectedResponse === 'yes' && '✨ Can\'t wait to see you!'}
                      {selectedResponse === 'maybe' && '⏳ Thanks for letting us know!'}
                      {selectedResponse === 'no' && '💔 We\'ll miss you!'}
                    </motion.p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(244,63,94,0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onViewDetails}
                    className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <span>View Full Details</span>
                    <ChevronRight size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowShare(true)}
                    className="w-full py-3 bg-white/60 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs border border-white/80 hover:bg-white/80 transition-all"
                  >
                    ↗️ Share This Invite
                  </motion.button>
                </div>

                {/* Footer Info */}
                <p className="text-center text-[10px] text-gray-500 font-bold mt-6">
                  ✨ Get ready for something special! ✨
                </p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* Share Options */
          <motion.div
            key="share"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full max-w-md"
          >
            <div className="glass-card rounded-[3rem] p-8 border border-white/80 shadow-2xl">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Share This Invite</h2>
              <p className="text-gray-600 font-bold text-sm mb-6">Send this to someone special!</p>

              <div className="space-y-3 mb-6">
                {/* WhatsApp */}
                <motion.a
                  whileHover={{ scale: 1.02, x: 5 }}
                  href={`https://wa.me/?text=${encodeURIComponent(`💕 You're invited to a special date! 💕\n\n${shareUrl || window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-2xl font-black hover:shadow-lg transition-all"
                >
                  <MessageCircle size={24} />
                  <span>WhatsApp</span>
                </motion.a>

                {/* Email */}
                <motion.a
                  whileHover={{ scale: 1.02, x: 5 }}
                  href={`mailto:?subject=💕 You're Invited to a Special Date!&body=${encodeURIComponent(`I'd love to spend time with you!\n\n${shareUrl || window.location.href}`)}`}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-2xl font-black hover:shadow-lg transition-all"
                >
                  <Mail size={24} />
                  <span>Email</span>
                </motion.a>

                {/* Copy Link */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl || window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                  className="w-full flex items-center justify-start space-x-3 p-4 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-2xl font-black hover:shadow-lg transition-all"
                >
                  <span>📋</span>
                  <span>Copy Link</span>
                </motion.button>
              </div>

              <motion.button
                onClick={() => setShowShare(false)}
                className="w-full py-3 bg-white/60 text-gray-900 rounded-2xl font-black uppercase text-xs border border-white/80"
              >
                ← Back
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareLinkPreview;
