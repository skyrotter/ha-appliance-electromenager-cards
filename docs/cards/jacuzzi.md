# Hot tub (jacuzzi)

`custom:appliance-jacuzzi-card`

**Hot tub**: spa seen from above, no background: acrylic shell with its thickness at the rim, water with a depth gradient, submerged bench, chrome jets, headrests, waterfall spout and the spa pack hatch. States: off, standby, filtering, heating, jets and fault. Bubbles, jets and the waterfall speed up with power, steam rises while heating, the LEDs light the water when `entity_light` is on, and alerts fire on pH outside `ph_min`–`ph_max` or water above `temp_max`. Without a status entity, the state comes from power (above 30 W filtering, 700 W jets, 1800 W heating).

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language. Temperatures follow `temperature_unit: C|F`, otherwise the unit of Home Assistant: each sensor is converted from its own unit, and temperature thresholds are entered in that unit (the defaults below are in °C and are converted, e.g. 40 °C → 104 °F).

- `entity_status` (climate or text: filtering / heating / jets / standby / off / fault…)
- `entity_power`
- `entity_energy`
- `entity_cost` or `price_per_kwh`
- `entity_temp` (water)
- `entity_target_temp`
- `entity_ph`
- `entity_light` (light or switch, uses `rgb_color` when available)
- `filter_threshold` (default 30 W)
- `jets_threshold` (default 700 W)
- `heater_threshold` (default 1800 W)
- `power_max` (default 2500 W, animation speed)
- `off_threshold` (default 0.5 W)
- `ph_min` / `ph_max` (default 7–7.8)
- `temp_max` (default 40 °C)
- `show_power`
- `show_energy`
- `show_temp`
- `show_ph`
- `show_cost`
- `show_status`

[← All cards](../../README.md#the-cards)
