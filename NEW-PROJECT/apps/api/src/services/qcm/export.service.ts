/**
 * Purpose: Service to export a QCM in JSON or XML format.  Retrieves
 * the QCM from the database and serializes it into the desired format.
 * Supports JSON (stringified object) and a simple XML representation.
 *
 * Inputs: QCM id (string UUID), format ('json' | 'xml').
 * Outputs: A promise resolving to a string containing the serialized QCM.
 * Events: None.  Audit logging should be handled by the controller if needed.
 * Errors: Throws Error('QCM_NOT_FOUND') if the QCM cannot be found,
 * or Error('INVALID_FORMAT') if the format is not supported.
 */

import { getQcm } from './get.service';
import { QcmRead, QcmPageRead } from '@packages/schemas/src/qcm';

/** Escape characters in a string for XML serialization. */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Convert a QCM object into a simple XML string. */
function qcmToXml(qcm: QcmRead): string {
  const lines: string[] = [];
  lines.push('<qcm>');
  lines.push(`<id>${escapeXml(qcm.id)}</id>`);
  lines.push(`<title>${escapeXml(qcm.title)}</title>`);
  if (qcm.description) lines.push(`<description>${escapeXml(qcm.description)}</description>`);
  if (qcm.iconClass) lines.push(`<iconClass>${escapeXml(qcm.iconClass)}</iconClass>`);
  lines.push(`<status>${escapeXml(qcm.status)}</status>`);
  if (qcm.difficultyLevel) lines.push(`<difficultyLevel>${escapeXml(qcm.difficultyLevel)}</difficultyLevel>`);
  if (qcm.passingThreshold !== undefined) lines.push(`<passingThreshold>${qcm.passingThreshold}</passingThreshold>`);
  lines.push(`<createdAt>${escapeXml(qcm.createdAt)}</createdAt>`);
  if (qcm.lastScore !== undefined) lines.push(`<lastScore>${qcm.lastScore}</lastScore>`);
  if (qcm.lastTime !== undefined) lines.push(`<lastTime>${qcm.lastTime}</lastTime>`);
  // Pages
  lines.push('<pages>');
  qcm.pages.forEach((page) => {
    lines.push('<page>');
    lines.push(`<id>${escapeXml(page.id)}</id>`);
    lines.push(`<name>${escapeXml(page.name)}</name>`);
    // Questions
    lines.push('<questions>');
    page.questions.forEach((question) => {
      lines.push('<question>');
      lines.push(`<id>${escapeXml(question.id)}</id>`);
      lines.push(`<text>${escapeXml(question.text)}</text>`);
      lines.push(`<type>${escapeXml(question.type)}</type>`);
      // Options
      lines.push('<options>');
      question.options.forEach((opt) => {
        lines.push(`<option id="${escapeXml(opt.id)}">${escapeXml(opt.text)}</option>`);
      });
      lines.push('</options>');
      // Correct answers
      lines.push('<correctAnswers>');
      question.correctAnswers.forEach((ans) => {
        lines.push(`<answer>${escapeXml(ans)}</answer>`);
      });
      lines.push('</correctAnswers>');
      if (question.explanation) lines.push(`<explanation>${escapeXml(question.explanation)}</explanation>`);
      lines.push('</question>');
    });
    lines.push('</questions>');
    lines.push('</page>');
  });
  lines.push('</pages>');
  lines.push('</qcm>');
  return lines.join('');
}

/** Export a QCM by ID into the specified format (json or xml). */
export async function exportQcm(id: string, format: 'json' | 'xml'): Promise<string> {
  const qcm = await getQcm(id);
  if (!qcm) {
    throw new Error('QCM_NOT_FOUND');
  }
  if (format === 'json') {
    return JSON.stringify(qcm);
  } else if (format === 'xml') {
    return qcmToXml(qcm);
  } else {
    throw new Error('INVALID_FORMAT');
  }
}