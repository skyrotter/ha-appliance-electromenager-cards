# Water heat pump

`custom:appliance-water-heat-pump-card`

**Water heat pump** (water-to-water or ground source: borehole, ground loop, well): no fan and no air, unlike the outdoor unit of the *Heat pump* card. The compressor vibrates between the evaporator (source loop, going down into the ground on the left) and the condenser (heating loop to a radiator on the right). The flow/return pipes turn from blue (20 °C) to red (55 °C) and the water flows while the flow rate is above `flow_threshold` (zero by default; or while the compressor runs, without `entity_flow_rate`). The COP comes from `entity_cop`, or is computed from a heat meter (`entity_heat_power`) and an electricity meter (`entity_power`). Without a status entity, the compressor runs above `threshold`.

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language. Temperatures follow `temperature_unit: C|F`, otherwise the unit of Home Assistant: each sensor is converted from its own unit, and temperature thresholds are entered in that unit (the defaults below are in °C and are converted, e.g. 40 °C → 104 °F).

- `entity_status` (climate, water_heater or text: heating / hot water / cooling / off / fault…)
- `entity_power` (electric, W or kW)
- `entity_heat_power` (heat output, W or kW)
- `entity_cop` (otherwise computed: heat output / electric power while the compressor runs)
- `entity_flow_temp`
- `entity_return_temp` (ΔT shown)
- `entity_source_in_temp`
- `entity_source_out_temp` (ground loop / well, optional)
- `entity_flow_rate` (l/h or m³/h)
- `flow_threshold` (flow at or below this counts as zero, in the unit of `entity_flow_rate`, default 0: heat meters often read a few l/h while the heat pump is idle)
- `entity_energy`
- `entity_heat_energy` (Wh, kWh or MWh, shown in kWh)
- `entity_scop`
- `threshold` (compressor running above, default 100 W)
- `off_threshold` (off below, standby above, default 0.5 W)
- `source_threshold` (source loop animation above it: well / primary pumps start before the compressor and stop after it; default: with the compressor)
- `compressor_threshold` (compressor animation above it, default `threshold`: on/off heat pumps can heat with only the circulation pump running)
- `buffer_tank` (true: the heat pump charges a buffer tank and the circulation pump feeds the emitters from it, even when the compressor is off; the flow rate, if set, is the heat pump side)
- `entity_buffer_temp` (tank temperature)
- `entity_compressor` and `entity_source_pump` (optional relays: binary_sensor, switch or a numeric sensor, running above 0; they replace the power steps)
- `heating_delay` (s, power must stay above `threshold` this long before showing heating, default 0: ignores short pump runs during standby; when the card opens during a run, the recorder history of `entity_power` tells how long it has already been above)
- `show_status`
- `show_power`
- `show_heat`
- `show_cop`
- `show_temps`
- `show_source`
- `show_flow_rate`
- `show_energy`
- `show_scop`
- `animations`

[← All cards](../../README.md#the-cards)
