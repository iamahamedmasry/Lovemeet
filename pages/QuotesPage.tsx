
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, RefreshCw, Heart, Quote as QuoteIcon, Timer, Edit3, Check } from 'lucide-react';
import { QUOTES } from '../constants';
import { Quote, Language } from '../types';
import { shareToMultiplePlatforms } from '../utils/shareUtils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownSection = () => {
  const [eventName, setEventName] = useState(() => localStorage.getItem('lovemeeet_event_name') || "Valentine's Day");
  const [targetDate, setTargetDate] = useState(() => {
    const saved = localStorage.getItem('lovemeeet_target_date');
    if (saved) return saved;
    
    // Default to next Valentine's Day
    const now = new Date();
    let vDay = new Date(now.getFullYear(), 1, 14);
    if (now > vDay) vDay = new Date(now.getFullYear() + 1, 1, 14);
    return vDay.toISOString().split('T')[0];
  });

  const [isEditing, setIsEditing] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleSave = () => {
    localStorage.setItem('lovemeeet_event_name', eventName);
    localStorage.setItem('lovemeeet_target_date', targetDate);
    setIsEditing(false);
  };

  const resetToValentines = () => {
    const now = new Date();
    let vDay = new Date(now.getFullYear(), 1, 14);
    if (now > vDay) vDay = new Date(now.getFullYear() + 1, 1, 14);
    const dateStr = vDay.toISOString().split('T')[0];
    setEventName("Valentine's Day");
    setTargetDate(dateStr);
    localStorage.setItem('lovemeeet_event_name', "Valentine's Day");
    localStorage.setItem('lovemeeet_target_date', dateStr);
    setIsEditing(false);
  };

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <motion.div 
        key={value}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-16 h-16 md:w-24 md:h-24 glass-card rounded-full flex items-center justify-center mb-2 border-white/80 shadow-rose-100 shadow-xl"
      >
        <span className="text-xl md:text-3xl font-black text-rose-600">{value.toString().padStart(2, '0')}</span>
      </motion.div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</span>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mb-16 px-4"
    >
      <div className="glass-card p-8 md:p-12 rounded-[3rem] border-white/70 relative overflow-hidden text-center">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Timer size={120} className="text-rose-500" />
        </div>

        <div className="flex justify-center items-center space-x-3 mb-8">
          <Heart className="text-rose-500 fill-rose-500" size={16} />
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col md:flex-row items-center gap-4 z-10"
              >
                <input 
                  type="text" 
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="bg-white/40 border-2 border-white rounded-xl px-4 py-2 outline-none focus:border-rose-300 font-black text-rose-600 text-sm uppercase tracking-widest text-center"
                  placeholder="Event Name"
                />
                <input 
                  type="date" 
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="bg-white/40 border-2 border-white rounded-xl px-4 py-2 outline-none focus:border-rose-300 font-black text-rose-600 text-sm uppercase tracking-widest text-center"
                />
                <div className="flex space-x-2">
                  <button onClick={handleSave} className="p-2 bg-green-500 text-white rounded-lg hover:scale-110 transition-transform"><Check size={18}/></button>
                  <button onClick={resetToValentines} className="p-2 bg-gray-500 text-white rounded-lg hover:scale-110 transition-transform text-[10px] font-black uppercase tracking-tighter">Reset</button>
                </div>
              </motion.div>
            ) : (
              <motion.h3 
                key={eventName}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm md:text-xl font-black text-gray-800 uppercase tracking-[0.3em]"
              >
                {eventName} <span className="text-rose-500">In</span>
              </motion.h3>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 hover:bg-rose-50 rounded-full transition-colors group"
          >
            <Edit3 size={16} className="text-gray-300 group-hover:text-rose-400" />
          </button>
        </div>

        <div className="flex justify-center space-x-4 md:space-x-10">
          <TimeUnit value={timeLeft.days} label="Days" />
          <TimeUnit value={timeLeft.hours} label="Hrs" />
          <TimeUnit value={timeLeft.minutes} label="Min" />
          <TimeUnit value={timeLeft.seconds} label="Sec" />
        </div>

        {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="mt-8 text-rose-500 font-black uppercase tracking-[0.4em] text-lg animate-bounce"
          >
            The moment has arrived! ❤️
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const QuotesPage: React.FC = () => {
  const [lang, setLang] = useState<Language>('english');
  const [currentQuote, setCurrentQuote] = useState<Quote>(QUOTES[0]);
  const [isCopied, setIsCopied] = useState(false);

  const filterQuotes = QUOTES.filter(q => q.language === lang);

  const generateNewQuote = () => {
    const available = filterQuotes.filter(q => q.id !== currentQuote.id);
    const next = available[Math.floor(Math.random() * available.length)] || filterQuotes[0];
    setCurrentQuote(next);
  };

  useEffect(() => {
    generateNewQuote();
  }, [lang]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`"${currentQuote.quote}" - ${currentQuote.author || 'Unknown'}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-4">
      {/* Countdown Hero Section */}
      <CountdownSection />

      <div className="max-w-2xl w-full mx-auto">
        {/* Language Tabs */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex glass-card p-1.5 rounded-2xl shadow-lg mb-10 max-w-sm mx-auto border border-white/60"
        >
          {(['english', 'tamil', 'sinhala'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                lang === l 
                ? 'bg-rose-500 text-white shadow-xl scale-100' 
                : 'text-gray-500 hover:text-rose-400 hover:bg-white/30 scale-95'
              }`}
            >
              {l}
            </button>
          ))}
        </motion.div>

        {/* Quote Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.id}
            initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -30, rotateX: -10 }}
            transition={{ type: "spring", damping: 15 }}
            className="glass-card p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden text-center group border border-white/80"
          >
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-200/10 to-pink-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-1000">
              <QuoteIcon size={180} className="text-rose-500" />
            </div>
            
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                filter: ["drop-shadow(0 0 0px #f43f5e)", "drop-shadow(0 0 15px #f43f5e)", "drop-shadow(0 0 0px #f43f5e)"]
              }} 
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="inline-flex items-center justify-center mb-8 w-16 h-16 rounded-full bg-white/50 text-rose-500 shadow-inner border border-white/40"
            >
              <Heart fill="currentColor" size={32} />
            </motion.div>

            <h2 className={`text-2xl md:text-4xl font-black text-gray-800 mb-8 leading-[1.4] tracking-tight ${
              lang === 'english' ? 'font-serif italic' : ''
            }`}>
              {currentQuote.quote}
            </h2>
            
            <div className="flex items-center justify-center space-x-3 mb-12">
              <div className="h-px w-8 bg-rose-200" />
              <p className="text-rose-400 font-black uppercase tracking-[0.2em] text-[10px]">
                {currentQuote.author || 'Silent Heart'}
              </p>
              <div className="h-px w-8 bg-rose-200" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5">
              <motion.button
                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px -10px rgba(244,63,94,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={generateNewQuote}
                className="flex items-center space-x-3 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 bg-[length:200%_auto] animate-gradient text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-xl"
              >
                <RefreshCw size={18} className="animate-spin-slow" />
                <span>Next Inspiration</span>
              </motion.button>
              
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.9)', rotate: -5 }}
                  onClick={copyToClipboard}
                  className="p-4 bg-white/60 text-rose-500 rounded-full transition-all shadow-sm relative group border border-white/80"
                >
                  <AnimatePresence>
                    {isCopied && (
                      <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: -45 }}
                        exit={{ opacity: 0, y: -60 }}
                        className="absolute left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-3 rounded-full font-bold uppercase tracking-tighter"
                      >
                        Copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <Copy size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.9)', rotate: 5 }}
                  className="p-4 bg-white/60 text-rose-500 rounded-full transition-all shadow-sm border border-white/80"
                  onClick={() => {
                    const shareText = `"${currentQuote.quote}" - ${currentQuote.author || 'Unknown'}\n\nDiscover love on lovemeeet 💕`;
                    shareToMultiplePlatforms(shareText);
                  }}
                >
                  <Share2 size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuotesPage;
