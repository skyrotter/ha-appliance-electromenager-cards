# Canister vacuum

`custom:appliance-canister-vacuum-card`: a corded bagless canister vacuum (e.g. Philips 5000 FC9557 PowerPro Active) as a cut-out photo, on a smart plug.

- Runs above `threshold` (150 W by default): the cyclone spins, the nozzle lights up and dust is sucked in.
- Options: `power`, `energy`, `cost`, `switch`, `entity` (e.g. an `input_boolean` state).

```yaml
type: custom:appliance-canister-vacuum-card
power: sensor.philips_fc9557_porszivo_power
energy: sensor.philips_fc9557_porszivo_energy_daily
```

[← All cards](../../README.md#the-cards)
