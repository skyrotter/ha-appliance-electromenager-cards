# Pellet boiler

`custom:appliance-pellet-boiler-card`

<p align="center"><img src="../pellet-boiler.gif" width="300" alt="Pellet boiler card"></p>

**Pellet boiler**: boiler with its touchscreen and combustion window, pellet hopper with a level sight glass and an inclined auger, no background. Igniting: glowing igniter, small flame, fast auger. Heating: full flame, pellets travelling up the auger, water flowing in the copper flow/return pipes that turn red with temperature. Low-pellet alert below `pellet_alert`. Without a status entity, the state comes from power (above 300 W igniting, above 30 W heating).

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language. Temperatures follow `temperature_unit: C|F`, otherwise the unit of Home Assistant: each sensor is converted from its own unit, and temperature thresholds are entered in that unit (the defaults below are in °C and are converted, e.g. 40 °C → 104 °F).

- `entity_status` (ignition / heating / shutdown / alarm…)
- `entity_power`
- `entity_energy`
- `entity_cost` or `price_per_kwh`
- `entity_flow_temp`
- `entity_return_temp`
- `entity_pellet_level` (%)
- `threshold` (default 30 W)
- `ignition_threshold` (default 300 W)
- `pellet_alert` (default 15 %)
- `flow_temp_max` (default 80 °C)
- `show_power`
- `show_energy`
- `show_cost`
- `show_temps`
- `show_pellets`
- `show_status`

[← All cards](../../README.md#the-cards)
