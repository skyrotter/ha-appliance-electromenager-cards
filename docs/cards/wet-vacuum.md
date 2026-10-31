# Wet & dry vacuum

`custom:appliance-wet-vacuum-card`: a cordless wet & dry floor cleaner (upright floor washer): handle, round display ring, clean water tank at the back, transparent dirty water tank and a brush roller, standing in its dock or washing the floor.

States and animations:
- **Cleaning**: the dock disappears, the cleaner moves back and forth, the roller spins, water drips and the floor gets wet. The ring turns blue.
- **Self-cleaning**: in the dock, the roller spins fast, water and bubbles flow in the tray, the dirty water swirls and the ring spins.
- **Drying**: warm air rises around the brush head, the roller turns slowly, the ring turns orange.
- **Charging** / **Charged**: the dock's bolt and the ring light up green; the ring and the progress bar follow `battery_level`.
- The display shows the battery level, `FULL` when the dirty water tank is full.

Two ways to feed it, together or apart:
- **An integration** (status entity): `entity` can be a `vacuum` entity (`cleaning`, `docked`, `error`…) or a sensor / select whose state contains `cleaning`, `self_cleaning`, `drying`, `charging`, `charged` (French, German and Dutch words are understood too). It wins over the plug.
- **A smart plug on the dock** (`power`): above `selfclean_threshold` (**60 W** by default) = self-cleaning, above `threshold` (**3 W**) = charging, otherwise charged (battery full) or off the dock. Hot-air drying draws about as much as self-cleaning, so drying is only shown with a status entity.

```yaml
type: custom:appliance-wet-vacuum-card
entity: sensor.floor_washer_status      # optional: vacuum.* or a status sensor
power: sensor.floor_washer_dock_power   # optional: smart plug on the dock
battery_level: sensor.floor_washer_battery
clean_water: sensor.floor_washer_clean_water   # % or binary_sensor (on = empty)
dirty_water: binary_sensor.floor_washer_dirty_tank_full   # % or binary_sensor (on = full)
mode: select.floor_washer_mode          # optional: shown in a tile
```

| Option | Description |
|---|---|
| `entity` | Status: `vacuum` entity, or a sensor / select with the working state. |
| `power` | Dock plug power: charging and self-cleaning without an integration. |
| `battery_level` | Battery (%): display ring, tile, progress bar while charging. |
| `clean_water` | Clean water tank: level in % (alert at or below `clean_water_low`, 10 %) or `binary_sensor` / state `empty`, `low` (on = empty). |
| `dirty_water` | Dirty water tank: level in % (alert at or above `dirty_water_full`, 90 %) or `binary_sensor` / state `full` (on = full). |
| `mode` | Suction / cleaning mode (select or sensor), shown in a tile. |
| `selfclean_threshold` | Dock power (W) above which it is self-cleaning. Default 60. |
| `battery_low` | "Low battery" alert at or below this level, except while charging. Default 20. |
| `full_level` | Battery level considered full. Default 100. |

Alerts: **Clean water tank empty** (tank drawn empty and red), **Dirty water tank full** (dirty tank drawn full, display `FULL`), **Low battery**, **Error** (status containing `error`, `fault`…).
