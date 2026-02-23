import { DatePlanData, ShareLink } from '../types';

// Encode data to base64 for URL embedding
const encodeDataToURL = (data: DatePlanData): string => {
  try {
    const json = JSON.stringify(data);
    return btoa(json); // Base64 encode
  } catch (err) {
    console.error('Error encoding data:', err);
    return '';
  }
};

// Decode data from base64 URL
const decodeDataFromURL = (encoded: string): DatePlanData | null => {
  try {
    const json = atob(encoded); // Base64 decode
    return JSON.parse(json);
  } catch (err) {
    console.error('Error decoding data:', err);
    return null;
  }
};

// Generate unique ID
const generateUniqueId = (): string => {
  return 'share_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Save proposal and return unique link
export const createShareLink = (planData: DatePlanData): string => {
  const uniqueId = generateUniqueId();
  const shareLink: ShareLink = {
    unique_id: uniqueId,
    plan_data: {
      ...planData,
      id: uniqueId,
      createdAt: Date.now()
    },
    created_at: Date.now()
  };

  // Save to localStorage (for local history/backup)
  const existingLinks = JSON.parse(localStorage.getItem('lovemeet_shares') || '{}');
  existingLinks[uniqueId] = shareLink;
  localStorage.setItem('lovemeet_shares', JSON.stringify(existingLinks));

  return uniqueId;
};

// Retrieve proposal by unique ID (from localStorage for sender's history)
export const getShareLinkData = (uniqueId: string): DatePlanData | null => {
  const shares = JSON.parse(localStorage.getItem('lovemeet_shares') || '{}');
  return shares[uniqueId]?.plan_data || null;
};

// Get all proposals (for admin/history)
export const getAllShareLinks = (): ShareLink[] => {
  const shares = JSON.parse(localStorage.getItem('lovemeet_shares') || '{}');
  return Object.values(shares);
};

// Delete a proposal (optional)
export const deleteShareLink = (uniqueId: string): boolean => {
  const shares = JSON.parse(localStorage.getItem('lovemeet_shares') || '{}');
  if (shares[uniqueId]) {
    delete shares[uniqueId];
    localStorage.setItem('lovemeet_shares', JSON.stringify(shares));
    return true;
  }
  return false;
};

/**
 * Generate share URLs with embedded data
 * The data is encoded directly in the URL so recipients don't need backend access
 */
export const getShareUrl = (uniqueId: string, planData?: DatePlanData): string => {
  const baseUrl = window.location.origin;
  
  // If planData is provided, embed it in the URL for recipients
  if (planData) {
    const encoded = encodeDataToURL(planData);
    return `${baseUrl}/#/share/${uniqueId}?data=${encoded}`;
  }
  
  // Fallback to localStorage lookup (for backward compatibility)
  return `${baseUrl}/#/share/${uniqueId}`;
};

/**
 * Retrieve share link data from URL parameters
 * This allows recipients to view data without backend access
 */
export const getShareDataFromUrl = (): DatePlanData | null => {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('data');
    
    if (encoded) {
      return decodeDataFromURL(encoded);
    }
  } catch (err) {
    console.error('Error retrieving data from URL:', err);
  }
  
  return null;
};

export const generateWhatsAppShareLink = (uniqueId: string, planData?: DatePlanData, recipientPhone?: string): string => {
  const shareUrl = getShareUrl(uniqueId, planData);
  const message = `✨ Someone Special Has a Date Planned for You! ✨\n\n💌 View your special plan on LoveMeet!\n🔗 ${shareUrl}`;
  const phone = recipientPhone?.replace(/\D/g, '') || '';
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

export const generateEmailShareLink = (uniqueId: string, planData?: DatePlanData): string => {
  const shareUrl = getShareUrl(uniqueId, planData);
  const subject = "✨ You've Been Invited to a Special Date! ✨";
  const body = `Someone special has planned a date for you!\n\nView your special plan on LoveMeet:\n${shareUrl}`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
