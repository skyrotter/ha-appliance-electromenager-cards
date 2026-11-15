# Bathroom extractor fan (VMC)

A wall-mounted bathroom extractor: white square front with a wavy top edge, round grille with horizontal slats and curved fan blades behind it, on a tiled bathroom wall.

- **Low speed**: the blades turn slowly and humid air is drawn towards the grille.
- **High speed**: everything goes faster.
- **High humidity** (above `humidity_max`, 70 %): steam rises and condensation drops run down the tiles, with an alert.
- With a smart plug: 5–35 W = low speed, above `high_threshold` (35 W) = high speed. A `speed` entity (select, sensor, level or %) takes priority if you have one.
- **Single-flow VMC with two switches** (one for low speed, one for high speed): set `switch_low` and `switch_high`. The state follows them (high on = high speed, low on = low speed, none = off) and two **Low speed / High speed** buttons appear under the card. Turning one speed on turns the other off, and a second click on the active speed turns it off. Either option can be used alone. `show_modes: false` hides the buttons.
- With a `fan` entity as `entity`: `preset_mode` (boost, high… / low, eco, auto…) or `percentage` (above 60 % = high speed) sets the speed.

```yaml
type: custom:appliance-vmc-card
power: sensor.vmc_plug_power
energy: sensor.vmc_plug_energy_today
humidity: sensor.bathroom_humidity
```


VMC with two switches:

```yaml
type: custom:appliance-vmc-card
name: Bathroom VMC
switch_low: switch.vmc_low_speed
switch_high: switch.vmc_high_speed
humidity: sensor.bathroom_humidity
```
## Ventoxx Harmony (decentralised push-pull)

`model: ventoxx` draws the Ventoxx Harmony front cover. `direction` takes the direction sensor (state `Befúvás` = supply, `Elszívás` = extract, `Inaktív` = off; attributes `speed` 1 to 3 and `dstate` 1 = extract / 2 = supply). Air lines move out of (supply, blue) or into (extract, orange) the cover edges; speed 1 to 3 sets their pace and number, and the display shows the speed digit.

```yaml
type: custom:appliance-vmc-card
model: ventoxx
direction: sensor.ventoxx_1_irany
power: sensor.ventoxx_harmony_szellozteto_power
```


[← All cards](../../README.md#the-cards)
