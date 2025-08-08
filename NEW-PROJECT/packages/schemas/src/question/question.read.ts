/**
 * Purpose: Define read-only types for questions and related entities used
 * throughout the application. These schemas are imported by QCM schemas
 * and other consumers.
 * Inputs: None.
 * Outputs: Zod schemas for questions, options and pages.
 * Events: None.
 * Errors: None.
 */
import { z } from 'zod';

// Identifier for a question
export const questionIdSchema = z.string().uuid();

// Type of question: single or multiple choice
export const questionTypeSchema = z.enum(['single', 'multiple']);

// Option within a question.  The id is typically a letter (A/B/C/…)
export const optionSchema = z.object({
  id: z.string(),
  text: z.string(),
});

// Schema representing a question as returned from the API
export const questionReadSchema = z.object({
  id: questionIdSchema,
  text: z.string(),
  type: questionTypeSchema,
  options: z.array(optionSchema).min(2),
  correctAnswers: z.array(z.string()).min(1),
  explanation: z.string().optional(),
});

export type QuestionId = z.infer<typeof questionIdSchema>;
export type QuestionType = z.infer<typeof questionTypeSchema>;
export type Option = z.infer<typeof optionSchema>;
export type QuestionRead = z.infer<typeof questionReadSchema>;