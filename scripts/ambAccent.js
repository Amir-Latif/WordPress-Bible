//#region Accent Removing
const textContainer = document.querySelector(".amb-text-container");
let accentedText = textContainer.innerHTML;

function removeAccents() {
  accentedText = textContainer.innerHTML;

  document.querySelectorAll(".amb-p").forEach((p) => {
    p.textContent = p.textContent
      .replace(/[ًٌٍَُِّّ~ْ]/g, "")
      .replace(/ٱ/g, "ا")
      .replace(/الله/g, "اللـه");
  });
}

// Remove accent on init if selected last session and check the input
if (localStorage.getItem("removeAccent") === "true") removeAccents();
if (localStorage.getItem("removeAccent") !== null)
  document.querySelector(".amb-accent-remover").checked =
    localStorage.getItem("removeAccent") === "true" ? true : false;

console.log(localStorage.getItem("removeAccent") !== null);

// Listener
document
  .querySelector(".amb-accent-remover")
  .addEventListener("change", (e) => {
    localStorage.setItem("removeAccent", e.target.checked);

    if (e.target.checked) {
      removeAccents();
    } else {
      textContainer.innerHTML = accentedText;
    }
  });
//#endregion Accent Removing
