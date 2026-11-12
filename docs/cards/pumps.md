# Water pump, industrial pump, sump pump and rainwater tank

`custom:appliance-water-pump-card · custom:appliance-industrial-pump-card · custom:appliance-sump-pump-card · custom:appliance-rainwater-tank-card`

**Water pump**: clean, light style for a garden, well, rainwater or pool pump. A source tank on the left (its level follows `entity_level`), the pump volute with a spinning impeller, a finned motor and the delivery pipe pouring into a basin. Water flows in the pipes, waves move in the tank and the basin, ripples spread where the jet lands.

**Industrial pump**: rugged motor-pump unit on a steel skid: internal gear pump with bolted flanges, hazard-striped coupling guard, finned motor with a rating plate showing the live power, terminal box with **RUN / WARNING / FAULT** lights and a pressure gauge whose needle follows `entity_pressure`. While running, the delivery pipe swells with each pulse, pressure rings leave the flange, the needle trembles and the whole unit vibrates.

**Sump pump**: buried pit seen in cross-section. Water drips in from the drain, the pit level follows `entity_level` (%) with a red **max** mark at `level_max`, the float rides on the surface, the submersible pump vibrates and pushes water up the discharge pipe. Above `level_max`, or when the alarm float `entity_float` is on, the card raises **High water level** and an alarm beacon flashes on the ground; if the pump is off at that moment the state becomes **alarm**. Without a level sensor, the pit empties while the pump runs. `entity_starts` shows the number of starts (e.g. a `history_stats` count).

**Rainwater tank + booster pump**: buried tank in cross-section, fed by the downspout of the house gutter, with the booster set above ground (pump, pressure vessel, gauge, pressure switch) and a tap. The suction pipe dips into the tank down to its strainer. The tank level follows `entity_level` (%) with the percentage written on the water and a red **min** mark at `level_min`. The gutter and the drops run when it rains (`entity_tank_rain`: a binary sensor `on`, a rain-rate sensor above 0 or a `weather` entity that is rainy / pouring) or, without that entity, for two minutes after the level rises. The tap flows and the gauge needle follows `entity_pressure` while the pump runs. Tiles: flow, pressure, power, tank level, **remaining volume** (`entity_tank_volume`, or level × `tank_capacity` in litres), runtime, starts, energy, cost and **mains top-up** (`entity_mains`, on = active). Alerts: **low level** (below `level_min`, or `entity_low_float` on) and **pump running dry** (pump on with the float on or the level at 2 % or less), plus the common alerts below.

On all four cards the animation speed follows the flow (`entity_flow` / `max_flow`), otherwise the power (`entity_power` / `max_power`). States: off, running, warning (running with an alert), fault and unavailable. Alerts: **no flow while running** (dry run, below `no_flow_threshold`), overpressure (above `pressure_max`), motor too hot (above `temp_max`) and low level (below `level_min`). With a `switch`, `input_boolean` or `fan` entity, an On/Off button is shown (`homeassistant.toggle`). Without a status entity, the state comes from power (above `run_threshold` = running).

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|es|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language. Temperatures follow `temperature_unit: C|F`, otherwise the unit of Home Assistant: each sensor is converted from its own unit, and temperature thresholds are entered in that unit (the defaults below are in °C and are converted, e.g. 40 °C → 104 °F).

- `entity` (switch, input_boolean, fan, binary_sensor or text sensor)
- `entity_power`
- `entity_flow` (L/min, m³/h, L/h, L/s or gal/min: converted to L/min for the animation and the thresholds, the tile keeps the sensor unit)
- `entity_pressure` (bar)
- `entity_temp` (motor or fluid temperature)
- `entity_level` (tank level in %, water pump drawing)
- `entity_fault` (binary_sensor, on = fault)
- `entity_runtime` (h, e.g. a `history_stats` sensor)
- `entity_energy`
- `entity_cost` or `price_per_kwh` (with `currency`)
- `fluid_color` (CSS color, default `#3fa9f5`)
- `max_flow` (L/min, whatever the sensor unit: water 40, industrial 200; 12 m³/h = 200 L/min)
- `max_power` (water 1200 W, industrial 7500 W)
- `run_threshold` (water 15 W, industrial 100 W)
- `max_pressure` (top of the gauge: water 6, industrial 16 bar)
- `pressure_max` (alert above: water 5, industrial 12 bar)
- `temp_max` (alert above: water 70, industrial 85 °C)
- `level_min` (alert below: water 15, industrial 10 %)
- `level_max` (sump pump: alert above, default 80 %)
- `entity_float` (sump pump: high-level float, binary_sensor)
- `entity_starts` (sump pump and rainwater tank: number of starts)
- `entity_low_float` (rainwater tank: low-level float, binary_sensor, on = tank nearly empty)
- `entity_tank_volume` (rainwater tank: remaining volume, any unit, shown as is)
- `tank_capacity` (rainwater tank: capacity in litres, to compute the volume from the level when there is no volume sensor)
- `entity_tank_rain` (rainwater tank: binary_sensor, rain-rate sensor or `weather` entity)
- `entity_mains` (rainwater tank: mains-water top-up valve or sensor, on = active)
- `no_flow_threshold` (L/min, default 0.5)
- `animations` (default true)
- `show_status`, `show_controls`, `show_flow`, `show_pressure`, `show_power`, `show_temp`, `show_level`, `show_runtime`, `show_starts`, `show_energy`, `show_cost`, `show_tank_volume` and `show_mains` (rainwater tank)

## Examples

```yaml
type: custom:appliance-water-pump-card
name: Garden pump
entity: switch.garden_pump
entity_power: sensor.garden_pump_power
entity_flow: sensor.garden_pump_flow
entity_pressure: sensor.garden_pump_pressure
entity_level: sensor.rainwater_tank_level
entity_energy: sensor.garden_pump_energy
price_per_kwh: 0.2516
```

```yaml
type: custom:appliance-industrial-pump-card
name: Booster pump
entity: switch.booster_pump
entity_power: sensor.booster_pump_power
entity_flow: sensor.booster_pump_flow
entity_pressure: sensor.booster_pump_pressure
entity_temp: sensor.booster_pump_motor_temperature
entity_fault: binary_sensor.booster_pump_fault
entity_runtime: sensor.booster_pump_runtime_today
entity_energy: sensor.booster_pump_energy
max_flow: 150
pressure_max: 10
fluid_color: "#4caf50"
```

```yaml
type: custom:appliance-sump-pump-card
name: Sump pump
entity: switch.sump_pump
entity_power: sensor.sump_pump_power
entity_level: sensor.sump_pit_level
entity_float: binary_sensor.sump_high_level
entity_starts: sensor.sump_pump_starts_today
level_max: 80
```

[← All cards](../../README.md#the-cards)

```yaml
type: custom:appliance-rainwater-tank-card
name: Rainwater tank
entity: switch.booster_pump
entity_power: sensor.booster_pump_power
entity_energy: sensor.booster_pump_energy
entity_level: sensor.tank_level
tank_capacity: 5000
entity_pressure: sensor.booster_pressure
entity_flow: sensor.booster_flow
entity_tank_rain: binary_sensor.raining
entity_mains: switch.mains_topup_valve
entity_low_float: binary_sensor.tank_low_float
entity_starts: sensor.booster_starts_today
level_min: 15
```
