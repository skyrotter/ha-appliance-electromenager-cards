# Air compressor

`custom:appliance-air-compressor-card`: a belt-driven air compressor (horizontal tank, motor, flywheel, piston head) on a smart plug with power metering (e.g. Shelly).

- Runs above `threshold` (20 W by default): the motor and flywheel spin, the belt runs, the piston pumps and the tank vibrates.
- Tiles: power, daily energy and cost, usage time today (`usage_time`, otherwise computed from the power history), total runtime (`runtime_total`) and tank pressure (`pressure`).

```yaml
type: custom:appliance-air-compressor-card
power: sensor.compressor_power
energy: sensor.compressor_energy_daily
usage_time: sensor.compressor_runtime_today
runtime_total: sensor.compressor_runtime_total
pressure: sensor.compressor_tank_pressure
```

[← All cards](../../README.md#the-cards)
