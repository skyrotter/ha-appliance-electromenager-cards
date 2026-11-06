# Pellet stove

A pellet stove draws a lot of power while **igniting** (the igniter element, typically 250–400 W for a few minutes) and little while **burning** (fan and auger, typically 30–100 W). With just a power-monitoring plug, the card therefore tells apart:

| Power | Status | Animation |
|---|---|---|
| above `ignition_threshold` (250 W) | Igniting | small flame, red igniter, smoke from the flue |
| above `threshold` (20 W) | Heating | full flames sized by `power_level`, glowing embers, warm air |
| below `threshold` | Off / Standby | clock on the display |

Shutting down, cleaning and alarms can't be guessed from power: they come from a status entity (`entity:`) whose text contains *extinction/shutdown/cooling*, *alarme/alarm/error*, *allumage/ignition*, *eco/standby*… A `climate` entity from a stove integration also works (its `hvac_action`, current and target temperature are used).

```yaml
type: custom:appliance-pellet-stove-card
power: sensor.stove_plug_power          # enough on its own
energy: sensor.stove_plug_energy_today
temperature: sensor.living_room_temperature
target_temperature: input_number.stove_target   # optional
power_level: sensor.stove_power_level           # optional, 1–5
pellet_level: sensor.stove_pellet_level         # optional, %
```

## Presets

With a `mode` entity (`select` / `input_select`), or a `climate` entity used as `entity` that has `preset_modes`, the card shows one button per preset the entity really offers (Manual, Auto, Eco, Comfort…) and highlights the active one. A tap calls `climate.set_preset_mode` or `select.select_option`. Hide the buttons with `show_modes: false`.

```yaml
type: custom:appliance-pellet-stove-card
entity: climate.stove      # presets come from its preset_modes
# or: mode: select.stove_mode
```

⚠️ **Never cut a pellet stove's power while it is burning or shutting down**: its fan must keep running to evacuate smoke. Use the stove's own controls or integration to turn it off. If you set `switch:`, the card asks for a second click before cutting power while the stove is igniting, heating or shutting down.


[← All cards](../../README.md#the-cards)
