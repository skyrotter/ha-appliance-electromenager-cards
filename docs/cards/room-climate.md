# Room climate

`custom:appliance-room-climate-card`: a compact card for one room's temperature and humidity. The thermometer's mercury rises to the temperature, water ripples in the drop up to the humidity level, a coloured halo breathes with the comfort state and the last 24 hours are drawn under the values. **Click the card** to open the history pop-up.

**Card**
- Temperature, humidity, change over the last hour (▲ / ▼) and a 24 h graph.
- Comfort badge: **Comfortable**, **Cool**, **Warm**, **Humid**, **Dry**, using the comfort thresholds you set in the editor.
- **Alerts** above or below a threshold (temperature and/or humidity): red badge, red line and faster halo.
- **Dew point** and risks: **Mould risk** when the humidity stays above `mold_humidity` (70 %), **Condensation risk** when the dew point reaches the estimated inside temperature of a double-glazed window (needs an outdoor temperature).
- **Air the room** advice with outdoor sensors: when the room is too humid and the outside air holds less water (absolute humidity, so it works in winter), or when the room is too warm and it is at least 2° cooler outside.
- **Open window**: icon with a window sensor (`entity_window`), otherwise guessed from a sudden temperature drop (`window_drop` in 15 min, 1.5 °C by default; `0` turns it off).
- **Low battery** icon: from `entity_battery` (percentage or `binary_sensor`), or from the `battery_level` / `battery` attribute of the temperature or humidity sensor.

**Pop-up**: **24 h / 7 days / 30 days** and **Both / Temperature / Humidity**. It shows the current value, average, min and max, a graph with a tooltip (hover or touch), the min–max band and the ideal zone, the outdoor value as a dashed line, and a day-by-day summary over 7 days. 7 and 30 days are read from Home Assistant's long-term statistics (hourly mean / min / max, kept forever for sensors with a `state_class`), 24 h from the history; sensors without statistics fall back to the history.

| Option | What it does |
|---|---|
| `entity_temperature`, `entity_humidity` | room sensors (one of them is enough) |
| `entity_outdoor_temperature`, `entity_outdoor_humidity` | outdoor sensors: comparison, condensation risk, airing advice |
| `entity_window` | window / door sensor (`binary_sensor`) |
| `entity_battery` | sensor battery (% or `binary_sensor` on = low) |
| `comfort_temp_min`, `comfort_temp_max` | comfort range (19–25 °C) |
| `humidity_min`, `humidity_max` | comfort humidity (35–65 %) |
| `alert_temp_min`, `alert_temp_max`, `alert_humidity_min`, `alert_humidity_max` | alert thresholds (empty = no alert) |
| `mold_humidity` | mould risk from this humidity (70 %) |
| `window_drop` | open-window detection: temperature drop in 15 min (1.5 °C, `0` = off) |
| `battery_low` | low battery below this % (20) |
| `history_days` | pop-up period when it opens: `1`, `7` (default) or `30` |
| `history_mode` | pop-up graph when it opens: `both` (default), `temperature`, `humidity` |
| `temperature_unit` | `C` or `F` (default: Home Assistant's unit); thresholds are in this unit |
| `show_status`, `show_outdoor`, `show_dew_point`, `show_advice`, `show_graph`, `animations`, `labels`, `language`, `illustration_size`, `transparent` | |

```yaml
type: custom:appliance-room-climate-card
name: Living room
entity_temperature: sensor.living_room_temperature
entity_humidity: sensor.living_room_humidity
entity_outdoor_temperature: sensor.outdoor_temperature   # optional
entity_outdoor_humidity: sensor.outdoor_humidity         # optional
entity_window: binary_sensor.living_room_window          # optional
comfort_temp_min: 19
comfort_temp_max: 24
alert_temp_max: 27
alert_humidity_max: 70
```


[← All cards](../../README.md#the-cards)
