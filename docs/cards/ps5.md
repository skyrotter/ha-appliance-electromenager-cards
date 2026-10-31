# PlayStation 5

`custom:appliance-ps5-card`: the console standing on its stand, with its controller resting at its foot (silhouette only, no logo).

States and animations:
- **Off**: grey light strips.
- **Rest mode**: orange light strips breathing slowly; the controller charges (cable plugged in, orange light bar).
- **On**: at power-on the light strips sweep up in blue, then stay white; the controller light bar turns blue and a little warm air comes out of the top vents.
- **Gaming**: blue glow around the console, more warm air, the controller is picked up (it lifts and moves, its buttons light up). With PlayStation Network, the status shows the game: "Gaming · Astro Bot".

Two sources, together or apart:
- **A smart plug** (`power`): on above `threshold` (**25 W**), gaming above `gaming_threshold` (**100 W**), rest mode between `standby_threshold` (**0.8 W**) and `threshold`, off below. The plug wins over PlayStation Network, which only reports the account (it can be online on another device, or show offline while you play).
- **The PlayStation Network integration** (`entity: media_player.…`): `playing` = gaming, with the game title (`media_title`); `on` = on. Used alone when there is no plug.

```yaml
type: custom:appliance-ps5-card
entity: media_player.playstation_5   # optional: PlayStation Network integration
power: sensor.ps5_plug_power         # optional: smart plug
switch: switch.ps5_plug              # optional: power button
energy: sensor.ps5_plug_energy
```

| Option | Description |
|---|---|
| `entity` | `media_player` of the PlayStation Network integration: gaming state and game title. |
| `power` | Plug power: off, rest mode, on, gaming. |
| `switch` | Plug switch: power button. Cutting the plug while the console is on or in rest mode (downloads, updates) needs two clicks. |
| `threshold` | On above this power (W). Default 25. |
| `gaming_threshold` | Gaming above this power (W), even without PlayStation Network. Default 100. |
| `standby_threshold` | Rest mode above this power (W). Default 0.8. |
| `confirm_off` | `false` to cut the plug in one click. Default `true`. |

Common options (`energy`, `cost`, `energy_period`, `price_per_kwh`, `display`, `tap_action`, `hold_action`, `labels`…): see [configuration.md](../configuration.md).
