import React, { useEffect } from "react";

export default function FontResizer({ setRemoveAccents }) {
  useEffect(() => {
    const preferencedFontSize = localStorage.getItem("preferencedFontSize");
    const preferencedLineHeight = localStorage.getItem("preferencedFontSize");
    const element = document.querySelector(".amb-text-container");

    if (element && preferencedFontSize && preferencedLineHeight) {
      element.style.fontSize = preferencedFontSize;
      element.style.lineHeight = preferencedLineHeight;
    }
  }, []);

  function resize(action) {
    const element = document.querySelector(".amb-text-container");
    if (element) {
      const currentFontSize = parseInt(
        window.getComputedStyle(element).getPropertyValue("font-size")
      );
      const preferencedFontSize = `${
        action === "normal"
          ? 14
          : action === "augment"
          ? currentFontSize + 4
          : currentFontSize - 4
      }pt`;
      element.style.fontSize = preferencedFontSize;

      const preferencedLineHeight = `${
        parseInt(element.style.fontSize) * 1.5
      }pt`;

      element.style.lineHeight = preferencedLineHeight;

      localStorage.setItem("preferencedFontSize", preferencedFontSize);
      localStorage.setItem("preferencedFontSize", preferencedLineHeight);
    }
  }

  return (
    <div className="amb-form amb-block-container">
      <div className="amb-font-resize-label">التحكم في حجم الخط</div>
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
      <div className="amb-d-flex">
        <label htmlFor="removeAccents">اخفاء التشكيل</label>
        <input
          type="checkbox"
          name="removeAccents"
          onChange={(e) => {
            setRemoveAccents(e.target.checked);
          }}
        />
      </div>
    </div>
  );
}
