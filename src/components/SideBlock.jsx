import React, { useEffect } from "react";

export default function SideBlock({ setRemoveAccents, showSearchLink }) {
  useEffect(() => {
    const preferencedFontSize = localStorage.getItem("preferencedFontSize");
    const preferencedLineHeight = localStorage.getItem("preferencedFontSize");
    const elements = document.querySelectorAll(".amb-text-container p");

    if (elements.length > 0 && preferencedFontSize && preferencedLineHeight) {
      elements.forEach((e) => (e.style.fontSize = preferencedFontSize));
      elements.forEach((e) => (e.style.lineHeight = preferencedLineHeight));
    }
  }, []);

  function resize(action) {
    const elements = document.querySelectorAll(".amb-text-container p");

    if (elements.length > 0) {
      const currentFontSize = parseInt(
        window.getComputedStyle(elements[0]).getPropertyValue("font-size")
      );
      let preferencedFontSize = "";

      console.log(preferencedFontSize);
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
      console.log(preferencedFontSize);
      elements.forEach((e) => (e.style.fontSize = preferencedFontSize));

      const preferencedLineHeight = `${
        parseInt(elements[0].style.fontSize) * 1.5
      }px`;

      elements.forEach((e) => (e.style.lineHeight = preferencedLineHeight));

      localStorage.setItem("preferencedFontSize", preferencedFontSize);
      localStorage.setItem("preferencedFontSize", preferencedLineHeight);
    }
  }

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
          name="removeAccents"
          onChange={(e) => {
            setRemoveAccents(e.target.checked);
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
