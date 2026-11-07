# Sauna

`custom:appliance-sauna-card`

**Sauna**: wooden cabin seen from the front, no background: tinted glass door showing the benches, the stove and its stones, a wall thermometer, a control panel with the temperature, the light over the door and a roof vent. States: off, heating, ready, cooling down and fault.

The stove glow and the embers grow with the temperature (from 25 °C to the target), heat waves rise above the stones and steam comes out of the vent while it is on, the thermometer fills up. When the sauna is off but still above 40 °C it shows *Cooling down*. It is *Ready* once the temperature is within `ready_margin` of the target.

With a `climate` entity, the temperature and target come from its attributes and the card shows **− / On-Off / +** buttons (`climate.set_hvac_mode`, `climate.set_temperature`). With a `switch` or `input_boolean`, a single On/Off button. Without a status entity, the state comes from power (above `off_threshold` = on).

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language. Temperatures follow `temperature_unit: C|F`, otherwise the unit of Home Assistant: each sensor is converted from its own unit, and temperature thresholds are entered in that unit (the defaults below are in °C and are converted, e.g. 40 °C → 104 °F).

- `entity` (climate, switch, input_boolean or binary_sensor)
- `entity_temp` (cabin temperature, otherwise `current_temperature` of the climate)
- `entity_target_temp` (otherwise `temperature` of the climate, otherwise `target_temp`)
- `entity_humidity`
- `entity_power` (heater)
- `entity_energy`
- `entity_cost` or `price_per_kwh` (with `currency`)
- `target_temp` (default 80 °C)
- `ready_margin` (default 3 °C)
- `heater_threshold` (default 300 W, used without temperature: below it while on = ready)
- `off_threshold` (default 5 W)
- `temp_max` (default 110 °C, alert above)
- `temp_scale` (default 120 °C, top of the thermometer)
- `animations` (default true)
- `show_status`
- `show_controls`
- `show_temp`
- `show_humidity`
- `show_power`
- `show_energy`
- `show_cost`

## Example

```yaml
type: custom:appliance-sauna-card
entity: climate.sauna
entity_humidity: sensor.sauna_humidity
entity_power: sensor.sauna_heater_power
entity_energy: sensor.sauna_heater_energy
price_per_kwh: 0.2516
```

[← All cards](../../README.md#the-cards)
