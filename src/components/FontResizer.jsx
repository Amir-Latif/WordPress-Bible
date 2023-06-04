import React, { useEffect } from "react";

export default function FontResizer() {
  useEffect(() => {
    localStorage.setItem(
      "originalFontSize",

      window
        .getComputedStyle(document.querySelector(".amb-bible-container"))
        .getPropertyValue("font-size")
    );
  }, []);

  function resize(action) {
    const element = document.querySelector(".amb-bible-container");
    const currentFontSize = parseInt(
      window.getComputedStyle(element).getPropertyValue("font-size")
    );
    element.style.fontSize = `${
      action === "normal"
        ? parseInt(localStorage.getItem("originalFontSize"))
        : action === "augment"
        ? currentFontSize + 4
        : currentFontSize - 4
    }px`;
  }

  return (
    <div>
      <div>التحكم في حجم الخط</div>
      <div className="amb-font-resizer-container">
        <button
          onClick={() => {
            resize("augment");
          }}
        >
          [+]
        </button>
        <button
          onClick={() => {
            resize("normal");
          }}
        >
          [الحجم الطبيعي]
        </button>
        <button
          onClick={() => {
            resize("reduce");
          }}
        >
          [-]
        </button>
      </div>
    </div>
  );
}
