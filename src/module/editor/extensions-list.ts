import { CodeExtension } from "@lexical/code-core";
import { CodePrismExtension } from "@lexical/code-prism";
import { HorizontalRuleExtension } from "@lexical/extension";
import { HistoryExtension } from "@lexical/history";
import { LinkExtension } from "@lexical/link";
import { CheckListExtension, ListExtension } from "@lexical/list";
import { RichTextExtension } from "@lexical/rich-text";

export const extensionsList = [
  HistoryExtension,
  RichTextExtension,
  CodeExtension,
  CodePrismExtension,
  LinkExtension,
  ListExtension,
  CheckListExtension,
  HorizontalRuleExtension,
];
