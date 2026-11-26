# Energy monitor (Ecojoko style)

`custom:appliance-energy-monitor-card`: a home energy display from a **single sensor**, in the spirit of the Ecojoko screen. For example one sensor that reports the whole consumption of the induction hob and the oven.

- **Ring and face** that go from green to red following the power right now (thresholds you can change), with the live power (W, or kW from 10 kW).
- **Today**: energy of the day (kWh), **cost** (a cost sensor or a price per kWh) and **base load** (the lowest hourly average power of the last 24 h).
- **24 h histogram**: average power per hour, coloured by level, with a dashed line for the base load. The history comes from the Home Assistant recorder, completed by the live value.

One sensor is enough, power or energy:
- a **power** sensor (`entity_power`, W / kW / MW): the energy of the day and the histogram are computed from its history;
- an **energy** sensor (`entity_energy`, Wh / kWh / MWh, cumulative): the energy of the day is read from it, and without a power sensor the power is deduced from its variations over the last 10 minutes.

```yaml
type: custom:appliance-energy-monitor-card
name: Kitchen (hob + oven)
entity_power: sensor.kitchen_power
price_per_kwh: 0.2516          # number or entity
thresholds: [1000, 3000]       # orange from 1000 W, red from 3000 W
max_power: 5000                # power of the full ring
```

| Option | Description |
|---|---|
| `entity_power` | Power sensor (W, kW, MW). |
| `entity_energy` | Cumulative energy sensor (Wh, kWh, MWh). At least one of the two sensors is required. |
| `entity_cost` | Cost of the day (sensor). Otherwise `price_per_kwh` × energy of the day. |
| `price_per_kwh` | Price per kWh: a number or an entity (`sensor.tarif`, `input_number.prix`…). |
| `currency` | Currency symbol. Default: the currency of Home Assistant. |
| `thresholds` | `[orange from, red from]` in W. Default `[1000, 3000]`. |
| `max_power` | Power (W) of the full ring. Default: 1.5 × the red threshold. |
| `show_graph`, `show_base`, `show_cost` | Hide the histogram, the base load or the cost (default true). |

Common options (`name`, `illustration_size`, `transparent`, `tap_action`, `hold_action`, `language`…): see [configuration.md](../configuration.md).

[← All cards](../../README.md#the-cards)
