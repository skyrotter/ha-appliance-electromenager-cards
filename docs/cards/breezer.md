# Fresh air purifier / Breezer (`custom:appliance-breezer-card`)

Animated supply air purifier (breezer) with intake damper, HEPA filter, PTC intake heater, spinning impeller, front CO₂ OLED ring, airflow waves, controls (`power`, `heater`, `damper`), telemetry tiles, `extra_tiles`, and `icons`.

## Example configuration

```yaml
type: custom:appliance-breezer-card
name: Living room breezer
entity_status: fan.breezer_living_room
entity_heater: switch.breezer_heater
entity_damper: switch.breezer_damper
entity_outdoor_temp: sensor.outdoor_temperature
entity_temp: sensor.breezer_supply_temperature
entity_target_temp: number.breezer_target_temperature
entity_co2: sensor.living_room_co2
entity_pm25: sensor.living_room_pm25
entity_humidity: sensor.living_room_humidity
entity_filter: sensor.breezer_filter_life
entity_power: sensor.breezer_power
co2_max: 1000
pm25_max: 35
filter_low: 10
```
