/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */
const STYLE = /*@css*/``;
const STYLE_SHEET = (() => {
  try {
    if (typeof CSSStyleSheet !== "undefined" && CSSStyleSheet.prototype.replaceSync) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(STYLE);
      return sheet;
    }
  } catch (e) {}
  return null;
})();
