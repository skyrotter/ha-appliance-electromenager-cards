# Room climate

`custom:appliance-room-climate-card`: a compact card for one room's temperature and humidity. The thermometer's mercury rises to the temperature, water ripples in the drop up to the humidity level, a coloured halo breathes with the comfort state and the last 24 hours are drawn under the values. **Click the card** to open the history pop-up.

**12 styles** (`style`, chosen in the editor), all animated, with the same features and the same pop-up:

| `style` | Look |
|---|---|
| `standard` (default) | rising thermometer, rippling drop, breathing halo, 24 h graph |
| `gauge` | temperature ring and inner humidity arc that fill up |
| `gradient` | background coloured by the comfort state, water rising in waves to the humidity level |
| `minimal` | big numbers, colour bar, thin humidity bar |
| `lcd` | weather-station LCD screen with a comfort smiley; `lcd_color`: `auto` (green by day, blue in dark mode), `green`, `blue`, `amber` |
| `tile` | small square (3–4 per row on a phone): humidity ring, temperature in the middle |
| `thermometer` | tall card with a graduated thermometer coloured by the temperature (blue → green → orange → red), 24 h min / avg / max |
| `gradient_ring` | gradient temperature ring, humidity arc, two 24 h mini graphs on the side when the card is wide enough |
| `double_ring` | temperature and humidity rings around the room icon, min / avg / max with their time, 24 h graphs in the background |
| `dial` | brass thermo-hygrometer with two springy needles and green comfort zones |
| `neon` | glowing neon numbers on black, colour of the comfort state |
| `bars` | two columns filling up (temperature and humidity) with the comfort zone marked |

**Card**
- `icon`: room icon shown next to the name in every style (in the middle of `double_ring`).
- Temperature, humidity, change over the last hour (▲ / ▼) and a 24 h graph.
- Comfort badge: **Comfortable**, **Cool**, **Warm**, **Humid**, **Dry**, using the comfort thresholds you set in the editor.
- **Alerts** above or below a threshold (temperature and/or humidity): red badge, red line and faster halo.
- **Dew point** and risks: **Mould risk** when the humidity stays above `mold_humidity` (70 %), **Condensation risk** when the dew point reaches the estimated inside temperature of a double-glazed window (needs an outdoor temperature).
- **Air the room** advice with outdoor sensors: when the room is too humid and the outside air holds less water (absolute humidity, so it works in winter), or when the room is too warm and it is at least 2° cooler outside.
- **Open window**: icon with a window sensor (`entity_window`), otherwise guessed from a sudden temperature drop (`window_drop` in 15 min, 1.5 °C by default; `0` turns it off).
- **Linked thermostat** (`entity_climate`): target temperature with **− / +** buttons (sent 0.8 s after the last tap, respecting the thermostat's step and limits), flame / snowflake while heating / cooling.
- **Low battery** icon: from `entity_battery` (percentage or `binary_sensor`), or from the `battery_level` / `battery` attribute of the temperature or humidity sensor.

**Pop-up**: **24 h / 7 days / 30 days** and **Both / Temperature / Humidity**. It shows the current value, average, min and max, a graph with a tooltip (hover or touch), the min–max band and the ideal zone, the outdoor value as a dashed line, and a day-by-day summary over 7 days. **Compare** overlays the previous period (yesterday for 24 h) as dashed lines. 7 and 30 days are read from Home Assistant's long-term statistics (hourly mean / min / max, kept forever for sensors with a `state_class`), 24 h from the history; sensors without statistics fall back to the history.

| Option | What it does |
|---|---|
| `entity_temperature`, `entity_humidity` | room sensors (one of them is enough) |
| `entity_outdoor_temperature`, `entity_outdoor_humidity` | outdoor sensors: comparison, condensation risk, airing advice |
| `entity_window` | window / door sensor (`binary_sensor`) |
| `entity_climate` | linked thermostat (`climate`): target and − / + buttons |
| `entity_battery` | sensor battery (% or `binary_sensor` on = low) |
| `comfort_temp_min`, `comfort_temp_max` | comfort range (19–25 °C) |
| `humidity_min`, `humidity_max` | comfort humidity (35–65 %) |
| `alert_temp_min`, `alert_temp_max`, `alert_humidity_min`, `alert_humidity_max` | alert thresholds (empty = no alert) |
| `mold_humidity` | mould risk from this humidity (70 %) |
| `window_drop` | open-window detection: temperature drop in 15 min (1.5 °C, `0` = off) |
| `battery_low` | low battery below this % (20) |
| `history_days` | pop-up period when it opens: `1`, `7` (default) or `30` |
| `history_mode` | pop-up graph when it opens: `both` (default), `temperature`, `humidity` |
| `style` | one of the 12 styles above (`standard`) |
| `icon` | room icon (`mdi:sofa`, `mdi:bed`…) |
| `lcd_color` | screen colour of the `lcd` style: `auto`, `green`, `blue`, `amber` |
| `tap_action` | `history` (pop-up, default), `more-info`, `navigate` (with `navigation_path`), `none` |
| `color_comfort`, `color_cool`, `color_warm`, `color_humidity`, `color_dry`, `color_alert` | custom colours (colour picker or CSS colour) |
| `temperature_unit` | `C` or `F` (default: Home Assistant's unit); thresholds are in this unit |
| `show_status`, `show_outdoor`, `show_dew_point`, `show_advice`, `show_graph`, `animations`, `labels`, `language`, `illustration_size`, `transparent` | |

```yaml
type: custom:appliance-room-climate-card
name: Living room
style: dial
icon: mdi:sofa
entity_temperature: sensor.living_room_temperature
entity_humidity: sensor.living_room_humidity
entity_outdoor_temperature: sensor.outdoor_temperature   # optional
entity_outdoor_humidity: sensor.outdoor_humidity         # optional
entity_window: binary_sensor.living_room_window          # optional
comfort_temp_min: 19
comfort_temp_max: 24
alert_temp_max: 27
alert_humidity_max: 70
entity_climate: climate.living_room                       # optional
```


[← All cards](../../README.md#the-cards)
