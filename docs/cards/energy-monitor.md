# Energy monitor (Ecojoko style)

`custom:appliance-energy-monitor-card`: a home energy display from a **single sensor**, in the spirit of the Ecojoko screen. For example one sensor that reports the whole consumption of the induction hob and the oven.

- **Round white box** like the real thing: the **watts scale** on the top arc (0, 50, 100, 500, 1K, 5K, 10K, MAX) with a blue marker that follows the power right now; the whole arc carries a **colour scale** (green / orange / red following your thresholds), the part already reached is full and the rest is dimmed.
- **% scale** on the bottom arc (-20 … +20): the evolution of your consumption over the **last 7 days compared with the 7 days before** (needs the long-term statistics of the sensor, at least 10 days). The second blue marker shows it.
- **Black screen** in the middle that cycles every 6 seconds: power, energy of the day, cost, **base load** (the lowest hourly average power of the last 24 h) and "Saving over 7 days -18 % of consumption".
- **Tiles** (today, cost, base load) and a **24 h histogram**: average power per hour, coloured by level, with a dashed line for the base load. The history comes from the Home Assistant recorder, completed by the live value.

One sensor is enough, power or energy:
- a **power** sensor (`entity_power`, W / kW / MW): the energy of the day and the histogram are computed from its history;
- an **energy** sensor (`entity_energy`, Wh / kWh / MWh, cumulative): the energy of the day is read from it, and without a power sensor the power is deduced from its variations over the last 10 minutes.

```yaml
type: custom:appliance-energy-monitor-card
name: Kitchen (hob + oven)
entity_power: sensor.kitchen_power
price_per_kwh: 0.2516          # number or entity
thresholds: [2000, 4500]       # orange from 2000 W, red from 4500 W (whole house)
```

| Option | Description |
|---|---|
| `entity_power` | Power sensor (W, kW, MW). |
| `entity_energy` | Cumulative energy sensor (Wh, kWh, MWh). At least one of the two sensors is required. |
| `entity_cost` | Cost of the day (sensor). Otherwise `price_per_kwh` × energy of the day. |
| `price_per_kwh` | Price per kWh: a number or an entity (`sensor.tarif`, `input_number.prix`…). |
| `currency` | Currency symbol. Default: the currency of Home Assistant. |
| `thresholds` | `[orange from, red from]` in W, for the colours. Default `[2000, 4500]` (whole house). |
| `show_graph`, `show_base`, `show_cost` | Hide the histogram, the base load or the cost (default true). |

Common options (`name`, `illustration_size`, `transparent`, `tap_action`, `hold_action`, `language`…): see [configuration.md](../configuration.md).

[← All cards](../../README.md#the-cards)
