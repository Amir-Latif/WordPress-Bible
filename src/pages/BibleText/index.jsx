import React, { useState, useEffect } from "react";
import SideBlock from "../../components/SideBlock";

export default function BibleText() {
  //#region load bible text and books
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`${ambBuildObject.pluginDir}src/data/books.json`)
      .then((res) => res.json())
      .then((books) => setBooks(books));
  }, []);

  //#endregion load bible text and books

  //#region Variables
  const searchParams = new URLSearchParams(window.location.search);

  const [testament, setTestament] = useState("all");
  const [book, setBook] = useState(
    searchParams.get("book") ? searchParams.get("book") : "GEN"
  );
  const [chapter, setChapter] = useState(
    searchParams.get("chapter") ? parseInt(searchParams.get("chapter")) : 1
  );
  const [verse, setVerse] = useState(
    searchParams.get("verse") ? parseInt(searchParams.get("verse")) : 0
  );
  //#endregion

  //#region Append verse heading after form submission
  useEffect(() => {
    if (verse !== 0) window.location.href += "#verse";
  }, [verse]);

  //#endregion Append verse heading after form submission

  return (
    <section className="amb-d-flex amb-justify-content-between">
      {books.length > 0 && (
        <form
          action="الكتاب-المقدس"
          className="amb-form-flex amb-form amb-block-container"
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
            <select
              name="book"
              defaultValue={book}
              onChange={(e) => setBook(e.target.value)}
            >
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
              defaultValue={chapter}
              onChange={(e) => {
                setChapter(parseInt(e.target.value));
              }}
            >
              {Array(books.filter((b) => b.abbr === book)[0].chapters.length)
                .fill(0)
                .map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
            </select>
          </div>
          <div className="amb-form-group">
            <label htmlFor="verse">العدد</label>
            <select
              name="verse"
              defaultValue={verse}
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
                ).fill(0)
              ).map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">عرض النص</button>
        </form>
      )}
      <SideBlock showSearchLink={true} />
    </section>
  );
}
