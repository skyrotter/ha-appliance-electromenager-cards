# Electric meter

`custom:appliance-electric-meter-card`: a generic disc electricity meter (for the French Linky, see the [Linky card](linky.md)). The red disc spins faster with the power, the pulse LED blinks and the odometer shows the index in kWh. Animations can be turned off with `animations: false`.

Every sensor is optional:

| Option | What it does |
|---|---|
| `entity_power` | power; `W`, `kW`, `MW` are converted. **Without it, the power is derived from the index changes** |
| `entity_index` | total energy index; `Wh`, `kWh`, `MWh` are converted |
| `entity_today` | today's consumption (kWh) |
| `entity_cost` | cost sensor (any currency) |
| `entity_tariff` | current tariff (text sensor, `select`, `input_select`) |
| `entity_power_l1`, `entity_power_l2`, `entity_power_l3` | power per phase (three tiles) |
| `subscribed_power` | subscribed power in kVA: above it the state becomes **Overload** (red alert). `0` = off |
| `power_threshold` | power below this counts as zero (5 W) |
| `show_status`, `show_power`, `show_today`, `show_index`, `show_cost`, `show_tariff`, `show_phases`, `animations`, `labels`, `language` | |

States: **No consumption**, consuming (the badge shows the power), **Overload**.

```yaml
type: custom:appliance-electric-meter-card
entity_power: sensor.house_power
entity_index: sensor.house_energy_total
entity_tariff: sensor.current_tariff       # optional
entity_power_l1: sensor.power_l1           # optional
subscribed_power: 9                        # optional, kVA
```


[← All cards](../../README.md#the-cards)
