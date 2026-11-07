# Robot vacuum and robot mower

`custom:appliance-robot-vacuum-solo-card · custom:appliance-robot-mower-solo-card`

<p align="center"><img src="../robot-vacuum.gif" width="300" alt="Robot vacuum card"></p>

<p align="center"><img src="../robot-mower.gif" width="300" alt="Robot mower card"></p>

**Robot vacuum / robot mower**: the robot alone, no background. Vacuum: side brushes spin, dust is sucked in, lidar scans, a light ring shows the battery level. Mower: wheels and blade spin, grass clippings fly, rain when `entity_rain` is on. Both have **Start / Pause / Dock** buttons (`vacuum.start` / `pause` / `return_to_base`, `lawn_mower.start_mowing` / `pause` / `dock`).

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language.

**Robot vacuum**

- `entity` (`vacuum.*`, required)
- `entity_battery`
- `entity_area` (m²)
- `entity_time` (min)
- `entity_status`
- `entity_filter`
- `entity_brush` (%)
- `show_battery`
- `show_area`
- `show_time`
- `show_fan`
- `show_status`
- `show_consumables`
- `show_buttons`

**Robot mower**

- `entity` (`lawn_mower.*` or `vacuum.*`, required)
- `entity_battery`
- `entity_area`
- `entity_time`
- `entity_next_start`
- `entity_blade` (%)
- `entity_rain`
- `entity_status`
- `show_battery`
- `show_area`
- `show_time`
- `show_next`
- `show_status`
- `show_blade`
- `show_buttons`

```yaml
type: custom:appliance-robot-vacuum-solo-card
entity: vacuum.robot
entity_area: sensor.robot_cleaned_area
entity_time: sensor.robot_cleaning_time
```

## Compact layout and your own image

Both cards take two options shared by the vacuum and the mower:

- `layout: compact`: the same size and style as the appliance cards (picture on the left, name and status dot, value tiles, buttons below), to sit next to the washer or the fridge in a grid. The status moves under the name, so the Status tile is not repeated.
- `image`: your own picture (`/local/my-robot.png` or an `https://` URL) instead of the drawing, dimmed when the robot is docked and bright while it is working. It works with both layouts.

```yaml
type: custom:appliance-robot-vacuum-solo-card
entity: vacuum.roborock
layout: compact
image: /local/roborock.png
entity_area: sensor.roborock_cleaned_area
```

[← All cards](../../README.md#the-cards)
