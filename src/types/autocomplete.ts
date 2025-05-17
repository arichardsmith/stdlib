/**
 * Suggest a union of strings, but also allow other strings to be entered
 */
export type AutocompleteSuggestion<T extends string> = T | (string & {});
