# Iron and steam generator

`custom:appliance-iron-card` · `custom:appliance-steam-station-card`: a steam iron or a steam generator (iron + base station) as a cut-out photo, on a smart plug with power metering. The appliance itself is "dumb": the card follows it from the power drawn.

- **Heating** (power above `threshold`, 100 W by default): orange light (iron) or orange ring around the power button (station), glow under the soleplate.
- **Ready to iron** (after `preheat_minutes`: 2 for the iron, 4 for the station, or when the thermostat cuts the heating after at least 2 minutes): the light turns green. It stays "ready" for `ready_minutes` (10 by default) after the power drops, because the thermostat cuts and restarts the heating.
- **Steaming**: when the `steam` entity is active (button, binary sensor, switch, or a sensor above 0): blue light and steam from the soleplate.
- **Water tank** (optional `water_level`: a % sensor or a binary sensor "empty"): tile with the level and a "Low water level" alert below `water_low` (10 % by default).
- **Temperature** (optional `temperature` sensor): tile.
- Options: `power`, `energy`, `cost`, `switch`, `entity`, `temperature`, `water_level`, `steam`, `preheat_minutes`, `ready_minutes`, `water_low`.

```yaml
type: custom:appliance-steam-station-card
name: Steam generator
power: sensor.steam_station_plug_power
energy: sensor.steam_station_plug_energy
switch: switch.steam_station_plug
water_level: sensor.steam_station_water   # optional
steam: binary_sensor.steam_station_steam  # optional
```

[← All cards](../../README.md#the-cards)
