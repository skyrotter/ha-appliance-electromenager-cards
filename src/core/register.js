/* ------------------------------------------------------------------ */
/* Register                                                            */
/* ------------------------------------------------------------------ */
window.customCards = window.customCards || [];
for (const kind of Object.keys(DEF)) {
  const tag = `appliance-${kind.replace("_", "-")}-card`;
  if (customElements.get(tag)) continue;
  customElements.define(tag, class extends ApplianceCardBase { static get kind() { return kind; } });
  window.customCards.push({
    type: tag,
    name: `Appliance – ${STRINGS.en[kind]} / ${STRINGS.fr[kind]}`,
    // nom traduit par langue : la liste de la carte unique s'affiche et se trie dans la langue de Home Assistant
    names: Object.fromEntries(Object.keys(STRINGS).map((l) => [l, STRINGS[l][kind] || STRINGS.en[kind]])),
    description: `${STRINGS.en[kind]} card with realistic animated illustration, live status, power, energy and cost.`,
    preview: true,
    documentationURL: "https://github.com/skyrotter/ha-appliance-electromenager-cards",
  });
}
console.info(`%c HA-APPLIANCE-CARDS %c v${VERSION} `,
  "color:#fff;background:#03a9f4;font-weight:700;border-radius:3px 0 0 3px",
  "color:#03a9f4;background:#fff;font-weight:700;border-radius:0 3px 3px 0");
