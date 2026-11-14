# Sliding curtains

`custom:appliance-sliding-curtain-card`

Two fabric panels slide sideways from the centre of a window and gather at the
edges as `current_position` changes. Fold shading follows the fabric colour;
the window switches between daylight and moonlight using `sun.sun`.

Uses the same cover controls, visual editor, status badges, sizing and theme
helpers as the [shutter and blind cards](shutters.md). No external images,
libraries, or additional resources are needed.

```yaml
type: custom:appliance-sliding-curtain-card
entity: cover.living_room_curtains
name: Living room curtains
language: en
color: '#b6a997'
travel_time: 8
show_position: false
show_since: false
```

## Options

| Option | Description |
|---|---|
| `entity` | A `cover` entity; `current_position` is 0 when closed, 100 when open. |
| `name` | Title; defaults to the translated card name. |
| `color` | Fabric colour, default `#b6a997`. |
| `sun_entity` | Day/night entity, default `sun.sun`. |
| `travel_time` | Full-travel animation duration in seconds. Partial moves scale with distance. |
| `show_controls` | Show Open / Stop / Close buttons, default true. Stop is hidden when unsupported. |
| `show_slider` | Show the position slider when supported, default true. Sends `cover.set_cover_position` when released. |
| `show_position` | Show the position value tile, default true; independent of the slider. |
| `show_status` | Show the status badge, default true. |
| `show_since` | Show the last-change tile, default true. |
| `entity_power`, `show_power` | Optional motor-power sensor and tile. |
| `animations` | Set false to disable transitions. The curtain illustration also respects reduced-motion preferences. |

The existing shared options `language`, `illustration_size`, `transparent`,
`tile_background`, `tile_order`, `labels`, `tap_action` and `hold_action` work too.
`invert` corrects reversed position feedback, while `invert_buttons` corrects
reversed open/close commands. Covers without position feedback retain buttons
but have no position slider. Unavailable covers have disabled controls.

To keep only the buttons below the illustration:

```yaml
type: custom:appliance-sliding-curtain-card
entity: cover.bedroom_curtains
show_slider: false
show_position: false
show_since: false
```

Try **Sliding curtains** in the [interactive demo](../demo.html), including
Open, Stop, Close, partial positions, and the day/night switch.

[← All cards](../../README.md#the-cards)
