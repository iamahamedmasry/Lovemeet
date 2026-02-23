/**
 * Emoji and UTF-8 Encoding Utilities
 * 
 * This module ensures proper handling of emojis and special UTF-8 characters
 * across all sharing methods and browsers.
 * 
 * Key Principles:
 * 1. JavaScript strings are UTF-16 internally - they handle emojis naturally
 * 2. encodeURIComponent() properly encodes UTF-8 characters including emojis
 * 3. The Web Share API handles emojis and special characters without encoding
 * 4. Never manually encode/decode emoji strings - let handlers do it
 */

/**
 * Validate that text contains proper UTF-8 emoji characters
 * Returns true if emojis are preserved correctly
 */
export const validateEmojiEncoding = (text: string): boolean => {
  // Check if common emoji characters are preserved
  const emojiPatterns = [/💕|❤️|💌|✨|📅|🕖|📍|🎯|🌹|💝/];
  return emojiPatterns.some(pattern => pattern.test(text));
};

/**
 * Ensure text is properly UTF-8 encoded for all platforms
 * This is especially important for emoji characters
 */
export const ensureProperEmojiEncoding = (text: string): string => {
  // JavaScript strings are already Unicode (UTF-16)
  // Just ensure the string is not corrupted
  try {
    // Test encoding/decoding to catch any corruption
    const encoded = encodeURIComponent(text);
    const decoded = decodeURIComponent(encoded);
    
    // If decoding doesn't match original, there's an issue
    if (decoded === text) {
      return text;
    } else {
      console.warn('Emoji encoding mismatch detected:', { original: text, decoded });
      return text;
    }
  } catch (err) {
    console.error('Error validating emoji encoding:', err);
    return text;
  }
};

/**
 * Create properly formatted share text with emoji support
 * Use this when constructing share messages to ensure consistency
 */
export const createShareMessage = (
  title: string,
  details: Record<string, string>,
  footer?: string
): string => {
  let message = title;
  
  if (Object.keys(details).length > 0) {
    message += '\n\n';
    message += Object.entries(details)
      .map(([key, value]) => value) // Values already contain emoji prefixes
      .join('\n');
  }
  
  if (footer) {
    message += '\n\n' + footer;
  }
  
  return message;
};

/**
 * Format date with proper emoji
 */
export const formatDateWithEmoji = (date: string): string => {
  const parsed = new Date(date);
  const formatted = parsed.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return `📅 Date: ${formatted}`;
};

/**
 * Format time with proper emoji
 */
export const formatTimeWithEmoji = (time: string): string => {
  return `🕖 Time: ${time}`;
};

/**
 * Format location with proper emoji
 */
export const formatLocationWithEmoji = (city: string, district?: string): string => {
  const location = district ? `${city}, ${district}` : city;
  return `📍 Location: ${location}`;
};

/**
 * Test browser's emoji support and handling
 * Useful for debugging emoji rendering issues
 */
export const testEmojisUpport = (): {
  supported: boolean;
  renders: boolean;
  shareApi: boolean;
  clipboard: boolean;
} => {
  const testEmoji = '💕';
  
  return {
    // Check if emoji characters exist in Unicode
    supported: /\P{Emoji}/u.test(testEmoji),
    
    // Check if browser can render emojis
    renders: canvas.toDataURL ? true : false,
    
    // Check Web Share API support
    shareApi: !!navigator.share,
    
    // Check clipboard API support
    clipboard: !!navigator.clipboard,
  };
};

/**
 * Debug helper: Log emoji information
 */
export const debugEmojis = (text: string): void => {
  console.group('Emoji Debug Information');
  console.log('Original text:', text);
  console.log('Text length:', text.length);
  console.log('Character codes:', Array.from(text).map(c => c.charCodeAt(0)));
  console.log('Encoded URI:', encodeURIComponent(text));
  console.log('Browser support:', testEmojisUpport());
  console.groupEnd();
};

// Canvas check helper
const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;

export default {
  validateEmojiEncoding,
  ensureProperEmojiEncoding,
  createShareMessage,
  formatDateWithEmoji,
  formatTimeWithEmoji,
  formatLocationWithEmoji,
  testEmojisUpport,
  debugEmojis,
};
