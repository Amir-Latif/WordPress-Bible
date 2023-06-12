import accentRemover from "../../services/accentRemover";
import React from "react";

export default function TextBlock({ text, removeAccents }) {
  return (
    <div className="amb-text-container">
      {text.map((v) => (
        <div key={v.v}>
          {v.title && (
            <>
              {v.v !== 1 && <hr />}
              <h2>{v.title}</h2>
            </>
          )}
          <div className="amb-d-flex">
            <p style={{ paddingInlineEnd: "5px" }}>{v.v}.</p>
            {removeAccents ? <p>{accentRemover(v.text)}</p> : <p>{v.text}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
