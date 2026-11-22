# Electric cooktop

A black glass cooktop with four zones, a saucepan on the front-left zone and a frying pan on the back-right one.

- Each active zone **glows red**, brighter with its level, and the touch strip shows the level (1–9).
- The pot steams; at high level the lid rattles. The pan sizzles.
- After cooking, an **H** (residual heat) stays on the zones that were used for `residual_minutes` (10 min).
- **Per-zone data** (`zone_1` = front-left, `zone_2` = front-right, `zone_3` = back-left, `zone_4` = back-right), as a level, W or %, when your cooktop integration provides it (Home Connect, SmartThings…).
- **Total power only**: the zones are lit from the power (about `zone_power`, 1500 W, per zone).
- **State only** (no power sensor): an `entity` that is on / running (`binary_sensor`, `input_boolean`, or a state sensor such as Home Connect `run`) lights one zone at a medium level. Combine with `show_power: false` if `power` is only an estimate.

⚠️ A cooktop is wired on a dedicated 20–32 A circuit, **never on a smart plug**. Measure it with a DIN-rail energy meter or a CT clamp at the electrical panel.

```yaml
type: custom:appliance-hob-card
power: sensor.cooktop_power      # from a DIN-rail meter or CT clamp
energy: sensor.cooktop_energy_today
power_factor: sensor.cooktop_power_factor   # optional: power factor (cos φ) tile
```

`power_factor` is a sensor holding the power factor, either as a decimal (0.93) or in % (93 %); the tile is hidden while the power is 0. Most DIN-rail meters and CT clamps (Shelly Pro / EM, Eastron…) expose it.


[← All cards](../../README.md#the-cards)
