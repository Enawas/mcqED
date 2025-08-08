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
import { db } from '../../db';
import { qcm as qcmTable } from '@packages/db/src/schema/qcm';
import { qcmPage } from '@packages/db/src/schema/page';
import { question as questionTable } from '@packages/db/src/schema/question';

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
  // Generate identifiers and timestamps
  const now = new Date();
  const qcmId = randomUUID();
  // Persist the QCM to the database. Nullable values are inserted as undefined
  await db.insert(qcmTable).values({
    id: qcmId,
    title: input.title,
    description: input.description,
    iconClass: input.iconClass,
    status: input.status ?? 'draft',
    difficultyLevel: input.difficultyLevel,
    passingThreshold: input.passingThreshold,
    createdAt: now,
    lastScore: null,
    lastTime: null,
    isFavorite: false,
  });
  // Insert pages and questions
  const pageResults: QcmPageRead[] = [];
  const pages = input.pages ?? [];
  let position = 0;
  for (const page of pages) {
    position += 1;
    const pageId = randomUUID();
    await db.insert(qcmPage).values({
      id: pageId,
      qcmId,
      name: page.name,
      position,
    });
    const questionReads = [] as QcmPageRead['questions'];
    for (const q of page.questions) {
      const questionId = randomUUID();
      await db.insert(questionTable).values({
        id: questionId,
        qcmId,
        pageId,
        text: q.text,
        type: q.type,
        options: q.options,
        correctAnswers: q.correctAnswers,
        explanation: q.explanation,
      });
      questionReads.push({
        id: questionId,
        text: q.text,
        type: q.type,
        options: q.options,
        correctAnswers: q.correctAnswers,
        explanation: q.explanation,
      });
    }
    pageResults.push({
      id: pageId,
      name: page.name,
      questions: questionReads,
    });
  }
  // Assemble and return the QCM read object with persisted pages
  return {
    id: qcmId,
    title: input.title,
    description: input.description,
    iconClass: input.iconClass,
    status: input.status ?? 'draft',
    difficultyLevel: input.difficultyLevel,
    passingThreshold: input.passingThreshold,
    createdAt: now.toISOString(),
    lastScore: undefined,
    lastTime: undefined,
    isFavorite: false,
    pages: pageResults,
  };
}