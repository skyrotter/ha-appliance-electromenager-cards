# Ceiling fan

<p align="center"><img src="../fans.gif" width="480" alt="Pedestal fan and ceiling fan cards"></p>

`custom:appliance-ceiling-fan-card`: a ceiling fan with four wooden blades seen in perspective, the motor housing, a glass light and two pull chains. Three speeds like the pedestal fan (`fan` entity `percentage`, or power: `threshold` 5 W, `mid_threshold` 30 W, `high_threshold` 40 W): the blades turn faster, air flows down and the chains sway. With a `light` entity the glass glows and lights the room below, even when the blades are stopped (status "Lights only").

```yaml
type: custom:appliance-ceiling-fan-card
entity: fan.living_room_ceiling   # or power: sensor.ceiling_fan_power
light: light.living_room_ceiling  # optional
show_light: true                  # false: fan without a lamp (lamp and light beam hidden, `light` ignored)
show_controls: true               # buttons, see below
```

With a **`fan` entity** the card shows **buttons** (`show_controls`, default on; only those the entity supports): **power**, **speed 1 / 2 / 3** (sets 33 / 67 / 100 %) and the **direction** (summer: air blown down, winter: air drawn up, `fan.set_direction`). The speed and direction buttons are disabled while the fan is off.


[← All cards](../../README.md#the-cards)
