# Smart lock

`custom:appliance-smart-lock-card`

A motorised smart lock (Nuki or any `lock` entity) mounted on the inside of the door. Two models (`model`):

| Model | Look |
|---|---|
| `nuki_3_pro` (default) | Nuki Smart Lock 3.0 Pro: white body, stainless knob on top |
| `nuki_pro_5` | Nuki Smart Lock Pro (5th generation): cut-out photo of the stainless and white cylinder |

Animations: the LED ring takes the state colour (green locked, orange unlocked, blue unlatched, red jammed) and its segments turn while the motor runs, the knob's reflections turn with the key, the **deadbolt** slides into the strike plate when locked, the **latch** pulls back when unlatched and the door opens a little (daylight in the gap), the padlock's shackle lifts. Jammed: the lock shakes and a warning sign blinks. Low battery: a battery pictogram blinks.

Buttons **Lock / Unlock / Unlatch** (`lock.lock`, `lock.unlock`, `lock.open`, or `entity_unlatch` if set). Unlatch asks for a second click within 4 s (`confirm_open: false` to turn this off) and is only shown if the lock supports it. Optional **Lock 'n' Go** buttons. Tiles: battery (%, charging, critical), door sensor, last change.

```yaml
type: custom:appliance-smart-lock-card
model: nuki_pro_5
entity: lock.porte_entree
entity_unlatch: button.porte_entree_unlatch                       # optional
entity_lock_n_go: button.porte_entree_lock_n_go                   # optional
entity_lock_n_go_unlatch: button.porte_entree_lock_n_go_with_unlatch  # optional
entity_battery: sensor.porte_entree_battery
entity_battery_charging: binary_sensor.porte_entree_battery_charging  # optional
entity_battery_critical: binary_sensor.porte_entree_battery_critical  # optional
entity_door: binary_sensor.porte_entree_door                      # optional (door sensor)
```

Options: `name`, `labels`, `illustration_size`, `transparent`, `battery_low` (20 %), `confirm_open`, `tap_action` / `hold_action`, `language`, `show_status`, `show_buttons`, `show_battery`, `show_door`, `show_since`, `animations`.

[← All cards](../../README.md#the-cards)
