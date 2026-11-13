# Internet box

`custom:appliance-internet-box-card`

**Internet box** with a cut-out photo or a vector SVG drawing of your model (`model`): `freebox_pop` (Freebox Pop, default), `sfr_box` (SFR Box), or a Wi-Fi router: `router` (generic router with four antennas, drawn), `asus_gt_be98` (ASUS ROG Rapture GT-BE98), `asus_rt_ac88u` (ASUS RT-AC88U), `asus_rt_be92u` (ASUS RT-BE92U), `asus_rt_ac68u` (ASUS RT-AC68U) and `xiaomi_ax3000` (Xiaomi Mesh System AX3000 NE, white tower). Choose the drawing with `illustration: svg` (default `photo`; `router` is always drawn, and the other routers use the generic drawing when `illustration: svg`).

Animations: Wi-Fi waves leave the box, packets run towards the box (download, blue) and away from it (upload, orange) at a speed that follows your throughput, the box LED is white when online and blinks red when offline (the Wi-Fi tile of the SFR Box screen lights up too), the cloud is crossed out on an outage.

Buttons: Wi-Fi on/off (`entity_wifi`) and restart (`entity_reboot`, with confirmation).

## Options

- `entity`: connection state (binary_sensor, sensor, device_tracker…). Without it, the box is online as soon as a throughput is readable
- `entity_download`, `entity_upload` (sensors, Mb/s, kB/s, MB/s…), `entity_devices` (sensor), `entity_wifi` (switch), `entity_reboot` (button)
- `entity_ping` (sensor, ms), `entity_wan_ip` (sensor, text), `entity_uptime` (sensor in seconds, minutes, hours or days, or a `timestamp` sensor holding the last boot), `entity_cpu` and `entity_memory` (sensors, %): extra tiles, shown only when the entity is set
- Wi-Fi switch per band, one round button each next to the main Wi-Fi button: `entity_wifi_24`, `entity_wifi_5`, `entity_wifi_6`, `entity_wifi_guest` (guest network), `entity_wifi_iot` (IoT network). Switches, lit when on
- `model`, `illustration` (`photo` | `svg`), `max_speed` (reference throughput in Mb/s for the packet speed, default 1000)
- `animations` (default true), `compact: true`, `transparent: true`, `illustration_size` (%)
- `show_status`, `show_controls`, `show_download`, `show_upload`, `show_devices`, `show_wifi`, `show_ping`, `show_wan_ip`, `show_uptime`, `show_cpu`, `show_memory`
- `language: fr|en|de|it|es|nb|nl|pl|ro|ru|sr|sr-Latn`

## Examples

```yaml
type: custom:appliance-internet-box-card
model: freebox_pop
entity: binary_sensor.freebox_connectivity
entity_download: sensor.freebox_download_speed
entity_upload: sensor.freebox_upload_speed
entity_wifi: switch.freebox_wifi
```

```yaml
type: custom:appliance-internet-box-card
model: sfr_box
illustration: svg
entity: binary_sensor.sfr_box_wan
entity_download: sensor.sfr_box_download
entity_upload: sensor.sfr_box_upload
```
