# Generic card (your own image)

`custom:appliance-generic-card`: for any device without a dedicated card (a speaker, a lamp, a pump…), put your own picture in `image`. The card keeps everything else: status (running / idle / off), power, energy and cost chips, and the power button. The picture is dimmed when the device is off and glows softly while it is running.

- `image`: URL of the picture (`/local/my-device.png` for a file in `config/www/`, or any `https://` URL). A PNG or SVG with a transparent background looks best.
- Running detection works like the other cards: `power` above `threshold` (5 W by default), or the state of `entity`.

```yaml
type: custom:appliance-generic-card
name: Sonos living room
image: /local/sonos.png
power: sensor.tasmota_sonos_power
switch: switch.tasmota_sonos
```

## On / off images and colour ring

- `image_off` / `image_on`: two pictures, one for the device at rest and one while it is running (power above the threshold, or entity on). The card fades from one to the other. In the visual editor these fields are an **upload picker** (from your phone or computer), no need to copy files to `config/www/` by hand. If only one is set, `image` is used for the other.
- `ring_light`: a `light` entity whose **colour and brightness** drive a glowing ring around the picture (e.g. the ring of a Xiaomi Gateway). `ring_style`: `halo` (soft glow, default) or `ring` (a thin ring). `ring_x`, `ring_y` (position, % of the card) and `ring_size` (%) place it on the picture.

```yaml
type: custom:appliance-generic-card
name: Xiaomi Gateway
entity: light.xiaomi_gateway
ring_light: light.xiaomi_gateway
ring_style: ring
ring_y: 46
ring_size: 34
image: /local/gateway.png
```

## Several images by state

`images` shows a different picture depending on the power, the state of the card's entity or another entity (e.g. a 2-speed ventilation unit). Each entry has an `image` and optional conditions; the card shows the **last** entry whose conditions are all true, and an entry without a condition always matches (use it first, as the default).

- `above` / `below`: compare the power in W (`power`, kW converted), or the value of `entity` when the entry has one
- `state`: state (or list of states) of the card's `entity`, or of the entry's `entity`
- `entity`: another entity for this entry's conditions

```yaml
type: custom:appliance-generic-card
name: Heat recovery ventilation
power: sensor.hrv_power
images:
  - image: /local/hrv-off.png        # default
  - above: 20
    image: /local/hrv-speed1.png     # above 20 W
  - above: 60
    image: /local/hrv-speed2.png     # above 60 W
  - entity: select.hrv_mode
    state: boost
    image: /local/hrv-boost.png
```

`image` still works on its own; with `images`, it is the default picture.

[← All cards](../../README.md#the-cards)
