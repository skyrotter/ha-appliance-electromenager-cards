# Underfloor heating

`custom:appliance-underfloor-heating-card`

**Underfloor heating**: room in cross-section with the slab in perspective. The tiles are lifted on the left to show the coil: a water loop fed by a supply / return manifold on the wall, or a heating cable (`heating_type: electric`). A wall thermostat shows the room temperature. While heating, the water or current flows through the coil, the slab glows (following the floor temperature from 20 °C to `floor_max`) and heat waves rise from the floor.

States: off, heating, idle (on, target reached) and fault. With a `climate` entity, `hvac_action` decides between heating and idle (otherwise the room temperature is compared with the target) and the card shows **− / On-Off / +** buttons (`climate.set_hvac_mode`, `climate.set_temperature`). A `switch`, `input_boolean` or `binary_sensor` (zone valve, circulator) gives heating / off; without an entity, the power decides (above `heat_threshold`). Alerts: floor too hot (above `floor_max`, 29 °C by default, the usual comfort limit) and water too hot (above `water_max`, 45 °C).

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language. Temperatures follow `temperature_unit: C|F`, otherwise the unit of Home Assistant: each sensor is converted from its own unit, and temperature thresholds are entered in that unit (the defaults below are in °C and are converted, e.g. 40 °C → 104 °F).

- `entity` (climate, switch, input_boolean or binary_sensor)
- `entity_temp` (room, otherwise `current_temperature` of the climate)
- `entity_target_temp` (otherwise `temperature` of the climate)
- `entity_floor_temp`
- `entity_water_temp` (supply / flow temperature)
- `entity_power`
- `entity_energy`
- `entity_cost` or `price_per_kwh` (with `currency`)
- `heating_type` (`water` or `electric`, default `water`)
- `floor_max` (default 29 °C)
- `water_max` (default 45 °C)
- `heat_threshold` (default 20 W)
- `animations` (default true)
- `show_status`, `show_controls`, `show_temp`, `show_floor`, `show_water`, `show_power`, `show_energy`, `show_cost`

## Example

```yaml
type: custom:appliance-underfloor-heating-card
name: Living room floor
entity: climate.living_room_floor
entity_floor_temp: sensor.living_room_floor_temperature
entity_water_temp: sensor.underfloor_flow_temperature
entity_energy: sensor.heat_pump_energy
price_per_kwh: 0.2516
```

[← All cards](../../README.md#the-cards)
