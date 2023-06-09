import React, { useEffect } from "react";

export default function SideBlock({ removeAccents, setRemoveAccents, showSearchLink }) {
  //#region font resizing
  useEffect(() => {
    const preferencedFontSize = localStorage.getItem("preferencedFontSize");
    const preferencedLineHeight = localStorage.getItem("preferencedLineHeight");
    const elements = document.querySelectorAll(".amb-p");

    if (elements.length > 0 && preferencedFontSize && preferencedLineHeight) {
      elements.forEach((e) => {
        e.style.fontSize = preferencedFontSize;
        e.style.lineHeight = preferencedLineHeight;
      });
    }
  }, []);

  function resize(action) {
    const elements = document.querySelectorAll(".amb-p");
    let currentFontSize;
    let preferencedFontSize = "";

    if (elements.length > 0) {
      currentFontSize = parseInt(
        window.getComputedStyle(elements[0]).getPropertyValue("font-size")
      );

      switch (action) {
        case "normal":
          preferencedFontSize = `${21}px`;
          break;
        case "augment":
          preferencedFontSize = `${currentFontSize + 4}px`;
          break;
        case "reduce":
          preferencedFontSize = `${currentFontSize - 4}px`;
          break;

        default:
          break;
      }

      const preferencedLineHeight = `${parseInt(preferencedFontSize) * 1.7}px`;

      elements.forEach((e) => {
        e.style.fontSize = preferencedFontSize;
        e.style.lineHeight = preferencedLineHeight;
      });

      localStorage.setItem("preferencedFontSize", preferencedFontSize);
      localStorage.setItem("preferencedLineHeight", preferencedLineHeight);
    }
  }
  //#endregion font resizing

  return (
    <div className="amb-form amb-block-container amb-side-block">
      <h3 className="amb-font-resize-label">التحكم في حجم الخط</h3>
      <div className="amb-font-resizer-container">
        <button
          onClick={() => {
            resize("augment");
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            resize("normal");
          }}
        >
          الحجم الطبيعي
        </button>
        <button
          onClick={() => {
            resize("reduce");
          }}
        >
          -
        </button>
      </div>
      <div className="amb-d-flex amb-accent-removing-div">
        <label htmlFor="removeAccents">اخفاء التشكيل</label>
        <input
          type="checkbox"
          className="amb-accent-remover"
          name="removeAccents"
          checked={removeAccents}
          onChange={(e) => {
            !showSearchLink && setRemoveAccents(e.target.checked);
          }}
        />
      </div>
      {showSearchLink && (
        <div className="amb-search-container">
          <a className="amb-search-a" href="بحث-في-الكتاب-المقدس">
            البحث في الكتاب المقدس
          </a>
        </div>
      )}
    </div>
  );
}
