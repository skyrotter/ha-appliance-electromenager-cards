# Heat meter

`custom:appliance-heat-meter-card`: district heating / central heating with water radiators and an ultrasonic heat meter (Landis+Gyr ULTRAHEAT T350 / UH50, Kamstrup Multical, Sharky…). A brass flow tube with an LCD calculator (cumulative energy), a thin red supply pipe (Tv) and a thicker blue return pipe (Tr) with animated particles, and a water panel radiator with rising heat waves and a central badge showing the output power and ΔT.

Every sensor is optional (M-Bus, W-MBus, ESPHome, Modbus…):

| Option | What it does |
|---|---|
| `entity_energy` | cumulative heat energy shown on the LCD, in the sensor's own unit (`Wh`, `kWh`, `MWh`, `GJ`, `MJ`) |
| `entity_supply_temp` | supply (flow) temperature Tv |
| `entity_return_temp` | return temperature Tr; ΔT = Tv − Tr |
| `entity_power` | heating power; `W`, `kW`, `MW`, `GJ/h` are converted to kW. **Without it, the power is computed** from flow × ΔT × 1.163 Wh/(kg·K) |
| `entity_flow` | flow rate; `L/h`, `L/min`, `L/s`, `m³/h` are converted |
| `entity_water_volume` | total water volume (`m³`, `L`) |
| `entity_room_temp` | room temperature tile |
| `power_threshold` | below this power (kW, 0.05) the state is "No heating" |
| `temperature_unit`, `show_status`, `show_supply`, `show_return`, `show_delta`, `show_power`, `show_flow`, `show_energy`, `show_volume`, `show_room`, `animations`, `labels`, `language` | |

States: **Heating** (animated pipes and heat waves, badge in red), **No heating**, **Unavailable**. The animation speeds up with the power.

```yaml
type: custom:appliance-heat-meter-card
name: Heating
entity_energy: sensor.heat_meter_energy
entity_supply_temp: sensor.heat_meter_flow_temperature
entity_return_temp: sensor.heat_meter_return_temperature
entity_power: sensor.heat_meter_power
entity_flow: sensor.heat_meter_flow_rate
entity_water_volume: sensor.heat_meter_volume
entity_room_temp: sensor.room_temperature
```

[← All cards](../../README.md#the-cards)
