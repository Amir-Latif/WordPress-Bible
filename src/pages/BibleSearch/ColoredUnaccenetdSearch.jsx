import accentRemover from "../../services/accentRemover";
import React from "react";

export default function ColoredUnaccenetdSearch({
  accentedPhrase,
  unaccentedQuery,
}) {
  let unacQuery = unaccentedQuery;

  const punctuation = /[\s،:؟.؛!«»]/;
  // create array to use it for mapping the words later on
  const accentedArr = accentedPhrase.split(punctuation);

  let dict = {};
  accentedArr.forEach((e) => {
    dict[accentRemover(e)] = e;
  });

  let unaccentedArr = accentRemover(accentedPhrase).split(
    accentRemover(unacQuery)
  );

  // If the query is part of a sentence, undefined will arise, so here is the solution

  const arrayBeforeQuery = unaccentedArr[0].split(punctuation);
  if (arrayBeforeQuery[arrayBeforeQuery.length - 1] !== " ") {
    unacQuery = arrayBeforeQuery[arrayBeforeQuery.length - 1] + unacQuery;

    let x = unaccentedArr[0].split(" ");
    x.pop();
    unaccentedArr[0] = x.join(" ");
  }

  const arrayAfterQuery = unaccentedArr[1].split(punctuation);

  if (arrayAfterQuery[0] !== " ") {
    unacQuery += arrayAfterQuery[0];
    unaccentedArr[1] = unaccentedArr[1].slice(unaccentedArr[1].search(" "));
  }

  return (
    <>
      {unaccentedArr[0].split(punctuation).map((w) => `${dict[w]} `)}
      <span style={{ color: "blue" }}>
        {unacQuery.split(punctuation).map((w) => `${dict[w]} `)}
      </span>
      {unaccentedArr[1].split(punctuation).map((w) => `${dict[w]} `)}
    </>
  );
}
