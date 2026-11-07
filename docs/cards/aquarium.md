# Aquarium

`custom:appliance-aquarium-card`

<p align="center"><img src="../aquarium.gif" width="300" alt="Aquarium card"></p>

**Aquarium**: fish swim back and forth, bubbles and tails speed up with power, the water turns blue / turquoise / orange / red with temperature (alert badge outside `temp_min`–`temp_max`), the lamp follows `entity_light`.

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language. Temperatures follow `temperature_unit: C|F`, otherwise the unit of Home Assistant: each sensor is converted from its own unit, and temperature thresholds are entered in that unit (the defaults below are in °C and are converted, e.g. 40 °C → 104 °F).

- `entity_power`
- `entity_energy`
- `entity_temperature`
- `entity_light` (day/night)
- `entity_cost` or `price_per_kwh`
- `temp_min` / `temp_max` (default 24–27 °C)
- `max_power` (default 200 W)
- `show_power`
- `show_energy`
- `show_temperature`
- `show_cost`

[← All cards](../../README.md#the-cards)
