# Water softener (generic)

`custom:appliance-water-softener-generic-card`

A generic resin water softener, drawn after the usual "tank + brine tank" diagram: translucent composite tank with its central tube and top / bottom strainers (0.2 mm slots) on a flared foot, a control valve on top (LCD screen and programmer dial), and a separate brine tank with its lid, brine well (cane), float, overflow elbow and the brine under the salt. It sits next to the [Culligan-style card](water-softener.md), which is unchanged. Options, tiles and phases are the same.

Phases, all animated: **service** (hard water in, softened water out), **backwash** (the resin bed is lifted, muddy water), **brine draw** (brine from the tank to the resin), **rinse**, **water return** (brine tank refill) and **low salt** (red alert, the lid blinks).

**No flow, no animation**: in service, when `entity_flow` is set and the flow is 0 (0.05 or below), the drawing stays still (no flowing pipes, no drops). Without `entity_flow` the card cannot know the flow and keeps animating in service.

The phase comes from the state of `entity` (a sensor, select, switch or binary sensor: `backwash`, `contre-lavage`, `brine`, `saumure`, `regeneration`, `rinse`, `rinçage`, `off`…). Without it, the card is in service when `entity_flow` is above 0.05 and in standby otherwise.

| Option | What it does |
|---|---|
| `entity` | state of the softener (text of the current phase, or on / off) |
| `entity_backwash`, `entity_brine`, `entity_rinse`, `entity_refill` | one entity per phase (`binary_sensor`, `switch`, `input_boolean` or `sensor`, **on = running**): backwash, brine draw, rinse, water return (brine tank refill). Used when `entity` does not give the phase; priority backwash > brine > rinse > refill |
| `entity_service` | service phase (**on = running**): shows the blue « Service » state instead of the grey « Standby ». Also works when `entity` is on and its name contains « service » |
| `entity_flow` | flow (L/min) |
| `entity_capacity` | remaining capacity (%) |
| `entity_salt` | salt level: in **%**, the salt height in the tank follows it; in **kg / lb / g**, add the tank capacity (`entity_salt_max` or `salt_max`). Alert at or below `salt_low` (20 % of the tank) |
| `entity_salt_max`, `salt_max` | maximum salt the brine tank holds, in the same unit as `entity_salt`: an entity (`sensor`, `input_number`, `number`) or a fixed value. With it, the salt height in the drawing is `salt / maximum` (96 kg out of 150 kg = 64 %) |
| `entity_hardness_in`, `entity_hardness_out` | hardness before and after, shown as `32 → 2 °f` |
| `entity_today` | water softened today |
| `entity_regen_days` | days before the next regeneration |
| `entity_last_regen` | date of the last cycle (`sensor` with a date / timestamp, or `input_datetime`; plain text is shown as is) |
| `entity_cycle_volume` | water used by one regeneration cycle (L) |
| `entity_salt_year` | salt used per year (kg) |
| `entity_power` | power (W) |
| `salt_low`, `compact`, `show_flow`, `show_capacity`, `show_salt`, `show_hardness`, `show_today`, `show_regen`, `show_last_regen`, `show_cycle_volume`, `show_salt_year`, `show_power`, `animations`, `labels`, `language`, `illustration_size`, `transparent`, `tap_action`, `hold_action` | |

`compact: true` is for small fixed slots (smaller title and tiles, the illustration takes the remaining height); `transparent: true` removes the card background.

```yaml
type: custom:appliance-water-softener-generic-card
name: Water softener
entity: sensor.softener_status
entity_flow: sensor.softener_flow
entity_capacity: sensor.softener_capacity_left
entity_salt: sensor.softener_salt_level
entity_hardness_in: sensor.water_hardness_in
entity_hardness_out: sensor.water_hardness_out
entity_regen_days: sensor.softener_days_to_regen
```

[← All cards](../../README.md#the-cards)
