# Smart speaker

![Smart speaker cards](../smart-speaker.png)

`custom:appliance-smart-speaker-card`: a smart speaker drawn from a **real product photo**, picked with `model` in the visual editor. 34 models:

| Brand | `model` |
|---|---|
| Amazon Echo | `echo_pop`, `echo_dot` (5th gen with the clock display), `echo_dot_5` (5th gen without clock), `echo_dot_3` (3rd gen, fabric), `echo_plus_2` (Echo Plus, 2nd gen), `echo_flex` (Echo Flex, drawn), `echo_show_5`, `echo_show_8`, `echo_show_10`, `echo_show_11`, `echo_show_15`, `echo_spot` |
| Google Nest | `nest_mini`, `nest_audio`, `nest_hub` (7"), `nest_hub_2` (2nd gen), `nest_hub_max` |
| Sonos | `sonos_play_1`, `sonos_play_3`, `sonos_play_5`, `sonos_one`, `sonos_one_sl`, `sonos_era_100`, `sonos_era_300`, `sonos_five`, `sonos_roam`, `sonos_beam` (Beam / Arc), `sonos_sub_mini`, `sonos_sub` |
| Devialet | `devialet_phantom` (1st gen), `devialet_phantom_reactor`, `devialet_phantom_i`, `devialet_phantom_ii`, `devialet_phantom_ultimate`: `finish` `white` (default) or `black` |
| Samsung | `samsung_hw_q800c` (HW-Q800C soundbar with its wireless subwoofer, photo), `samsung_hw_q800c_svg` (same, drawing): the subwoofer pumps with the bass, the front speakers pulse, the small display shows an equaliser and waves rise towards the ceiling (Atmos) |
| Apple | `homepod` (2nd gen): `finish` `midnight` (default) or `white`; `homepod_mini` (mini 2): `white` (default), `pink`, `green`, `blue` or `midnight` |

![Samsung HW-Q800C soundbar, photo and SVG versions](https://raw.githubusercontent.com/skyrotter/ha-appliance-electromenager-cards/main/docs/soundbar-samsung-hw-q800c.gif)

Without `model`, the card guesses from the entity id: `sonos` → Sonos One, `homepod` → HomePod (or HomePod mini), `devialet` / `phantom` → Phantom II, `nest` / `google` → Nest Mini, otherwise Echo Dot. `style` is accepted as an alias of `model`.

States and animations:
- **Playing**: sound waves come out of the speaker, faster and brighter as the volume goes up. Echo Pop / Dot: the blue light ring breathes; Echo Flex: the light bar at the top breathes. Echo Show, Echo Spot and Nest Hub: a light sweep, a glow and an equalizer on the screen. Nest Mini / Audio: the 4 white dots light up in a wave. Sonos: the speaker pumps with the bass (more on the subs), the white status light breathes. Devialet Phantom: the speaker pumps with the bass. HomePod: the Siri glow on top swirls and breathes.
- **Muted**: no waves, dimmed lights; the mute button is lit and the volume tile is highlighted.
- **Paused / idle**: dimmed, no waves.
- **Standby / off / unavailable**: greyed out, black screen.

The card reads a **`media_player`** entity (Alexa Media Player, Google Cast, Sonos…): state, `volume_level`, `is_volume_muted`, `app_name` (or `source`), `media_artist` and `media_title`. Without a media player, a smart plug (`power`) works too: playing above `threshold` (**3 W**), idle above `standby_threshold` (**0.5 W**).

```yaml
type: custom:appliance-smart-speaker-card
entity: media_player.living_room_speaker
model: nest_audio
power: sensor.speaker_plug_power     # optional
energy: sensor.speaker_plug_energy   # optional
```

| Option | Description |
|---|---|
| `entity` | The `media_player`: state, volume, mute, source app, artist and title. |
| `model` | The speaker photo (see the table above). |
| `finish` | Colour of the Devialet and HomePod models (see the table above). |
| `show_controls` | Buttons: power, volume −, play/pause, volume +, mute. On by default; only the features the entity supports are shown. |
| `show_media` | The "artist · title" line under the state. On by default. |
| `volume_step` | Volume − / + step, from 0 to 1. Default 0.05 (5 %). |
| `threshold` / `standby_threshold` | Plug only: playing / idle above these powers (W). |
| `show_power` / `show_energy` / `show_cost` / `show_toggle` | Checkboxes in the visual editor (on by default; unchecked on newly created smart speaker cards). |

Tiles: volume (%), source app, then power, energy and cost.

Common options (`energy`, `cost`, `energy_period`, `price_per_kwh`, `display`, `tap_action`, `hold_action`, `labels`…): see [configuration.md](../configuration.md).

Product photos belong to their respective brands (Amazon, Google, Sonos, Devialet, Apple); they are only used to illustrate the device in the card.
