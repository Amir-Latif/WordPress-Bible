export const accents = new RegExp(/[ٌٍَُِّ~ْ]/, "g");

export default function accentRemover(string) {
  return string.replace(accents, "").replace(/ٱ/g, "ا");
}
