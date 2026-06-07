export function pluraliza(word: string, count: number): string {
  if (count === 1) return word;

  const lastChar = word[word.length - 1].toLocaleLowerCase();

  if (["a", "e", "o", "u", "i"].includes(lastChar)) {
    return word + "s";
  }

  return word + "es";
}

