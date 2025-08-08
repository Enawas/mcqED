/**
 * Purpose: Define read-only types for QCM entities returned by the API.
 * Inputs: None (Zod schemas define the structures).
 * Outputs: Zod schemas for QCM and related types used on both server and client.
 * Events: None.
 * Errors: None.
 */
import { z } from 'zod';
import { questionReadSchema } from '../question/question.read';

// Unique identifier for a QCM
export const qcmIdSchema = z.string().uuid();

// Publication status of a QCM
export const qcmStatusSchema = z.enum(['draft', 'published']);

// Difficulty level of a QCM
export const qcmDifficultySchema = z.enum(['beginner', 'intermediate', 'advanced']);

// Metadata associated with a QCM
export const qcmMetaSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  iconClass: z.string().optional(),
  status: qcmStatusSchema,
  difficultyLevel: qcmDifficultySchema.optional(),
  passingThreshold: z.number().int().min(0).max(100).optional(),
  createdAt: z.string(),
  lastScore: z.number().optional(),
  lastTime: z.number().optional(),
  isFavorite: z.boolean().optional(),
});

// A page within a QCM containing ordered questions
export const qcmPageReadSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  questions: z.array(questionReadSchema),
});

// The full QCM definition returned from the API
export const qcmReadSchema = z.object({
  id: qcmIdSchema,
  pages: z.array(qcmPageReadSchema),
}).merge(qcmMetaSchema);

export type QcmId = z.infer<typeof qcmIdSchema>;
export type QcmStatus = z.infer<typeof qcmStatusSchema>;
export type QcmDifficulty = z.infer<typeof qcmDifficultySchema>;
export type QcmMeta = z.infer<typeof qcmMetaSchema>;
export type QcmPageRead = z.infer<typeof qcmPageReadSchema>;
export type QcmRead = z.infer<typeof qcmReadSchema>;