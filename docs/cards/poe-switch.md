# PoE switch

`custom:appliance-poe-switch-card`

Cloud-managed PoE switches (SSCPOE / Steamemo): the **front panel is drawn** with its ports. Each port has a **link LED** (green, blinking with the traffic) and a **PoE LED** (orange, breathing when the port powers a device). Models: `gps208` (8 PoE + 2 LAN), `gps204v` (4 PoE + 2 LAN), `gps105s` (4 PoE + 1 LAN).

**Tap a port** to see its details (link speed, PoE state, power, rx / tx rates) and two buttons: **PoE** (asks for a confirmation before cutting the power) and **Extend**.

| Option | What it does |
|---|---|
| `model` | `gps208` (default), `gps204v` or `gps105s` |
| `prefix` | prefix of your entities, without domain, e.g. `gps208xxxxxxxxxxxxarubg3l`. The card finds all the entities by itself (see below) |
| `entity_total_power`, `entity_voltage` | optional: use these entities instead of `<prefix>_total_power` and `<prefix>_voltage` |
| `show_total`, `show_voltage`, `show_poe`, `show_links`, `show_status`, `compact`, `animations`, `labels`, `language`, `illustration_size`, `transparent`, `tile_background`, `tile_order` | |

Entities found from `prefix` (`n` = port number, `lanN` = LAN port):

| Entity | Used for |
|---|---|
| `switch.<prefix>_<n>_poe` | PoE on / off of the port |
| `switch.<prefix>_<n>_extend`, `switch.<prefix>_lan<N>_extend` | Extend mode |
| `sensor.<prefix>_<n>_link`, `sensor.<prefix>_lan<N>_link` | link: a speed in Mbit/s (`1000` shows `1 G`), or a text (`up` / `down`) |
| `sensor.<prefix>_<n>_power` | power of the port (W) |
| `sensor.<prefix>_<n>_rx` / `_tx`, `sensor.<prefix>_lan<N>_rx` / `_tx` | receive / send rate (shown with their own unit) |
| `sensor.<prefix>_total_power`, `sensor.<prefix>_voltage` | total power and voltage tiles |

```yaml
type: custom:appliance-poe-switch-card
name: Cameras switch
model: gps208
prefix: gps208xxxxxxxxxxxxarubg3l
```

[← All cards](../../README.md#the-cards)
