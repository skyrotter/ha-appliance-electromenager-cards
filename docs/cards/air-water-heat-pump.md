# Air-to-water heat pump (2 zones)

`custom:appliance-air-water-heat-pump-card`

**Air-to-water heat pump with two heating zones**: the outdoor unit (fan and air flow), the indoor module, then two circuits, each with its circulation pump: zone 1 (radiators) and zone 2 (underfloor heating). The fan spins while the compressor runs (faster with `entity_demand`), the flow pipes are red and the return pipes blue, and the water of a zone flows while its circulator runs. When the 3-way valve is on (hot water), both zones are dimmed and stop, and the badge shows *Hot water*. The COP comes from `entity_cop`, or is computed from the heat output (`entity_heat_power`) and the electric power (`entity_power`).

Without a status entity, the compressor runs when `entity_frequency` is above `frequency_threshold` (otherwise `entity_power` above `threshold`, otherwise `entity_heat_power` above 0). Without circulator entities, both zones flow while the compressor runs.

## Options

Every group of tiles can be hidden with its `show_…` option, and `language: fr|en|de|it|es|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language. Tile names (and the zone names, with `zone1` and `zone2`) can be renamed with `labels`, for example `labels: { zone1: Radiators, zone2: Floor }`. Temperatures follow `temperature_unit: C|F`, otherwise the unit of Home Assistant.

- `entity_status` (climate, water_heater or text: heating / hot water / cooling / off / fault…)
- `entity_heat_power` (heat output, W or kW)
- `entity_power` (electric power, W or kW)
- `entity_cop` (otherwise computed: heat output / electric power while the compressor runs)
- `entity_frequency` (compressor frequency, Hz)
- `entity_demand` (demand, %)
- `entity_flow_temp`
- `entity_return_temp` (ΔT shown)
- `entity_dhw_temp` (hot water tank)
- `entity_buffer_temp` (buffer tank)
- `entity_outdoor_temp`
- `entity_energy` (electric, Wh, kWh or MWh, shown in kWh)
- `entity_heat_energy` (heat produced)
- `entity_pump_1` and `entity_pump_2` (circulators of zone 1 and zone 2: binary_sensor, switch or a numeric sensor, running above 0)
- `entity_valve` (3-way valve: on = hot water)
- `entity_backup`, `entity_immersion` and `entity_boiler` (backup heater, immersion heater, boiler: shown as On / Off)
- `threshold` (compressor running above this electric power, default 100 W, used without `entity_frequency`)
- `frequency_threshold` (compressor running above this frequency, default 0 Hz)
- `show_status`
- `show_heat`
- `show_power`
- `show_cop`
- `show_compressor` (frequency and demand)
- `show_temps` (flow, return, ΔT, hot water tank, buffer tank, outdoor)
- `show_energy`
- `show_backup` (backup heater, immersion heater, boiler)
- `animations`

[← All cards](../../README.md#the-cards)
