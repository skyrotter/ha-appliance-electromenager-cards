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
  // climate / water_heater acceptés : la carte lit alors current_temperature / temperature (pas l'état, qui est un mode)
  temperature: { entity: { filter: [{ domain: ["sensor", "input_number"], device_class: "temperature" }, { domain: ["climate", "water_heater"] }] } },
  target_temperature: { entity: { domain: ["sensor", "input_number", "number", "climate", "water_heater"] } },
  freezer_temperature: { entity: { domain: "sensor", device_class: "temperature" } },
  flex_temperature: { entity: { domain: ["sensor", "climate"] } },
  power_level: { entity: { domain: ["sensor", "number", "input_number", "select", "input_select"] } },
  pellet_level: { entity: { domain: ["sensor", "number", "input_number"] } },
  runtime: { entity: { domain: ["sensor"] } },
  light: { entity: { domain: ["light", "switch", "binary_sensor", "input_boolean"] } },
  zone2_temperature: { entity: { domain: ["sensor", "input_number"], device_class: "temperature" } },
  battery_level: { entity: { domain: ["sensor", "number", "input_number"] } },
  keg_level: { entity: { domain: ["sensor", "number", "input_number"] } },
  pouring: { entity: { domain: ["binary_sensor", "input_boolean", "switch"] } },
  bed_temperature: { entity: { domain: ["sensor"], device_class: "temperature" } },
  humidity: { entity: { domain: ["sensor"], device_class: "humidity" } },
  mode: { entity: { domain: ["select", "input_select", "sensor", "climate"] } },
  window: { entity: { domain: "binary_sensor" } },
  zone_1: { entity: { domain: ["sensor", "number", "select", "input_number"] } },
  zone_2: { entity: { domain: ["sensor", "number", "select", "input_number"] } },
  zone_3: { entity: { domain: ["sensor", "number", "select", "input_number"] } },
  zone_4: { entity: { domain: ["sensor", "number", "select", "input_number"] } },
  speed: { entity: { domain: ["sensor", "number", "input_number", "select"] } },
  target_humidity: { entity: { domain: ["sensor", "number", "input_number", "humidifier"] } },
  tank_full: { entity: { domain: ["binary_sensor", "input_boolean", "sensor"] } },
  fan_speed: { entity: { domain: ["select", "input_select", "sensor", "number", "input_number", "fan"] } },
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
            { name: "freezer_max_temperature", selector: { number: { min: -30, max: 0, step: 0.5, mode: "box" } } },
          ] : []),
          ...(kind === "wine_cooler" ? [
            { name: "max_temperature", selector: { number: { min: 5, max: 25, step: 0.5, mode: "box" } } },
            { name: "max_temperature_2", selector: { number: { min: 3, max: 25, step: 0.5, mode: "box" } } },
          ] : []),
          ...(kind === "fridge" ? [
            { name: "style", selector: { select: { mode: "dropdown", options: [
              { value: "top", label: "Congélateur en haut / Top freezer" }, { value: "bottom", label: "Congélateur en bas / Bottom freezer" },
              { value: "bottom_door", label: "Combiné, porte en bas / Bottom freezer door" },
              { value: "french", label: "French door" }, { value: "four_door", label: "4 portes / 4-door" }, { value: "american", label: "Américain / Side-by-side" }] } } },
            { name: "max_temperature", selector: { number: { min: 0, max: 15, step: 0.5, mode: "box" } } },
            { name: "freezer_max_temperature", selector: { number: { min: -30, max: 0, step: 0.5, mode: "box" } } },
            { name: "flex_max_temperature", selector: { number: { min: -30, max: 15, step: 0.5, mode: "box" } } },
          ] : []),
          ...(["washer", "dryer", "dishwasher"].includes(kind) ? [
            { name: "last_cycle", selector: { boolean: {} } },
            { name: "price_per_kwh", selector: { number: { min: 0, max: 2, step: 0.0001, mode: "box" } } },
          ] : []),
          ...(d.fields.includes("energy") ? [{ name: "energy_period", selector: { select: { mode: "dropdown", options: [
            { value: "", label: tr(null, "energy") }, ...["day", "week", "month"].map((value) => ({ value, label: tr(null, `energy_${value}`) }))] } } }] : []),
          { name: "illustration_size", selector: { number: { min: 30, max: 300, step: 5, mode: "slider", unit_of_measurement: "%" } } },
          { name: "transparent", selector: { boolean: {} } },
          { name: "animations", selector: { boolean: {} }, default: true },
          ...(kind === "generic" ? [{ name: "image", selector: { text: {} } }, { name: "images", selector: { object: {} } }] : []),
          ...(kind === "printer_3d" ? [
            { name: "nozzle_temperatures", selector: { entity: { multiple: true, domain: "sensor" } } },
            { name: "filament_color", selector: { text: {} } },
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
          ...(kind === "tool_charger" ? [
            { name: "standby_threshold", selector: { number: { min: 0, max: 20, step: 0.1, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "av_receiver" ? [
            { name: "max_power", selector: { number: { min: 50, max: 2000, step: 10, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "tv" ? [
            { name: "style", selector: { select: { mode: "dropdown", options: [
              { value: "wall", label: "Murale / Wall-mounted" }, { value: "stand", label: "Pied central / Center stand" }, { value: "feet", label: "Deux pieds / Two feet" }] } } },
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
          { name: "show_power", selector: { boolean: {} }, default: true },
          ...(["radiator", "towel_dryer"].includes(kind) ? [{ name: "show_modes", selector: { boolean: {} }, default: true }] : []),
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
            { name: "max_power", selector: { number: { min: 100, max: 3000, step: 10, mode: "box", unit_of_measurement: "W" } } },
          ] : []),
          ...(kind === "pellet_stove" ? [
            { name: "ignition_threshold", selector: { number: { min: 50, max: 1000, step: 10, mode: "box", unit_of_measurement: "W" } } },
            { name: "pellet_alert", selector: { number: { min: 0, max: 50, step: 1, mode: "box", unit_of_measurement: "%" } } },
          ] : []),
          ...(["washer", "dryer", "dishwasher", "pellet_stove", "printer_3d", "chest_freezer", "drawer_freezer", "desktop_pc", "server_rack"].includes(kind) ? [{ name: "confirm_off", selector: { boolean: {} }, default: true }] : []),
          { name: "color", selector: { text: {} } },
        ],
      },
    ],
    computeLabel: (s) => (s.name ? tr(null, kind === "solar" && s.name === "max_power" ? "f_max_power_solar" : kind === "wine_cooler" && s.name === "max_temperature" ? "f_max_temperature_wine" : kind === "fridge" && s.name === "style" ? "f_fridge_style" : kind === "tv" && s.name === "style" ? "f_tv_style" : kind === "desktop_pc" && s.name === "style" ? "f_pc_style" : ["monitor", "phone_charger", "piano"].includes(kind) && s.name === "standby_threshold" ? "f_standby_threshold_monitor" : kind === "server_rack" && s.name === "max_power" ? "f_max_power_rack" : kind === "radiator" && s.name === "max_power" ? "f_max_power_rad" : `f_${s.name}`) : undefined),
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
  const wh = kind === "water_heater" ? pick((i) => i.startsWith("water_heater.")) : kind === "tv" || kind === "av_receiver" ? pick((i) => i.startsWith("media_player.")) : ["fan", "ceiling_fan"].includes(kind) ? pick((i) => i.startsWith("fan.")) : ["ac_split", "heat_pump"].includes(kind) ? pick((i) => i.startsWith("climate.")) : kind === "dehumidifier" ? pick((i) => i.startsWith("humidifier.")) : null;
  const temp = pick((i, st) => i.startsWith("sensor.") && dc(st) === "temperature");
  const flag = ["washer", "dryer", "dishwasher", "microwave"].includes(kind)
    ? pick((i) => /^(input_boolean|binary_sensor)\./.test(i) && /(running|en_cours|marche|cycle)/.test(i)) : null;
  if (wh) cfg.entity = wh;
  if (flag) cfg.entity = flag;
  if (power) cfg.power = power;
  if (energy) cfg.energy = energy;
  if (cost) cfg.cost = cost;
  if (sw && ["water_heater", "oven", "microwave", "pool_pump", "air_fryer", "coffee_maker", "tv", "range_hood", "ac_split", "heat_pump", "towel_dryer", "server_rack", "desktop_pc", "laptop", "monitor", "kettle", "toaster", "power_strip", "phone_charger", "piano", "garland", "wine_cooler", "beer_tap", "av_receiver", "fan", "tool_charger", "ceiling_fan", "dehumidifier"].includes(kind)) cfg.switch = sw;
  else if (sw && !cfg.entity) cfg.entity = sw;
  const clim = kind === "radiator" ? pick((i) => i.startsWith("climate.")) : null;
  if (clim) cfg.entity = clim;
  if (temp && ["kettle", "fridge", "water_heater", "oven", "air_fryer", "beer_tap", "pellet_stove", "pool_pump", "printer_3d", "chest_freezer", "drawer_freezer", "radiator", "towel_dryer", "server_rack", "wine_cooler"].includes(kind)) cfg.temperature = temp;
  if (kind === "dehumidifier") {
    const hum = pick((i, st) => i.startsWith("sensor.") && dc(st) === "humidity");
    const tank = pick((i) => i.startsWith("binary_sensor.") && /(tank|bac|reservoir|full|plein)/.test(i));
    if (hum) cfg.humidity = hum;
    if (tank) cfg.tank_full = tank;
    if (temp) cfg.temperature = temp;
  }
  const batt = kind === "tool_charger" ? pick((i, st) => i.startsWith("sensor.") && dc(st) === "battery") : null;
  if (batt) cfg.battery_level = batt;
  if (!cfg.entity && !cfg.power && !cfg.switch && !cfg.temperature) cfg.power = "sensor.example_power";
  return cfg;
}
