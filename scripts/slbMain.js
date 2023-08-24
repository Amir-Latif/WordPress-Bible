//#region Spinner Remover
window.addEventListener("load", () => {
  document.querySelector(".slb-spinner-container").remove();
});
//#endregion Spinner Remover

//#region Edit document title
document.title = slbMainJsObject.title;
//#endregion Edit document title
