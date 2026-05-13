/**
 * Parses a custom question text into structured components.
 * Handles both explicit bullet markers and plain-text bullet points
 * that appear after a header/separator line ending with a colon.
 */
export function parseCustomQuestion(text: string): {
  title: string;
  situation: string;
  bulletPoints: string[];
  tone: 'formal' | 'informal' | 'semi-formal';
} {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);

  // Detect explicit bullet markers: lines starting with bullet, dash, asterisk, or numbered
  const bulletRegex = /^(?:[•\-\*]|\d+[.)]\s*)\s*/;
  const bulletLines: string[] = [];
  const nonBulletLines: string[] = [];

  for (const line of lines) {
    if (bulletRegex.test(line)) {
      bulletLines.push(line.replace(bulletRegex, '').trim());
    } else {
      nonBulletLines.push(line);
    }
  }

  let bulletPoints: string[] = [];
  let situationParts: string[] = [];

  if (bulletLines.length > 0) {
    // Explicit bullets found - use them
    bulletPoints = bulletLines;

    // Build situation from non-bullet lines, excluding meta-instruction and separator lines
    const metaRegex = /^(write\s+(an?\s+)?(email|letter|response|reply)|your\s+(email|letter|response)\s+should)/i;
    for (const line of nonBulletLines) {
      if (!metaRegex.test(line)) {
        situationParts.push(line);
      }
    }
  } else {
    // No explicit bullets - look for a separator/header line
    const separatorTriggers = [
      'should include',
      'should do the following',
      'must include',
      'need to',
      'following points',
      'following information',
      'make sure to',
      'should address',
      'should contain',
      'should cover',
    ];

    const metaRegex = /^(write\s+(an?\s+)?(email|letter|response|reply|survey|report|message))/i;

    let separatorIndex = -1;
    let metaIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();

      // Find meta-instruction line (e.g. "Write an email...")
      if (metaIndex === -1 && metaRegex.test(line)) {
        metaIndex = i;
      }

      // Find separator/header line: ends with colon and contains a trigger phrase
      if (separatorIndex === -1 && line.endsWith(':')) {
        for (const trigger of separatorTriggers) {
          if (lowerLine.includes(trigger)) {
            separatorIndex = i;
            break;
          }
        }
      }
    }

    if (separatorIndex !== -1) {
      // All non-empty lines after the separator are bullet points
      for (let i = separatorIndex + 1; i < lines.length; i++) {
        bulletPoints.push(lines[i]);
      }

      // Situation: lines before the meta-instruction line (or before the separator if no meta found)
      const cutoff = metaIndex !== -1 ? metaIndex : separatorIndex;
      for (let i = 0; i < cutoff; i++) {
        situationParts.push(lines[i]);
      }
    } else {
      // No separator found either - fall back: exclude meta lines, rest is situation
      for (const line of lines) {
        if (!metaRegex.test(line)) {
          situationParts.push(line);
        }
      }
    }
  }

  // Build final situation string
  const situation = situationParts.length > 0
    ? situationParts.join(' ')
    : lines.join(' ');

  // If no bullet points were extracted, provide a default
  if (bulletPoints.length === 0) {
    bulletPoints = ['Address all points in the prompt'];
  }

  // Detect tone from keywords
  let tone: 'formal' | 'informal' | 'semi-formal' = 'formal';
  const lowerText = text.toLowerCase();
  if (
    lowerText.includes('friend') ||
    lowerText.includes('neighbour') ||
    lowerText.includes('neighbor') ||
    lowerText.includes('informal')
  ) {
    tone = 'semi-formal';
  }
  if (lowerText.includes('formal')) {
    tone = 'formal';
  }

  const title = 'Custom Question';

  return { title, situation, bulletPoints, tone };
}
