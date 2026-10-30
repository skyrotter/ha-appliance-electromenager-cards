# Dehumidifier

`custom:appliance-dehumidifier-card`: a portable dehumidifier with its top air outlet, front grille and transparent water tank. While drying, humid air is drawn in from the sides, droplets are caught behind the grille, the fan spins, warm dry air blows out of the top and drops fall into the tank. The display shows the measured humidity, `FULL` when the tank is full, `OFF` when switched off.

States:
- **Drying**: `humidifier` entity with `action: drying`, or power above `threshold` (50 W).
- **At target**: `action: idle`, low power (between 1 W and `threshold`), or humidity at or below the target when there is no power sensor.
- **Tank full**: `tank_full` sensor on (or a state such as `full` / `plein`). The tank is drawn full, the drop icon blinks and the card shows "Empty the tank".
- **Off**: entity or `switch` off, or 0 W.

```yaml
type: custom:appliance-dehumidifier-card
entity: humidifier.dehumidifier          # optional: on/off, action, current humidity, target, mode
power: sensor.dehumidifier_power         # optional: smart plug
energy: sensor.dehumidifier_energy       # optional
humidity: sensor.room_humidity           # optional (else current_humidity of the humidifier entity)
target_humidity: number.dehumidifier_target   # optional (else humidity of the humidifier entity)
temperature: sensor.room_temperature     # optional
tank_full: binary_sensor.dehumidifier_tank_full   # optional
fan_speed: select.dehumidifier_fan_speed # optional: select, number (%), or fan entity
mode: select.dehumidifier_mode           # optional (else mode of the humidifier entity)
switch: switch.dehumidifier_plug         # optional
humidity_max: 70                         # optional: "High humidity" alert above this value
```

| Option | Description |
|---|---|
| `entity` | `humidifier` entity (device class `dehumidifier`). Without `switch`, the power button toggles it. |
| `humidity` / `target_humidity` | Measured humidity and target (sensor, `number`, `input_number` or `humidifier`). |
| `tank_full` | `binary_sensor` (on = full) or a sensor whose state is `full`. |
| `fan_speed` | Text (`low` / `medium` / `high`, `silent`, `turbo`…), percentage, speed 1 to 3, or `fan` entity: sets the animation speed and shows a Fan tile. |
| `mode` | Mode tile (auto, laundry, continuous…). |
| `threshold` | Drying above this power (W, 50 by default). |
| `humidity_max` | Humidity alert threshold (%), off by default. |

Every tile opens the more-info dialog of its entity.

[← All cards](../../README.md#the-cards)
