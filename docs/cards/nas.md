# NAS

`custom:appliance-nas-card`

<p align="center"><img src="../home-tech.gif" width="720" alt="Mini PC, NAS, TV box and smart scale cards"></p>

**NAS** (cut-out photo of the Synology DS423+, 4 bays), made for the **Synology DSM** integration. The STATUS and DISK LEDs of the photo come alive: the disk LEDs blink faster with the activity, a read beam sweeps across the bays, data packets fly to the volume ring (upload) or leave it (download), a failing disk blinks orange and its bay pulses red, the STATUS LED blinks orange on any alert, the power button breathes in blue and heat rises above the case when too hot. On the side: a volume ring (red above `volume_max`), download / upload bars and a temperature bar.

States: off, idle, running, very active (CPU above `cpu_busy` or high throughput), warning and unavailable. Alerts: volume degraded or crashed, disk N problem (DSM status or temperature above `disk_temp_max`), overheating, volume almost full, security warning. A "DSM update available" line shows when `entity_update` is on. Click a bay to open its disk.

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|nb|nl|ro|ru|sr|sr-Latn` forces the language.

- `entity` (optional on / off: ping, switch)
- `entity_volume` (volume status), `entity_volume_used` (%)
- `entity_cpu` (%), `entity_ram` (%), `entity_temp` (system temperature)
- `entity_net_down`, `entity_net_up` (DSM gives kB/s, shown as kB/s or MB/s)
- `entity_drive_1` … `entity_drive_4` (disk status), `entity_drive_1_temp` … `entity_drive_4_temp`
- `entity_security` (binary_sensor, on = problem), `entity_update` (update entity), `entity_power` (W)
- `cpu_busy` (default 60 %), `volume_max` (default 85 %), `temp_max` (default 60 °), `disk_temp_max` (default 50 °), `temperature_unit`
- `animations` (default true)
- `compact: true` (small fixed slots: smaller title, tiles and buttons, the illustration takes the remaining height), `transparent: true` (no card background), `illustration_size` (%)
- One checkbox per tile in the visual editor: `show_status`, `show_volume`, `show_cpu`, `show_ram`, `show_temp`, `show_disks`, `show_down`, `show_up`, `show_power` (`show_network: false` hides both network tiles)

## Example

```yaml
type: custom:appliance-nas-card
name: DS423+
entity_volume: sensor.ds423_volume_1_status
entity_volume_used: sensor.ds423_volume_1_volume_used
entity_cpu: sensor.ds423_cpu_utilization_total
entity_ram: sensor.ds423_memory_usage_real
entity_temp: sensor.ds423_temperature
entity_net_down: sensor.ds423_download_throughput
entity_net_up: sensor.ds423_upload_throughput
entity_drive_1: sensor.ds423_drive_1_status
entity_drive_1_temp: sensor.ds423_drive_1_temperature
entity_drive_2: sensor.ds423_drive_2_status
entity_drive_2_temp: sensor.ds423_drive_2_temperature
entity_drive_3: sensor.ds423_drive_3_status
entity_drive_3_temp: sensor.ds423_drive_3_temperature
entity_drive_4: sensor.ds423_drive_4_status
entity_drive_4_temp: sensor.ds423_drive_4_temperature
entity_security: binary_sensor.ds423_security_status
entity_update: update.ds423_dsm_update
```


[← All cards](../../README.md#the-cards)
