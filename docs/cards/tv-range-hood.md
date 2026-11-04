# Flat TV and range hood

<p align="center"><img src="../tv-range-hood.gif" width="560" alt="TV and range hood cards"></p>

**TV** (`custom:appliance-tv-card`): a flat screen, wall-mounted by default (nothing around it). `style: stand` puts it on a central stand, `style: feet` on two angled feet (also in the visual editor).

<p align="center"><img src="../tv.gif" width="300" alt="TV card"></p>

- **Switching on**: a bright line opens up the panel, light streaks converge into a start-up logo, then the streaming home screen appears; **switching off**: the picture collapses into a line, then a dot.
- **On**: a streaming home screen (featured banner, rows of tiles scrolling, moving selection). **Standby**: black screen, red LED. **Off**: black screen, no LED.
- With a smart plug: on above `threshold` (25 W), standby between `standby_threshold` (0.2 W) and 25 W, off below. With a `media_player`: `on` / `playing` / `paused` / `idle` = on, `standby` = standby, `off` = off, and the app or source is shown (« Allumée · Netflix »).

```yaml
type: custom:appliance-tv-card
entity: switch.tv_plug          # or media_player.living_room_tv
power: sensor.tv_plug_power
energy: sensor.tv_plug_energy_today
```

**Projectors** (same card, option `model`, "TV or projector" in the visual editor): `projector` (classic short-throw projector) or `projector_compact` (compact laser projector) shows a photo of the projector instead of the TV. **On**: the light beam and the lens glow (the lamp warms up for 3 s when it switches on), green LED. **Standby**: red LED. **Off**: no beam, no LED.

Functions (checkboxes in the visual editor):

| Option | Shows | Default |
|---|---|---|
| `show_controls` | buttons: power, next source, volume −, play / pause, volume +, mute (only those the `media_player` supports) | on for a projector, off for a TV |
| `show_source` | current source (`HDMI 1`…) | on for a projector, off for a TV |
| `show_volume` | volume (%) | on for a projector, off for a TV |
| `show_media` | app or programme next to the status | on |
| `show_lamp` | lamp / laser hours (`lamp_hours` sensor) | on |
| `show_picture_mode` | picture mode (`picture_mode` entity: select or sensor) | on |
| `show_temperature` | temperature (`temperature` sensor) | on |

`volume_step` sets the volume buttons step (0.05 = 5 %).

```yaml
type: custom:appliance-tv-card
entity: media_player.projector     # Epson, BenQ, Optoma, PJLink…
model: projector                   # projector / projector_compact
power: sensor.projector_plug_power
lamp_hours: sensor.projector_lamp_hours
picture_mode: select.projector_picture_mode
temperature: sensor.projector_temperature
```

**Range hood** (`custom:appliance-range-hood-card`): chimney hood above a cooktop and a steaming pot.
- **Fan running**: the fan spins, steam from the pot is drawn up into the hood, air flows upwards; faster at high speed, with the speed LEDs.
- **Lights**: the lamps light up the cooktop. With a power sensor alone, a few watts (above `light_threshold`, 3 W) without the motor = « Lights only »; or set a `light` entity.
- Speeds from power (above `threshold` 40 W = low, above `high_threshold` 130 W = high) or from a `speed` entity.

```yaml
type: custom:appliance-range-hood-card
power: sensor.hood_power
light: light.hood_light         # optional
```


[← All cards](../../README.md#the-cards)
