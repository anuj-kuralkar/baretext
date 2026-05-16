import type { EditorThemeClasses } from "lexical";

export const theme: EditorThemeClasses = {
  root: "bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased leading-7 min-h-full p-4 md:p-8 xl:p-12 w-full focus:outline-none",

  paragraph: "mb-4 last:mb-0 leading-7 text-neutral-900 dark:text-neutral-100",

  heading: {
    h1: "mt-8 mb-4 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white",
    h2: "mt-8 mb-4 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white",
    h3: "mt-6 mb-3 text-xl font-bold tracking-tight text-neutral-950 dark:text-white",
    h4: "mt-6 mb-3 text-lg font-bold text-neutral-950 dark:text-white",
    h5: "mt-4 mb-2 text-base font-extrabold text-neutral-950 dark:text-white",
    h6: "mt-4 mb-2 text-sm font-extrabold text-neutral-950 dark:text-white",
  },

  quote:
    "my-4 border-s-4 border-neutral-200 dark:border-neutral-700 ps-4 text-lg italic font-medium text-neutral-700 dark:text-neutral-300",

  list: {
    ul: "mb-4 ps-6 list-disc text-neutral-900 dark:text-neutral-100",
    ol: "mb-4 ps-6 list-decimal text-neutral-900 dark:text-neutral-100",

    listitem:
      "ps-1 marker:text-neutral-400 dark:marker:text-neutral-500 focus:outline-none",

    checklist: "my-3 ps-0 list-none cursor-pointer",

    listitemChecked:
      "relative pl-7 select-none text-neutral-400 dark:text-neutral-500 line-through decoration-neutral-400/40 " +
      "before:content-[''] before:absolute before:left-0 before:top-[6px] " +
      "before:size-4 before:rounded-[4px] before:border before:transition-colors " +
      "before:bg-primary before:border-primary " +
      "after:content-[''] after:absolute after:left-0 after:top-[6px] " +
      "after:size-4 after:bg-primary-foreground " +
      "after:[mask-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjIwIDYgOSAxNyA0IDEyIi8+PC9zdmc+')] " +
      "after:[mask-size:70%] after:[mask-repeat:no-repeat] after:[mask-position:center]",

    listitemUnchecked:
      "relative pl-7 select-none text-neutral-900 dark:text-neutral-100 " +
      "before:content-[''] before:absolute before:left-0 before:top-[6px] " +
      "before:size-4 before:rounded-[4px] before:border before:transition-colors " +
      "before:border-input before:bg-white dark:before:bg-input/30 " +
      "after:hidden",

    nested: {
      listitem: "list-none",
    },
  },

  image:
    "mx-auto block h-auto max-w-full rounded-lg border border-neutral-200 dark:border-neutral-800",

  link: "font-medium text-neutral-900 dark:text-neutral-100 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 dark:decoration-neutral-600 dark:hover:decoration-neutral-100 transition-colors cursor-pointer",

  text: {
    bold: "font-bold text-neutral-950 dark:text-white",

    italic: "italic",

    underline: "underline underline-offset-4",

    strikethrough: "line-through opacity-70",

    underlineStrikethrough:
      "[text-decoration-line:underline_line-through] underline-offset-4 decoration-solid",

    code: "px-1.5 py-0.5 rounded text-sm font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ring-1 ring-inset ring-neutral-200 dark:ring-neutral-700",

    subscript: "align-sub text-xs",

    superscript: "align-super text-xs",
  },

  code: "relative block my-4 p-4 overflow-x-auto rounded-lg text-sm font-mono leading-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100",

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

  hr: "my-8 h-px border-0 bg-neutral-200 dark:bg-neutral-800",

  hrSelected: "bg-neutral-900 dark:bg-neutral-100 h-0.5",

  table:
    "w-full my-4 overflow-x-auto text-sm text-left border-collapse table-auto",

  tableCell:
    "px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 align-top last:border-0",

  tableCellHeader:
    "px-4 py-2 text-xs font-semibold tracking-wider uppercase bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400",

  tableCellSelected: "bg-neutral-50 dark:bg-neutral-900",

  tableRow: "hover:bg-neutral-50 dark:hover:bg-neutral-900/50",

  hashtag:
    "inline-block px-1.5 py-0.5 text-xs font-bold rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300",

  specialText:
    "font-medium underline decoration-wavy decoration-red-500 text-neutral-950 dark:text-neutral-100",

  embedBlock: {
    base: "rounded-lg border border-transparent select-none transition-all",
    focus: "border-neutral-300 dark:border-neutral-600 shadow-sm",
  },
};
