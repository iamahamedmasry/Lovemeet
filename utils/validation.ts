// Form validation utilities
import { ShareFormData } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateShareForm = (data: Partial<ShareFormData>): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Full Name validation
  if (!data.fullName || data.fullName.trim().length === 0) {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  } else if (data.fullName.length < 2) {
    errors.push({ field: 'fullName', message: 'Full name must be at least 2 characters' });
  }

  // Phone validation (basic international format)
  if (!data.phone || data.phone.trim().length === 0) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (!/^[\d\s\-\+\(\)]{7,}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  // City validation
  if (!data.city || data.city.trim().length === 0) {
    errors.push({ field: 'city', message: 'City is required' });
  }

  // Address validation
  if (!data.address || data.address.trim().length === 0) {
    errors.push({ field: 'address', message: 'Address is required' });
  }

  // Message validation
  if (!data.message || data.message.trim().length === 0) {
    errors.push({ field: 'message', message: 'Message is required' });
  } else if (data.message.length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters' });
  }

  // Password validation (if provided)
  if (data.password && data.password.length < 4) {
    errors.push({ field: 'password', message: 'Password must be at least 4 characters' });
  }

  return errors;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};
