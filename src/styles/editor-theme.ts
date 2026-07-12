import type { EditorThemeClasses } from "lexical";

export const theme: EditorThemeClasses = {
  // Base editor container
  root: "outline-none min-h-37.5 text-zinc-900 dark:text-zinc-100 caret-zinc-900 dark:caret-zinc-100 selection:bg-blue-200 dark:selection:bg-blue-900/50",

  // Standard typography
  paragraph:
    "relative m-0 mb-4 leading-relaxed text-zinc-800 dark:text-zinc-200",

  // Block quotes
  quote:
    "mt-6 mb-4 border-l-2 border-zinc-300 dark:border-zinc-700 pl-4 italic text-zinc-600 dark:text-zinc-400",

  // Headings
  heading: {
    h1: "mt-8 mb-4 text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50",
    h2: "mt-6 mb-3 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-2",
    h3: "mt-5 mb-2 text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50",
    h4: "mt-4 mb-2 text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50",
    h5: "mt-4 mb-2 text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50",
    h6: "mt-4 mb-2 text-base font-medium tracking-tight text-zinc-500 dark:text-zinc-400 uppercase",
  },

  // Lists
  list: {
    ul: "my-4 ml-6 list-disc space-y-1 marker:text-zinc-500 dark:marker:text-zinc-400",
    ol: "my-4 ml-6 list-decimal space-y-1 marker:text-zinc-500 dark:marker:text-zinc-400",
    checklist: "my-4 space-y-1 pl-0",
    listitem: "leading-relaxed text-zinc-800 dark:text-zinc-200",
    // Interactive checkboxes using v4 arbitrary pseudo-elements
    listitemChecked:
      "relative list-none line-through text-zinc-500 dark:text-zinc-500 pl-6 before:cursor-pointer before:absolute before:left-0 before:top-[0.3em] before:flex before:h-4 before:w-4 before:items-center before:justify-center before:rounded-sm before:border before:border-zinc-300 before:bg-zinc-100 before:text-[10px] before:content-['✔'] dark:before:border-zinc-700 dark:before:bg-zinc-800",
    listitemUnchecked:
      "relative list-none pl-6 before:cursor-pointer before:absolute before:left-0 before:top-[0.3em] before:h-4 before:w-4 before:rounded-sm before:border before:border-zinc-300 before:bg-white before:content-[''] dark:before:border-zinc-700 dark:before:bg-zinc-950",
    nested: {
      list: "my-1 list-none",
      listitem: "ml-6",
    },
  },

  // Text node formatting
  text: {
    bold: "font-semibold text-zinc-900 dark:text-zinc-100",
    italic: "italic",
    underline:
      "underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-600",
    strikethrough: "line-through text-zinc-500 dark:text-zinc-400",
    underlineStrikethrough:
      "[text-decoration-line:underline_line-through] underline-offset-4 decoration-zinc-300 dark:decoration-zinc-600 text-zinc-500 dark:text-zinc-400",
    code: "font-mono text-[0.875em] bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-1.5 py-0.5 rounded-md",
    subscript: "text-[0.8em] align-sub",
    superscript: "text-[0.8em] align-super",
  },

  // Block code (GitHub theme inspired light/dark modes)
  code: "relative block my-4 p-4 overflow-x-auto rounded-lg text-sm font-mono leading-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 tab-2",

  // Syntax highlighting for code blocks (using Prism token names)
  codeHighlight: {
    atrule: "text-purple-600 dark:text-purple-400",
    attr: "text-neutral-800 dark:text-neutral-200",
    boolean: "text-blue-600 dark:text-blue-300",
    builtin: "text-blue-600 dark:text-blue-300",
    cdata: "italic text-neutral-500 dark:text-neutral-400",
    char: "text-blue-700 dark:text-blue-300",
    class: "text-orange-600 dark:text-orange-300",
    "class-name": "text-orange-600 dark:text-orange-300",
    comment: "italic text-neutral-500 dark:text-neutral-500",
    constant: "text-blue-600 dark:text-blue-300",
    deleted: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    doctype: "text-neutral-600 dark:text-neutral-400",
    entity: "text-purple-600 dark:text-purple-400",
    function: "text-purple-600 dark:text-purple-400",
    important: "font-bold text-red-600 dark:text-red-400",
    inserted:
      "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    keyword: "text-red-600 dark:text-red-400",
    namespace: "text-orange-600 dark:text-orange-300",
    number: "text-blue-600 dark:text-blue-300",
    operator: "text-neutral-600 dark:text-neutral-300",
    prolog: "text-neutral-600 dark:text-neutral-400",
    property: "text-blue-600 dark:text-blue-300",
    punctuation: "text-neutral-600 dark:text-neutral-300",
    regex: "text-blue-800 dark:text-blue-300",
    selector: "text-green-600 dark:text-green-400",
    string: "text-blue-800 dark:text-blue-300",
    symbol: "text-blue-600 dark:text-blue-300",
    tag: "text-green-600 dark:text-green-400",
    url: "text-blue-600 underline dark:text-blue-300",
    variable: "text-orange-600 dark:text-orange-300",
  },

  // Interactive nodes
  link: "font-medium text-blue-600 dark:text-blue-400 underline underline-offset-4 decoration-blue-600/30 dark:decoration-blue-400/30 hover:decoration-blue-600/100 dark:hover:decoration-blue-400/100 transition-colors cursor-pointer",
  hashtag:
    "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1 py-0.5 rounded-md font-medium text-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer",
  mark: "bg-yellow-200 dark:bg-yellow-500/30 text-inherit px-1 rounded-sm",
  markOverlap: "bg-yellow-300 dark:bg-yellow-500/50",
  image:
    "rounded-md border border-zinc-200 dark:border-zinc-800 max-w-full h-auto",
  hr: "my-8 border-t border-zinc-200 dark:border-zinc-800",
  hrSelected: "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-950",

  // Tables
  table:
    "w-full my-6 border-collapse border border-zinc-200 dark:border-zinc-800 text-sm",
  tableCell:
    "border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-left align-top",
  tableCellHeader:
    "bg-zinc-100/50 dark:bg-zinc-800/50 font-medium text-zinc-900 dark:text-zinc-100",
  tableRow: "even:bg-zinc-50/50 dark:even:bg-zinc-900/20",
  tableCellSelected: "bg-blue-50 dark:bg-blue-900/30",

  // Layout utilities
  ltr: "text-left",
  rtl: "text-right",

  // Collaboration / Multiplayer
  collaboration: {
    cursor: "relative inline-block w-0.5 bg-blue-500 z-10 animate-pulse",
    cursorName:
      "absolute -top-5 -left-px whitespace-nowrap rounded-t-sm rounded-br-sm bg-blue-500 px-1.5 py-0.5 text-[10px] font-medium text-white z-20",
    selection: "bg-blue-100 dark:bg-blue-900/40 text-inherit",
    selectionBg: "bg-blue-100 dark:bg-blue-900/40",
  },

  // Additional editor states
  blockCursor:
    "bg-zinc-200 dark:bg-zinc-800 text-transparent animate-pulse rounded-sm",
  characterLimit: "bg-red-100 dark:bg-red-900/30",
};
