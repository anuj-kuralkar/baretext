import { signal } from "@lexical/extension";

/**
 * The search input writes it, the note list reads it, and the editor extension
 * repaints from it. A signal is the interface Lexical extensions use to
 * communicate with the rest of the app, so no subscription is managed by hand.
 */
export const searchQuery = signal("");
