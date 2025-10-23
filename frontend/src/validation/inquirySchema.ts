import { z } from 'zod';

// Phone number validation - accepts international formats
// Sri Lankan: 0771234567, +94771234567, 94771234567
// International: +1234567890, +441234567890, etc.
const phoneRegex = /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?[\d\s-]{7,}$/;

// Define the inquiry types
export type InquiryType = 'general' | 'price' | 'test_drive' | 'financing' | 'trade_in';
export type ContactMethod = 'whatsapp' | 'phone' | 'email';

export const inquiryFormSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  customerEmail: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  
  customerPhone: z
    .string()
    .min(7, 'Phone number is too short')
    .max(20, 'Phone number is too long')
    .regex(phoneRegex, 'Please enter a valid phone number (e.g., +94771234567, 0771234567, or international format)')
    .transform(val => {
      // Clean up the phone number
      const cleaned = val.trim().replace(/[\s-()]/g, '');
      
      // Normalize Sri Lankan numbers to +94 format
      if (cleaned.startsWith('0') && cleaned.length === 10) {
        return '+94' + cleaned.slice(1);
      }
      
      // Add + if number starts with country code but missing +
      if (/^[1-9]\d{10,}$/.test(cleaned)) {
        return '+' + cleaned;
      }
      
      return cleaned.startsWith('+') ? cleaned : '+' + cleaned;
    }),
  
  customerMessage: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  
  inquiryType: z.string().refine(
    (val): val is InquiryType => ['general', 'price', 'test_drive', 'financing', 'trade_in'].includes(val),
    { message: 'Invalid inquiry type' }
  ),
  
  preferredContactMethod: z.string().refine(
    (val): val is ContactMethod => ['whatsapp', 'phone', 'email'].includes(val),
    { message: 'Invalid contact method' }
  ),
});

export type InquiryFormData = z.infer<typeof inquiryFormSchema>;
