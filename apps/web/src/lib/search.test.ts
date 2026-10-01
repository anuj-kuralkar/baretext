import { expect, test } from "vitest";

import { findMatchRanges, matchesAllTerms, parseSearchTerms } from "./search";

test("terms are split on whitespace runs", () => {
  expect(parseSearchTerms("  alpha   beta\ngamma ")).toEqual([
    "alpha",
    "beta",
    "gamma",
  ]);
  expect(parseSearchTerms("   ")).toEqual([]);
});

test("every term has to match", () => {
  const text = "alpha beta gamma";

  expect(matchesAllTerms(text, ["alpha", "gamma"])).toBe(true);
  expect(matchesAllTerms(text, ["alpha", "delta"])).toBe(false);
  expect(matchesAllTerms(text, [])).toBe(true);
});

test("a term matches at the start, the end, the middle or as a whole word", () => {
  const text = "prefixword middle wordsuffix";

  expect(matchesAllTerms(text, ["prefixword"])).toBe(true);
  expect(matchesAllTerms(text, ["wordsuffix"])).toBe(true);
  expect(matchesAllTerms(text, ["iddle"])).toBe(true);
  expect(matchesAllTerms(text, ["mid"])).toBe(true);
  expect(matchesAllTerms(text, ["middle"])).toBe(true);
});

test("matching ignores case", () => {
  expect(matchesAllTerms("Alpha Beta", ["alpha", "BETA"])).toBe(true);
  expect(matchesAllTerms("Alpha Beta", ["ALPHABETA"])).toBe(false);
});

test("every occurrence is reported", () => {
  expect(findMatchRanges("ab ab", ["ab"])).toEqual([
    { start: 0, end: 2 },
    { start: 3, end: 5 },
  ]);
});

test("overlapping and adjacent hits are merged", () => {
  expect(findMatchRanges("abc", ["ab", "bc"])).toEqual([{ start: 0, end: 3 }]);
  expect(findMatchRanges("abcd", ["ab", "cd"])).toEqual([{ start: 0, end: 4 }]);
});

test("reported offsets index the original text", () => {
  const text = "ÄÖÜ mixed Case";
  const ranges = findMatchRanges(text, ["äöü", "case"]);

  expect(ranges).toEqual([
    { start: 0, end: 3 },
    { start: 10, end: 14 },
  ]);
  expect(ranges.map((range) => text.slice(range.start, range.end))).toEqual([
    "ÄÖÜ",
    "Case",
  ]);
});

test("a term containing regex metacharacters is matched literally", () => {
  expect(matchesAllTerms("cost is 5.00 (net)", ["5.00 (net)"])).toBe(true);
  expect(findMatchRanges("aaa", ["a.b"])).toEqual([]);
});
