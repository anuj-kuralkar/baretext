export interface MatchRange {
  start: number;
  end: number;
}

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function termPattern(term: string) {
  return new RegExp(escapeRegExp(term), "giu");
}

/**
 * Splits a query into terms. Every term has to match for a note to be a hit,
 * so extra words narrow the result.
 */
export function parseSearchTerms(query: string): string[] {
  return query.trim().split(/\s+/u).filter(Boolean);
}

export function matchesAllTerms(
  text: string,
  terms: readonly string[],
): boolean {
  return terms.every((term) => term !== "" && termPattern(term).test(text));
}

/**
 * Every occurrence of every term, as offsets into `text`. Overlapping and
 * adjacent hits are merged so a caller can slice the text in one pass.
 */
export function findMatchRanges(
  text: string,
  terms: readonly string[],
): MatchRange[] {
  const found: MatchRange[] = [];

  for (const term of terms) {
    if (term === "") continue;

    const pattern = termPattern(term);
    let match = pattern.exec(text);
    while (match !== null) {
      found.push({ start: match.index, end: match.index + match[0].length });
      match = pattern.exec(text);
    }
  }

  found.sort((a, b) => a.start - b.start || a.end - b.end);

  const merged: MatchRange[] = [];
  for (const range of found) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) {
      previous.end = Math.max(previous.end, range.end);
      continue;
    }
    merged.push({ ...range });
  }

  return merged;
}
