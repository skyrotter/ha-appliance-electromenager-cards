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
