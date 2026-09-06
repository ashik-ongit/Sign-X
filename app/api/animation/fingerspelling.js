const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function shouldFingerspell(gloss) {
  return !LETTERS.includes(gloss) && gloss.length === 1;
}

export function fingerspell(gloss) {
  return gloss
    .toUpperCase()
    .split("")
    .filter((letter) => LETTERS.includes(letter));
}