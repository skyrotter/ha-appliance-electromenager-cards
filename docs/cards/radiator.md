# Electric radiator

A wall-mounted inertia radiator with six wide vertical elements and its control box (display, Comfort / Eco / Frost icons and buttons).

- **Models** (`style`): `inertia` (default, the six-element radiator above), `convector` (flat wall convector with an air-outlet grille on top) or `baseboard` (long, low electric baseboard heater), or the photo versions `convector_photo` and `baseboard_photo` (cut-out photos with the heat glow, waves, display and mode icons laid over them). They all share the same entities, modes, display and animations.
- **Heating**: the columns glow and heat waves rise from the top grille, stronger with the power drawn (vs `max_power`).
- **Mode**: sun = Comfort, moon = Eco, snowflake = Frost protection (`H-G` on the display), read from a pilot-wire `select`, a `climate` preset or any mode entity. Comfort -1 and Comfort -2 (6-order pilot wire) get their own buttons and show as Comfort. The display shows the target temperature.
- **Window open** (`window`): cold air blows in and an alert is shown.
- **Humidity** (`humidity`): a humidity sensor adds a tile. Without it, the `current_humidity` of the `climate` entity is used when the thermostat provides it.
- Works with a `climate` entity (current/target temperature, `hvac_action`, `preset_mode`), a pilot-wire mode entity, or simply a power sensor (above `threshold`, 50 W = heating).

```yaml
type: custom:appliance-radiator-card
style: baseboard                       # inertia (default), convector, baseboard, convector_photo or baseboard_photo
entity: climate.living_room_radiator   # or power / mode only
power: sensor.radiator_power
window: binary_sensor.living_room_window
humidity: sensor.living_room_humidity   # optional
```


[← All cards](../../README.md#the-cards)
