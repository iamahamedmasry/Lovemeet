// Clipboard and sharing utilities
// All operations handle UTF-8 encoding properly for emoji support

export interface ShareOptions {
  text?: string;
  title?: string;
  url: string;
}

export interface SocialMediaLinks {
  whatsapp: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  email: string;
}

/**
 * Ensure text is properly encoded as UTF-8 for sharing
 * This handles emojis and special characters correctly
 */
const ensureUtf8Encoding = (text: string): string => {
  // JavaScript strings are already UTF-16, encodeURIComponent handles this correctly
  // Just return the text as-is; modern browsers handle UTF-8 emojis
  return text;
};

/**
 * Generate social media share links with proper emoji encoding
 * encodeURIComponent() naturally handles UTF-8 and emoji characters
 */
export const generateSocialMediaLinks = (text: string, url?: string): SocialMediaLinks => {
  // Ensure proper UTF-8 string handling
  const normalizedText = ensureUtf8Encoding(text);
  // encodeURIComponent properly encodes UTF-8 characters including emojis
  const encoded = encodeURIComponent(normalizedText);
  const encodedUrl = url ? encodeURIComponent(url) : '';
  
  return {
    whatsapp: `https://wa.me/?text=${encoded}`,
    twitter: `https://twitter.com/intent/tweet?text=${encoded}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encoded}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent('Check this out!')}&body=${encoded}`,
  };
};

/**
 * Multi-platform share handler
 * Uses Web Share API if available, otherwise opens the most suitable platform
 * Properly handles UTF-8 and emoji characters
 */
export const shareToMultiplePlatforms = async (shareText: string, shareUrl?: string): Promise<void> => {
  try {
    // Ensure proper UTF-8 encoding
    const normalizedText = ensureUtf8Encoding(shareText);
    
    // Try native Web Share API first (best for emoji support)
    if (navigator.share) {
      await navigator.share({
        title: 'Share',
        text: normalizedText,
      });
    } else {
      // Fallback: Open the most suitable platform with proper encoding
      const socialLinks = generateSocialMediaLinks(normalizedText, shareUrl);
      const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
      
      // Prioritize WhatsApp on all platforms (user requirement)
      const url = isMobile ? socialLinks.whatsapp : socialLinks.whatsapp;
      window.open(url, '_blank', 'width=600,height=400');
    }
  } catch (err) {
    // User cancelled share, do nothing
    console.error('Share failed:', err);
  }
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

/**
 * Share via Web Share API if available, otherwise copy to clipboard
 */
export const share = async (options: ShareOptions): Promise<boolean> => {
  try {
    if (navigator.share) {
      await navigator.share({
        text: options.text || 'Check this out!',
        title: options.title || 'Shared Link',
        url: options.url,
      });
      return true;
    } else {
      // Fallback: copy URL to clipboard
      return await copyToClipboard(options.url);
    }
  } catch (err) {
    if (err instanceof Error && err.name !== 'AbortError') {
      console.error('Error sharing:', err);
    }
    return false;
  }
};

/**
 * Generate WhatsApp share link
 */
export const getWhatsAppShareLink = (
  phoneNumber: string,
  message: string,
  url: string
): string => {
  const text = `${message}\n\n${url}`;
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${phoneNumber}?text=${encodedText}`;
};

/**
 * Generate formatted WhatsApp message
 */
export const formatWhatsAppMessage = (fullName: string, url: string): string => {
  return `Hi! 👋\n\nI want to share something special from ${fullName}.\n\nCheck it out: ${url}`;
};

/**
 * Open link in new tab
 */
export const openInNewTab = (url: string): void => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Get base URL (for generating share links)
 */
export const getBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return 'http://localhost:3000';
  }
  const protocol = window.location.protocol;
  const host = window.location.host;
  return `${protocol}//${host}`;
};

/**
 * Generate share link from ID
 */
export const generateShareLink = (id: string): string => {
  return `${getBaseUrl()}/s/${id}`;
};
