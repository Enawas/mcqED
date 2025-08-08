/**
 * Purpose: Define write schemas for QCM creation and updates.  These schemas
 * validate input from clients when creating or modifying a QCM.
 * Inputs: Request bodies for QCM operations.
 * Outputs: Zod schemas for validation.
 * Events: None.
 * Errors: Validation errors.
 */
import { z } from 'zod';
import { questionCreateSchema } from '../question/question.write';
import { qcmStatusSchema, qcmDifficultySchema } from './qcm.read';

// Schema for a page when creating a QCM.  Contains a name and an array of
// questions to create.
export const qcmPageCreateSchema = z.object({
  name: z.string().min(1),
  questions: z.array(questionCreateSchema),
});

// Schema for creating a new QCM
export const qcmCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  iconClass: z.string().optional(),
  status: qcmStatusSchema.default('draft'),
  difficultyLevel: qcmDifficultySchema.optional(),
  passingThreshold: z.number().int().min(0).max(100).optional(),
  pages: z.array(qcmPageCreateSchema).default([]),
});

// Schema for updating an existing QCM
export const qcmUpdateSchema = qcmCreateSchema.partial().extend({ id: z.string().uuid() });

export type QcmCreateInput = z.infer<typeof qcmCreateSchema>;
export type QcmUpdateInput = z.infer<typeof qcmUpdateSchema>;