import { inquiryFormSchema } from '../inquirySchema';

describe('Inquiry Form Validation Schema', () => {
  describe('customerName validation', () => {
    it('accepts valid names', () => {
      const result = inquiryFormSchema.safeParse({
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '0771234567',
        customerMessage: 'I am interested in this car',
        inquiryType: 'general',
        preferredContactMethod: 'email',
      });

      expect(result.success).toBe(true);
    });

    it('rejects names that are too short', () => {
      const result = inquiryFormSchema.safeParse({
        customerName: 'J',
        customerEmail: 'john@example.com',
        customerPhone: '0771234567',
        customerMessage: 'I am interested in this car',
        inquiryType: 'general',
        preferredContactMethod: 'email',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2 characters');
      }
    });

    it('rejects names with numbers', () => {
      const result = inquiryFormSchema.safeParse({
        customerName: 'John123',
        customerEmail: 'john@example.com',
        customerPhone: '0771234567',
        customerMessage: 'I am interested in this car',
        inquiryType: 'general',
        preferredContactMethod: 'email',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('letters and spaces');
      }
    });
  });

  describe('customerEmail validation', () => {
    it('accepts valid email addresses', () => {
      const validEmails = [
        'john@example.com',
        'jane.doe@company.co.uk',
        'test+tag@domain.org',
      ];

      validEmails.forEach(email => {
        const result = inquiryFormSchema.safeParse({
          customerName: 'John Doe',
          customerEmail: email,
          customerPhone: '0771234567',
          customerMessage: 'I am interested in this car',
          inquiryType: 'general',
          preferredContactMethod: 'email',
        });

        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'test@',
        'test @example.com',
      ];

      invalidEmails.forEach(email => {
        const result = inquiryFormSchema.safeParse({
          customerName: 'John Doe',
          customerEmail: email,
          customerPhone: '0771234567',
          customerMessage: 'I am interested in this car',
          inquiryType: 'general',
          preferredContactMethod: 'email',
        });

        expect(result.success).toBe(false);
      });
    });

    it('converts email to lowercase', () => {
      const result = inquiryFormSchema.safeParse({
        customerName: 'John Doe',
        customerEmail: 'JOHN@EXAMPLE.COM',
        customerPhone: '0771234567',
        customerMessage: 'I am interested in this car',
        inquiryType: 'general',
        preferredContactMethod: 'email',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.customerEmail).toBe('john@example.com');
      }
    });
  });

  describe('customerPhone validation', () => {
    it('accepts valid phone numbers', () => {
      const validPhones = [
        '0771234567',
        '+94771234567',
        '+1234567890',
        '+44 20 7946 0958',
      ];

      validPhones.forEach(phone => {
        const result = inquiryFormSchema.safeParse({
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: phone,
          customerMessage: 'I am interested in this car',
          inquiryType: 'general',
          preferredContactMethod: 'phone',
        });

        expect(result.success).toBe(true);
      });
    });

    it('rejects phone numbers that are too short', () => {
      const result = inquiryFormSchema.safeParse({
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '12345',
        customerMessage: 'I am interested in this car',
        inquiryType: 'general',
        preferredContactMethod: 'phone',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('customerMessage validation', () => {
    it('accepts messages of appropriate length', () => {
      const result = inquiryFormSchema.safeParse({
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '0771234567',
        customerMessage: 'I am very interested in purchasing this vehicle',
        inquiryType: 'general',
        preferredContactMethod: 'email',
      });

      expect(result.success).toBe(true);
    });

    it('rejects messages that are too short', () => {
      const result = inquiryFormSchema.safeParse({
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '0771234567',
        customerMessage: 'Too short',
        inquiryType: 'general',
        preferredContactMethod: 'email',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 10 characters');
      }
    });

    it('rejects messages that are too long', () => {
      const longMessage = 'a'.repeat(1001);
      const result = inquiryFormSchema.safeParse({
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '0771234567',
        customerMessage: longMessage,
        inquiryType: 'general',
        preferredContactMethod: 'email',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than 1000 characters');
      }
    });
  });
});
