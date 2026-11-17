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
| `illustration_position` | `center` (default), `left` or `right`: the meter sits beside the first two tiles, the other tiles go below on two columns |
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


## Belgian P1 meter (Sagemcom XS212)

`model: sagemcom_xs212` shows the Sagemcom / Siconia XS212 smart meter (P1 port) as a cut-out photo. Its LCD scrolls through the available values (OBIS code + value: `1.8.0` total import, `1.8.1` / `1.8.2` import tariff 1 / 2, `2.8.x` export, `1.7.0` power, `32.7` voltage, `31.7` current) and the pulse LED blinks while power flows. Feed it with the sensors of a P1 reader (e.g. HomeWizard):

| Option | Sensor |
|---|---|
| `entity_index` | total import (`1.8.0`) |
| `entity_import_t1`, `entity_import_t2` | import tariff 1 (full) / 2 (reduced) |
| `entity_export`, `entity_export_t1`, `entity_export_t2` | total export / export tariff 1 / 2 |
| `entity_peak`, `entity_avg` | monthly peak demand, average demand |
| `entity_voltage`, `entity_current` | voltage, current |
| `entity_battery` | battery group power |
| `entity_power`, `entity_power_l1` to `l3` | power, power per phase |

`show_tariffs`, `show_peak`, `show_electrics`, `show_battery` hide each group of tiles.

```yaml
type: custom:appliance-electric-meter-card
model: sagemcom_xs212
entity_power: sensor.p1_power
entity_index: sensor.p1_energy_import
entity_import_t1: sensor.p1_energy_import_tariff_1
entity_import_t2: sensor.p1_energy_import_tariff_2
entity_export: sensor.p1_energy_export
entity_peak: sensor.p1_monthly_peak
entity_voltage: sensor.p1_voltage_phase_1
entity_current: sensor.p1_current
```

[← All cards](../../README.md#the-cards)
