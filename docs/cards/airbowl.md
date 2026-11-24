# Airbowl air sanitiser

`custom:appliance-airbowl-card`: the Airbowl (proWIN) air sanitiser, with its metal dome, its oval control screen and its glass water bowl. It only needs an **on/off** entity (a switch or a smart plug).

- **On**: the LEDs of the screen glow green, the water ripples and bubbles rise in the bowl.
- **Off**: LEDs off, calm water.
- Tiles: power, energy and cost if you give a smart plug with metering.
- Options: `entity`, `switch`, `power`, `energy`, `cost`, `threshold`.

```yaml
type: custom:appliance-airbowl-card
name: Airbowl
switch: switch.airbowl_plug            # on/off
power: sensor.airbowl_plug_power       # optional
```

[← All cards](../../README.md#the-cards)
