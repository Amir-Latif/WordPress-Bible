import React, { useState, useEffect, useRef } from "react";
import { books } from "../data/books";
import { bibleText } from "../data/bibleText";
import accentRemover from "../services/accentRemover";
import FontResizer from "./FontResizer";

export default function BibleSearch() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [removeAccents, setRemoveAccents] = useState(false);
  const [testament, setTestament] = useState("all");
  const [book, setBook] = useState("all");
  const [pageUpdater, setPageUpdater] = useState(false);
  const isFirstRender = useRef(true);

  //#region Get results
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let booksCollection = books
      .filter((b) =>
        testament === "all" && book === "all"
          ? b
          : testament === "all" && book !== "all"
          ? b.abbr === book
          : testament !== "all" && book === "all"
          ? b.testament === testament
          : b.testament === testament && b.abbr === book
      )
      .map((b) => b.abbr);

    setSearchResults(
      bibleText.filter(
        (ver) =>
          booksCollection.includes(ver.b) &&
          accentRemover(ver.text).includes(accentRemover(query))
      )
    );
  }, [pageUpdater]);
  //#endregion

  return (
    <div className="amb-bible-container">
      <FontResizer />
      <form
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
            <option value="all">كل الأسفار</option>
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
          <input
            type="text"
            name="query"
            onChange={(e) => setQuery(e.target.value)}
            required
          />
        </div>

        <button type="submit">عرض نتائج البحث</button>
      </form>

      <label htmlFor="removeAccents">اخفاء التشكيل</label>
      <input
        type="checkbox"
        name="removeAccents"
        onChange={(e) => {
          setRemoveAccents(e.target.checked);
        }}
      />

      {/* Search Results */}
      <div>
        {searchResults.length > 0 ? (
          <>
            <div>عدد نتائج البحث = {searchResults.length}</div>
            {searchResults.map((r, i) => (
              <div key={i}>
                <div className="amb-searchResults">
                  <div className="amb-verse">{i + 1}.</div>
                  <div>{books.find((e) => e.abbr === r.b).book} </div>
                </div>
                <div>
                  {removeAccents
                    ? accentRemover(
                        r.text.replace(
                          new RegExp(`${query}`, "g"),
                          `<span style="color: blue">${query}</span>`
                        )
                      )
                    : r.text.replace(
                        new RegExp(`${query}`, "g"),
                        `<span style="color: blue">${query}</span>`
                      )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div>لا يوجد نتائج بالبحث</div>
        )}
      </div>
    </div>
  );
}
