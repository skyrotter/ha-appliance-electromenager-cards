# Gas boiler

`custom:appliance-gas-boiler-card`

**Gas boiler**: wall-mounted gas boiler, no background. Blue flames on the burner rail (sized by modulation), flue gas, pressure gauge, and flow/return copper pipes that turn from blue to red with temperature, with water flowing when the pump runs. Hot-water (DHW) and heating modes, low/high pressure and flow-too-hot alerts.

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language. Temperatures follow `temperature_unit: C|F`, otherwise the unit of Home Assistant: each sensor is converted from its own unit, and temperature thresholds are entered in that unit (the defaults below are in °C and are converted, e.g. 40 °C → 104 °F).

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

[← All cards](../../README.md#the-cards)
