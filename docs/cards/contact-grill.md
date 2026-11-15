# Contact grill

`custom:appliance-contact-grill-card`: a contact grill / panini press (e.g. Tefal Inicio Grill 2000 W) as a cut-out photo, on a smart plug with power metering.

- **Heating** (power above `threshold`, 50 W by default): the red light pulses, the seam between the plates glows and steam rises.
- **Ready** (after `preheat_minutes`, 4 by default, or when the thermostat cuts the heating after at least 2 minutes): the green light turns on. It stays on for `ready_minutes` (15 by default) after the power drops.
- **Off**: lights off, no glow.
- Options: `power`, `energy`, `cost`, `switch`, `entity`, `preheat_minutes`, `ready_minutes`.

```yaml
type: custom:appliance-contact-grill-card
name: Tefal Inicio Grill
power: sensor.tefal_inicio_grill_2000w_power
energy: sensor.tefal_inicio_grill_2000w_energy_daily
switch: switch.tefal_inicio_grill_2000w
```

[← All cards](../../README.md#the-cards)
