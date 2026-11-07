# Air purifier

`custom:appliance-air-purifier-card`: a slim column air purifier (IKEA FÖRNUFTIG style) with its fabric front, top outlet grille and 0-1-2-3 rotary knob. While running, dust is drawn into the front, air flows up through the filter and clean air blows out of the top; the knob turns to the current speed and everything moves faster at higher speeds.

Made for purifiers that only sit on a **smart plug** (FÖRNUFTIG has no connectivity: the speed is guessed from the power), and also works with a `fan` entity (IKEA STARKVIND, Xiaomi, Levoit…).

States:
- **Speed 1 / 2 / 3**: `fan` entity percentage (≤ 34 %, ≤ 67 %, above), else `fan_speed`, else the power: above `threshold` (1 W) speed 1, above `mid_threshold` (5 W) speed 2, above `high_threshold` (9 W) speed 3.
- **Off**: entity or `switch` off, or power at or below `threshold`.

Alerts: **Poor air quality** when `pm25` is above `pm25_max` (35 µg/m³), **Replace the filter** when `filter` is at or below `filter_alert` (10 %), or when a replace-filter `binary_sensor` is on. The knob is then circled in orange.

```yaml
type: custom:appliance-air-purifier-card
name: FÖRNUFTIG
power: sensor.purifier_plug_power      # smart plug (W)
energy: sensor.purifier_plug_energy    # optional
switch: switch.purifier_plug           # optional: power button
pm25: sensor.bedroom_pm25              # optional: any PM2.5 sensor in the room (µg/m³)
filter: sensor.purifier_filter_life    # optional: % life left, or binary_sensor "replace filter"
mid_threshold: 5                       # optional: speed 2 above (W)
high_threshold: 9                      # optional: speed 3 above (W)
```

With a connected purifier:

```yaml
type: custom:appliance-air-purifier-card
entity: fan.starkvind                  # on/off and percentage
pm25: sensor.starkvind_pm25
filter: binary_sensor.starkvind_replace_filter
```

| Option | Description |
|---|---|
| `entity` | `fan` entity: on/off and speed from `percentage`. Without `switch`, the power button toggles it. |
| `power` / `energy` / `cost` | Smart plug sensors. The power gives the speed when there is no `fan` entity. |
| `fan_speed` | Optional speed entity (`select` 1 / 2 / 3, `night` / `turbo`…, number or percentage): takes priority over the power estimate. |
| `pm25` | PM2.5 sensor (µg/m³), shown as a tile. |
| `filter` | Filter life (%), or a `binary_sensor` / `input_boolean` that is on when the filter must be replaced. |
| `threshold` | Running above this power (W, 1 by default). |
| `mid_threshold` / `high_threshold` | Speed 2 / speed 3 above this power (W, 5 and 9 by default). Check your plug at each knob position and adjust. |
| `pm25_max` | Poor air quality alert above this value (µg/m³, 35 by default). |
| `filter_alert` | Filter alert at or below this life (%, 10 by default). |

Every tile opens the more-info dialog of its entity.

[← All cards](../../README.md#the-cards)
