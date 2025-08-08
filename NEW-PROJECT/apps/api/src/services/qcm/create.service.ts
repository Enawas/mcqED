/**
 * Purpose: Service to create a new QCM. Generates unique identifiers for
 * the QCM itself, its pages and their questions, applies default values
 * for optional fields and timestamps, and assembles a normalized QCM
 * object. Persistence to a database and audit logging should be added
 * in future iterations.
 * Inputs: QcmCreateInput containing title and optionally description,
 * iconClass, status, difficultyLevel, passingThreshold, and pages.
 * Outputs: A promise resolving to a QcmRead object representing the
 * newly created QCM.
 * Events: TODO: persist to database and emit an audit event.
 * Errors: Propagates unexpected errors.
 */

import { randomUUID } from 'crypto';
import { QcmCreateInput, QcmRead, QcmPageRead } from '@packages/schemas/src/qcm';

/**
 * Helper to create a deep copy of pages with generated IDs for the page
 * itself and its questions. This ensures that each entity in the returned
 * QCM has a stable unique identifier.
 */
function transformPages(pages: QcmCreateInput['pages']): QcmPageRead[] {
  if (!pages) return [];
  return pages.map((page) => {
    const pageId = randomUUID();
    const questions = page.questions.map((q) => ({
      id: randomUUID(),
      text: q.text,
      type: q.type,
      options: q.options,
      correctAnswers: q.correctAnswers,
      explanation: q.explanation,
    }));
    return {
      id: pageId,
      name: page.name,
      questions,
    };
  });
}

export async function createQcm(input: QcmCreateInput): Promise<QcmRead> {
  const now = new Date().toISOString();
  const qcmId = randomUUID();
  const pages = transformPages(input.pages);
  return {
    id: qcmId,
    title: input.title,
    description: input.description,
    iconClass: input.iconClass,
    status: input.status ?? 'draft',
    difficultyLevel: input.difficultyLevel,
    passingThreshold: input.passingThreshold,
    createdAt: now,
    lastScore: undefined,
    lastTime: undefined,
    isFavorite: false,
    pages,
  };
}