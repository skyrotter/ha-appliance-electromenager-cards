# Air quality

`custom:appliance-air-quality-card`

<p align="center"><img src="../air-quality.gif" width="360" alt="Air quality card"></p>

An air quality monitor in one card. Every sensor is optional: only the ones you configure are shown.

- **Central indicator**: a face in a ring that goes from **Good** to **Bad** following the worst pollutant (CO₂, PM2.5, PM10, VOC, formaldehyde). Humidity and temperature are coloured but do not count in the indicator. When the air degrades, dust particles float around the face; when it is good, sparkles twinkle.
- **One tile per measurement**: value coloured by thresholds and a mini 24 h curve.
- **24 h curve**: click a tile to show its curve, with the threshold bands in colour and a tooltip (value and time) when you hover or touch the curve. The history comes from the Home Assistant recorder, completed by the values seen live.

| Measurement | Good | Moderate | Poor | Bad |
|---|---|---|---|---|
| CO₂ (ppm) | < 800 | 800 – 1000 | 1000 – 1500 | ≥ 1500 |
| PM2.5 (µg/m³) | < 12 | 12 – 35 | 35 – 55 | ≥ 55 |
| PM10 (µg/m³) | < 20 | 20 – 50 | 50 – 100 | ≥ 100 |
| VOC (ppb) | < 220 | 220 – 660 | 660 – 2200 | ≥ 2200 |
| Formaldehyde (µg/m³) | < 30 | 30 – 60 | 60 – 100 | ≥ 100 |
| Humidity (%) | 40 – 60 | 30 – 70 | else | far out of range |
| Temperature (°C) | 19 – 24 | 17 – 26 | else | far out of range |

For VOC, the thresholds adapt to the unit of the entity (ppb, µg/m³, mg/m³, ppm or index). Override any of them with `thresholds`.

```yaml
type: custom:appliance-air-quality-card
entity_co2: sensor.living_room_co2
entity_pm25: sensor.living_room_pm25
entity_pm10: sensor.living_room_pm10
entity_voc: sensor.living_room_tvoc
entity_hcho: sensor.living_room_formaldehyde      # optional
entity_humidity: sensor.living_room_humidity
entity_temperature: sensor.living_room_temperature
thresholds:                                       # optional: [good→moderate, moderate→poor, poor→bad]
  co2: [700, 1000, 1400]
```

Options: `name`, `thresholds`, `labels`, `illustration_size`, `transparent`, `tap_action` / `hold_action`, `language`, `show_status`, `show_sparklines`, `show_chart`, `animations`.

[← All cards](../../README.md#the-cards)
