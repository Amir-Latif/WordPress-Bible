import React, { useState, useEffect, useRef } from "react";
import { books } from "../data/books";
import { bibleText } from "../data/bibleText";
import accentRemover from "../services/accentRemover";
import FontResizer from "./FontResizer";

export default function BibleSearch() {
  const isFirstRender = useRef(true);

  //#region Get results
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [removeAccents, setRemoveAccents] = useState(false);
  const [testament, setTestament] = useState("all");
  const [book, setBook] = useState("all");
  const [pageUpdater, setPageUpdater] = useState(false);

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

  //#region pagination
  const [searchStart, setSearchStart] = useState(0);
  const [searchEnd, setSearchEnd] = useState(0);

  const resultsPerPage = 50;
  const numberOfPages = Math.ceil(searchResults.length / resultsPerPage);
  const lastStart = (numberOfPages - 1) * resultsPerPage;
  const lastEnd = numberOfPages * resultsPerPage - 1;

  function nextPage(page) {
    if (page === "last") {
      setSearchStart(lastStart);
      setSearchEnd(lastEnd);
      return;
    }
    if (searchStart + resultsPerPage > lastStart) setSearchStart(0);
    else setSearchStart(searchStart + resultsPerPage);

    if (searchEnd + resultsPerPage > lastEnd) setSearchEnd(resultsPerPage - 1);
    else setSearchEnd(searchEnd + resultsPerPage);
  }

  function previousPage(page) {
    if (page === "first") {
      setSearchStart(0);
      setSearchEnd(resultsPerPage - 1);
      return;
    }
    if (searchStart === 0) return;
    else setSearchStart(searchStart - resultsPerPage);

    if (searchEnd === resultsPerPage - 1) return;
    else setSearchEnd(searchEnd - resultsPerPage);
  }
  //#endregion

  //#region Custom Validation message
  useEffect(() => {
    document.querySelector("input").oninvalid = function (e) {
      e.target.setCustomValidity("برجاء كتابة كلمات البحث");
    };
  }, []);
  //#endregion

  return (
    <div className="amb-bible-container">
      <form
        className="amb-form amb-block-container"
        onSubmit={(e) => {
          e.preventDefault();
          setSearchEnd(resultsPerPage - 1);
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
          <label htmlFor="query">البحث</label>
          <input
            type="text"
            name="query"
            onChange={(e) => setQuery(e.target.value)}
            required
          />
        </div>

        <button style={{ marginTop: "1em" }} type="submit">
          عرض نتائج البحث
        </button>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 ? (
        <>
          <FontResizer setRemoveAccents={setRemoveAccents} />
          <div className="amb-text-container">
            <div>عدد نتائج البحث = {searchResults.length}</div>
            {searchResults.slice(searchStart, searchEnd).map((r, i) => (
              <div className="amb-verse-container" key={i}>
                <div className="amb-d-flex">
                  <div className="amb-search-verse">{i + 1}.</div>
                  <div className="amb-search-ref">
                    <div>
                      {"{"}
                      {books.find((e) => e.abbr === r.b).book}{" "}
                    </div>
                    <div>{r.c} :</div>
                    <div>
                      {r.v}
                      {"}"}
                    </div>
                  </div>
                </div>
                <div>
                  {removeAccents ? (
                    <>
                      {accentRemover(r.text).split(query)[0]}
                      <span style={{ color: "blue" }}>{query} </span>
                      {accentRemover(r.text).split(query)[1]}
                    </>
                  ) : (
                    r.text
                      .split(/[\s،:؟.؛!]/)
                      .map((w) =>
                        accentRemover(w) === accentRemover(query) ? (
                          <span style={{ color: "blue" }}>{w} </span>
                        ) : (
                          `${w} `
                        )
                      )
                  )}
                </div>
              </div>
            ))}

            {/* Page Controller */}
            <div className="amb-page-controller amb-d-flex amb-align-items-center amb-justify-content-center">
              {searchStart !== 0 && (
                <>
                  <button
                    className="amb-d-flex-switch"
                    onClick={() => previousPage("first")}
                  >
                    {"<<"}
                  </button>
                  <button className="amb-d-flex-switch" onClick={previousPage}>
                    {"<"}
                  </button>
                </>
              )}
              <div>
                صفحة {searchStart / resultsPerPage + 1} من {numberOfPages}
              </div>
              {searchEnd !== lastEnd && (
                <>
                  <button className="amb-d-flex-switch" onClick={nextPage}>
                    {">"}
                  </button>
                  <button
                    className="amb-d-flex-switch"
                    onClick={() => nextPage("last")}
                  >
                    {">>"}
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div>لا يوجد نتائج بالبحث</div>
      )}
    </div>
  );
}
