# Weather station (Davis Vantage Pro2 style)

<p align="center"><img src="../weather-station.gif" width="460" alt="Animated weather station card: Davis Vantage Pro2 style console with its backlit LCD"></p>

`custom:appliance-weather-station-card`: a weather station console in the style of the Davis Vantage Pro2, fully drawn in SVG, with its backlit LCD redrawn live.

- **Compass rose** with the wind direction (pointer on the ring) and the wind speed in the centre.
- **Forecast icon** (sun, clouds, rain, snow, storm, fog), **moon phase** (computed from the date), **time and date**.
- **Fixed area**: outdoor temperature and humidity, **barometer** with a **5-position trend arrow** over 3 hours (needs `entity_pressure`).
- **Variable area**: indoor temperature and humidity, and an **extra value** of your choice (`entity_extra` + `extra_label`: heat index, dew point, UV, solar radiation…).
- **Daily rain** and **rain rate**, with the **umbrella** shown when it rains.
- **24 h graph** of a sensor (`entity_graph`, outdoor temperature by default) and the **ticker** at the bottom (`entity_ticker`, or the forecast translated by Home Assistant and the wind).
- `backlight: false` for the grey, unlit LCD. The LCD labels (TEMP OUT, BAROMETER…) stay in English like on the real console; change them with `labels`.

- **Dominant winds of the last hour**: hollow arrows on the compass ring. The last hour is cut into six 10-minute periods; for each one, the card keeps the direction (out of 16 sectors) the wind blew from most often while its speed was above 0. One to six arrows can appear: a constant wind shows one, a wind that changed or oscillated shows several. When the current direction is one of them, the filled pointer and the hollow arrow overlap. The samples come from the history of `entity_wind_bearing` / `entity_wind_speed` when they are sensors, completed by the values seen live (with a `weather.*` entity alone, the arrows build up as the card stays open). `wind_trend: false` to hide them.
- **Pressure unit**: `pressure_unit: hPa | inHg | mmHg` converts the value (the trend arrow always works in hPa).
- **Heat index**: calculated from the outdoor temperature and humidity when `entity_extra` is empty (equal to the temperature below about 27 °C, like the console). `extra_calc: false` to disable it.
- **Rain without a rain gauge**: if `entity_rain_day` / `entity_rain_rate` are empty, the card uses the precipitation of the `weather.*` forecast (daily total of today, and the current hour for the rate). `rain_from_forecast: false` to disable it.
- **Bigger screen**: `hide_keys: true` removes the side buttons so the LCD fills the card; combine it with `illustration_size` (%) on a tablet.
- **24 h graph**: needs a sensor with history (`entity_graph`, or `entity_temp_out`); a `weather.*` entity alone has no history.

Sources: a `weather.*` entity (local station or web weather) and / or separate sensors, all optional. A separate sensor wins over the attribute of the weather entity.

```yaml
type: custom:appliance-weather-station-card
name: Weather station
entity_weather: weather.home
entity_temp_out: sensor.outdoor_temperature     # optional (also feeds the 24 h graph)
entity_hum_out: sensor.outdoor_humidity         # optional
pressure_unit: hPa                              # optional
hide_keys: true                                 # optional: bigger screen
entity_pressure: sensor.outdoor_pressure        # optional (trend arrow)
entity_temp_in: sensor.living_room_temperature
entity_hum_in: sensor.living_room_humidity
entity_extra: sensor.dew_point                  # optional (otherwise heat index, calculated)
extra_label: Dew point
entity_rain_day: sensor.rain_today
entity_rain_rate: sensor.rain_rate
```

[← All cards](../../README.md#the-cards)
