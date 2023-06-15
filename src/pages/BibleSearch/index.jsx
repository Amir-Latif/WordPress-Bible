import React, { useState, useEffect } from "react";
import SideBlock from "../../components/SideBlock";
import accentRemover, { accents } from "../../services/accentRemover";
import ColoredUnaccenetdSearch from "./ColoredUnaccenetdSearch";

export default function BibleSearch() {
  //#region load bible text and books
  const [books, setBooks] = useState([]);
  const [bibleText, setBibleText] = useState([]);

  useEffect(() => {
    fetch(`${ambBuildObject.pluginDir}src/data/books.json`)
      .then((res) => res.json())
      .then((books) => setBooks(books));

    fetch(`${ambBuildObject.pluginDir}src/data/bibleText.json`)
      .then((res) => res.json())
      .then((bibleText) => setBibleText(bibleText));
  }, []);
  //#endregion load bible text and books

  const [removeAccents, setRemoveAccents] = useState(false);

  //#region Get results
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get("query");
  const [testament, setTestament] = useState(
    searchParams.get("testament") ? searchParams.get("testament") : "all"
  );
  const book = searchParams.get("book") ? searchParams.get("book") : "all";

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

  const searchResults = query
    ? bibleText.filter(
        (ver) =>
          booksCollection.includes(ver.b) &&
          accentRemover(ver.text).includes(accentRemover(query))
      )
    : [];

  //#endregion Get results

  //#region pagination
  const [searchStart, setSearchStart] = useState(0);
  const [searchEnd, setSearchEnd] = useState(0);

  const resultsPerPage = 50;
  const numberOfPages = Math.ceil(searchResults.length / resultsPerPage);
  const lastStart = (numberOfPages - 1) * resultsPerPage;
  const lastEnd = numberOfPages * resultsPerPage - 1;

  useEffect(() => {
    setSearchStart(0);
    setSearchEnd(resultsPerPage);
  }, []);

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
      setSearchEnd(resultsPerPage);
      return;
    }
    if (searchStart === 0) return;
    else setSearchStart(searchStart - resultsPerPage);

    if (searchEnd === resultsPerPage - 1) return;
    else setSearchEnd(searchEnd - resultsPerPage);
  }
  //#endregion

  return (
    <main className="amb-bible-container">
      <section className="amb-d-flex amb-justify-content-between">
        <form
          className="amb-form-flex amb-form amb-block-container"
          action="بحث-في-الكتاب-المقدس"
        >
          <div className="amb-form-group">
            <label htmlFor="testament">العهد</label>
            <select
              name="testament"
              onChange={(e) => {
                setTestament(e.target.value);
              }}
            >
              <option value="all">العهد القديم والجديد</option>
              <option value="old">العهد القديم</option>
              <option value="new">العهد الجديد</option>
            </select>
          </div>
          <div className="amb-form-group">
            <label htmlFor="book">السفر</label>
            <select name="book">
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
              required
              onInvalid={(e) => {
                if (e.target.validity.valueMissing)
                  e.target.setCustomValidity("برجاء عدم ترك خانة البحث فارغة");
              }}
            />
          </div>

          <button style={{ marginTop: "1em" }} type="submit">
            عرض نتائج البحث
          </button>
        </form>

        <SideBlock setRemoveAccents={setRemoveAccents} showSearchLink={false} />
      </section>
      {/* Search Results */}
      {searchResults.length > 0 ? (
        <>
          <section className="amb-text-container">
            <div>عدد نتائج البحث = {searchResults.length}</div>
            {searchResults.slice(searchStart, searchEnd).map((r, i) => (
              <p className="amb-p" style={{ marginBlock: "1em" }} key={i}>
                <div className="amb-d-flex">
                  <div className="amb-search-verse">{searchStart + i + 1}.</div>
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
                  {query &&
                    (removeAccents ? (
                      <>
                        {accentRemover(r.text).split(accentRemover(query))[0]}
                        {
                          <span style={{ color: "blue" }}>
                            {accentRemover(query)}
                          </span>
                        }
                        {accentRemover(r.text).split(accentRemover(query))[1]}
                      </>
                    ) : accents.test(query) ? (
                      <>
                        {r.text.split(query)[0]}
                        {<span style={{ color: "blue" }}>{query}</span>}
                        {r.text.split(query)[1]}
                      </>
                    ) : (
                      <ColoredUnaccenetdSearch
                        accentedPhrase={r.text}
                        unaccentedQuery={query}
                      />
                    ))}
                </div>
              </p>
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
                  <button
                    className="amb-d-flex-switch"
                    onClick={() => previousPage()}
                  >
                    {"<"}
                  </button>
                </>
              )}
              <div>
                صفحة {searchStart / resultsPerPage + 1} من {numberOfPages}
              </div>
              {searchEnd !== lastEnd && (
                <>
                  <button
                    className="amb-d-flex-switch"
                    onClick={() => nextPage()}
                  >
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
          </section>
        </>
      ) : (
        <>
          {document.readyState === "complete" && (
            <p className="amb-p">لا يوجد نتائج بالبحث</p>
          )}
        </>
      )}
    </main>
  );
}
