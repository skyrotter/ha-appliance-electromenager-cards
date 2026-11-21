# Gas boiler

`custom:appliance-gas-boiler-card`

**Gas boiler**: wall-mounted gas boiler, no background. Blue flames on the burner rail (sized by modulation), flue gas, pressure gauge, and flow/return copper pipes that turn from blue to red with temperature, with water flowing when the pump runs. Hot-water (DHW) and heating modes, low/high pressure and flow-too-hot alerts.

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|es|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language. Temperatures follow `temperature_unit: C|F`, otherwise the unit of Home Assistant: each sensor is converted from its own unit, and temperature thresholds are entered in that unit (the defaults below are in °C and are converted, e.g. 40 °C → 104 °F).

- `entity_status` (climate or text: heating / dhw / standby / alarm…)
- `entity_flame` (binary_sensor)
- `entity_power`
- `entity_energy`
- `entity_gas` (m³ or kWh)
- `entity_cost` or `price_per_unit`
- `entity_flow_temp`
- `entity_return_temp`
- `entity_pressure` (bar)
- `entity_modulation` (%)
- `threshold` (default 15 W)
- `off_threshold` (off below, standby above, default 0.5 W)
- `pressure_min` / `pressure_max` (default 1–2.5 bar)
- `flow_temp_max` (default 80 °C)
- `show_power`
- `show_energy`
- `show_gas`
- `show_cost`
- `show_temps`
- `show_pressure`
- `show_modulation`
- `show_status`

## Vaillant ecoTEC plus (photo)

`model: vaillant_ecotec_plus` shows a photo of the boiler with its pipes, expansion vessel and wall unit, animated:

- **Screen**: flow temperature in large digits, outdoor temperature (`entity_outdoor_temp`) and the time in the top bar, green leaf lit while the burner runs.
- **Pipes**: the red heating pipe is animated while the circuit runs; the hot water pipe (red valve) and the cold water pipe (blue valve) are animated in hot water mode, and the return pipe while heating.
- **Flue**: a condensation plume rises while the burner runs.
- **Wall unit**: the LED bar follows the modulation, turns dim in standby and blinks red on a fault.
- **Expansion vessel**: the water pressure is shown above it, in red when out of range.

```yaml
type: custom:appliance-gas-boiler-card
model: vaillant_ecotec_plus
entity_status: sensor.house_circuit_0_state
entity_flow_temp: sensor.house_circuit_0_current_flow_temperature
entity_pressure: sensor.house_system_water_pressure
entity_outdoor_temp: sensor.house_outdoor_temperature
entity_room_temp: sensor.house_room_current_temperature   # optional tile
entity_room_target: sensor.house_room_desired_temperature  # optional tile
```

[← All cards](../../README.md#the-cards)
