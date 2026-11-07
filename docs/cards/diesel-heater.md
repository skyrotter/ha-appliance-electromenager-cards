# Diesel heater

`custom:appliance-diesel-heater-card`

**Diesel heater**: diesel stove drawn in volume, no background: cast-iron top plate in perspective, stainless flue, combustion chamber with the blue crown of the wick burner and three-layer flames (sized by modulation), and a diesel level sight glass that turns red below `fuel_alert`. States: off, standby, igniting (glowing plug, small flames, blower spinning up), heating, cooldown (the blower purge after shutdown: no flame, fading embers, fast blower, air streaks) and fault. Without a status entity, the state comes from power (above 60 W igniting, above 15 W heating).

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language. Temperatures follow `temperature_unit: C|F`, otherwise the unit of Home Assistant: each sensor is converted from its own unit, and temperature thresholds are entered in that unit (the defaults below are in °C and are converted, e.g. 40 °C → 104 °F).

- `entity_status` (climate or text: ignition / heating / cooldown / standby / off / fault…)
- `entity_flame` (binary_sensor)
- `entity_power`
- `entity_energy`
- `entity_fuel_level` (%)
- `entity_fuel_used` (L)
- `entity_cost` or `price_per_liter`
- `entity_temp` (room)
- `entity_flue_temp`
- `entity_modulation` (%)
- `threshold` (default 15 W)
- `ignition_threshold` (default 60 W)
- `off_threshold` (default 0.5 W)
- `fuel_alert` (default 15 %)
- `flue_temp_max` (default 300 °C)
- `show_power`
- `show_energy`
- `show_fuel`
- `show_fuel_used`
- `show_cost`
- `show_temps`
- `show_status`

[← All cards](../../README.md#the-cards)
