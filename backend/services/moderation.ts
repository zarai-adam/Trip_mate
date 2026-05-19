const BANNED_WORDS = ["spam", "scam", "shonky"]; // Placeholder list

export function filterProfanity(text: string): string {
  let filtered = text;
  BANNED_WORDS.forEach(word => {
    const regex = new RegExp(word, "gi");
    filtered = filtered.replace(regex, "****");
  });
  return filtered;
}

export function detectInappropriateContent(text: string): boolean {
  return BANNED_WORDS.some(word => text.toLowerCase().includes(word));
}
