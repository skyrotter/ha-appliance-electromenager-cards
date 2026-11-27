/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */
const STYLE = /*@css*/``;
// Styles de la bibliothèque dans un @layer : tout CSS utilisateur (card_mod, <style> injecté) non « layered »
// l'emporte, quel que soit l'ordre d'injection (les feuilles adoptées passent après les <style> du shadow root).
const STYLE_LAYERED = `@layer appliance{${STYLE}}`;
const STYLE_SHEET = (() => {
  try {
    if (typeof CSSStyleSheet !== "undefined" && CSSStyleSheet.prototype.replaceSync) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(STYLE_LAYERED);
      return sheet;
    }
  } catch (e) {}
  return null;
})();
