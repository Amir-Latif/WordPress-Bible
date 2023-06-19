//#region Spinner Remover
window.addEventListener("load", () => {
  document.querySelector(".amb-spinner-container").remove();
});
//#endregion Spinner Remover

//#region Edit document title
document.title = ambMainJsObject.title;
//#endregion Edit document title
