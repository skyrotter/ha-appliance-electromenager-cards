# Barrier, sliding gate, swing gate, garage door

`custom:appliance-barrier-card` · `custom:appliance-sliding-gate-card` · `custom:appliance-swing-gate-card` · `custom:appliance-garage-door-card`

Four cards for motorised access, no background:

- **Barrier**: yellow cabinet, red and white arm that rises to 90° and lowers back, support fork, LEDs in the arm (red closed, green open).
- **Sliding gate**: barred leaf on its rail that slides behind the pillar along a low wall, wheels that turn, ground motor.
- **Swing gate**: one or two leaves drawn in 3D that swing **inwards** (away from the street) on their pillars, driveway behind.
- **Garage door**: sectional door that rises under the lintel and reveals the lit garage and the car.

States: open, closed, opening, closing, partly open (`current_position` between 1 and 99) and unavailable. The orange beacon flashes while moving, or as soon as the motor draws more than `moving_threshold`.

The movement lasts as long as the real motor (`travel_time`). With a cover that reports `current_position`, the illustration follows the position and the transitions smooth out the updates. Without it, the drawing goes from one end to the other in `travel_time` when the cover switches to opening or closing.

Buttons: **Open / Stop / Close** for a `cover` (Stop is hidden when the cover does not support it), or a single **Command** button for an impulse entity (`entity_control`: `button`, `input_button`, `script`, `switch`…). Tapping the illustration opens the entity's more-info dialog.

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language.

- `entity` (cover, or binary_sensor / input_boolean / switch where on = open, or a text sensor: open / closed / opening / closing…)
- `entity_control` (optional impulse entity: button, input_button, script or switch)
- `entity_pedestrian` (optional pedestrian / partial opening: `button`, `input_button`, `script`, `scene`, `switch` or a `cover`; adds a **Pedestrian** button)
- `entity_power` (motor)
- `entity_energy`
- `entity_cost` or `price_per_kwh` (with `currency`)
- `travel_time` (seconds, default 4 for the barrier, 15 for the sliding gate, 14 for the swing gate and the garage door)
- `moving_threshold` (default 15 W: above it, the beacon flashes)
- `invert` (default false: on = closed, for a contact sensor that is on when closed)
- `leaves` (swing gate only: 1 or 2, default 2)
- `animations` (default true)
- `show_status`
- `show_controls`
- `show_position` (only shown when the cover reports `current_position`)
- `show_power`
- `show_energy`
- `show_cost`
- `show_since` (time since the last change)

## Examples

```yaml
type: custom:appliance-garage-door-card
name: Garage
entity: cover.garage_door
entity_power: sensor.garage_plug_power
entity_energy: sensor.garage_plug_energy
price_per_kwh: 0.2516
travel_time: 14
```

```yaml
type: custom:appliance-swing-gate-card
name: Front gate
entity: binary_sensor.gate_contact   # on = open
entity_control: button.gate_impulse  # dry contact of the motor
entity_power: sensor.gate_power
leaves: 2
travel_time: 18
```

[← All cards](../../README.md#the-cards)
