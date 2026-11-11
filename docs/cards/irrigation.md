# Irrigation

`custom:appliance-irrigation-card`

A garden watering card with **generic entities** (no brand): 1 to 8 zones, a well pump, a rain sensor, soil moisture. A sprinkler head is drawn per zone and sprays when its zone is on; a cloud and raindrops appear when it rains; the pump LED blinks when the pump runs.

- One **button per zone** (tap = on / off): `valve` (open / close), `switch`, `input_boolean`.
- **Stop all** (when there are several zones) and an optional **Auto** button (a switch / input_boolean enabling your watering automations).
- With `block_on_rain: true`, a zone can no longer be started from the card while the rain sensor is on (stopping stays possible). This only blocks the card: keep a rain condition in your automations too.

| Option | What it does |
|---|---|
| `zones` | list of entities (`valve`, `switch`, `input_boolean`), up to 8. Each can also be `{entity, name, icon}` |
| `entity_pump` | well pump (switch, input_boolean or binary_sensor) |
| `entity_master` | « Auto watering » switch (on = enabled), shown as a button |
| `entity_rain` | rain sensor: `binary_sensor` (on = rain) or `sensor` (rate above 0) |
| `block_on_rain` | blocks starting a zone from the card while it rains (default `false`) |
| `entity_flow`, `entity_soil`, `entity_today`, `entity_next`, `entity_pressure`, `entity_power` | tiles: flow, soil moisture, water today, next run (timestamp or text), pressure, power |
| `compact`, `show_buttons`, `show_flow`, `show_soil`, `show_today`, `show_next`, `show_pressure`, `show_pump`, `show_power`, `show_rain`, `animations`, `labels`, `language`, `illustration_size`, `transparent`, `tap_action`, `hold_action` | |

```yaml
type: custom:appliance-irrigation-card
name: Garden
zones:
  - valve.lawn
  - valve.vegetable_garden
  - valve.hedge
  - entity: switch.drip_line
    name: Drip
entity_pump: switch.well_pump
entity_rain: binary_sensor.rain_detector
entity_master: input_boolean.auto_watering
block_on_rain: true
entity_soil: sensor.garden_soil_moisture
```

[← All cards](../../README.md#the-cards)
