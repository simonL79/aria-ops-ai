
// Clean up content by removing URLs and emojis
export function sanitizeContent(text: string): string {
  return text
    .replace(/https?:\/\/\S+/g, '') // remove URLs
    .replace(/[^\x00-\x7F]+/g, '') // remove emojis
    .trim();
}
