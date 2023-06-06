export default function accentRemover(string) {
  return string.replace(/[ٌٍَُِّ~ْ]/g, "").replace(/ٱ/g, "ا");
}
