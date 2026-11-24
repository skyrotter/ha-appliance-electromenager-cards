# Projector screen

`custom:appliance-projector-screen-card`: a motorised projector screen (idea and drawing from the forum). The chrome case with its light stays on top, the screen unrolls with its weighted bar following the real position of the `cover`.

- `entity`: a `cover` (position 0 to 100 %, 100 = unrolled), or a `switch` / `input_boolean` (on = unrolled).
- **Light**: red when rolled up, green when unrolled, orange and blinking while it moves.
- Status: unrolled / rolled up / unrolling / rolling up; position tile (cover with a position).
- Buttons **Lower / Stop / Raise** (`cover.open_cover`, `stop_cover`, `close_cover`; on a switch: turn on / turn off), hidden with `show_buttons: false`.
- `invert_position: true`: for a screen driven by a roller shutter module, where 100 % = screen fully rolled up and 0 % = fully unrolled. The drawing, the status, the position tile and the Lower / Raise buttons are inverted.
- Optional `power`, `energy`, `cost` (motor on a smart plug).

```yaml
type: custom:appliance-projector-screen-card
name: Projector screen
entity: cover.projector_screen
```

[← All cards](../../README.md#the-cards)
