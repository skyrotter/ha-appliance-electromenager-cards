# Air quality

`custom:appliance-air-quality-card`

<p align="center"><img src="../air-quality.gif" width="360" alt="Air quality card"></p>

An air quality monitor in one card. Every sensor is optional: only the ones you configure are shown.

- **Central indicator**: a face in a ring that goes from **Good** to **Bad** following the worst pollutant (CO₂, particulates, VOC, NOx, formaldehyde, gases, radon). Humidity, temperature, pressure, noise and oxygen are coloured but do not count in the indicator. When the air degrades, dust particles float around the face; when it is good, sparkles twinkle.
- **One tile per measurement**: value coloured by thresholds and a mini 24 h curve.
- **24 h curve**: click a tile to show its curve, with the threshold bands in colour and a tooltip (value and time) when you hover or touch the curve. The history comes from the Home Assistant recorder, completed by the values seen live.

| Measurement | Good | Moderate | Poor | Bad |
|---|---|---|---|---|
| CO₂ (ppm) | < 800 | 800 – 1000 | 1000 – 1500 | ≥ 1500 |
| PM2.5 (µg/m³) | < 12 | 12 – 35 | 35 – 55 | ≥ 55 |
| PM10 (µg/m³) | < 20 | 20 – 50 | 50 – 100 | ≥ 100 |
| VOC (ppb) | < 220 | 220 – 660 | 660 – 2200 | ≥ 2200 |
| Formaldehyde (µg/m³) | < 30 | 30 – 60 | 60 – 100 | ≥ 100 |
| PM0.3 (#/cm³) | < 500 | 500 – 1500 | 1500 – 3000 | ≥ 3000 |
| PM1 (µg/m³) | < 10 | 10 – 25 | 25 – 40 | ≥ 40 |
| PM4 (µg/m³) | < 15 | 15 – 40 | 40 – 75 | ≥ 75 |
| NOx (index) | < 20 | 20 – 150 | 150 – 300 | ≥ 300 |
| CO (ppm) | < 9 | 9 – 25 | 25 – 50 | ≥ 50 |
| NO₂ (µg/m³) | < 40 | 40 – 100 | 100 – 200 | ≥ 200 |
| O₃ (µg/m³) | < 60 | 60 – 100 | 100 – 180 | ≥ 180 |
| Radon, radon long term (Bq/m³) | < 100 | 100 – 150 | 150 – 300 | ≥ 300 |
| Propane (%LEL) | < 5 | 5 – 10 | 10 – 20 | ≥ 20 |
| Noise (dB) *(tile only)* | < 45 | 45 – 65 | 65 – 80 | ≥ 80 |
| Humidity (%) | 40 – 60 | 30 – 70 | else | far out of range |
| Temperature (°C) | 19 – 24 | 17 – 26 | else | far out of range |
| Oxygen (%) *(tile only)* | 19.5 – 23.5 | 18 – 25 | else | far out of range |
| Pressure (hPa) *(tile only)* | 1000 – 1026 | 985 – 1040 | else | far out of range |

For VOC, the thresholds adapt to the unit of the entity (ppb, µg/m³, mg/m³, ppm or index). CO (ppb), NO₂ / O₃ (ppb), radon (pCi/L), propane (ppm) and pressure (inHg, mmHg, kPa…) are converted too. Override any of them with `thresholds`.

```yaml
type: custom:appliance-air-quality-card
entity_co2: sensor.living_room_co2
entity_pm25: sensor.living_room_pm25
entity_pm10: sensor.living_room_pm10
entity_voc: sensor.living_room_tvoc
entity_hcho: sensor.living_room_formaldehyde      # optional
# also optional: entity_pm03, entity_pm1, entity_pm4, entity_nox, entity_co, entity_no2, entity_o3,
#   entity_radon, entity_radon_long_term, entity_propane, entity_o2, entity_pressure, entity_noise
entity_humidity: sensor.living_room_humidity
entity_temperature: sensor.living_room_temperature
thresholds:                                       # optional: [good→moderate, moderate→poor, poor→bad]
  co2: [700, 1000, 1400]
```

Options: `name`, `thresholds`, `labels`, `illustration_size`, `transparent`, `tap_action` / `hold_action`, `language`, `show_status`, `show_sparklines`, `show_chart`, `animations`.

[← All cards](../../README.md#the-cards)
