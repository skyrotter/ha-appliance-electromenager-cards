# Thermomix

`custom:appliance-thermomix-card`: the Thermomix food processor, **TM6** (white) or **TM7** (black), picked with `model` in the visual editor.

States and animations (from the smart plug power):
- **Off**: the screen is a dark glass, the status lights are off.
- **Standby**: screen on, green lights breathing.
- **Mixing**: the machine shakes slightly.
- **Turbo**: strong shaking, a little steam.
- **Heating**: steam coming out of the lid, orange lights.
- **Cooking**: steam, orange lights and a gentle stirring shake.

Vorwerk has no Home Assistant integration that reports the machine state, so the card reads the **plug power**: off below `standby_threshold` (**0.5 W**), standby up to `threshold` (**15 W**), mixing above, turbo above `turbo_threshold` (**250 W**), heating above `heat_threshold` (**650 W**). **Heating or cooking?** While it heats up, the element stays on (high power all the time): *heating*. Once the temperature is reached, the element switches off and on to hold it (high and low power in turn): *cooking*, as long as this alternation lasts (90 s window). The heating element draws 600 to 1000 W, the motor 20 to 80 W at speeds 1–4 and up to about 500 W in turbo: adjust the thresholds to your plug if needed.

```yaml
type: custom:appliance-thermomix-card
model: tm6                          # tm6 (default) or tm7
power: sensor.thermomix_plug_power
switch: switch.thermomix_plug       # optional: on/off button
energy: sensor.thermomix_plug_energy
energy_period: month                # optional: day / week / month…
price_per_kwh: 0.2516               # optional: cost in €
```

| Option | Description |
|---|---|
| `model` | `tm6` (white, default) or `tm7` (black). |
| `power` | Plug power: off, standby, mixing, turbo, heating, cooking. |
| `switch` | Plug switch: on/off button. Cutting the plug while it mixes or heats needs two clicks (`confirm_off: false` to turn off). |
| `threshold` | Mixing above this power (W). Default 15. |
| `standby_threshold` | Standby (screen on) above this power (W). Default 0.5. |
| `turbo_threshold` | Turbo above this power (W). Default 250. |
| `heat_threshold` | Heating above this power (W). Default 650. |
| `show_power` / `show_energy` / `show_cost` / `show_toggle` | Checkboxes in the visual editor: show the power, energy and cost tiles and the on/off button (all on by default). |

Common options (`energy`, `cost`, `energy_period`, `price_per_kwh`, `display`, `tap_action`, `hold_action`, `labels`…): see [configuration.md](../configuration.md).
