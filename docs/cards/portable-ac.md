# Portable air conditioner

`custom:appliance-portable-ac-card`

**Portable air conditioner** (single-hose monobloc on casters): vector SVG drawing of the unit with its exhaust hose going out of the window. Works with a `climate` entity (mode, target, current temperature, fan), or with a simple switch plus sensors.

Animations: cold blue air leaves the grille (orange when heating, grey in fan mode), hot air leaves through the hose, drops fall into the tank while dehumidifying, a full tank blinks red with an alert, the screen turns off when the unit is off. The speed of the air flows follows the fan speed.

Screen: target temperature and mode (`COOL`, `DRY`, `FAN`, `HEAT`, `READY`). States: off, cooling, dehumidifying, fan, heating, at target, unavailable.

Buttons: on/off, target − / +, mode.

## Options

- `entity`: `climate`, `switch` or `input_boolean`
- `entity_temperature` (sensor), `entity_target` (number), `entity_fan`, `entity_timer`, `entity_tank` (binary sensor: full, or level in %), `entity_power` (sensor)
- `temp_step` (target step, default 1)
- `animations` (default true), `compact: true`, `transparent: true`, `illustration_size` (%), `tile_background`, `tile_order`
- `show_status`, `show_controls`, `show_temperature`, `show_target`, `show_fan`, `show_timer`, `show_tank`, `show_power`
- `language: fr|en|de|it|es|nb|nl|pl|ro|ru|sr|sr-Latn`

## Examples

```yaml
type: custom:appliance-portable-ac-card
entity: climate.portable_ac
entity_tank: binary_sensor.portable_ac_tank_full
entity_power: sensor.portable_ac_power
```

```yaml
type: custom:appliance-portable-ac-card
entity: switch.portable_ac
entity_temperature: sensor.living_room_temperature
entity_tank: binary_sensor.portable_ac_tank_full
```
