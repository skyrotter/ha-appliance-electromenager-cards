# Dosing pump (pH+ / pH-, aquarium)

Blue peristaltic dosing pump, as used to correct the pH of a pool or to dose an aquarium (e.g. the Jebao integration). Use one card per pump (pH+ and pH-) or per channel.

- The rotor turns, the liquid flows in the tube and the green LED pulses while the pump is injecting. The status reads **Dosing**.
- With a smart plug: above `threshold` (3 W) = **Dosing**. With a switch only (no power sensor): switch on = **Dosing**.
- `ph`: pH sensor, shown as a tile.
- The power button (`switch`) turns the pump on and off.
- Scheduled dosing (aquarium): `dose_interval` (number or sensor, in days), `dose_volume` (sensor, mL per dose) and `dose_time` (sensor holding the time, e.g. `10:00`, or a `schedule` attribute) are shown as tiles. `dose_timer` (switch) adds a **Timer** button: on = the pump doses at the planned interval.

- `color`: color of the pump housing and of the status dot (any CSS color: `"#e53935"`, `orange`, `rgb(…)`), to tell the products apart at a glance (pH+, iron, potassium…). Default: blue.

```yaml
type: custom:appliance-dosing-pump-card
name: pH- pump
entity: switch.pool_ph_minus
switch: switch.pool_ph_minus
power: sensor.pool_ph_minus_power   # optional
ph: sensor.pool_ph                  # optional
```

Aquarium, one card per channel:

```yaml
type: custom:appliance-dosing-pump-card
name: Ferropol
entity: switch.aquarium_salon_channe1
switch: switch.aquarium_salon_channe1
dose_interval: number.aquarium_salon_intervalt1
dose_timer: switch.aquarium_salon_timer1on
dose_volume: sensor.aquarium_pompes_doseuses_channel_1_daily_volume
dose_time: sensor.aquarium_pompes_doseuses_channel_1_schedule
```

To switch the dosing pumps from the pool card instead, see `switch_ph_plus` and `switch_ph_minus` in [Pool pump](pool-pump.md).


[← All cards](../../README.md#the-cards)
