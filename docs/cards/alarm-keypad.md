# Alarm keypad

`custom:appliance-alarm-keypad-card`

A white touch keypad (screen, padlocks, number pad, navigation and function keys) drawn in vector. Its screen shows the alarm status and the number of open zones; optional zone chips below it turn orange when a zone is open and red when it is in fault. Tap the keypad to open the status entity.

```yaml
type: custom:appliance-alarm-keypad-card
entity: sensor.alarm_status
name: Alarm
entity_zones_open: sensor.nb_zone_open      # optional
entity_zones_fault: sensor.nb_zone_default  # optional
zones:                                      # optional, up to 8
  - name: Living room
    entity: binary_sensor.detection_living
    entity_fault: binary_sensor.default_living
  - name: Kitchen
    entity: binary_sensor.detection_kitchen
```

## Options

| Option | Description |
|---|---|
| `entity` | Alarm status: a text `sensor` or an `alarm_control_panel`. |
| `entity_zones_open`, `entity_zones_fault` | Counters of open / faulty zones. Without them, the count is taken from `zones`. |
| `zones` | Up to 8 zones: `name`, `entity` (open) and `entity_fault` (both optional `binary_sensor`). |
| `show_status`, `show_open`, `show_fault`, `show_zones` | Show the badge, the two counter tiles and the zone chips (default true). |
| `animations` | Set false to disable the blinking. |

Recognised statuses (English or French text, or `alarm_control_panel` states): not armed / disarmed / non actif, ready / prêt, armed / actif, armed partially / armed_home / armed_night / actif partiel, entry delay / pending / tempo entrée, exit delay / arming / tempo sortie, intrusion / triggered. Override the displayed words with `labels` (keys `disarmed`, `ready`, `armed`, `armed_partial`, `entry_delay`, `exit_delay`, `intrusion`).

The shared options `language`, `illustration_size`, `transparent`, `tile_background`, `tile_order`, `labels`, `tap_action` and `hold_action` work too.

[← All cards](../../README.md#the-cards)
