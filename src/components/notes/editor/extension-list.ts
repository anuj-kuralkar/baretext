import { CodeExtension } from "@lexical/code";
import { HashtagExtension } from "@lexical/hashtag";
import { LinkExtension } from "@lexical/link";
import { CheckListExtension, ListExtension } from "@lexical/list";
import { RichTextExtension } from "@lexical/rich-text";

export const coreExtensions = [
  RichTextExtension,
  ListExtension,
  CheckListExtension,
  CodeExtension,
  HashtagExtension,
  LinkExtension,
];
