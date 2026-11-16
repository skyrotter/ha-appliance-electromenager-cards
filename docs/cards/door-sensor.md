# Door sensor

`custom:appliance-door-sensor-card`

<p align="center"><img src="../door-sensor.gif" width="560" alt="Door sensor card"></p>

A white PVC front door (glazing, moulded panel, stainless bar handle) seen in 3/4 view, with the opening sensor on the frame and its magnet on the leaf. Works with any `binary_sensor` (door, opening, window, garage door contact).

- **Closed**: the leaf closes, green LED.
- **Open**: the leaf swings inward and the room lights up behind it, orange LED.
- **Left open**: after `open_alert_minutes` the LED blinks red, an alert outline pulses, waves leave the sensor and the line « Open for X min » appears.
- **Battery** (optional): a `sensor` in % or a low-battery `binary_sensor`. A battery pictogram blinks below `battery_low`.

```yaml
type: custom:appliance-door-sensor-card
entity: binary_sensor.front_door_contact
entity_battery: sensor.front_door_contact_battery   # optional (% sensor or low-battery binary_sensor)
open_alert_minutes: 5                               # 0 turns the "left open" alert off
battery_low: 20                                     # %
```

Options: `name`, `labels`, `illustration_size`, `transparent`, `tap_action` / `hold_action`, `language`, `show_status`, `show_battery`, `show_since`, `animations`.

[← All cards](../../README.md#the-cards)
