import type React from "react";

/**
 * Parses mnemonic text and converts custom tags to styled React elements
 * Supports: <radical>, <kanji>, <vocabulary>, etc.
 * Replaces them with <mark> tags for consistent styling
 * 
 * @param text - The mnemonic text with custom tags
 * @returns React elements with proper styling
 */
export function parseMnemonics(text: string): React.ReactNode {
  // Regular expression to find custom tags and their content
  // Matches: <tagname>content</tagname>
  const tagRegex = /<(radical|kanji|vocabulary|kana_vocabulary|hiragana|katakana|kanji_name|reading)>([^<]+)<\/\1>/g;
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  text.replace(tagRegex, (match: string, tagName: string, content: string, offset: number) => {
    // Add text before the tag
    if (offset > lastIndex) {
      parts.push(text.substring(lastIndex, offset));
    }

    // Add styled mark element
    parts.push(
      <mark key={`${tagName}-${offset}`} className={`mnemonic-tag mnemonic-tag-${tagName}`}>
        {content}
      </mark>
    );

    lastIndex = offset + match.length;
    return match;
  });

  // Add remaining text after the last tag
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // If no tags were found, return the original text
  return parts.length === 0 ? text : parts;
}
