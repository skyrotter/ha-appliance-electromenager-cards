# Coffee maker

<p align="center"><img src="../coffee-maker.gif" width="520" alt="Coffee maker card"></p>

Three illustrations, chosen with `style`: `filtre` (drip coffee maker with glass carafe, default), `dosette` (pod machine: Senseo, Nespresso, Dolce Gusto…) or `expresso` (bean-to-cup espresso machine).

- **Brewing** (power above `threshold`, 300 W by default): coffee drips or flows, the carafe or cup fills up, the water tank empties, steam rises, the buttons blink and the display shows `BREW` (`CAFE` in French).
- **Keeping warm** (drip only, between `warm_threshold` — 5 W by default — and `threshold`): the hot plate glows and the full carafe steams.
- **Ready** (pods / espresso, same power range): green LEDs, display `READY`.
- Designed for a smart plug (power + energy). If your keep-warm plate draws more than 300 W, raise `threshold`.

```yaml
type: custom:appliance-coffee-maker-card
style: dosette                 # filtre | dosette | expresso
entity: switch.coffee_plug
power: sensor.coffee_power
energy: sensor.coffee_energy_today
```

## Philips 5400 LatteGo (photo)

`style: latte` shows the Philips EP544X (5400 series, LatteGo) as a cut-out photo: the screen lights up, a coffee stream falls into the cup, which fills while brewing (power above `threshold`), then steam.

## Samsung MS23F301TAK microwave (photo)

On the microwave card, `model: samsung_ms23f301tak` shows the Samsung MS23F301TAK as a cut-out photo: lit window, turning plate, steam, clock / countdown on the display.


[← All cards](../../README.md#the-cards)
