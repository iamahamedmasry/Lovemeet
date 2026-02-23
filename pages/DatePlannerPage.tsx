import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, ChevronLeft, MapPin, Calendar, Share2, Sparkles, Copy, Check, Zap } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { SRI_LANKA_DISTRICTS } from '../constants';
import { createShareLink, getShareUrl, generateWhatsAppShareLink, generateEmailShareLink } from '../services/shareLink';
import { shareToMultiplePlatforms } from '../utils/shareUtils';
import { DatePlanData } from '../types';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Colombo area locations for quick search
const COLOMBO_LOCATIONS = [
  { name: 'Colombo City Centre', lat: 6.9271, lng: 80.7789 },
  { name: 'Galle Face Green', lat: 6.8294, lng: 80.7622 },
  { name: 'Mount Lavinia Beach', lat: 6.8487, lng: 80.7692 },
  { name: 'Kandy City', lat: 6.9271, lng: 80.6369 },
  { name: 'Negombo Beach', lat: 7.2087, lng: 79.8396 },
  { name: 'Colombo Fort', lat: 6.9367, lng: 80.8242 },
];

const DatePlannerPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [noButtonPos, setNoButtonPos] = useState({ top: 'auto', left: 'auto' });
  const [noCount, setNoCount] = useState(0);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [locationMode, setLocationMode] = useState<'custom' | 'pin' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(COLOMBO_LOCATIONS);

  const [formData, setFormData] = useState({
    creatorName: '',
    creatorMessage: '',
    date: '',
    time: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Colombo',
    district: '',
    postalCode: '',
    country: 'Sri Lanka',
    latitude: 6.9271,
    longitude: 80.7789,
  });

  const [shareLink, setShareLink] = useState('');
  const [uniqueId, setUniqueId] = useState('');

  const moveNoButton = () => {
    const maxX = window.innerWidth - 150;
    const maxY = window.innerHeight - 80;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    setNoButtonPos({ top: `${newY}px`, left: `${newX}px` });
    setNoCount(prev => prev + 1);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = COLOMBO_LOCATIONS.filter(loc =>
        loc.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(COLOMBO_LOCATIONS);
    }
  };

  const selectQuickLocation = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    setLocationMode(null);
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleShare = () => {
    const planData: DatePlanData = {
      id: '',
      creatorName: formData.creatorName,
      creatorMessage: formData.creatorMessage,
      date: formData.date,
      time: formData.time,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      district: formData.district,
      postalCode: formData.postalCode,
      country: formData.country,
      latitude: formData.latitude,
      longitude: formData.longitude,
      venues: [],
      createdAt: Date.now(),
    };

    const id = createShareLink(planData);
    setUniqueId(id);
    // Pass planData to embed it in the URL for recipients
    const url = getShareUrl(id, planData);
    setShareLink(url);
  };

  const handleBack = () => {
    if (locationMode) {
      setLocationMode(null);
    } else {
      setStep(prev => prev - 1);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  const openShare = async () => {
    const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'https://lovemeeet.netlify.app';
    const date = new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    // Share text with proper UTF-8 emoji support - no manual encoding needed
    const shareText = `💕 A Special Date Invitation 💕\n\n📅 Date: ${date}\n🕖 Time: ${formData.time}\n📍 Location: ${formData.city}\n\n✨ Created on ${websiteUrl}\n\n${shareLink}`;
    await shareToMultiplePlatforms(shareText, shareLink);
  };

  const openEmail = () => {
    const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'https://lovemeeet.netlify.app';
    const date = new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const subject = encodeURIComponent('💕 You\'re Invited to A Special Date 💕');
    const body = encodeURIComponent(
      `Hi!\n\n💕 I've planned something special for us! 💕\n\nDate: ${date}\nTime: ${formData.time}\nLocation: ${formData.city}\n\nView the complete details here:\n${shareLink}\n\n✨ Created on ${websiteUrl}\n\nI can't wait to see you!\n❤️`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleShareToSocial = async () => {
    openShare();
  };

  if (step === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center relative z-10 px-8 py-12 glass-card rounded-[3rem] max-w-2xl border border-white/60"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="mb-8 inline-block"
          >
            <Sparkles className="text-rose-500 w-16 h-16" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-800 mb-6 font-romantic leading-tight">
            Will You Go On A <span className="text-rose-500">Date</span> With Me?
          </h1>
          <p className="text-gray-500 mb-12 font-black uppercase text-[10px] tracking-[0.3em] text-center">Select your answer below</p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <motion.button
              whileHover={{ scale: 1.1, boxShadow: "0 0 40px rgba(244,63,94,0.4)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setStep(1)}
              className="px-16 py-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-2xl font-black shadow-2xl transition-all"
            >
              YES! ❤️
            </motion.button>

            <button
              onMouseEnter={moveNoButton}
              onClick={moveNoButton}
              style={{
                position: noButtonPos.top === 'auto' ? 'static' : 'fixed',
                top: noButtonPos.top,
                left: noButtonPos.left,
                transition: 'all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: `scale(${Math.max(0.4, 1 - noCount * 0.04)})`,
                zIndex: 100
              }}
              className="px-10 py-4 glass-card bg-white/80 text-gray-400 rounded-full text-lg font-black shadow-lg border-rose-100"
            >
              No 💔
            </button>
          </div>

          {noCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 text-rose-500 font-black italic animate-pulse uppercase text-[10px] tracking-widest"
            >
              {noCount > 10 ? "Fine, I see how it is! 😤" : "You missed! Try again? 😉"}
            </motion.p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-36 pb-20 px-4 flex justify-center">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-3xl w-full glass-card rounded-[3rem] shadow-2xl p-8 md:p-12 border border-white/70 flex flex-col"
      >
        {/* Progress Bar */}
        <div className="w-full bg-white/30 h-2 rounded-full mb-10 relative overflow-hidden border border-white/10">
          <motion.div
            className="bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 h-full rounded-full"
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="flex-grow">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                <h2 className="text-3xl font-black text-gray-800 mb-8 uppercase tracking-tight text-center">
                  👤 LET'S INTRODUCE YOURSELF
                </h2>
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-4">Your Name</label>
                    <div className="p-4 glass-card rounded-[2rem] bg-white/60">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={formData.creatorName}
                        onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
                        className="w-full p-4 bg-transparent outline-none text-lg font-bold text-rose-600 placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-4">Personal Message</label>
                    <div className="p-4 glass-card rounded-[2rem] bg-white/60">
                      <textarea
                        placeholder="Write a special message for them..."
                        value={formData.creatorMessage}
                        onChange={(e) => setFormData({ ...formData, creatorMessage: e.target.value })}
                        rows={4}
                        className="w-full p-4 bg-transparent outline-none text-lg font-bold text-gray-700 placeholder-gray-400 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s1" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                <h2 className="text-3xl font-black text-gray-800 mb-8 flex items-center uppercase tracking-tight">
                  <Calendar className="mr-3 text-rose-500" size={32} /> THE PERFECT DATE
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-4 flex items-center">Selection Date</label>
                    <div className="p-4 glass-card rounded-[2rem] bg-white/60">
                      <input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full p-4 bg-transparent outline-none text-xl font-black text-rose-600 text-center cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-4 flex items-center">Perfect Time</label>
                    <div className="p-4 glass-card rounded-[2rem] bg-white/60">
                      <input 
                        type="time" 
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full p-4 bg-transparent outline-none text-xl font-black text-rose-600 text-center cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && !locationMode && (
              <motion.div key="s2-choice" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                <h2 className="text-3xl font-black text-gray-800 mb-10 flex items-center uppercase tracking-tight justify-center text-center">
                  <span className="mr-2">📍</span> SELECT LOCATION
                </h2>
                <p className="text-gray-600 mb-10 text-center font-bold">Choose how to set your date location</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Custom Location Button */}
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(244,63,94,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLocationMode('custom')}
                    className="p-8 glass-card rounded-[2rem] border-2 border-rose-300 bg-white/60 hover:bg-white/80 transition-all"
                  >
                    <div className="text-5xl mb-4">🎯</div>
                    <h3 className="text-2xl font-black text-gray-800 mb-2">CUSTOM LOCATION</h3>
                    <p className="text-sm text-gray-600 font-bold">Enter detailed address</p>
                  </motion.button>

                  {/* Pin Location Button */}
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(244,63,94,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLocationMode('pin')}
                    className="p-8 glass-card rounded-[2rem] border-2 border-pink-300 bg-white/60 hover:bg-white/80 transition-all"
                  >
                    <div className="text-5xl mb-4">📍</div>
                    <h3 className="text-2xl font-black text-gray-800 mb-2">PIN LOCATION</h3>
                    <p className="text-sm text-gray-600 font-bold">Fast Colombo area search</p>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 3 && locationMode === 'custom' && (
              <motion.div key="s2-custom" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                <h2 className="text-3xl font-black text-gray-800 mb-8 flex items-center uppercase tracking-tight">
                  <MapPin className="mr-3 text-rose-500" size={32} /> 🎯 CUSTOM ADDRESS
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Address Line 1 *</label>
                    <input
                      type="text"
                      placeholder="Street address"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      className="w-full p-4 glass-card rounded-2xl outline-none font-bold text-gray-700 bg-white/50 focus:border-rose-400 border-2 border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Address Line 2</label>
                    <input
                      type="text"
                      placeholder="Apartment, suite, etc. (optional)"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                      className="w-full p-4 glass-card rounded-2xl outline-none font-bold text-gray-700 bg-white/50 focus:border-rose-400 border-2 border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">City *</label>
                      <input
                        type="text"
                        placeholder="Colombo"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full p-4 glass-card rounded-2xl outline-none font-bold text-gray-700 bg-white/50 focus:border-rose-400 border-2 border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">District</label>
                      <input
                        type="text"
                        placeholder="Optional"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full p-4 glass-card rounded-2xl outline-none font-bold text-gray-700 bg-white/50 focus:border-rose-400 border-2 border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Postal Code</label>
                      <input
                        type="text"
                        placeholder="00100"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full p-4 glass-card rounded-2xl outline-none font-bold text-gray-700 bg-white/50 focus:border-rose-400 border-2 border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        disabled
                        className="w-full p-4 glass-card rounded-2xl outline-none font-bold text-gray-500 bg-white/30"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && locationMode === 'pin' && (
              <motion.div key="s2-pin" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                <h2 className="text-3xl font-black text-gray-800 mb-8 flex items-center uppercase tracking-tight">
                  <Zap className="mr-3 text-rose-500" size={32} /> 📍 FAST LOCATION SEARCH
                </h2>
                
                <div className="mb-6">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Search Colombo Area</label>
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full p-4 glass-card rounded-2xl outline-none font-bold text-gray-700 bg-white/50 focus:border-rose-400 border-2 border-transparent"
                  />
                </div>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {filteredLocations.map((loc, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectQuickLocation(loc.lat, loc.lng)}
                      className="w-full p-4 glass-card rounded-2xl bg-white/60 text-left font-bold text-gray-700 hover:bg-white/80 border-2 border-transparent hover:border-rose-300 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📍</span>
                        <div>
                          <div className="font-black text-gray-800">{loc.name}</div>
                          <div className="text-xs text-gray-500">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <p className="text-center text-gray-600 font-bold mb-8">Or click on the map below to pin exact location</p>

                <div className="w-full h-96 rounded-3xl border-4 border-white/80 shadow-lg overflow-hidden">
                  <MapContainer
                    center={[formData.latitude, formData.longitude]}
                    zoom={11}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    <Marker position={[formData.latitude, formData.longitude]} />
                    <MapClickHandler onLocationSelect={handleLocationSelect} />
                  </MapContainer>
                </div>

                <div className="glass-card p-4 rounded-2xl bg-white/60 mt-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Coordinates</p>
                  <p className="text-gray-700 font-bold text-center">
                    {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                  </p>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Sparkles size={36} />
                </div>
                <h2 className="text-4xl font-black text-gray-800 mb-2 uppercase tracking-tighter">💕 QUICK SHARE 💕</h2>
                <p className="text-gray-600 font-bold mb-8">Share your special date plan</p>

                {shareLink ? (
                  <div className="space-y-6">
                    {/* Share Details Preview */}
                    <div className="glass-card p-6 rounded-[2rem] border border-white/90 bg-gradient-to-br from-white/80 to-pink-50/50">
                      <p className="text-gray-500 mb-4 font-black uppercase tracking-widest text-[10px]">📋 Share Details</p>
                      <div className="space-y-3 text-left">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📅</span>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase">Date</p>
                            <p className="font-black text-gray-800">{new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🕖</span>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase">Time</p>
                            <p className="font-black text-gray-800">{formData.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📍</span>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase">Location</p>
                            <p className="font-black text-gray-800">{formData.city}{formData.district ? `, ${formData.district}` : ''}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Share Link */}
                    <div className="glass-card p-6 rounded-[2rem] border border-white/90">
                      <p className="text-gray-500 mb-4 font-black uppercase tracking-widest text-[10px]">🔗 Your Unique Share Link</p>
                      <div className="flex items-center gap-2 p-4 bg-white/40 rounded-2xl border-2 border-white/50">
                        <input
                          type="text"
                          value={shareLink}
                          readOnly
                          className="flex-1 bg-transparent outline-none font-mono text-sm text-gray-700 font-bold"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={copyToClipboard}
                          className="p-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all"
                        >
                          {copiedShareLink ? <Check size={20} /> : <Copy size={20} />}
                        </motion.button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-3 uppercase tracking-widest">
                        {copiedShareLink ? '✓ Copied to clipboard!' : 'Click to copy & share'}
                      </p>
                    </div>

                    {/* Share Buttons */}
                    <div>
                      <p className="text-gray-500 mb-4 font-black uppercase tracking-widest text-[10px]">📤 Share With Love</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleShareToSocial}
                          className="py-5 px-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-[1.5rem] font-black text-lg shadow-lg flex items-center justify-center hover:from-rose-600 hover:to-pink-600 transition-all"
                        >
                          📤 Share To All Social Media
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={openEmail}
                          className="py-5 px-6 bg-blue-500 text-white rounded-[1.5rem] font-black text-lg shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all"
                        >
                          💌 Email
                        </motion.button>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setStep(1);
                        setLocationMode(null);
                        setShareLink('');
                        setFormData({
                          date: '',
                          time: '',
                          addressLine1: '',
                          addressLine2: '',
                          city: 'Colombo',
                          district: '',
                          postalCode: '',
                          country: 'Sri Lanka',
                          latitude: 6.9271,
                          longitude: 80.7789,
                        });
                      }}
                      className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-[2rem] font-black text-sm shadow-lg uppercase tracking-[0.2em]"
                    >
                      ✨ CREATE ANOTHER
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="w-full py-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-[2rem] font-black text-lg shadow-lg flex items-center justify-center uppercase tracking-[0.2em]"
                  >
                    <Share2 className="mr-3" size={24} /> GENERATE SHARE LINK 💕
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
        <div className="mt-12 flex justify-between items-center px-2">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center text-gray-400 hover:text-gray-600 font-black uppercase text-[10px] tracking-[0.2em] transition-all"
            >
              <ChevronLeft className="mr-1" size={14} /> BACK
            </button>
          )}
          {step < 4 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.creatorName)) ||
                (step === 2 && (!formData.date || !formData.time)) ||
                (step === 3 && !locationMode)
              }
              className={`ml-auto flex items-center px-12 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-lg transition-all ${
                (step === 0 ||
                  (step === 1 && formData.creatorName) ||
                  (step === 2 && formData.date && formData.time) ||
                  (step === 3 && locationMode)
                ) ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed'
              }`}
            >
              CONTINUE <ChevronRight className="ml-2" size={14} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DatePlannerPage;
