# UPS

`custom:appliance-ups-card`

**UPS**: wall socket → tower UPS → protected internet box and NAS. On mains, current flows from the socket through the UPS to the devices. On battery, the socket goes dark with a crossed-out bolt, the screen turns orange, the UPS beeps and current flows from the battery only. The battery seen through the side panel follows `entity_charge`, the 5-LED bar follows `entity_load`, the screen shows the charge and the input voltage (runtime when on battery).

States: on mains, charging, on battery, low battery, off and unavailable. The state is read from the **NUT** integration status: the raw codes of `sensor.<ups>_status_data` (`OL`, `OB`, `LB`, `CHRG`, `DISCHRG`, `RB`, `OVER`, `OFF`…) or the plain text of `sensor.<ups>_status` (`Online`, `On Battery`…). A `binary_sensor` also works (on = mains present). Without either, the input voltage decides (below `mains_min` = on battery). Alerts: low battery (`LB` or charge below `battery_low`), overload (`OVER` or load above `load_max`), replace the battery (`RB`).

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language.

- `entity` (NUT status sensor or binary_sensor)
- `entity_charge` (battery %)
- `entity_runtime` (s, min or h)
- `entity_load` (%)
- `entity_power` (W)
- `entity_input_voltage`
- `entity_output_voltage`
- `entity_energy`
- `battery_low` (default 20 %)
- `load_max` (default 90 %)
- `mains_min` (default 100 V)
- `animations` (default true)
- `show_status`, `show_charge`, `show_runtime`, `show_load`, `show_power`, `show_voltage`, `show_energy`

## Example

```yaml
type: custom:appliance-ups-card
entity: sensor.ups_status_data
entity_charge: sensor.ups_battery_charge
entity_runtime: sensor.ups_battery_runtime
entity_load: sensor.ups_load
entity_input_voltage: sensor.ups_input_voltage
entity_power: sensor.ups_current_apparent_power
```

[← All cards](../../README.md#the-cards)
