# Home battery

`custom:appliance-battery-card`

<p align="center"><img src="../battery.gif" width="300" alt="Home battery card"></p>

**Home battery**: three modules wired with orange cables, no background. The charge level rises in the modules (green → orange → red), energy flows along the cables in one direction when charging and the other when discharging, with time to full / empty.

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language. Temperatures follow `temperature_unit: C|F`, otherwise the unit of Home Assistant: each sensor is converted from its own unit, and temperature thresholds are entered in that unit (the defaults below are in °C and are converted, e.g. 40 °C → 104 °F).

- `entity_soc` (%)
- `entity_power` (positive = charging, `invert_power: true` if yours is reversed)
- `entity_energy`
- `entity_temperature`
- `capacity_kwh` (default 10)
- `max_power`
- `low_threshold` (default 15 %)
- `show_power`
- `show_energy`
- `show_temperature`
- `show_time`
- `layout`: `default` or `split` (illustration on the left, name, status and values on the right; useful in narrow or 2-column grids)
- `status_position`: `auto` (default, status moves below the illustration on narrow cards), `inside` or `below`

[← All cards](../../README.md#the-cards)
