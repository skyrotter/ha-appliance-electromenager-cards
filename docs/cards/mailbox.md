# Mailbox

`custom:appliance-mailbox-card`: a mailbox seen at three-quarter view. With mail, a letter drops through the slot, the flap snaps shut and a badge shows the number of letters. With a parcel, a box bounces at the foot of the mailbox. When the door is open, it swings on its hinge and shows the mail inside.

It is generic and works with whatever your mailbox sensor provides (Zigbee door or vibration sensor, ESPHome, mmWave, letterbox sensors, template sensors…):

- **One sensor per type**: `entity_mail` and `entity_parcel`, each `on` (or a number above 0) when something is there.
- **One sensor only**: `entity_mail` alone, whose state is
  - `on` / `off` → mail / empty,
  - a number → letters received (0 = empty),
  - a text: `mail`, `letter`, `courrier`, `parcel`, `colis`, `package`, `both`, `courrier et colis`, `empty`, `vide`… in every language of the cards. Add your own values with `mail_states` / `parcel_states`.

| Option | What it does |
|---|---|
| `entity_mail` | mail sensor: `binary_sensor`, `input_boolean`, `sensor`, `counter`, `input_select`… (see above) |
| `entity_parcel` | parcel sensor (optional) |
| `entity_door` | door sensor (`binary_sensor` on = open, `cover`, `lock`): the door swings open |
| `entity_door_back` | rear door sensor for double-door mailboxes (same types as `entity_door`). `entity_door` is then the front door: the badge says which door is open and two **Front / Rear** tiles appear (hide them with `show_doors: false`) |
| `entity_count` | letter counter (`counter`, `sensor`, `input_number`): badge and tile. Without it, a numeric `entity_mail` is used |
| `entity_reset` | **Mark as collected** button: `button` / `input_button` (press), `input_boolean` / `switch` (turn off), `counter` (reset), `script`, `automation`, `scene`, `input_number` (set to 0) |
| `entity_battery` | battery of the mailbox sensor; the tile turns red below 20 % |
| `entity_battery_back`, `entity_battery_back_low` | battery (%) and low-battery flag of the rear door sensor, for double-door mailboxes: a **Rear battery** tile (red below 20 % or when the flag is on). Hidden when not set; `show_battery_back: false` hides it |
| `entity_presence` | presence or motion sensor (`binary_sensor`, `input_boolean`): a **Presence** tile showing *Detected* / *None*. Hidden when not set; `show_presence: false` hides it |
| `mail_states`, `parcel_states` | extra text states, comma separated (`amazon, dhl`) |
| `box_color` | `anthracite` (default), `black`, `grey`, `white`, `green`, `red`, `blue`, `yellow`, `brown` or any `#hex` |
| `show_status`, `show_since`, `show_count`, `show_battery`, `show_buttons`, `animations`, `labels`, `language`, `show_doors`, `illustration_size`, `transparent` | |

States: **Empty**, **Mail**, **Parcel**, **Mail + parcel**, **Door open**, **Unavailable**. The **Delivered** tile shows when the mail arrived (time today, date and time otherwise).

```yaml
type: custom:appliance-mailbox-card
name: Mailbox
entity_mail: binary_sensor.mailbox_mail       # or one text / number sensor
entity_parcel: binary_sensor.mailbox_parcel   # optional
entity_door: binary_sensor.mailbox_door       # optional (front door)
entity_door_back: binary_sensor.mailbox_door_back  # optional (double-door mailboxes)
entity_reset: input_boolean.mailbox_mail      # optional: "Mark as collected"
box_color: anthracite
```

## BOKS parcel box

`box_model: boks` replaces the drawing with a photo of the [BOKS](https://www.boks.fr/) connected parcel box (BLE, for example through [skob-ha](https://github.com/kamahat/skob-ha)). The door swings open, a letter drops into the slot, the parcel pictogram lights up when a parcel is announced, the keypad turns green while the door is open and a red battery light blinks when the batteries are low.

| Option | What it does |
|---|---|
| `box_model` | `standard` (default, drawing) or `boks` (photo) |
| `entity_door` | the BOKS **Door** sensor |
| `entity_open` | **Open the door** button: `button` / `input_button` (press), `lock` (unlock), `script`, `switch`, `input_boolean` (turn on) |
| `entity_last_open` | one or more timestamp sensors (**Last VIGIK / badge / code opening**): the **Last opened** tile shows the most recent |
| `entity_battery` | **Battery** (%) |
| `entity_battery_low` | **Battery low** (`binary_sensor`): battery tile in red and blinking light on the box |
| `show_last_open` | show the **Last opened** tile (default `true`) |

`entity_mail` / `entity_parcel` stay optional: without them the BOKS shows **Closed** / **Door open**. `box_color` does not apply to the photo.

```yaml
type: custom:appliance-mailbox-card
name: BOKS
box_model: boks
entity_door: binary_sensor.boks_door
entity_open: button.boks_open
entity_battery: sensor.boks_battery
entity_battery_low: binary_sensor.boks_battery_low
entity_last_open:
  - sensor.boks_last_code_opening
  - sensor.boks_last_badge_opening
  - sensor.boks_last_vigik_opening
```

[← All cards](../../README.md#the-cards)
