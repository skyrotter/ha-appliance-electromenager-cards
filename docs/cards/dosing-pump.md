# Dosing pump (pH+ / pH-)

Blue peristaltic dosing pump, as used to correct the pH of a pool. Use one card per pump (pH+ and pH-).

- The rotor turns, the liquid flows in the tube and the green LED pulses while the pump is injecting. The status reads **Dosing**.
- With a smart plug: above `threshold` (3 W) = **Dosing**. With a switch only (no power sensor): switch on = **Dosing**.
- `ph`: pH sensor, shown as a tile.
- The power button (`switch`) turns the pump on and off.

```yaml
type: custom:appliance-dosing-pump-card
name: pH- pump
entity: switch.pool_ph_minus
switch: switch.pool_ph_minus
power: sensor.pool_ph_minus_power   # optional
ph: sensor.pool_ph                  # optional
```

To switch the dosing pumps from the pool card instead, see `switch_ph_plus` and `switch_ph_minus` in [Pool pump](pool-pump.md).


[← All cards](../../README.md#the-cards)
