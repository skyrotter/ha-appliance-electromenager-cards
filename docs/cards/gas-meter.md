# Gas meter

`custom:appliance-gas-meter-card`: a yellow gas meter. The odometer shows the index (5 digits + 3 red decimals), the check wheel spins and the flame flickers faster with the flow. Animations can be turned off with `animations: false`.

Every sensor is optional:

| Option | What it does |
|---|---|
| `entity_index` | total index, shown in the sensor's unit (`m³`, `kWh`, `ft³`…), no conversion |
| `entity_flow` | flow rate, shown in the sensor's unit. **Without it, the flow is derived from the index changes** (index unit per hour) |
| `entity_today` | today's consumption |
| `entity_cost` | cost sensor (any currency) |
| `entity_leak` | gas detector (`binary_sensor` / `input_boolean`, on = gas). **One entity or a list**: the alert banner names the triggered detectors |
| `entity_valve` | shut-off valve (`valve`, `switch` or `input_boolean`): **Close / Open valve** button, the handle turns red |
| `flow_threshold` | flow below this counts as zero (0.01) |
| `variant` | `classic` (default: yellow bellows meter, odometer, flame) or `modern` (grey meter with LCD, yellow pipe with flow arrows that pulse with the flow, check wheel; the pipe turns red when the valve is closed). Modern drawing by Ppatou |
| `show_status`, `show_flow`, `show_today`, `show_index`, `show_cost`, `animations`, `labels`, `language` | |

States: **No consumption**, flowing (the badge shows the flow), **Gas leak** (red alert), **Valve closed**. Priority: leak > valve closed > flowing > idle.

```yaml
type: custom:appliance-gas-meter-card
entity_index: sensor.gas_meter_index
entity_flow: sensor.gas_flow               # optional
entity_leak:                               # optional, one detector or a list
  - binary_sensor.kitchen_gas
  - binary_sensor.boiler_gas
entity_valve: valve.gas_main               # optional
```


[← All cards](../../README.md#the-cards)
