# Home battery

`custom:appliance-battery-card`

<p align="center"><img src="../battery.gif" width="300" alt="Home battery card"></p>

**Home battery**: three modules wired with orange cables, no background. The charge level rises in the modules (green → orange → red), energy flows along the cables in one direction when charging and the other when discharging, with time to full / empty.

## Marstek Venus E 3.0 (photo)

<p align="center"><img src="../battery-marstek.gif" width="420" alt="Two Marstek Venus E 3.0 batteries: charging then discharging"></p>

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|es|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language. Temperatures follow `temperature_unit: C|F`, otherwise the unit of Home Assistant: each sensor is converted from its own unit, and temperature thresholds are entered in that unit (the defaults below are in °C and are converted, e.g. 40 °C → 104 °F).

- `model`: `default` (the three drawn modules) or `marstek_venus_e3` (cut-out photo of the **Marstek Venus E 3.0**: its light strip fills with the state of charge, in green / orange / red, and runs in the direction of the energy flow when charging or discharging; the percentage and state are shown on the black front)
- `count` (1 to 4, default 1): number of units drawn side by side with `model: marstek_venus_e3`, e.g. `2` for two batteries combined in a single charge sensor
- `entity_backup`: power of the **backup (off-grid) output** in W (e.g. Marstek Venus E 3.0 AC off-grid power), shown in a **Backup** tile; with `model: marstek_venus_e3` the backup socket of the unit lights up on the picture while it supplies 10 W or more
- `show_backup` (default true): hides the Backup tile
- `entity_soc` (%)
- `entity_power` (positive = charging, `invert_power: true` if yours is reversed)
- `entity_energy`
- `entity_temperature`
- `entity_calibration`: date of the next calibration (e.g. Zendure batteries), from a `sensor` (date or timestamp) or an `input_datetime`; shown in a tile
- `show_calibration` (default true)
- `capacity_kwh` (default 10)
- `max_power`
- `low_threshold` (default 15 %)
- `show_power`
- `show_energy`
- `show_temperature`
- `show_time`
- `layout`: `default` or `split` (illustration on the left, name, status and values on the right; useful in narrow or 2-column grids)
- `status_position`: `auto` (default, status moves below the illustration on narrow cards), `inside` or `below`

```yaml
type: custom:appliance-battery-card
name: Marstek batteries
model: marstek_venus_e3
count: 2
entity_soc: sensor.soc_batteries
entity_power: sensor.batteries_power
capacity_kwh: 10.24
max_power: 5000
```

[← All cards](../../README.md#the-cards)
