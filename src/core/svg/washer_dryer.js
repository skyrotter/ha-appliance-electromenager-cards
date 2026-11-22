/* Lave-linge séchant : le lave-linge (hublot, mousse, eau) avec la chaleur du sèche-linge en phase de séchage (calque « heat »).
   Face avant seulement ; SVG.washer est lu à l'appel (washer_side.js le redéfinit après ce fichier). */
SVG.washer_dryer = (c) => SVG.washer({ ...c, view: "front" })
  .replace("</defs>", `<radialGradient id="ID-heat" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#ffb347" stop-opacity=".55"/><stop offset="1" stop-color="#ff7b2e" stop-opacity="0"/></radialGradient></defs></defs>`)
  .replace('<g class="water">', '<circle class="heat" cx="60" cy="80" r="29" fill="url(#ID-heat)"/><g class="water">');
