//#region Accent Removing
const textContainer = document.querySelector(".amb-text-container");
let accentedText = textContainer.innerHTML;

document
  .querySelector(".amb-accent-remover")
  .addEventListener("change", (e) => {
    if (e.target.checked) {
      accentedText = textContainer.innerHTML;
      
      document.querySelectorAll("p").forEach((p) => {
        p.textContent = p.textContent.replaceAll(/[ٌٍَُِّ~ْ]/g, "");
        p.textContent = p.textContent.replaceAll(/ٱ/g, "ا");
      });
    } else {
      textContainer.innerHTML = accentedText;
    }
  });
//#endregion Accent Removing
