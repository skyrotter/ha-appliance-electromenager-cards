# Water meter

<p align="center"><img src="../water-roof-window.gif" width="600" alt="Animated water meter and roof window cards"></p>

`custom:appliance-water-meter-card`: a brass water meter with a blue dial. The odometer shows the index (black m³ wheels, red litre wheels), the red flow star spins with the flow and water runs in the pipes.

Every sensor is optional, so it works with whatever your meter integration provides (Linky-like water meters, pulse counters, ESPHome, Zigbee/Z-Wave meters, Suez / Veolia / Eau de Paris integrations…):

| Option | What it does |
|---|---|
| `entity_index` | total index; `m³`, `L`, `gal`, `ft³`, `CCF` are converted |
| `entity_flow` | flow rate; `L/min`, `L/h`, `L/s`, `m³/h`, `gal/min` are converted to L/min. **Without it, the flow is derived from the index changes** |
| `entity_today` | today's consumption (any volume unit) |
| `entity_cost` | cost sensor (any currency) |
| `entity_leak` | leak sensor (`binary_sensor` on = leak) |
| `entity_valve` | shut-off valve (`valve`, `switch` or `input_boolean`): **Close / Open valve** button, the valve handle on the pipe turns red |
| `leak_minutes` | without a leak sensor: "Possible leak" when water runs non-stop for longer than this (60 min; `0` turns it off) |
| `flow_threshold` | flow below this counts as zero (0.05 L/min) |
| `show_status`, `show_flow`, `show_today`, `show_index`, `show_cost`, `animations`, `labels`, `language` | |

States: **No flow**, flowing (the badge shows the flow), **Possible leak** (red alert), **Valve closed**.

```yaml
type: custom:appliance-water-meter-card
entity_index: sensor.water_meter_index      # the only sensor many meters provide
entity_today: sensor.water_today            # optional
entity_leak: binary_sensor.kitchen_leak     # optional
entity_valve: valve.main_water              # optional
```


[← All cards](../../README.md#the-cards)
