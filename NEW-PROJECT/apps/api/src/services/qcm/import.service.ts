/**
 * Purpose: Service to import a QCM from JSON or XML data.  Parses
 * the provided data, normalizes it into a QcmCreateInput shape, and
 * delegates to the createQcm service for persistence.  Supports
 * multiple formats.  Throws an error if the input format is not
 * supported or the data cannot be parsed.
 *
 * Inputs: format ('json' | 'xml'), data (string representing a QCM)
 * Outputs: Promise resolving to a QcmRead representing the created QCM
 * Events: Emits no events directly; audit logging should be handled
 * by the caller (e.g. controller).
 * Errors: Throws Error('INVALID_FORMAT') if the format is unsupported
 * or if parsing fails.
 */

import { QcmRead, QcmCreateInput } from '@packages/schemas/src/qcm';
import { createQcm } from './create.service';

/**
 * Parses an XML string into a QcmCreateInput.  This simple parser
 * expects a fixed structure and is not robust against malformed
 * XML.  See README for the expected format.  For production
 * systems, use a proper XML parser library (e.g. fast-xml-parser).
 */
function parseXmlToQcm(xml: string): QcmCreateInput {
  // Helper to extract the text of the first matching tag
  function getTagValue(xmlStr: string, tag: string): string | undefined {
    const match = xmlStr.match(new RegExp(`<${tag}>([\s\S]*?)</${tag}>`));
    return match ? match[1].trim() : undefined;
  }
  const title = getTagValue(xml, 'title') || 'Untitled';
  const description = getTagValue(xml, 'description');
  const iconClass = getTagValue(xml, 'iconClass');
  const status = getTagValue(xml, 'status') as any;
  const difficultyLevel = getTagValue(xml, 'difficultyLevel') as any;
  const passingThresholdStr = getTagValue(xml, 'passingThreshold');
  const passingThreshold = passingThresholdStr ? parseInt(passingThresholdStr, 10) : undefined;
  // Extract pages
  const pageMatches = xml.match(/<page>([\s\S]*?)<\/page>/g) || [];
  const pages = pageMatches.map((pageXml) => {
    const name = getTagValue(pageXml, 'name') || 'Page';
    const questionMatches = pageXml.match(/<question>([\s\S]*?)<\/question>/g) || [];
    const questions = questionMatches.map((qXml) => {
      const qText = getTagValue(qXml, 'text') || '';
      const qType = getTagValue(qXml, 'type') as any;
      // Parse options
      const optionMatches = qXml.match(/<option[^>]*>([\s\S]*?)<\/option>/g) || [];
      const options = optionMatches.map((oXml) => {
        // Extract id attribute if present
        const idMatch = oXml.match(/id="([^"]+)"/);
        const id = idMatch ? idMatch[1] : undefined;
        // Extract text inside option
        const textMatch = oXml.match(/<option[^>]*>([\s\S]*?)<\/option>/);
        const text = textMatch ? textMatch[1].trim() : '';
        return { id: id || '', text };
      });
      // Extract correctAnswers from nested elements or attribute on option
      // First, check for explicit correctAnswers tags
      const answerMatches = qXml.match(/<answer>([\s\S]*?)<\/answer>/g) || [];
      let correctAnswers: string[] = [];
      if (answerMatches.length > 0) {
        correctAnswers = answerMatches.map((ansXml) => {
          const ansMatch = ansXml.match(/<answer>([\s\S]*?)<\/answer>/);
          return ansMatch ? ansMatch[1].trim() : '';
        });
      } else {
        // Otherwise, check for correct="true" on option tags
        optionMatches.forEach((oXml, idx) => {
          const corrMatch = oXml.match(/correct="true"/);
          const idMatch = oXml.match(/id="([^"]+)"/);
          const optId = idMatch ? idMatch[1] : String.fromCharCode(65 + idx);
          if (corrMatch) correctAnswers.push(optId);
        });
      }
      const explanation = getTagValue(qXml, 'explanation') || undefined;
      return {
        text: qText,
        type: qType,
        options: options.map((o, idx) => ({ id: o.id || String.fromCharCode(65 + idx), text: o.text })),
        correctAnswers,
        explanation,
      };
    });
    return { name, questions };
  });
  return {
    title,
    description,
    iconClass,
    status,
    difficultyLevel,
    passingThreshold,
    pages,
  };
}

/**
 * Import a QCM from the specified format.  Currently supports JSON and
 * XML.  For JSON, the `data` must parse into a QcmCreateInput.  For
 * XML, a simple parser extracts a subset of fields.  The returned
 * QCM reflects the newly created record in the database.
 */
export async function importQcm(
  format: 'json' | 'xml',
  data: string,
): Promise<QcmRead> {
  let input: QcmCreateInput | undefined;
  if (format === 'json') {
    try {
      input = JSON.parse(data);
    } catch (err) {
      throw new Error('INVALID_FORMAT');
    }
  } else if (format === 'xml') {
    try {
      input = parseXmlToQcm(data);
    } catch (err) {
      throw new Error('INVALID_FORMAT');
    }
  } else {
    throw new Error('INVALID_FORMAT');
  }
  if (!input || typeof input.title !== 'string' || !input.title) {
    throw new Error('INVALID_FORMAT');
  }
  // Delegate to createQcm service which handles persistence and ID generation
  const qcm = await createQcm(input);
  return qcm;
}