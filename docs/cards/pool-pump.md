# Pool pump

Water flows in a loop on the drawing: from the pool, through the pre-filter (water swirling, leaves in the basket), the pump and back to the pool, with bubbles at the return jet. The motor fan spins and the pump hums while filtering.

- With a smart plug: above `threshold` (50 W) = **Filtering**. Plug on below it = **Standby**.
- Animation speed follows the pump speed: `speed` in rpm (2800 rpm = full speed) or %, or the power divided by `max_power` for variable-speed pumps.
- The display shows the rpm, the % or the power.
- `runtime`: filtration time today, e.g. a `history_stats` sensor:

```yaml
sensor:
  - platform: history_stats
    name: Pool filtration today
    entity_id: switch.pool_pump
    state: "on"
    type: time
    start: "{{ today_at() }}"
    end: "{{ now() }}"
```

Water analysis and pressure, shown as tiles (each one only if its sensor is set, and each can be switched off):

| Option | Tile | Hide with |
|---|---|---|
| `temperature` | Pool water temperature | `show_temperature: false` |
| `ph` | pH | `show_ph: false` |
| `orp` | ORP (mV) | `show_orp: false` |
| `pressure` | Filter pressure | `show_pressure: false` |
| `tds` | TDS | `show_tds: false` |
| `salt` | Salt | `show_salt: false` |
| `chlorine` | Chlorine level | `show_chlorine: false` |

Pool equipment you can switch on and off from the card (one button each, shown only if the entity is set; the button is lit when the equipment is running):

| Option | Button |
|---|---|
| `switch_ph_plus` | pH+ dosing pump |
| `switch_ph_minus` | pH- dosing pump |
| `switch_electrolysis` | Electrolysis (chlorine production) |
| `switch_heat_pump` | Pool heat pump |
| `switch_shower` | Shower (on/off, and its status) |

The filtration pump itself is switched with the power button (`switch`).

- `presence`: presence detector (`binary_sensor` / `input_boolean`), shown as a tile: **Someone** / **Nobody**.
- `low_water`: low water alert (`binary_sensor`, e.g. a door/float sensor used as a level switch). When on, the card shows a red **Low water level** alert.

```yaml
type: custom:appliance-pool-pump-card
switch: switch.pool_pump
entity: switch.pool_pump
power: sensor.pool_pump_power
energy: sensor.pool_pump_energy_today
temperature: sensor.pool_water_temperature
runtime: sensor.pool_filtration_today
ph: sensor.pool_ph
orp: sensor.pool_orp
pressure: sensor.pool_filter_pressure
tds: sensor.pool_tds
salt: sensor.pool_salt
chlorine: sensor.pool_chlorine
show_tds: false             # hide a tile without removing its sensor
max_power: 1100
switch_ph_plus: switch.pool_ph_plus
switch_ph_minus: switch.pool_ph_minus
switch_electrolysis: switch.pool_electrolysis
switch_heat_pump: switch.pool_heat_pump
switch_shower: switch.pool_shower
presence: binary_sensor.pool_presence
low_water: binary_sensor.pool_low_water
```


[← All cards](../../README.md#the-cards)
