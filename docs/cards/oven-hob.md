# Oven and hob (one sensor)

`custom:appliance-oven-hob-card`: the **oven** and the **hob** side by side on the same card, for a kitchen where **one single sensor** reports the consumption of both (for example a meter on the circuit of the induction hob and the oven).

The two drawings are those of the [Oven](../configuration.md#type-specific-options) and [Cooktop](hob.md) cards, reused as they are: they are animated **together** as soon as the power goes above the threshold (the oven heats, the hob zones glow). Under the drawings, a common **power**, **energy** and **cost**.

```yaml
type: custom:appliance-oven-hob-card
name: Kitchen
power: sensor.kitchen_power
energy: sensor.kitchen_energy_today
price_per_kwh: 0.2516
```

With one sensor the card cannot tell which of the two is heating. To refine one of them, give it its own data with `oven:` and `hob:`, which accept any option of the corresponding card (oven temperature, door, per-zone levels of the hob…):

```yaml
type: custom:appliance-oven-hob-card
power: sensor.kitchen_power
oven:
  temperature: sensor.oven_temperature
  door: binary_sensor.oven_door
hob:
  zone_1: sensor.hob_zone_1
  zone_2: sensor.hob_zone_2
```

| Option | Description |
|---|---|
| `power` | Power sensor (W or kW) of the oven + hob. |
| `energy` | Energy sensor (Wh, kWh) of the oven + hob. At least one of `power`, `energy` is required. |
| `cost`, `price_per_kwh` | Cost sensor, or a price per kWh (number or tariff entity) × the energy. |
| `threshold` | Cooking above this power (W). Default 50. |
| `oven`, `hob` | Options passed to the oven card / the hob card (object). |
| `show_power`, `show_energy`, `show_cost` | Hide a tile (default true). |

Common options (`name`, `illustration_size`, `transparent`, `tap_action`, `hold_action`, `language`…): see [configuration.md](../configuration.md).

⚠️ A hob is wired on a dedicated 20–32 A circuit, **never on a smart plug**: measure it with a DIN-rail energy meter or a CT clamp at the electrical panel.

[← All cards](../../README.md#the-cards)
