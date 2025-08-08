/**
 * Purpose: Define write/update schemas for questions.  These schemas are
 * consumed by the API when clients create or update questions.
 * Inputs: Request bodies from the client.
 * Outputs: Zod schemas to validate incoming data.
 * Events: None.
 * Errors: Validation errors.
 */
import { z } from 'zod';
import { questionTypeSchema, optionSchema } from './question.read';

// Schema for creating a new question
export const questionCreateSchema = z.object({
  text: z.string().min(1),
  type: questionTypeSchema,
  options: z.array(optionSchema).min(2),
  correctAnswers: z.array(z.string()).min(1),
  explanation: z.string().optional(),
});

// Schema for updating an existing question
export const questionUpdateSchema = questionCreateSchema.partial({
  text: true,
  type: true,
  options: true,
  correctAnswers: true,
  explanation: true,
}).extend({ id: z.string().uuid() });

export type QuestionCreateInput = z.infer<typeof questionCreateSchema>;
export type QuestionUpdateInput = z.infer<typeof questionUpdateSchema>;