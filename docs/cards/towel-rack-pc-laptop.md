# Heated towel rail, server rack, desktop PC and laptop

Four cards driven by a smart plug (`power`), with an optional `entity` and `switch`.

- **Heated towel rail** (`custom:appliance-towel-dryer-card`): above `threshold` (50 W) the rails glow orange, heat waves rise, towels sway and steam. Below it with the plug on: "At target" (rails barely warm). Optional `temperature` / `target_temperature` (the display shows the target) and `humidity` (tile; otherwise `current_humidity` of a `climate` entity).
- **Server rack / homelab** (`custom:appliance-server-rack-card`): above `threshold` (30 W) the LEDs blink, the fans spin, drive bays glow blue and data flows along the cables. The blink rate follows the load (`max_power`, default 300 W). The UPS display shows the live power draw.
- **Desktop PC** (`custom:appliance-desktop-pc-card`): above `threshold` (40 W) the screen lights up with a desktop (typing code, bars, moving cursor) and the case fans spin with RGB rings. Between 0.5 W and the threshold: sleep (amber LED). `style: tower` draws the tower alone (for a PC whose monitors are on another plug).
- **Monitors** (`custom:appliance-monitor-card`): one, two or three screens on their own plug (`screens`, default 2). Above `threshold` (10 W) they show a code editor, a dashboard and a video; between `standby_threshold` (0.3 W) and the threshold: standby (amber LED, "no signal" box).
- **Laptop** (`custom:appliance-laptop-card`): above `threshold` (15 W) the screen shows a live dashboard and the keys are backlit; below it: sleep (amber LED).

```yaml
type: custom:appliance-towel-dryer-card
power: sensor.towel_rail_power
temperature: sensor.bathroom_temperature
---
type: custom:appliance-server-rack-card
power: sensor.rack_power
max_power: 250
---
type: custom:appliance-desktop-pc-card
power: sensor.pc_power
---
type: custom:appliance-desktop-pc-card   # tower only
power: sensor.pc_tower_power
style: tower
---
type: custom:appliance-monitor-card
power: sensor.monitors_power
switch: switch.monitors
screens: 2
---
type: custom:appliance-laptop-card
power: sensor.laptop_power
```


[← All cards](../../README.md#the-cards)
