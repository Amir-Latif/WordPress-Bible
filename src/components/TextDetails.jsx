import React from "react";

export default function TextDetails({books, book, text, chapter,pageUpdater, setPageUpdater, setChapter}) {
  return (
    <>
      <h1>
        {books.find((b) => b.abbr === book).testament === "old" && "سفر "}
        {books.find((b) => b.abbr === text[0].b).book}
      </h1>
      <div className="amb-d-flex amb-align-items-center">
        {text[0].c > 1 && (
          <button
            className="amb-d-flex-switch"
            onClick={() => {
              setChapter(chapter - 1);
              setPageUpdater(!pageUpdater);
            }}
          >
            {"<"}
          </button>
        )}
        <h1>أصحاح: {text[0].c}</h1>
        {chapter < books.find((b) => b.abbr === book).chapters.length && (
          <button
            className="amb-d-flex-switch"
            onClick={() => {
              setChapter(chapter + 1);
              setPageUpdater(!pageUpdater);
            }}
          >
            {">"}
          </button>
        )}
      </div>
    </>
  );
}
