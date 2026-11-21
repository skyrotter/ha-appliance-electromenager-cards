# Air conditioning pack (indoor split + outdoor heat pump)

<p align="center"><img src="../air-conditioning.gif" width="560" alt="Air conditioning cards"></p>

Two cards meant to sit side by side, both driven by the same `climate` entity (and/or a power sensor).

**Indoor split** (`custom:appliance-ac-split-card`): the flap opens and swings, air blows down — blue when cooling, orange with a warm glow and rising heat waves when heating, grey in fan mode, droplets in dry mode; the display shows the target temperature with a mode icon. At target: the flap stays open with a gentle airflow.

**Outdoor unit** (`custom:appliance-heat-pump-card`): the fan spins behind its grille, the unit vibrates while the compressor runs, warm air waves come out when cooling, cold air waves when heating, steam rises during defrost. At target: the fan turns slowly.

- With a `climate` entity: `hvac_action` (cooling, heating, drying, fan, idle, defrosting) or, failing that, the HVAC mode.
- With a power sensor only: running above `threshold` (60 W); set `hvac: cool` or `hvac: heat` (default `auto` = cooling May–September, heating otherwise).
- `temperature` on the outdoor card can be an outdoor temperature sensor.

**Humidity** (indoor split): shown under the temperature on the display and in a **Humidity** tile. It comes from the `climate` entity (`current_humidity` attribute, when your integration provides it) or from a humidity sensor set with `humidity`, which takes priority. `lcd_humidity: false` hides it from the display (the tile stays).

**Icon only**: `show_temperature: false` hides the room temperature tile and `show_target: false` hides the set temperature tile (also available in the visual editor).

```yaml
type: custom:appliance-ac-split-card
entity: climate.living_room
power: sensor.ac_power
humidity: sensor.living_room_humidity   # optional, else the climate's current_humidity
---
type: custom:appliance-heat-pump-card
entity: climate.living_room
temperature: sensor.outdoor_temperature
```


[← All cards](../../README.md#the-cards)
