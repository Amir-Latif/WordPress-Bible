import React, { useState } from "react";
import SideBlock from "../../components/SideBlock";
import TextDetails from "./TextDetails";
import { bibleText } from "../../data/bibleText";
import { books } from "../../data/books";
import TextBlock from "./TextBlock";

export default function BibleText() {
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
  const [removeAccents, setRemoveAccents] = useState(false);
  const text = bibleText
    .filter((pBook) => pBook.b === book)
    .filter((v) =>
      verse === 0 ? v.c === chapter : v.v === verse && v.c === chapter
    );

  //#endregion

  return (
    <main className="amb-bible-container">
      {book && chapter > 0 ? (
        <>
          <section className="amb-d-flex amb-justify-content-between">
            <form
              method="GET"
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
                  {Array(
                    books.filter((b) => b.abbr === book)[0].chapters.length
                  )
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
            <SideBlock
              setRemoveAccents={setRemoveAccents}
              showSearchLink={true}
            />
          </section>

          {/* Text */}
          <section>
            {text.length !== 0 && (
              <>
                <div>
                  <TextDetails
                    books={books}
                    book={book}
                    text={text}
                    chapter={chapter}
                    verse={verse}
                  />

                  <TextBlock text={text} removeAccents={removeAccents} />

                  <TextDetails
                    books={books}
                    book={book}
                    chapter={chapter}
                    verse={verse}
                    text={text}
                  />
                </div>
              </>
            )}
          </section>
        </>
      ) : (
        <p>خطأ في عنوان الصفحة</p>
      )}
    </main>
  );
}
