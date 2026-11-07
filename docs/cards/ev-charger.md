# EV charger

`custom:appliance-ev-charger-card`

<p align="center"><img src="../ev-charger.gif" width="300" alt="EV charger card"></p>

**EV charger**: wall box with a status light (grey unplugged, blue plugged, pulsing green charging, steady green complete), energy flowing through the cable to the car and a battery gauge on the car door.

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language.

- `entity_power`
- `entity_session_energy`
- `entity_car_soc`
- `entity_status` (charging / connected / complete…)
- `entity_cost` or `price_per_kwh`
- `max_power` (default 7400 W)
- `car_color`
- `show_power`
- `show_energy`
- `show_soc`
- `show_status`
- `show_duration`
- `show_cost`

[← All cards](../../README.md#the-cards)
