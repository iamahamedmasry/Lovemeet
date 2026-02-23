
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Calendar, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { getShareLinkData, getShareDataFromUrl } from '../services/shareLink';
import { ShareLinkPreview } from './ShareLinkPreview';
import { DatePlanData } from '../types';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

const RecipientView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [planData, setPlanData] = useState<DatePlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<'yes' | 'no' | 'maybe' | null>(null);

  useEffect(() => {
    if (id) {
      // First, try to get data from URL (for sharing with other people)
      let data = getShareDataFromUrl();
      
      // If not in URL, try localStorage (for local access)
      if (!data) {
        data = getShareLinkData(id);
      }
      
      // Load saved response if exists
      if (data) {
        const savedResponses = JSON.parse(localStorage.getItem(`lovemeet_responses_${id}`) || '{}');
        if (savedResponses.response) {
          setSelectedResponse(savedResponses.response);
          data.response = savedResponses.response;
          data.responseReceivedAt = savedResponses.responseReceivedAt;
        }
      }
      
      setPlanData(data);
      setLoading(false);
    }
  }, [id]);

  const handleRSVP = (response: 'yes' | 'no' | 'maybe') => {
    if (!id) return;
    
    setSelectedResponse(response);
    
    // Save response to localStorage
    const responseData = {
      response,
      responseReceivedAt: Date.now(),
      respondent: 'Anonymous'
    };
    localStorage.setItem(`lovemeet_responses_${id}`, JSON.stringify(responseData));
    
    // Update plan data
    if (planData) {
      setPlanData({
        ...planData,
        response,
        responseReceivedAt: Date.now()
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
          <Heart className="text-rose-500" size={48} fill="currentColor" />
        </motion.div>
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center relative z-10 px-8 py-12 glass-card rounded-[3rem] max-w-2xl border border-white/60"
        >
          <Heart className="mx-auto text-rose-300 animate-pulse mb-4" size={64} fill="currentColor" />
          <h1 className="text-4xl font-black text-gray-800 mb-4">Link Not Found</h1>
          <p className="text-gray-500 font-bold mb-6">This date plan might have expired or been deleted.</p>
          <a
            href="/#/"
            className="inline-block px-12 py-4 bg-rose-500 text-white rounded-full font-black hover:bg-rose-600 transition-all"
          >
            ← Go Back Home
          </a>
        </motion.div>
      </div>
    );
  }

  // Show preview card first, then full details on button click
  if (!showFullDetails) {
    return (
      <ShareLinkPreview 
        planData={planData}
        onViewDetails={() => setShowFullDetails(true)}
        onRSVP={handleRSVP}
        selectedResponse={selectedResponse}
        shareUrl={window.location.href}
      />
    );
  }

  const dateObj = new Date(planData.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 flex justify-center">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-3xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-block mb-6"
          >
            <Heart className="text-rose-500 w-16 h-16" fill="currentColor" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-800 mb-4 font-romantic">
            Someone Special Has a <span className="text-rose-500">Date Planned</span> For You! 💕
          </h1>
          {planData.creatorName && (
            <p className="text-rose-600 font-black text-2xl mb-4">
              From: <span className="text-pink-600">{planData.creatorName}</span>
            </p>
          )}
          <p className="text-gray-500 font-black uppercase text-[10px] tracking-[0.3em]">
            Here are the beautiful details...
          </p>
        </div>

        {/* Creator Message */}
        {planData.creatorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-[2rem] p-8 border-2 border-rose-200 mb-8 shadow-lg bg-gradient-to-br from-rose-50 to-pink-50"
          >
            <p className="text-center text-gray-800 font-bold text-lg italic leading-relaxed">
              "{planData.creatorMessage}"
            </p>
          </motion.div>
        )}

        {/* RSVP Status */}
        {selectedResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className={`text-center p-4 rounded-2xl mb-8 font-black uppercase text-sm ${
              selectedResponse === 'yes'
                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                : selectedResponse === 'maybe'
                ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                : 'bg-red-100 text-red-700 border-2 border-red-300'
            }`}
          >
            {selectedResponse === 'yes' && '✅ You Said YES! Can\'t wait to see you!'}
            {selectedResponse === 'maybe' && '🤔 You Said MAYBE. Let us know soon!'}
            {selectedResponse === 'no' && '❌ You Said NO. We\'ll miss you! 💔'}
          </motion.div>
        )}

        {/* Date & Time Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-[2rem] p-8 border border-white/80 mb-8 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center">
              <span className="text-4xl mr-4">📅</span>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                <p className="text-2xl font-black text-gray-800">{formattedDate}</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-4xl mr-4">🕖</span>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</p>
                <p className="text-2xl font-black text-gray-800">{planData.time}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Location Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-[2rem] p-8 border border-white/80 mb-8 shadow-2xl overflow-hidden"
        >
          <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center">
            <span className="mr-3 text-3xl">📍</span> LOCATION
          </h2>

          {/* Map */}
          <div className="w-full h-80 rounded-2xl border-4 border-white/80 shadow-lg overflow-hidden mb-6">
            <MapContainer
              center={[planData.latitude, planData.longitude]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <Marker position={[planData.latitude, planData.longitude]} />
            </MapContainer>
          </div>

          {/* Address Details */}
          <div className="glass-card p-6 rounded-2xl bg-white/60 space-y-4">
            {planData.addressLine1 && (
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address Line 1</p>
                <p className="text-lg font-bold text-gray-800">{planData.addressLine1}</p>
              </div>
            )}
            {planData.addressLine2 && (
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address Line 2</p>
                <p className="text-gray-600 font-bold">{planData.addressLine2}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {planData.city && (
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">City</p>
                  <p className="font-bold text-gray-700">{planData.city}</p>
                </div>
              )}
              {planData.district && (
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">District</p>
                  <p className="font-bold text-gray-700">{planData.district}</p>
                </div>
              )}
            </div>
            {planData.postalCode && (
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Postal Code</p>
                <p className="font-bold text-gray-700">{planData.postalCode}</p>
              </div>
            )}
            {planData.country && (
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Country</p>
                <p className="font-bold text-gray-700">{planData.country}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-gray-600 font-black uppercase text-[10px] tracking-widest mb-4">
            This special moment just for you! ✨💕
          </p>
          <a
            href="/#/"
            className="inline-block px-12 py-4 bg-rose-500 text-white rounded-full font-black text-lg hover:bg-rose-600 shadow-xl transition-all transform hover:scale-105"
          >
            Back to Home
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RecipientView;
