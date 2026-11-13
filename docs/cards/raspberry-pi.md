# Raspberry Pi

`custom:appliance-raspberry-pi-card`

A **Raspberry Pi 4 drawn in SVG** (top view), fed by the **System Monitor** integration (or Glances). The green ACT LED blinks faster with the CPU load, the processor glows from blue to red with the temperature, the Ethernet port blinks and packets run down / up the cable with the network rate. Heat rises above the board when it is busy or hot, and a bolt flashes on **undervoltage**. Tiles with a progress bar: CPU, temperature, RAM, disk.

```yaml
type: custom:appliance-raspberry-pi-card
name: RPi4
entity_cpu: sensor.rpi_processor_use
entity_cpu_temp: sensor.rpi_processor_temperature
entity_ram: sensor.rpi_memory_use_percent
entity_ram_free: sensor.rpi_memory_free
entity_disk: sensor.rpi_disk_use_percent
entity_net_down: sensor.rpi_network_throughput_in_eth0
entity_net_up: sensor.rpi_network_throughput_out_eth0
entity_data_down: sensor.rpi_network_in_eth0
entity_data_up: sensor.rpi_network_out_eth0
entity_uptime: sensor.rpi_last_boot
entity_power_status: binary_sensor.rpi_power_status
```

| Option | What it does |
|---|---|
| `entity` | optional on/off or connectivity entity (otherwise the card is « unavailable » when the CPU sensor is) |
| `entity_cpu`, `entity_cpu_temp`, `entity_ram`, `entity_ram_free`, `entity_disk` | load (%), temperature, RAM used (%), RAM free, disk used (%) |
| `entity_net_down`, `entity_net_up` | network rates, any unit (B/s, kB/s, Mbit/s…) |
| `entity_data_down`, `entity_data_up` | total data received / sent |
| `entity_uptime` | « Last boot » timestamp sensor or a duration |
| `entity_power_status` | `binary_sensor` of the **Raspberry Pi Power Supply Checker** (on = undervoltage) |
| `cpu_busy`, `temp_max`, `ram_max`, `disk_max` | thresholds: busy (70 %), overheating (80 °), memory saturated (90 %), disk almost full (90 %) |
| `show_cpu`, `show_temp`, `show_ram`, `show_ram_free`, `show_disk`, `show_down`, `show_up`, `show_data_down`, `show_data_up`, `show_uptime`, `show_power`, `show_status`, `compact`, `animations`, `extra_tiles`, `labels`, `language`, `illustration_size`, `transparent`, `tile_background`, `tile_order` | |
