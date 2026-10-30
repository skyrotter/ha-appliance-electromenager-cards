# Bathroom extractor fan (VMC)

A wall-mounted bathroom extractor: white square front with a wavy top edge, round grille with horizontal slats and curved fan blades behind it, on a tiled bathroom wall.

- **Low speed**: the blades turn slowly and humid air is drawn towards the grille.
- **High speed**: everything goes faster.
- **High humidity** (above `humidity_max`, 70 %): steam rises and condensation drops run down the tiles, with an alert.
- With a smart plug: 5–35 W = low speed, above `high_threshold` (35 W) = high speed. A `speed` entity (select, sensor, level or %) takes priority if you have one.
- With a `fan` entity as `entity`: `preset_mode` (boost, high… / low, eco, auto…) or `percentage` (above 60 % = high speed) sets the speed.

```yaml
type: custom:appliance-vmc-card
power: sensor.vmc_plug_power
energy: sensor.vmc_plug_energy_today
humidity: sensor.bathroom_humidity
```


[← All cards](../../README.md#the-cards)
