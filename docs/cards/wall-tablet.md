# Wall tablet

`custom:appliance-wall-tablet-card`

A touch tablet fixed on a wall (hallway, kitchen, entrance…), **drawn in SVG**: the screen is dark when **off**, shows a dashboard with the clock when **on**, and a fading photo **slideshow** when the wallpaper mode is on. Made for a mini PC with a kiosk browser driven by **HASS.Agent**, but any entity works (Fully Kiosk, WallPanel…). Everything is optional.

```yaml
type: custom:appliance-wall-tablet-card
name: Hallway tablet
entity_screen: binary_sensor.hallway_screen      # on = screen on
entity_wallpaper: switch.hallway_wallpaper       # on = slideshow
entity_reload: button.hallway_reload_kiosk       # reloads the kiosk page
entity_reboot: button.hallway_reboot_pc          # restarts the PC (asks for confirmation)
orientation: landscape                           # or portrait
```

| Option | What it does |
|---|---|
| `entity_screen` | screen state: `binary_sensor`, `switch`, `input_boolean`, `light`, `sensor` (`on` = screen on). A `switch` / `input_boolean` / `light` also adds a **Screen** button |
| `entity_screen_on`, `entity_screen_off` | wake / sleep the screen with two `button`s (or `script`…). `PowerOn` / `PowerOff` states are understood by `entity_screen`. With `entity_screen`, one **Screen** button calls the right one; without it, two buttons are shown |
| `entity_wallpaper` | wallpaper / slideshow mode: `switch` (adds a button) or `binary_sensor` (on = slideshow, shown while the screen is on) |
| `entity_reload` | reload the kiosk page: `button`, `input_button`, `script`, `automation` (adds a button) |
| `entity_reboot` | restart the PC: same domains, with a **confirmation** before it runs |
| `entity_brightness` | brightness: `sensor`, `number`, `input_number`, in % or 0-255; it also sets the brightness of the drawn screen |
| `entity_battery`, `entity_cpu`, `entity_ram`, `entity_uptime`, `entity_power`, `entity_energy` | optional tiles (uptime accepts a duration or a "last boot" timestamp) |
| `orientation` | `landscape` (default) or `portrait` |
| `show_clock` | the clock and the date drawn on the screen (default true) |
| `show_controls`, `show_status`, `show_brightness`, `show_battery`, `show_cpu`, `show_ram`, `show_uptime`, `show_power`, `show_energy`, `compact`, `animations`, `extra_tiles`, `labels`, `language`, `illustration_size`, `transparent`, `tile_background`, `tile_order`, `tap_action`, `hold_action` | the usual options |

States: **Screen on**, **Slideshow**, **Screen off**, **Unavailable** (no entity answers). Tapping the tablet opens the details of the screen entity.
