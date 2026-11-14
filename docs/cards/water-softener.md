# Water softener

`custom:appliance-water-softener-card`

<p align="center"><img src="../water-softener.gif" width="376" alt="Water softener card: service, backwash, brine, rinse, low salt"></p>

A resin water softener, with two drawings to choose from with `model`: `culligan` (default), a cut-away resin tank with its control head (LCD screen) and a cut-away brine tank with salt; `generic`, a composite tank with its central tube and strainers, a control valve on top and a separate brine tank with its brine well (cane), float and overflow elbow. The pipes are animated according to the phase (the water in the brine tank stays low, at most about 30 % of its height, and rises during the water return):

- **Service**: hard water comes in, softened water goes out (faster with the flow).
- **Backwash**: the resin bed is lifted and the water turns muddy.
- **Brine draw**: the brine goes from the salt tank to the resin, which glows.
- **Rinse**: fast rinse to the drain.
- **Water return**: the brine tank is refilled (the brine level rises).
- **Low salt**: red alert, the lid of the brine tank blinks.

In service with `entity_flow` at 0, nothing moves.

The phase comes from the state of `entity` (a sensor, select, switch or binary sensor: `backwash`, `contre-lavage`, `brine`, `saumure`, `regeneration`, `rinse`, `rinçage`, `off`…). Without it, the card is in service when `entity_flow` is above 0.05 and in standby otherwise.

| Option | What it does |
|---|---|
| `model` | drawing: `culligan` (default) or `generic`. The old `custom:appliance-water-softener-generic-card` still works and is the same card with `model: generic` |
| `entity` | state of the softener (text of the current phase, or on / off) |
| `entity_backwash`, `entity_brine`, `entity_rinse`, `entity_refill` | one entity per phase (`binary_sensor`, `switch`, `input_boolean` or `sensor`, **on = running**): backwash, brine draw, rinse, water return (brine tank refill). Used when `entity` does not give the phase; priority backwash > brine > rinse > refill |
| `entity_service` | service phase (**on = running**): shows the blue « Service » state instead of the grey « Standby ». Also works when `entity` is on and its name contains « service » |
| `entity_flow` | flow (L/min) |
| `entity_capacity` | remaining capacity (%) |
| `entity_salt` | salt level: in **%**, the salt height in the tank follows it; in **kg / lb / g**, add the tank capacity (`entity_salt_max` or `salt_max`). Alert at or below `salt_low` (20 % of the tank) |
| `entity_salt_max`, `salt_max` | maximum salt the brine tank holds, in the same unit as `entity_salt`: an entity (`sensor`, `input_number`, `number`) or a fixed value. With it, the salt height in the drawing is `salt / maximum` (96 kg out of 150 kg = 64 %) |
| `entity_hardness_in`, `entity_hardness_out` | hardness before and after, shown as `32 → 2 °f`. Accept a `sensor`, an `input_number` or a `number` (so do the other numeric entities: flow, capacity, salt, today, regeneration days, cycle volume, salt per year, power) |
| `entity_leak` | leak status as text (e.g. a template sensor): a pill under the phase, **green** when the state is a normal one, **red** otherwise (`unavailable` / `unknown` stay grey). Tap opens the entity |
| `leak_ok_states` | normal states of `entity_leak`, comma separated (case-insensitive). Default: `off, ok, none, no, false, normal, aucune, pas de fuite, no leak, rejet égout, rejet egout, sewer discharge`. Example: `pas de fuite, rejet égout` |
| `status_position` | `right` (default, phase badge at the top right) or `below` (phase under the name) |
| `entity_backwash_timer`, `entity_brine_timer`, `entity_rinse_timer`, `entity_refill_timer` | one HA `timer` per phase (backwash, brine draw, rinse, water return). During a regeneration, a **progress bar** appears under the phase: one segment per phase, as wide as its timer (`duration`), finished phases full, the current one filling in real time |
| `entity_timer` | `timer` of the whole regeneration cycle: shows the time left next to the bar. Alone (without phase timers), it gives a single bar |
| `show_progress` | `false` hides the progress bar (default `true`; the bar only shows during a regeneration) |
| `entity_today` | water softened today |
| `entity_regen_days` | days before the next regeneration |
| `entity_last_regen` | date of the last cycle (`sensor` with a date / timestamp, or `input_datetime`; plain text is shown as is) |
| `entity_cycle_volume` | water used by one regeneration cycle (L) |
| `entity_salt_year` | salt used per year (kg) |
| `entity_power` | power (W) |
| `salt_low`, `compact`, `show_flow`, `show_capacity`, `show_salt`, `show_hardness`, `show_today`, `show_regen`, `show_last_regen`, `show_cycle_volume`, `show_salt_year`, `show_power`, `animations`, `labels`, `language`, `illustration_size`, `transparent`, `tap_action`, `hold_action` | |

`compact: true` is for small fixed slots (smaller title and tiles, the illustration takes the remaining height); `transparent: true` removes the card background.

```yaml
type: custom:appliance-water-softener-card
name: Water softener
entity: sensor.softener_status
entity_flow: sensor.softener_flow
entity_capacity: sensor.softener_capacity_left
entity_salt: sensor.softener_salt_level
# salt in kg: the drawing follows salt / capacity
# entity_salt: sensor.softener_salt_kg
# entity_salt_max: input_number.salt_tank_capacity
entity_hardness_in: sensor.water_hardness_in
entity_hardness_out: sensor.water_hardness_out
entity_regen_days: sensor.softener_days_to_regen
```

[← All cards](../../README.md#the-cards)
