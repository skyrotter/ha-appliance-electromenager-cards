# Water leak detector

`custom:appliance-leak-detector-card`: a leak sensor puck on the floor, under a pipe. On a leak, a puddle spreads with ripples, drops fall from the fitting and the LED turns red. The card gets a red outline.

| Option | What it does |
|---|---|
| `model` | drawing of the detector: `puck` (default, generic puck), `ikea` (IKEA BADRING E2202, photo) or `sonoff` (Sonoff SNZB-05P, photo). With a photo model, the device sits in the puddle on a leak, a red warning triangle blinks and the status LED turns red |
| `entity_leak` | leak sensor: `binary_sensor` (device class moisture) or a text sensor (`wet`, `leak`, `fuite`… / `dry`, `sec`…). **A list works too**: the alert names the wet probes and a tile shows how many are wet (`1/4`) |
| `entity_valve` | shut-off valve (`valve`, `switch`, `input_boolean`): **Close / Open valve** button; the handle turns red and the drops stop when it is closed |
| `entity_siren` | siren (`siren`, `switch`, `input_boolean`, `button`, `script`): **Silence siren** button during a leak |
| `entity_battery` | battery in % or a battery `binary_sensor`; a list works too, the lowest one is shown. Low below `battery_low` (20 %) |
| `entity_temperature` | temperature tile; **freezing risk** below `freeze_temp` (3 °C): frost on the pipe |
| `entity_humidity` | humidity tile |
| `show_status`, `show_since`, `show_probes`, `show_battery`, `show_temperature`, `show_humidity`, `show_buttons`, `animations`, `labels`, `language`, `illustration_size`, `transparent`, `temperature_unit` | |

States, by priority: **Leak!** (or **Leak, valve closed**), **Freezing risk**, **Low battery**, **Dry**, **Unavailable**.

```yaml
type: custom:appliance-leak-detector-card
name: Under the sink
entity_leak: binary_sensor.sink_leak
entity_valve: valve.main_water          # optional
entity_battery: sensor.sink_leak_battery
```

Several probes in one card:

```yaml
type: custom:appliance-leak-detector-card
name: Leaks
entity_leak:
  - binary_sensor.sink_leak
  - binary_sensor.washer_leak
  - binary_sensor.water_heater_leak
entity_battery:
  - sensor.sink_leak_battery
  - sensor.washer_leak_battery
  - sensor.water_heater_leak_battery
entity_valve: valve.main_water
```

[← All cards](../../README.md#the-cards)
