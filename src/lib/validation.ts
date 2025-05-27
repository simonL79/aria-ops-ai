
import { z } from 'zod';

export const emailSchema = z.string().email('Please enter a valid email address');

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters');

export const scanRequestSchema = z.object({
  full_name: nameSchema,
  email: emailSchema,
});

export const leadMagnetSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  lead_magnet: z.string().min(1, 'Lead magnet selection is required'),
});

export type ScanRequestData = z.infer<typeof scanRequestSchema>;
export type LeadMagnetData = z.infer<typeof leadMagnetSchema>;

export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
};
