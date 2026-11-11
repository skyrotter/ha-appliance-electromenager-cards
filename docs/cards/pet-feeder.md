# Pet feeder

`custom:appliance-pet-feeder-card`

**Pet feeder** with a cut-out photo of the **Aqara Smart Pet Feeder C1** (`model: aqara_c1`, Zigbee2MQTT `ZNCWWSQ01LM`). All entities are optional.

Animations: kibbles fall from the hatch into the bowl while it feeds, the pile in the bowl grows with the portions of the day, the screen lights up, the screen blinks red on error, a padlock shows when the child lock is on. A feed is detected when you press the button or when the portions of the day increase.

Buttons: **Feed**, LED indicator, child lock. A click on the Mode tile switches between manual and schedule.

## Options

- `entity_feed` (select, button or switch: the Zigbee2MQTT `feed` entity), `feed_option` (option sent to a select, default `start`)
- `entity_portions` (`portions_per_day`), `entity_weight` (`weight_per_day`), `entity_serving` (`serving_size`, number), `entity_portion_weight` (`portion_weight`, number), `entity_source` (`feeding_source`)
- `entity_error`, `entity_led` (`led_indicator`, switch), `entity_child_lock` (switch), `entity_mode` (select)
- `daily_goal` (portions of the day that fill the bowl, default 6)
- Food reserve (see below): `entity_level`, `hopper_capacity` (g, default 1500), `daily_consumption` (g per day, optional), `food_low` (alert threshold in %, default 25), `show_level`, `show_autonomy`
- `animations` (default true), `compact: true`, `transparent: true`, `illustration_size` (%)
- `show_status`, `show_controls`, `show_portions`, `show_weight`, `show_serving`, `show_source`, `show_mode`
- `language: fr|en|de|it|es|nb|nl|pl|ro|ru|sr|sr-Latn`

## Example

```yaml
type: custom:appliance-pet-feeder-card
model: aqara_c1
entity_feed: select.aqara_feeder_feed
entity_portions: sensor.aqara_feeder_portions_per_day
entity_weight: sensor.aqara_feeder_weight_per_day
entity_serving: number.aqara_feeder_serving_size
entity_portion_weight: number.aqara_feeder_portion_weight
entity_source: sensor.aqara_feeder_feeding_source
entity_error: binary_sensor.aqara_feeder_error
entity_led: switch.aqara_feeder_led_indicator
entity_child_lock: switch.aqara_feeder_child_lock
entity_mode: select.aqara_feeder_mode
```

## Food reserve (hopper level and autonomy)

Most feeders cannot measure the food left, so the card reads a **helper you keep up to date**: an `input_number` (grams left; or a `number` / `sensor`, in grams or in %).

- The hopper of the drawing is **filled in proportion** to `entity_level` / `hopper_capacity` and turns red below `food_low` (25 %) with the message *Food running low*.
- Two tiles: **Hopper** (grams and %) and **Autonomy** (days left). The daily consumption is `daily_consumption` if set, otherwise `entity_weight` (weight of the day), otherwise portions of the day × `entity_portion_weight`. For an accurate autonomy, set `daily_consumption` (e.g. 5 × 10 g = `50`).
- A **Refill** button (when `entity_level` is an `input_number` or `number`) sets the level back to `hopper_capacity` (or 100 % if the entity is in %).

```yaml
type: custom:appliance-pet-feeder-card
entity_feed: select.aqara_feeder_feed
entity_level: input_number.feeder_hopper_grams
hopper_capacity: 1500
daily_consumption: 50
food_low: 25
```

To lower the level automatically after each meal, create the helper `input_number.feeder_hopper_grams` (min 0, max 1500, step 1, unit g) and this automation, which subtracts the grams served (increase of the weight of the day):

```yaml
alias: Feeder hopper level
triggers:
  - trigger: state
    entity_id: sensor.aqara_feeder_weight_per_day
conditions:
  - condition: template
    value_template: "{{ trigger.to_state.state | float(0) > trigger.from_state.state | float(0) }}"
actions:
  - action: input_number.set_value
    target:
      entity_id: input_number.feeder_hopper_grams
    data:
      value: >
        {{ [states('input_number.feeder_hopper_grams') | float(0)
           - (trigger.to_state.state | float(0) - trigger.from_state.state | float(0)), 0] | max }}
```
