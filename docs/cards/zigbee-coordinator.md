# Zigbee coordinator

`custom:appliance-zigbee-coordinator-card`

**Zigbee coordinator** with a cut-out photo (model: `slzb06`, SMLIGHT SLZB-06): animated LEDs for the Zigbee2MQTT bridge connection and the Ethernet link, "allow pairing" and restart buttons (with confirmation), temperatures, RAM and uptime tiles.

- **Online / Offline**: from `entity_connection` (the Zigbee2MQTT bridge connection, falls back to `entity_ethernet` when absent).
- **Zigbee LED**: green when the bridge is connected; amber, blinking, while `entity_permit_join` is on; red, blinking, if `entity_restart_required` is on.
- **Ethernet LEDs**: lit (green link + amber activity) while `entity_ethernet` is on.
- **Allow pairing** button toggles `entity_permit_join` (confirmation before opening the network). **Restart core** / **Restart Zigbee** press `entity_restart_core` / `entity_restart_zigbee` (confirmation, devices become briefly unavailable).

| Option | What it does |
|---|---|
| `entity_connection` | Zigbee2MQTT bridge connection (`binary_sensor.zigbee2mqtt_bridge_connection_state`) |
| `entity_restart_required` | bridge restart required (`binary_sensor.zigbee2mqtt_bridge_restart_required`), optional |
| `entity_ethernet` | Ethernet link (e.g. `binary_sensor.slzb_06_ethernet`) |
| `entity_permit_join` | permit join switch (`switch.zigbee2mqtt_bridge_permit_join`) |
| `entity_restart_core`, `entity_restart_zigbee` | restart buttons (e.g. SMLIGHT's `button.slzb_06_*`) |
| `entity_temp_core`, `entity_temp_zigbee` | core / Zigbee chip temperature sensors |
| `entity_ram` | RAM usage sensor (%) |
| `entity_uptime` | Zigbee uptime: a sensor in seconds, minutes, hours or days, or a `timestamp` sensor |
| `entity_version` | Zigbee2MQTT bridge version sensor |
| `entity_devices` | paired devices count sensor, optional |
| `model`, `illustration_size`, `transparent`, `compact`, `animations`, `show_status`, `show_controls`, `language` | |

```yaml
type: custom:appliance-zigbee-coordinator-card
name: Coordinador Zigbee
model: slzb06
entity_connection: binary_sensor.zigbee2mqtt_bridge_connection_state
entity_restart_required: binary_sensor.zigbee2mqtt_bridge_restart_required
entity_ethernet: binary_sensor.slzb_06_ethernet
entity_permit_join: switch.zigbee2mqtt_bridge_permit_join
entity_restart_core: button.slzb_06_reinicio_del_nucleo
entity_restart_zigbee: button.slzb_06_reinicio_de_zigbee
entity_temp_core: sensor.slzb_06_temperatura_del_chip_del_nucleo
entity_temp_zigbee: sensor.slzb_06_temperatura_del_chip_zigbee
entity_ram: sensor.slzb_06_uso_de_ram
entity_uptime: sensor.slzb_06_tiempo_de_actividad_de_zigbee
entity_version: sensor.zigbee2mqtt_bridge_version
```

[← All cards](../../README.md#the-cards)
