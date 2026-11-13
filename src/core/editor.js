/* ------------------------------------------------------------------ */
/* Visual editor schema                                                */
/* ------------------------------------------------------------------ */
const SEL = {
  entity: { entity: {} },
  power: { entity: { domain: "sensor", device_class: "power" } },
  energy: { entity: { domain: "sensor", device_class: "energy" } },
  power_solar: { entity: { domain: "sensor", device_class: "power" } },
  energy_solar: { entity: { domain: "sensor", device_class: "energy" } },
  cost: { entity: { domain: ["sensor", "input_number"] } },
  remaining: { entity: { domain: "sensor" } },
  progress: { entity: { domain: "sensor" } },
  program: { entity: { domain: ["sensor", "select", "input_select"] } },
  door: { entity: { domain: "binary_sensor" } },
  freezer_door: { entity: { domain: "binary_sensor" } },
  switch: { entity: { domain: ["switch", "input_boolean", "light"] } },
  switch_low: { entity: { domain: ["switch", "input_boolean", "light", "fan"] } },
  switch_high: { entity: { domain: ["switch", "input_boolean", "light", "fan"] } },
  dose_interval: { entity: { domain: ["number", "input_number", "sensor"] } },
  dose_timer: { entity: { domain: ["switch", "input_boolean"] } },
  dose_volume: { entity: { domain: ["sensor", "number", "input_number"] } },
  dose_time: { entity: { domain: ["sensor", "input_datetime"] } },
  switch_ph_plus: { entity: { domain: ["switch", "input_boolean", "light", "fan"] } },
  switch_ph_minus: { entity: { domain: ["switch", "input_boolean", "light", "fan"] } },
  switch_electrolysis: { entity: { domain: ["switch", "input_boolean", "light", "fan"] } },
  switch_heat_pump: { entity: { domain: ["switch", "input_boolean", "light", "fan"] } },
  switch_shower: { entity: { domain: ["switch", "input_boolean", "light", "fan"] } },
  presence: { entity: { domain: ["binary_sensor", "input_boolean"] } },
  low_water: { entity: { domain: ["binary_sensor", "input_boolean", "switch"] } },
  // climate / water_heater acceptés : la carte lit alors current_temperature / temperature (pas l'état, qui est un mode)
  temperature: { entity: { filter: [{ domain: ["sensor", "input_number"], device_class: "temperature" }, { domain: ["climate", "water_heater"] }] } },
  target_temperature: { entity: { domain: ["sensor", "input_number", "number", "climate", "water_heater"] } },
  freezer_temperature: { entity: { domain: "sensor", device_class: "temperature" } },
  flex_temperature: { entity: { domain: ["sensor", "climate"] } },
  power_level: { entity: { domain: ["sensor", "number", "input_number", "select", "input_select"] } },
  pellet_level: { entity: { domain: ["sensor", "number", "input_number"] } },
  runtime: { entity: { domain: ["sensor"] } },
  usage_time: { entity: { domain: ["sensor"] } },
  // vidéoprojecteur : heures de lampe / laser et mode d'image
  lamp_hours: { entity: { domain: ["sensor", "number", "input_number"] } },
  picture_mode: { entity: { domain: ["select", "input_select", "sensor"] } },
  light: { entity: { domain: ["light", "switch", "binary_sensor", "input_boolean"] } },
  zone2_temperature: { entity: { domain: ["sensor", "input_number"], device_class: "temperature" } },
  battery_level: { entity: { domain: ["sensor", "number", "input_number"] } },
  keg_level: { entity: { domain: ["sensor", "number", "input_number"] } },
  // chauffe-eau : eau chaude restante, en % ou en litres (avec tank_volume)
  hot_water_level: { entity: { domain: ["sensor", "number", "input_number"] } },
  hot_water_volume: { entity: { domain: ["sensor", "number", "input_number"] } },
  pouring: { entity: { domain: ["binary_sensor", "input_boolean", "switch"] } },
  bed_temperature: { entity: { domain: ["sensor"], device_class: "temperature" } },
  humidity: { entity: { domain: ["sensor"], device_class: "humidity" } },
  mode: { entity: { domain: ["select", "input_select", "sensor", "climate"] } },
  window: { entity: { domain: "binary_sensor" } },
  zone_1: { entity: { domain: ["sensor", "number", "select", "input_number"] } },
  zone_2: { entity: { domain: ["sensor", "number", "select", "input_number"] } },
  zone_3: { entity: { domain: ["sensor", "number", "select", "input_number"] } },
  zone_4: { entity: { domain: ["sensor", "number", "select", "input_number"] } },
  // piscine : analyses de l'eau et pression du filtre
  ph: { entity: { domain: ["sensor", "number", "input_number"] } },
  orp: { entity: { domain: ["sensor", "number", "input_number"] } },
  pressure: { entity: { domain: ["sensor", "number", "input_number"] } },
  tds: { entity: { domain: ["sensor", "number", "input_number"] } },
  salt: { entity: { domain: ["sensor", "number", "input_number"] } },
  chlorine: { entity: { domain: ["sensor", "number", "input_number"] } },
  speed: { entity: { domain: ["sensor", "number", "input_number", "select"] } },
  // fitness : cadence (tr/min ou coups/min), distance, fréquence cardiaque, calories
  cadence: { entity: { domain: ["sensor", "number", "input_number"] } },
  distance: { entity: { domain: ["sensor", "number", "input_number"] } },
  heart_rate: { entity: { domain: ["sensor", "number", "input_number"] } },
  calories: { entity: { domain: ["sensor", "number", "input_number"] } },
  target_humidity: { entity: { domain: ["sensor", "number", "input_number", "humidifier"] } },
  tank_full: { entity: { domain: ["binary_sensor", "input_boolean", "sensor"] } },
  clean_water: { entity: { domain: ["sensor", "binary_sensor", "number", "input_number"] } },
  dirty_water: { entity: { domain: ["sensor", "binary_sensor", "number", "input_number"] } },
  fan_speed: { entity: { domain: ["select", "input_select", "sensor", "number", "input_number", "fan"] } },
  pm25: { entity: { domain: ["sensor", "number", "input_number"] } },
  filter: { entity: { domain: ["sensor", "binary_sensor", "number", "input_number", "input_boolean"] } },
};
function buildForm(kind) {
  const d = DEF[kind];
  return {
    schema: [
      { name: "name", selector: { text: {} } },
      { name: "labels", selector: { object: {} } },
      ...d.fields.map((f) => ({ name: f, selector: SEL[f] })),
      {
        type: "expandable", name: "", title: "Options", flatten: true, schema: [
          { name: "threshold", selector: { number: { min: 0, max: 3000, step: 1, mode: "box", unit_of_measurement: "W" } } },
          ...(["washer", "dishwasher"].includes(kind) ? [
            { name: "heating_power", selector: { number: { min: 100, max: 4000, step: 50, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "washer" ? [
            { name: "spin_power", selector: { number: { min: 50, max: 2000, step: 25, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(["chest_freezer", "drawer_freezer"].includes(kind) ? [
            { name: "temperature_unit", selector: { select: { mode: "dropdown", options: [{ value: "C", label: "°C" }, { value: "F", label: "°F" }] } } },
            { name: "freezer_max_temperature", selector: { number: { min: -30, max: 32, step: 0.5, mode: "box" } } },
          ] : []),
          ...(kind === "wine_cooler" ? [
            { name: "temperature_unit", selector: { select: { mode: "dropdown", options: [{ value: "C", label: "°C" }, { value: "F", label: "°F" }] } } },
            { name: "max_temperature", selector: { number: { min: 5, max: 80, step: 0.5, mode: "box" } } },
            { name: "max_temperature_2", selector: { number: { min: 3, max: 80, step: 0.5, mode: "box" } } },
            { name: "humidity_max", selector: { number: { min: 40, max: 100, step: 1, mode: "box", unit_of_measurement: "%" } } },
          ] : []),
          ...(kind === "fridge" ? [
            { name: "style", selector: { select: { mode: "dropdown", options: [
              { value: "top", label: "Congélateur en haut / Top freezer" }, { value: "bottom", label: "Congélateur en bas / Bottom freezer" },
              { value: "bottom_door", label: "Combiné, porte en bas / Bottom freezer door" },
              { value: "french", label: "French door" }, { value: "four_door", label: "4 portes / 4-door" }, { value: "american", label: "Américain / Side-by-side" }, { value: "single", label: "Une porte / Single door" }] } } },
            { name: "finish", selector: { select: { mode: "dropdown", options: [{ value: "inox", label: "Inox / Stainless steel" }, { value: "white", label: "Blanc / White" }, { value: "black", label: "Noir / Black" }] } } },
            { name: "temperature_unit", selector: { select: { mode: "dropdown", options: [{ value: "C", label: "°C" }, { value: "F", label: "°F" }] } } },
            // bornes larges : les seuils sont saisis dans l'unité choisie (°C ou °F)
            { name: "max_temperature", selector: { number: { min: 0, max: 60, step: 0.5, mode: "box" } } },
            { name: "freezer_max_temperature", selector: { number: { min: -30, max: 32, step: 0.5, mode: "box" } } },
            { name: "flex_max_temperature", selector: { number: { min: -30, max: 60, step: 0.5, mode: "box" } } },
          ] : []),
          ...(["washer", "dryer", "dishwasher"].includes(kind) ? [
            { name: "last_cycle", selector: { boolean: {} } },
            { name: "estimate", selector: { boolean: {} } },
          ] : []),
          ...(kind === "water_heater" ? [{ name: "last_cycle", selector: { boolean: {} } },
            { name: "tank_volume", selector: { number: { min: 0, max: 1000, step: 1, mode: "box", unit_of_measurement: "L" } } }] : []),
          ...(["washer", "dryer", "dishwasher", "water_heater"].includes(kind) ? [
            { name: "cycle_gap", selector: { number: { min: 0, max: 240, step: 1, mode: "box", unit_of_measurement: "min" } } },
          ] : []),
          ...(d.fields.includes("energy") ? [{ name: "energy_period", selector: { select: { mode: "dropdown", options: [
            { value: "", label: tr(null, "energy") }, ...PERIODS.map((value) => ({ value, label: tr(null, `energy_${value}`) })),
            { value: "none", label: tr(null, "energy_none") }] } } }] : []), // none : pas de tuile énergie
          ...(d.fields.includes("energy") || ["washer", "dryer", "dishwasher"].includes(kind) ? [
            { name: "price_per_kwh", selector: { number: { min: 0, max: 2, step: 0.0001, mode: "box" } } },
            { name: "display", selector: { select: { mode: "dropdown", options: [
              { value: "", label: "kWh + €" }, { value: "energy", label: "kWh" }, { value: "cost", label: "€" }] } } },
          ] : []),
          { name: "illustration_size", selector: { number: { min: 30, max: 300, step: 5, mode: "slider", unit_of_measurement: "%" } } },
          { name: "transparent", selector: { boolean: {} } },
          ...window.applianceTileFields(),
          { name: "animations", selector: { boolean: {} }, default: true },
          { name: "hide_when_inactive", selector: { boolean: {} } },
          { name: "hide_delay", selector: { number: { min: 0, max: 1440, step: 1, mode: "box", unit_of_measurement: "min" } } },
          ...(kind === "generic" ? [{ name: "image", selector: { text: {} } }, { name: "images", selector: { object: {} } }] : []),
          ...(kind === "printer_3d" ? [
            // model : photo de l'imprimante (vide = dessin d'origine)
            { name: "model", selector: { select: { mode: "dropdown", options: [
              { value: "", label: tr(null, "printer_drawing") }, { value: "neptune4pro", label: "Elegoo Neptune 4 Pro" }, { value: "kobrax", label: "Anycubic Kobra X" }, { value: "a1", label: "Bambu Lab A1" },
              { value: "x1c", label: "Bambu Lab X1 Carbon (photo)" }, { value: "x1c_svg", label: "Bambu Lab X1 Carbon (SVG)" },
              { value: "h2d", label: "Bambu Lab H2D (photo)" }, { value: "h2d_svg", label: "Bambu Lab H2D (SVG)" },
              { value: "mk4", label: "Prusa MK4 / MK4S" }, { value: "mk3", label: "Prusa i3 MK3 / MK3S+" }] } } },
            { name: "nozzle_temperatures", selector: { entity: { multiple: true, domain: "sensor" } } },
            { name: "filament_color", selector: { text: {} } },
          ] : []),
          ...(["radiator", "towel_dryer", "ac_split"].includes(kind) ? [
            { name: "lcd_value", selector: { select: { mode: "dropdown", options: [
              { value: "target", label: tr(null, "lcd_value_target") }, { value: "current", label: tr(null, "lcd_value_current") }] } } },
            { name: "lcd_big", selector: { boolean: {} }, default: false },
          ] : []),
          ...(["ac_split", "heat_pump"].includes(kind) ? [
            { name: "hvac", selector: { select: { mode: "dropdown", options: [
              { value: "auto", label: "Auto (saison) / Auto (season)" }, { value: "cool", label: "Climatisation / Cooling" }, { value: "heat", label: "Chauffage / Heating" }] } } },
          ] : []),
          ...(kind === "ceiling_fan" ? [
            { name: "mid_threshold", selector: { number: { min: 5, max: 200, step: 1, mode: "box", unit_of_measurement: "W" } } },
            { name: "high_threshold", selector: { number: { min: 5, max: 300, step: 1, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "fan" ? [
            { name: "oscillating", selector: { boolean: {} }, default: true },
            { name: "mid_threshold", selector: { number: { min: 5, max: 200, step: 1, mode: "box", unit_of_measurement: "W" } } },
            { name: "high_threshold", selector: { number: { min: 5, max: 300, step: 1, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "air_purifier" ? [
            { name: "mid_threshold", selector: { number: { min: 1, max: 200, step: 0.5, mode: "box", unit_of_measurement: "W" } } },
            { name: "high_threshold", selector: { number: { min: 1, max: 300, step: 0.5, mode: "box", unit_of_measurement: "W" } } },
            { name: "pm25_max", selector: { number: { min: 5, max: 500, step: 1, mode: "box", unit_of_measurement: "µg/m³" } } },
            { name: "filter_alert", selector: { number: { min: 0, max: 50, step: 1, mode: "box", unit_of_measurement: "%" } } },
          ] : []),
          ...(kind === "tool_charger" ? [
            { name: "standby_threshold", selector: { number: { min: 0, max: 20, step: 0.1, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "av_receiver" ? [
            { name: "max_power", selector: { number: { min: 50, max: 2000, step: 10, mode: "box", unit_of_measurement: "W" } } },
            { name: "show_controls", selector: { boolean: {} }, default: true },
            { name: "show_source", selector: { boolean: {} }, default: true },
            { name: "show_sound_mode", selector: { boolean: {} }, default: true },
            { name: "volume_step", selector: { number: { min: 0.01, max: 0.2, step: 0.01, mode: "box" } } },
          ] : []),
          ...(kind === "smart_speaker" ? [
            // model : photo de l'enceinte (vide = devinée depuis l'entité : Sonos, Google Nest, sinon Echo Dot)
            { name: "model", selector: { select: { mode: "dropdown", options: [
              { value: "echo_pop", label: "Amazon Echo Pop" }, { value: "echo_dot", label: "Amazon Echo Dot (5e gén. avec horloge / 5th gen, clock)" }, { value: "echo_dot_5", label: "Amazon Echo Dot (5e gén. sans horloge / 5th gen, no clock)" }, { value: "echo_flex", label: "Amazon Echo Flex" }, { value: "echo_dot_3", label: "Amazon Echo Dot (3e gén. / 3rd gen)" }, { value: "echo_plus_2", label: "Amazon Echo Plus (2e gén. / 2nd gen)" },
              { value: "echo_show_5", label: "Amazon Echo Show 5" }, { value: "echo_show_8", label: "Amazon Echo Show 8" },
              { value: "echo_show_10", label: "Amazon Echo Show 10" }, { value: "echo_show_11", label: "Amazon Echo Show 11" },
              { value: "echo_show_15", label: "Amazon Echo Show 15" }, { value: "echo_spot", label: "Amazon Echo Spot" },
              { value: "nest_mini", label: "Google Nest Mini" }, { value: "nest_audio", label: "Google Nest Audio" },
              { value: "nest_hub", label: "Google Nest Hub (7\")" }, { value: "nest_hub_2", label: "Google Nest Hub (2e gén. / 2nd gen)" },
              { value: "nest_hub_max", label: "Google Nest Hub Max" },
              { value: "sonos_play_1", label: "Sonos Play:1" }, { value: "sonos_play_3", label: "Sonos Play:3" }, { value: "sonos_play_5", label: "Sonos Play:5" },
              { value: "sonos_one", label: "Sonos One" }, { value: "sonos_one_sl", label: "Sonos One SL" },
              { value: "sonos_era_100", label: "Sonos Era 100" }, { value: "sonos_era_300", label: "Sonos Era 300" },
              { value: "sonos_five", label: "Sonos Five" }, { value: "sonos_roam", label: "Sonos Roam" },
              { value: "sonos_beam", label: "Sonos Beam / Arc" }, { value: "sonos_sub_mini", label: "Sonos Sub Mini" }, { value: "sonos_sub", label: "Sonos Sub" },
              { value: "devialet_phantom", label: "Devialet Phantom (1re gén. / 1st gen)" }, { value: "devialet_phantom_reactor", label: "Devialet Phantom Reactor" },
              { value: "devialet_phantom_i", label: "Devialet Phantom I" }, { value: "devialet_phantom_ii", label: "Devialet Phantom II" },
              { value: "devialet_phantom_ultimate", label: "Devialet Phantom Ultimate" },
              { value: "samsung_hw_q800c", label: "Samsung HW-Q800C (photo)" }, { value: "samsung_hw_q800c_svg", label: "Samsung HW-Q800C (SVG)" },
              { value: "homepod", label: "Apple HomePod (2e gén. / 2nd gen)" }, { value: "homepod_mini", label: "Apple HomePod mini 2" }] } } },
            // finish : couleur de l'enceinte (Devialet : blanc / noir ; HomePod : minuit / blanc ; HomePod mini : 5 couleurs)
            { name: "finish", selector: { select: { mode: "dropdown", options: [
              { value: "white", label: "Blanc / White" }, { value: "black", label: "Noir / Black" }, { value: "midnight", label: "Minuit / Midnight" },
              { value: "pink", label: "Rose / Pink" }, { value: "green", label: "Vert / Green" }, { value: "blue", label: "Bleu / Blue" }] } } },
            { name: "show_controls", selector: { boolean: {} }, default: true },
            { name: "show_media", selector: { boolean: {} }, default: true },
            { name: "volume_step", selector: { number: { min: 0.01, max: 0.2, step: 0.01, mode: "box" } } },
          ] : []),
          ...(kind === "tv" ? [
            // model : vidéoprojecteur en photo (vide = télé dessinée)
            { name: "model", selector: { select: { mode: "dropdown", options: [
              { value: "", label: "Télé (dessin) / TV (drawing)" },
              { value: "projector", label: "Vidéoprojecteur classique / Projector (short throw)" },
              { value: "projector_compact", label: "Vidéoprojecteur compact laser / Compact laser projector" }] } } },
            { name: "style", selector: { select: { mode: "dropdown", options: [
              { value: "wall", label: "Murale / Wall-mounted" }, { value: "stand", label: "Pied central / Center stand" }, { value: "feet", label: "Deux pieds / Two feet" }] } } },
            // fonctions à afficher (cases à cocher) : boutons de commande, source, volume, lampe, mode d'image, température
            { name: "show_controls", selector: { boolean: {} } },
            { name: "show_source", selector: { boolean: {} } },
            { name: "show_volume", selector: { boolean: {} } },
            { name: "show_media", selector: { boolean: {} }, default: true },
            { name: "show_lamp", selector: { boolean: {} }, default: true },
            { name: "show_picture_mode", selector: { boolean: {} }, default: true },
            { name: "show_temperature", selector: { boolean: {} }, default: true },
            { name: "volume_step", selector: { number: { min: 0.01, max: 0.2, step: 0.01, mode: "box" } } },
          ] : []),
          ...(kind === "ps5" ? [
            { name: "standby_threshold", selector: { number: { min: 0, max: 20, step: 0.1, mode: "box", unit_of_measurement: "W" } } },
            { name: "gaming_threshold", selector: { number: { min: 30, max: 400, step: 5, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "desktop_pc" ? [
            { name: "style", selector: { select: { mode: "dropdown", options: [
              { value: "full", label: "Écran + unité centrale / Monitor + tower" }, { value: "tower", label: "Unité centrale seule / Tower only" }] } } },
          ] : []),
          ...(kind === "monitor" ? [
            { name: "screens", selector: { select: { mode: "dropdown", options: [
              { value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" }] } } },
            { name: "standby_threshold", selector: { number: { min: 0, max: 10, step: 0.1, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "range_hood" ? [
            { name: "high_threshold", selector: { number: { min: 40, max: 600, step: 5, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "coffee_maker" ? [
            { name: "style", selector: { select: { mode: "dropdown", options: [
              { value: "filtre", label: "Filtre / Drip" }, { value: "dosette", label: "Dosettes / Pods" }, { value: "expresso", label: "Expresso / Bean-to-cup" }] } } },
            { name: "warm_threshold", selector: { number: { min: 0, max: 300, step: 1, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "cookeo" ? [
            { name: "style", selector: { select: { mode: "dropdown", options: [{ value: "photo", label: "Photo" }, { value: "drawing", label: "Dessin / Drawing" }] } } },
            { name: "standby_threshold", selector: { number: { min: 0, max: 20, step: 0.1, mode: "box", unit_of_measurement: "W" } } },
            { name: "heat_threshold", selector: { number: { min: 200, max: 1500, step: 10, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "thermomix" ? [
            { name: "model", selector: { select: { mode: "dropdown", options: [{ value: "tm6", label: "TM6 (blanc / white)" }, { value: "tm7", label: "TM7 (noir / black)" }] } } },
            { name: "standby_threshold", selector: { number: { min: 0, max: 20, step: 0.1, mode: "box", unit_of_measurement: "W" } } },
            { name: "turbo_threshold", selector: { number: { min: 50, max: 900, step: 10, mode: "box", unit_of_measurement: "W" } } },
            { name: "heat_threshold", selector: { number: { min: 200, max: 1500, step: 10, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          { name: "show_power", selector: { boolean: {} }, default: true },
          ...(d.fields.includes("energy") ? [{ name: "show_energy", selector: { boolean: {} }, default: true }] : []),
          ...(d.fields.includes("cost") || d.fields.includes("energy") ? [{ name: "show_cost", selector: { boolean: {} }, default: true }] : []),
          ...(d.fields.includes("switch") ? [{ name: "show_toggle", selector: { boolean: {} }, default: true }] : []),
          { name: "hide_zero_power", selector: { boolean: {} }, default: true },
          ...(["radiator", "towel_dryer", "pellet_stove"].includes(kind) ? [{ name: "show_modes", selector: { boolean: {} }, default: true }] : []),
          ...(USAGE_KINDS.includes(kind) ? [{ name: "show_usage_time", selector: { boolean: {} }, default: true }] : []),
          ...(FIT_KINDS.includes(kind) ? [
            { name: "max_power", selector: { number: { min: 20, max: 1000, step: 5, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "server_rack" ? [
            { name: "max_power", selector: { number: { min: 50, max: 3000, step: 10, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "radiator" ? [
            { name: "max_power", selector: { number: { min: 100, max: 5000, step: 50, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "hob" ? [
            { name: "zone_power", selector: { number: { min: 500, max: 4000, step: 50, mode: "box", unit_of_measurement: "W" } } },
            { name: "residual_minutes", selector: { number: { min: 0, max: 60, step: 1, mode: "box", unit_of_measurement: "min" } } },
          ] : []),
          ...(kind === "power_strip" ? [
            { name: "outlets", selector: { entity: { multiple: true, domain: ["switch", "light", "input_boolean"] } } },
            { name: "sockets", selector: { number: { min: 2, max: 6, step: 1, mode: "box" } } },
          ] : []),
          ...(kind === "printer" ? [
            { name: "model", selector: { select: { mode: "dropdown", options: [
              { value: "", label: tr(null, "printer_drawing") }, { value: "samsung_c480", label: "Samsung Xpress C480W (photo)" }, { value: "brother_mfcj5955dw", label: "Brother MFC-J5955DW (photo)" }] } } },
            // modèle Brother : niveaux d'encre, message d'état et seuil d'encre faible
            ...["ink_black", "ink_cyan", "ink_magenta", "ink_yellow", "status_message"].map((name) => ({ name, selector: { entity: { domain: "sensor" } } })),
            { name: "ink_low", selector: { number: { min: 1, max: 100, step: 1, mode: "box", unit_of_measurement: "%" } } },
            { name: "scan_threshold", selector: { number: { min: 1, max: 500, step: 1, mode: "box", unit_of_measurement: "W" } } },
            { name: "standby_threshold", selector: { number: { min: 0, max: 20, step: 0.1, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "smart_plug" ? [
            // appareil branché derrière la prise : image (URL) et / ou icône ; voyants d'état au choix
            { name: "image", selector: { text: {} } },
            { name: "icon", selector: { icon: {} } },
            { name: "plug_type", selector: { select: { mode: "dropdown", options: [
              { value: "eu", label: tr(null, "plug_eu") }, { value: "us", label: tr(null, "plug_us") }] } } },
            { name: "indicators", selector: { select: { multiple: true, mode: "list", options: [
              { value: "led", label: tr(null, "ind_led") }, { value: "bolt", label: tr(null, "ind_bolt") }, { value: "ring", label: tr(null, "ind_ring") },
              { value: "glow", label: tr(null, "ind_glow") }, { value: "flow", label: tr(null, "ind_flow") }] } } },
          ] : []),
          ...(["phone_charger", "piano"].includes(kind) ? [
            { name: "standby_threshold", selector: { number: { min: 0, max: 10, step: 0.1, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "garland" ? [{ name: "multicolor", selector: { boolean: {} }, default: true }] : []),
          ...(kind === "kettle" ? [
            { name: "hot_minutes", selector: { number: { min: 0, max: 60, step: 1, mode: "box", unit_of_measurement: "min" } } },
          ] : []),
          ...(kind === "toaster" ? [
            { name: "ready_minutes", selector: { number: { min: 0, max: 30, step: 1, mode: "box", unit_of_measurement: "min" } } },
          ] : []),
          ...(kind === "wet_vacuum" ? [
            { name: "selfclean_threshold", selector: { number: { min: 5, max: 1000, step: 1, mode: "box", unit_of_measurement: "W" } } },
            { name: "battery_low", selector: { number: { min: 0, max: 100, step: 1, mode: "box", unit_of_measurement: "%" } } },
          ] : []),
          ...(kind === "dehumidifier" ? [
            { name: "humidity_max", selector: { number: { min: 40, max: 100, step: 1, mode: "box", unit_of_measurement: "%" } } },
          ] : []),
          ...(kind === "vmc" ? [
            { name: "high_threshold", selector: { number: { min: 5, max: 300, step: 1, mode: "box", unit_of_measurement: "W" } } },
            { name: "humidity_max", selector: { number: { min: 40, max: 100, step: 1, mode: "box", unit_of_measurement: "%" } } },
          ] : []),
          ...(kind === "solar" ? [
            { name: "max_power", selector: { number: { min: 100, max: 50000, step: 50, mode: "box", unit_of_measurement: "Wc" } } },
            { name: "sun_entity", selector: { entity: { domain: "sun" } } },
          ] : []),
          ...(kind === "pool_pump" ? [
            // mesures affichées en tuiles : chacune se coche / décoche (affichée si le capteur est renseigné)
            ...["temperature", "ph", "orp", "pressure", "tds", "salt", "chlorine"].map((k) => ({ name: `show_${k}`, selector: { boolean: {} }, default: true })),
            { name: "max_power", selector: { number: { min: 100, max: 3000, step: 10, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "pellet_stove" ? [
            { name: "ignition_threshold", selector: { number: { min: 50, max: 1000, step: 10, mode: "box", unit_of_measurement: "W" } } },
            { name: "pellet_alert", selector: { number: { min: 0, max: 50, step: 1, mode: "box", unit_of_measurement: "%" } } },
          ] : []),
          ...(["washer", "dryer", "dishwasher", "pellet_stove", "printer_3d", "chest_freezer", "drawer_freezer", "desktop_pc", "server_rack", "ps5", "thermomix", "cookeo"].includes(kind) ? [{ name: "confirm_off", selector: { boolean: {} }, default: true }] : []),
          // case à cocher : 2e clic obligatoire dès que la prise est allumée, quel que soit l'appareil
          ...(d.fields.includes("switch") || kind === "power_strip" ? [{ name: "confirm_always", selector: { boolean: {} } }] : []),
          { name: "tap_action", selector: { ui_action: { actions: ["more-info", "toggle", "navigate", "url", "perform-action", "none"] } } },
          { name: "hold_action", selector: { ui_action: { actions: ["more-info", "toggle", "navigate", "url", "perform-action", "none"] } } },
          { name: "color", selector: { text: {} } },
        ],
      },
    ],
    computeLabel: (s) => (s.name ? tr(null, kind === "solar" && s.name === "max_power" ? "f_max_power_solar" : kind === "wine_cooler" && s.name === "max_temperature" ? "f_max_temperature_wine" : kind === "cookeo" && s.name === "style" ? "f_cookeo_style" : kind === "fridge" && s.name === "style" ? "f_fridge_style" : kind === "fridge" && s.name === "finish" ? "f_fridge_finish" : kind === "tv" && s.name === "style" ? "f_tv_style" : kind === "tv" && s.name === "model" ? "f_tv_model" : kind === "tv" && s.name === "show_controls" ? "f_show_controls_tv" : kind === "tv" && s.name === "show_media" ? "f_show_media_tv" : kind === "desktop_pc" && s.name === "style" ? "f_pc_style" : kind === "thermomix" && s.name === "model" ? "f_thermomix_model" : kind === "smart_speaker" && s.name === "model" ? "f_speaker_model" : kind === "smart_speaker" && s.name === "finish" ? "f_speaker_finish" : ["printer_3d", "printer"].includes(kind) && s.name === "model" ? "f_printer_model" : ["monitor", "phone_charger", "piano", "thermomix", "printer"].includes(kind) && s.name === "standby_threshold" ? "f_standby_threshold_monitor" : kind === "ps5" && s.name === "standby_threshold" ? "f_standby_threshold_ps5" : kind === "server_rack" && s.name === "max_power" ? "f_max_power_rack" : kind === "radiator" && s.name === "max_power" ? "f_max_power_rad" : `f_${s.name}`) : undefined),
  };
}

/* ------------------------------------------------------------------ */
/* Stub config: auto-detect entities by name                           */
/* ------------------------------------------------------------------ */
function stubFor(kind, hass) {
  const keys = DEF[kind].keys;
  const ids = Object.keys(hass?.states || {});
  const match = (i) => keys.some((k) => i.split(".")[1].includes(k));
  const pick = (pred) => ids.find((i) => match(i) && pred(i, hass.states[i]));
  const dc = (st) => st.attributes.device_class;
  const cfg = {};
  const power = pick((i, st) => i.startsWith("sensor.") && dc(st) === "power");
  const energy = pick((i, st) => i.startsWith("sensor.") && dc(st) === "energy" && /(daily|jour|today|day)/.test(i))
    || pick((i, st) => i.startsWith("sensor.") && dc(st) === "energy");
  const cost = pick((i) => i.startsWith("sensor.") && /(cout|cost|prix)/.test(i) && /(jour|daily|today|day)/.test(i))
    || pick((i, st) => i.startsWith("sensor.") && dc(st) === "monetary");
  const sw = pick((i) => i.startsWith("switch.") && !/(child_lock|lock|led|indicator)/.test(i));
  const wh = kind === "water_heater" ? pick((i) => i.startsWith("water_heater.")) : ["tv", "av_receiver", "ps5", "smart_speaker"].includes(kind) ? pick((i) => i.startsWith("media_player.")) : ["fan", "ceiling_fan", "air_purifier"].includes(kind) ? pick((i) => i.startsWith("fan.")) : ["ac_split", "heat_pump"].includes(kind) ? pick((i) => i.startsWith("climate.")) : kind === "dehumidifier" ? pick((i) => i.startsWith("humidifier.")) : null;
  const temp = pick((i, st) => i.startsWith("sensor.") && dc(st) === "temperature");
  const flag = ["washer", "dryer", "dishwasher", "microwave"].includes(kind)
    ? pick((i) => /^(input_boolean|binary_sensor)\./.test(i) && /(running|en_cours|marche|cycle)/.test(i)) : null;
  if (wh) cfg.entity = wh;
  if (flag) cfg.entity = flag;
  if (power) cfg.power = power;
  if (energy) cfg.energy = energy;
  if (cost) cfg.cost = cost;
  if (sw && ["water_heater", "oven", "microwave", "pool_pump", "dosing_pump", "elliptical", "exercise_bike", "rowing_machine", "air_fryer", "coffee_maker", "thermomix", "cookeo", "tv", "range_hood", "ac_split", "heat_pump", "towel_dryer", "server_rack", "desktop_pc", "ps5", "laptop", "monitor", "kettle", "toaster", "power_strip", "smart_plug", "printer", "phone_charger", "piano", "garland", "wine_cooler", "beer_tap", "av_receiver", "fan", "tool_charger", "ceiling_fan", "dehumidifier", "air_purifier"].includes(kind)) cfg.switch = sw;
  else if (sw && !cfg.entity) cfg.entity = sw;
  const clim = kind === "radiator" ? pick((i) => i.startsWith("climate.")) : null;
  if (clim) cfg.entity = clim;
  if (temp && ["kettle", "cookeo", "fridge", "water_heater", "oven", "air_fryer", "beer_tap", "pellet_stove", "pool_pump", "printer_3d", "chest_freezer", "drawer_freezer", "radiator", "towel_dryer", "server_rack", "wine_cooler"].includes(kind)) cfg.temperature = temp;
  if (kind === "dehumidifier") {
    const hum = pick((i, st) => i.startsWith("sensor.") && dc(st) === "humidity");
    const tank = pick((i) => i.startsWith("binary_sensor.") && /(tank|bac|reservoir|full|plein)/.test(i));
    if (hum) cfg.humidity = hum;
    if (tank) cfg.tank_full = tank;
    if (temp) cfg.temperature = temp;
  }
  if (kind === "air_purifier") {
    const pm = pick((i, st) => i.startsWith("sensor.") && (dc(st) === "pm25" || /pm2_?5/.test(i)));
    const flt = pick((i) => /^(sensor|binary_sensor)\./.test(i) && /(filter|filtre)/.test(i));
    if (pm) cfg.pm25 = pm;
    if (flt) cfg.filter = flt;
  }
  if (kind === "wet_vacuum") {
    // statut (vacuum ou capteur texte), réservoirs et mode
    const st = pick((i) => i.startsWith("vacuum.")) || pick((i) => /^(sensor|select)\./.test(i) && /(status|statut|etat|state|mode_de_travail|work)/.test(i));
    const cl = pick((i) => /^(sensor|binary_sensor)\./.test(i) && /(clean_water|eau_propre|clear_water|fresh_water|clean_tank)/.test(i));
    const dt = pick((i) => /^(sensor|binary_sensor)\./.test(i) && /(dirty|sale|sewage|waste_water|dirty_tank)/.test(i));
    const md = pick((i) => /^(select|sensor)\./.test(i) && /(mode|suction|aspiration|power_mode)/.test(i) && !/(status|statut)/.test(i));
    if (st) cfg.entity = st;
    if (cl) cfg.clean_water = cl;
    if (dt) cfg.dirty_water = dt;
    if (md) cfg.mode = md;
  }
  const batt = ["tool_charger", "wet_vacuum"].includes(kind) ? pick((i, st) => i.startsWith("sensor.") && dc(st) === "battery") : null;
  if (batt) cfg.battery_level = batt;
  // enceinte connectée : nouvelles cartes sans tuiles puissance / énergie / coût (cases décochées) ; les cartes existantes ne changent pas
  if (kind === "smart_speaker") Object.assign(cfg, { show_power: false, show_energy: false, show_cost: false });
  if (!cfg.entity && !cfg.power && !cfg.switch && !cfg.temperature) cfg.power = "sensor.example_power";
  return cfg;
}
