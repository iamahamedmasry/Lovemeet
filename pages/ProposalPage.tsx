
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Wand2, Share2, Heart, CheckCircle, Layout } from 'lucide-react';
import { ThemeType } from '../types';
import { generateLoveMessage } from '../services/gemini';

const ProposalPage: React.FC = () => {
  const [formData, setFormData] = useState({
    crushName: '',
    senderName: '',
    message: '',
    theme: 'cute' as ThemeType,
    revealOption: 'after_yes'
  });
  
  const [loading, setLoading] = useState(false);
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [recipientPhone, setRecipientPhone] = useState('');

  const handleGenerateAI = async (mood: string) => {
    setLoading(true);
    const msg = await generateLoveMessage(mood, formData.crushName, formData.theme);
    setFormData({ ...formData, message: msg });
    setLoading(false);
  };

  const createProposal = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const proposal = {
      ...formData,
      id,
      createdAt: Date.now(),
      response: null
    };

    const saved = JSON.parse(localStorage.getItem('lovemeeet_proposals') || '[]');
    localStorage.setItem('lovemeeet_proposals', JSON.stringify([...saved, proposal]));
    
    setProposalId(id);
  };

  if (proposalId) {
    const shareUrl = `${window.location.origin}/#/proposal/${proposalId}`;
    
    const handleWhatsAppShare = () => {
      if (!recipientPhone.trim()) {
        alert('Please enter a WhatsApp number');
        return;
      }
      
      const phoneNumber = recipientPhone.replace(/\D/g, '');
      
      // Romantic proposal message with crush name
      const message = `My heart keeps typing your name, ${formData.crushName} 💕

I really can't wait to tell you everything on WhatsApp 😘

So tell me…
Is it going to be a sweet Yes? 😍
Or should I prepare for a dangerous No? 🙈💘`;
      
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    };

    return (
      <div className="min-h-screen pt-32 pb-12 px-4 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          className="max-w-md w-full glass-card p-10 rounded-[3rem] shadow-2xl border border-white text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-green-400 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100"
          >
            <CheckCircle size={48} />
          </motion.div>
          <h2 className="text-4xl font-black text-gray-800 mb-4 tracking-tighter">Sent with Love!</h2>
          <p className="text-gray-500 mb-10 font-medium">Your secret message is ready to share! 💕</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">WhatsApp Number</label>
              <input 
                type="tel"
                placeholder="+94 XX XXX XXXX"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="w-full p-5 bg-white/60 rounded-2xl border-2 border-white/80 focus:border-green-400 outline-none text-lg font-black text-gray-700 text-center placeholder:text-gray-400"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWhatsAppShare}
              className="w-full py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2 uppercase tracking-[0.2em]"
            >
              <Share2 size={20} /> <span>Send via WhatsApp</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setProposalId(null);
                setRecipientPhone('');
              }}
              className="w-full py-3 bg-gray-200 text-gray-800 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
            >
              Create Another
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Form */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="glass-card p-10 rounded-[3rem] shadow-2xl border border-white/80"
        >
          <h2 className="text-4xl font-black text-gray-800 mb-10 flex items-center font-romantic">
            <Send className="mr-4 text-rose-500" size={36} /> The Confession
          </h2>

          <div className="space-y-8">
            <div className="group">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Crush's Name</label>
              <input 
                value={formData.crushName}
                onChange={(e) => setFormData({ ...formData, crushName: e.target.value })}
                className="w-full p-5 bg-white/40 rounded-2xl border-2 border-white/80 focus:border-rose-300 outline-none font-bold text-gray-700 transition-all placeholder:text-gray-300 shadow-sm"
                placeholder="Ex. My Dearest..."
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-3 ml-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Message</label>
                <div className="flex space-x-2">
                  {(['shy', 'romantic', 'funny']).map(mood => (
                    <motion.button
                      key={mood}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={loading}
                      onClick={() => handleGenerateAI(mood)}
                      className="text-[9px] bg-white/80 text-rose-500 px-3 py-1.5 rounded-full font-black uppercase tracking-widest border border-rose-100 shadow-sm hover:bg-rose-500 hover:text-white transition-all disabled:opacity-20"
                    >
                      {mood}
                    </motion.button>
                  ))}
                </div>
              </div>
              <textarea 
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-6 bg-white/40 rounded-3xl border-2 border-white/80 focus:border-rose-300 outline-none resize-none font-bold text-gray-700 transition-all placeholder:text-gray-300 shadow-sm leading-relaxed"
                placeholder="Pour your magic into words..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Styling Theme</label>
              <div className="grid grid-cols-4 gap-3">
                {(['cute', 'romantic', 'funny', 'minimal'] as ThemeType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setFormData({ ...formData, theme: t })}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                      formData.theme === t 
                      ? 'bg-gray-900 border-gray-900 text-white shadow-xl' 
                      : 'border-white bg-white/40 text-gray-500 hover:border-rose-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={createProposal}
              disabled={!formData.message}
              className="w-full py-6 bg-gradient-to-r from-rose-500 to-pink-500 disabled:opacity-30 text-white rounded-[2rem] font-black text-xl shadow-2xl transition-all flex items-center justify-center uppercase tracking-[0.2em]"
            >
              Cast the Spell <Wand2 className="ml-3" />
            </motion.button>
          </div>
        </motion.div>

        {/* Right Preview */}
        <div className="sticky top-40 hidden lg:flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-8 bg-white/40 px-6 py-2 rounded-full border border-white/60">
            <Layout size={16} className="text-gray-400" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Live Projection</span>
          </div>
          
          <motion.div 
            layout
            className={`w-full aspect-[3/4] max-w-sm rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden ${
              formData.theme === 'romantic' ? 'bg-gradient-to-br from-[#1a0b0e] via-[#3d0a11] to-[#1a0b0e] text-rose-100 font-romantic' :
              formData.theme === 'funny' ? 'bg-[#ffd60a] text-[#003566] font-cute' :
              formData.theme === 'minimal' ? 'bg-white text-gray-800 border-[12px] border-gray-50' :
              'bg-[#ffe5ec] text-[#ff0a54] font-cute'
            }`}
          >
            {/* Animated BG for preview */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-[150%] h-[150%] absolute -top-[25%] -left-[25%] border-[1px] border-current border-dashed rounded-full" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={formData.theme}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-6xl mb-10 z-10"
                >
                    {formData.theme === 'cute' && "🧸"}
                    {formData.theme === 'romantic' && "🌹"}
                    {formData.theme === 'funny' && "🎈"}
                    {formData.theme === 'minimal' && "🤍"}
                </motion.div>
            </AnimatePresence>
            
            <h3 className="text-3xl font-black mb-6 z-10 leading-tight">
              Dearest {formData.crushName || "___"}
            </h3>
            <p className="text-lg italic opacity-80 leading-relaxed z-10 line-clamp-6">
              "{formData.message || "Your message will illuminate this space once you begin to write..."}"
            </p>
            
            <div className="mt-12 flex space-x-4 z-10 opacity-30">
              <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">Y</div>
              <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">N</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProposalPage;
