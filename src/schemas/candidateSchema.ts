import { z } from 'zod';

export const candidateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  experience: z.string().min(1, 'Experience is required'),
  status: z.enum(['Pending', 'In Review', 'Hired', 'Rejected'], {
    message: 'Please select a valid status'
  }),
  skills: z.array(
    z.object({
      name: z.string().min(1, 'Skill cannot be empty')
    })
  ).optional()
});

export type CandidateFormValues = z.infer<typeof candidateSchema>;
