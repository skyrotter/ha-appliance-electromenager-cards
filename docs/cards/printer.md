# Printer / scanner

<p align="center"><img src="../printer.gif" width="600" alt="Animated printer / scanner card: off, standby, printing, scanning"></p>

**Printer / scanner** (`custom:appliance-printer-card`): an office laser printer or multifunction printer (e.g. Samsung Xpress C480W) on a smart plug. No printer integration is needed: the state comes from the plug's `power`.

- **Printing**: power above `threshold` (100 W). A sheet slides out, the screen glows and the blue LED blinks.
- **Scanning**: power above `scan_threshold` (45 W). A beam of light sweeps along the scanner lid.
- **Standby**: power above `standby_threshold` (1 W), screen and LED on.
- **Off**: plug off or power below `standby_threshold`, the screen is dark.
- Without a power sensor, `switch` on means standby. An `entity` whose state contains `print`, `scan` or `error` (e.g. an IPP printer sensor) takes priority over the power.
- `model`: empty for the SVG drawing, `samsung_c480` for the photo of the Samsung Xpress C480W. The same animated layers are used for both.
- The power button toggles the plug; `power`, `energy` and `cost` give the usual tiles.

```yaml
type: custom:appliance-printer-card
switch: switch.printer_plug
power: sensor.printer_plug_power
model: samsung_c480   # remove for the SVG drawing
threshold: 100        # printing (W)
scan_threshold: 45    # scanning (W)
```


[← All cards](../../README.md#the-cards)
