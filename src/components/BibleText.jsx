import React, { useState, useEffect, useRef } from "react";
import { books } from "../data/books";
import { bibleText } from "../data/bibleText";
import accentRemover from "../services/accentRemover";
import FontResizer from "./FontResizer";

export default function BibleText() {
  const [text, setText] = useState([]);
  const [testament, setTestament] = useState("all");
  const [book, setBook] = useState("GEN");
  const [chapter, setChapter] = useState(1);
  const [verse, setVerse] = useState(0);
  const [removeAccents, setRemoveAccents] = useState(false);
  const [pageUpdater, setPageUpdater] = useState(false);
  const isFirstRender = useRef(true);

  // Get Text
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setText(
      bibleText
        .filter((pBook) => pBook.b === book)
        .filter((v) =>
          parseInt(verse) === 0
            ? v.c === parseInt(chapter)
            : v.v === parseInt(verse) && v.c === parseInt(chapter)
        )
    );
  }, [pageUpdater]);

  return (
    <div className="amb-bible-container">
      <form
        className="amb-form amb-block-container"
        onSubmit={(e) => {
          e.preventDefault();
          setPageUpdater(!pageUpdater);
        }}
      >
        <div className="amb-form-group">
          <label htmlFor="testament">العهد</label>
          <select
            name="testament"
            onChange={(e) => setTestament(e.target.value)}
          >
            <option value="all">العهد القديم والجديد</option>
            <option value="old">العهد القديم</option>
            <option value="new">العهد الجديد</option>
          </select>
        </div>
        <div className="amb-form-group">
          <label htmlFor="book">السفر</label>
          <select name="book" onChange={(e) => setBook(e.target.value)}>
            {books
              .filter((b) =>
                testament === "all" ? b : b.testament === testament
              )
              .map((b) => (
                <option key={b.abbr} value={b.abbr}>
                  {b.book}
                </option>
              ))}
          </select>
        </div>
        <div className="amb-form-group">
          <label htmlFor="chapter">الأصحاح</label>
          <select
            name="chapter"
            onChange={(e) => {
              setChapter(parseInt(e.target.value));
            }}
          >
            {Array(books.filter((b) => b.abbr === book)[0].chapters.length)
              .fill()
              .map((_, index) => (
                <option
                  key={index}
                  value={parseInt(index) + 1}
                  selected={chapter === parseInt(index) + 1}
                >
                  {index + 1}
                </option>
              ))}
          </select>
        </div>
        <div className="amb-form-group">
          <label htmlFor="verse">العدد</label>
          <select
            name="verse"
            onChange={(e) => {
              setVerse(parseInt(e.target.value));
            }}
          >
            <option value="0">الكل</option>
            {Object.keys(
              Array(
                books
                  .filter((b) => b.abbr === book)[0]
                  .chapters.filter((c) => c.chapter === chapter)[0].verses
              ).fill()
            ).map((_, i) => (
              <option key={i} value={parseInt(i) + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">عرض النص</button>
      </form>

      <div className="amb-search-container">
        <a className="amb-search-a" href="bible-search">
          البحث في الكتاب المقدس
        </a>
      </div>

      {/* Text */}
      <div>
        {text.length !== 0 && (
          <>
            <FontResizer setRemoveAccents={setRemoveAccents} />
            <div>
              <h1>
                {books.find((b) => b.abbr === book).testament === "old" &&
                  "سفر "}
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
                {chapter <
                  books.find((b) => b.abbr === book).chapters.length && (
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
              <div className="amb-text-container">
                {text.map((v) => (
                  <>
                    <div class="amb-verse-container" key={v.v}>
                      {v.title && <h2>{v.title}</h2>}
                      <div className="amb-d-flex">
                        <div style={{ paddingInlineEnd: "5px" }}>{v.v}.</div>
                        {removeAccents ? (
                          <div>{accentRemover(v.text)}</div>
                        ) : (
                          <div>{v.text}</div>
                        )}
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
