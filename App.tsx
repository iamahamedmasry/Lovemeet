
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Quote as QuoteIcon, Calendar, Send, History, Menu, X, Linkedin, Github, User } from 'lucide-react';
import QuotesPage from './pages/QuotesPage';
import DatePlannerPage from './pages/DatePlannerPage';
import ProposalPage from './pages/ProposalPage';
import RecipientView from './pages/RecipientView';

const BackgroundBlobs = () => (
  <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
    <motion.div
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -50, 100, 0],
        scale: [1, 1.2, 0.9, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="mesh-blob w-[500px] h-[500px] bg-rose-200 top-[-10%] left-[-10%]"
    />
    <motion.div
      animate={{
        x: [0, -80, 120, 0],
        y: [0, 150, -60, 0],
        scale: [1, 0.8, 1.1, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="mesh-blob w-[600px] h-[600px] bg-pink-300 bottom-[-20%] right-[-10%]"
    />
    <motion.div
      animate={{
        x: [0, 50, -100, 0],
        y: [0, -100, 50, 0],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      className="mesh-blob w-[400px] h-[400px] bg-amber-100 top-[40%] left-[30%]"
    />
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{ duration: 15, repeat: Infinity }}
      className="mesh-blob w-[700px] h-[700px] bg-violet-200 top-[-20%] right-[10%]"
    />
  </div>
);

const Footer = () => (
  <footer className="w-full py-12 px-4 relative z-10">
    <div className="max-w-4xl mx-auto glass-card rounded-3xl p-8 border border-white/60 flex flex-col md:flex-row items-center justify-between shadow-xl">
      <div className="text-center md:text-left mb-6 md:mb-0">
        <p className="text-rose-500 font-black tracking-widest text-[10px] uppercase mb-1">
          Crafted with Passion
        </p>
        <p className="text-gray-700 font-bold text-lg">
          © 2026 DESIGNED BY <span className="bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent font-black uppercase">Ahamed Masry</span>
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {[
          { icon: <Linkedin size={20} />, href: 'https://www.linkedin.com/in/ahamedmasry-cs/', color: 'hover:text-blue-600' },
          { icon: <Github size={20} />, href: 'https://github.com/iamahamedmasry', color: 'hover:text-gray-900' },
          { icon: <User size={20} />, href: 'https://iamahamedmasry.github.io/Portfolio/', color: 'hover:text-rose-600' }
        ].map((social, i) => (
          <motion.a
            key={i}
            whileHover={{ scale: 1.15, y: -4, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 bg-white/40 rounded-2xl flex items-center justify-center text-gray-500 transition-all shadow-sm border border-white ${social.color}`}
          >
            {social.icon}
          </motion.a>
        ))}
      </div>
    </div>
  </footer>
);

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Quotes', icon: <QuoteIcon size={20} /> },
    { path: '/date-planner', label: 'Planner', icon: <Calendar size={20} /> },
    { path: '/propose', label: 'AI Love', icon: <Heart size={20} /> },
    { path: '/history', label: 'Past', icon: <History size={20} /> },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50 glass-nav rounded-2xl shadow-xl px-6 py-3 border border-white/50">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <motion.div whileHover={{ scale: 1.2, rotate: 15 }}>
            <Heart className="text-rose-500 fill-rose-500" />
          </motion.div>
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent font-romantic">
            lovemeeet
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-2"
              >
                <div className={`flex items-center space-x-1 transition-all duration-300 relative z-10 ${
                  isActive ? 'text-rose-600' : 'text-gray-500 hover:text-rose-400'
                }`}>
                  {item.icon}
                  <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/60 rounded-xl shadow-sm border border-white/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-rose-500 p-2 bg-white/40 rounded-lg transition-transform active:scale-90">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden absolute top-full left-0 right-0 mt-4 glass-card rounded-2xl overflow-hidden shadow-2xl p-4 border border-white/40"
          >
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${
                    location.pathname === item.path ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-700 hover:bg-white/40'
                  }`}
                >
                  {item.icon}
                  <span className="font-bold">{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HistoryPage = () => {
  const [proposals, setProposals] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('lovemeeet_proposals');
    if (saved) setProposals(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-gray-800 mb-8 flex items-center font-romantic"
        >
          <History className="mr-3 text-rose-500" size={32} /> Your Love Archive
        </motion.h1>
        {proposals.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-20 glass-card rounded-3xl border border-white/80 shadow-2xl"
          >
            <Heart className="mx-auto text-rose-200 mb-6 animate-pulse" size={64} />
            <p className="text-gray-500 text-xl font-medium">No stories captured yet...</p>
            <Link to="/propose" className="mt-6 inline-block px-10 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-bold shadow-lg hover:shadow-rose-200 transition-all active:scale-95">
              Write a Chapter
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {proposals.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 rounded-3xl relative group overflow-hidden border border-white/60"
              >
                <div className="absolute top-0 right-0 p-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm ${
                    p.response === 'yes' ? 'bg-green-400 text-white' : 
                    p.response === 'no' ? 'bg-rose-400 text-white' : 'bg-blue-400 text-white'
                  }`}>
                    {p.response || 'Awaiting'}
                  </span>
                </div>
                <h3 className="text-xl font-black text-rose-600 mb-3 font-cute">To: {p.crushName || 'Someone Dear'}</h3>
                <p className="text-gray-600 line-clamp-2 mb-6 italic text-sm leading-relaxed">"{p.message}"</p>
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                  <span>Created {new Date(p.createdAt).toLocaleDateString()}</span>
                  <Link to={`/proposal/${p.id}`} className="text-rose-500 hover:text-rose-700 bg-white/60 px-3 py-1 rounded-lg transition-colors border border-rose-100">Open Link</Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen font-sans text-gray-900 selection:bg-rose-200 relative flex flex-col">
        <BackgroundBlobs />
        <Navigation />
        <main className="relative z-10 flex-grow">
          <Routes>
            <Route path="/" element={<QuotesPage />} />
            <Route path="/date-planner" element={<DatePlannerPage />} />
            <Route path="/propose" element={<ProposalPage />} />
            <Route path="/share/:id" element={<RecipientView />} />
            <Route path="/proposal/:id" element={<RecipientView />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
        
        <Footer />
        
        {/* Floating Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: '100vh', x: Math.random() * 100 + 'vw', opacity: 0 }}
              animate={{ 
                y: '-20vh', 
                opacity: [0, 0.4, 0],
                rotate: [0, 90, -90, 0],
                scale: [1, 1.2, 0.8, 1]
              }}
              transition={{ 
                duration: 15 + Math.random() * 15, 
                repeat: Infinity, 
                delay: Math.random() * 20,
                ease: "linear"
              }}
              className="absolute text-rose-300/30"
            >
              <Heart size={15 + Math.random() * 30} fill="currentColor" />
            </motion.div>
          ))}
        </div>
      </div>
    </Router>
  );
};

export default App;
