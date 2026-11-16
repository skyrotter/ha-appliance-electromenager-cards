# Hue Sync Box

`custom:appliance-hue-sync-box-card`

Philips Hue Play HDMI Sync Box (Hue integration of Home Assistant): the box is drawn in 3/4 view, its four HDMI inputs light up green when a device is plugged in, and a colour halo with waves animates while the lights are synced. Every entity is optional: only the controls you configure are shown.

Controls: **Power**, **Light sync**, **Dolby Vision** (switches), a **brightness** slider (`number`), and drop-downs for the entertainment area, intensity, sync mode, HDMI input and LED indicator (`select` entities, options read from the entity). Tiles: state of HDMI 1 to 4.

```yaml
type: custom:appliance-hue-sync-box-card
entity_power: switch.sync_box_power
entity_sync: switch.sync_box_light_sync
entity_dolby: switch.sync_box_dolby_vision_compatibility     # optional
entity_brightness: number.sync_box_brightness                # optional
entity_area: select.sync_box_entertainment_area              # optional
entity_intensity: select.sync_box_intensity                  # optional
entity_mode: select.sync_box_sync_mode                       # optional
entity_input: select.sync_box_hdmi_input                     # optional
entity_led: select.sync_box_led_mode                         # optional
entity_hdmi1: binary_sensor.sync_box_hdmi_input_1_status     # optional, same for 2, 3 and 4
```

Options: `name`, `labels`, `illustration_size`, `transparent`, `tap_action` / `hold_action`, `language`, `show_status`, `show_buttons`, `show_selects`, `show_brightness`, `show_hdmi`, `animations`.

[← All cards](../../README.md#the-cards)
