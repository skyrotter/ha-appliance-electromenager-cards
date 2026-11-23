# Cross trainer, exercise bike, rowing machine and treadmill

Four cards for home fitness equipment on a smart plug: `appliance-elliptical-card`, `appliance-exercise-bike-card`, `appliance-rowing-machine-card` and `appliance-treadmill-card`.

- Idle / **In use** from the power: above `threshold` (10 W by default) = in use.
- Animation while in use: the flywheel and pedals turn (cross trainer: pedals follow an ellipse, arms swing; bike: cranks turn, pedals stay flat), the rower's seat slides, the handle is pulled and the flywheel spins; on the treadmill the belt runs and the deck tilts with the incline.
- Treadmill: the belt speed follows the `speed` sensor (km/h), and the optional `incline` sensor (%) raises the deck.
- Speed of the animation: from `cadence` (rpm, or strokes/min for the rower) if you have it, otherwise from the power (`max_power` = effort at full speed, 250 W by default).
- Tiles: power, energy, cost, time in use today (history of the power sensor, or `usage_time`), plus the optional `speed`, `incline` (treadmill), `cadence`, `distance`, `heart_rate` and `calories` sensors.
- `show_usage_time: false` hides the time in use.

```yaml
type: custom:appliance-rowing-machine-card
name: Rowing machine
entity: switch.rower_plug
power: sensor.rower_plug_power
energy: sensor.rower_plug_energy
cadence: sensor.rower_stroke_rate   # optional
heart_rate: sensor.heart_rate       # optional
calories: sensor.rower_calories     # optional
distance: sensor.rower_distance     # optional
threshold: 10
```

[← All cards](../../README.md#the-cards)
