import React from "react";

export default function TextDetails({
  books,
  book,
  text,
  chapter,
  verse,
}) {
  return (
    <section className="amb-text-details">
      <div className="amb-d-flex amb-align-items-center">
        <h1 className="amb-bible-name">
          {books.find((b) => b.abbr === book).testament === "old" && "سفر "}
          {books.find((b) => b.abbr === text[0].b).book} /
        </h1>
        {text[0].c > 1 && (
          <a
          
            className="amb-d-flex-switch"
            href={`الكتاب-المقدس?testament=all&book=${book}&chapter=${
              chapter - 1
            }&verse=${verse}`}
          >
            {"<"}
          </a>
        )}
        <h1>أصحاح: {text[0].c}</h1>
        {text[0].c < books.find((b) => b.abbr === book).chapters.length && (
          <a
            href={`الكتاب-المقدس?testament=all&book=${book}&chapter=${
              chapter + 1
            }&verse=${verse}`}
            className="amb-d-flex-switch"
          >
            {">"}
          </a>
        )}
      </div>
    </section>
  );
}
