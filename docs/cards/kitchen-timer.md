# Kitchen timer

`custom:appliance-kitchen-timer-card`: a kitchen timer driven by a Home Assistant **`timer.*` entity**. Because the timer lives in Home Assistant, it survives a page reload and can trigger your automations when it ends (event `timer.finished`).

- **Round dial** with a ring that empties and the remaining time in the middle (`MM:SS`, `H:MM:SS` above one hour).
- **Buttons**: start / pause / resume, and cancel. **Preset durations** (`presets`, in minutes): one tap starts the timer with that duration.
- **States**: ready (shows the duration of the timer), running (orange), paused (yellow), and when the countdown ends the bell rings and "Time's up!" blinks until the next tap. Cancelling does not ring.

**Several timers on the same card** (for example oven and hob): one dial per timer, side by side, each with its own buttons.

Create the timer in Home Assistant (Settings → Devices & services → Helpers → Timer), then:

```yaml
type: custom:appliance-kitchen-timer-card
name: Kitchen timer
entity: timer.kitchen
presets: [1, 5, 10, 15, 30]    # minutes, optional (these are the defaults)
```

```yaml
type: custom:appliance-kitchen-timer-card
name: Kitchen
entities:
  - timer.oven
  - entity: timer.hob
    name: Induction hob      # optional name, default: the name of the entity
    presets: [5, 10]         # optional presets for this timer
```

To be told when it ends, use an automation on the `timer.finished` event of the entity (notification, light, speaker…).

| Option | Description |
|---|---|
| `entity` | The `timer.*` entity (one timer). |
| `entities` | Several timers (up to 6): `timer.x` or `{ entity, name, presets }`. Instead of `entity`. |
| `presets` | Preset durations in minutes (1 to 1440, 8 at most). Default `[1, 5, 10, 15, 30]`. |
| `show_presets` | `false` to hide the presets. |
| `animations` | `false` to stop the ringing animation. |

Common options (`name`, `illustration_size`, `transparent`, `tap_action`, `hold_action`, `language`…): see [configuration.md](../configuration.md).

[← All cards](../../README.md#the-cards)
