# Kettle and toaster

<p align="center"><img src="../kettle-toaster.gif" width="600" alt="Animated kettle and toaster cards"></p>

Two cards driven by a smart plug (`power`), with an optional `switch`.

- **Kettle** (`custom:appliance-kettle-card`): a glass kettle on its base. Above `threshold` (500 W): **Boiling**, the base glows blue, bubbles rise, the surface simmers and steam comes out of the spout. After it switches off: **Hot water** (orange LED, light steam) for `hot_minutes` (5 min). With a `temperature` sensor, the water temperature is shown in a tile and a bar, and the kettle stays "Hot water" while the water is above `hot_temperature` (60 °C).
- **Toaster** (`custom:appliance-toaster-card`): a stainless two-slot toaster. Above `threshold` (200 W): **Toasting**, the lever goes down, the slices sink in, the slots glow and heat waves rise. When it switches off, the toast pops up golden: **Toast ready!** for `ready_minutes` (2 min).

```yaml
type: custom:appliance-kettle-card
power: sensor.kettle_plug_power
energy: sensor.kettle_plug_energy_today
temperature: sensor.kettle_water_temperature   # optional
---
type: custom:appliance-toaster-card
power: sensor.toaster_plug_power
cost: sensor.toaster_cost_today
```

**Kettle without a smart plug** (ESPHome / Tuya kettle that exposes its own entities): use `entity` for the on/off `switch`, `temperature` for the water temperature, `target_temperature` (a `number`, `sensor` or `climate`) for the set temperature (extra "Target" tile) and `error` (a `binary_sensor`, or a text sensor that is not `ok` / `none`) to show a fault alert:

```yaml
type: custom:appliance-kettle-card
entity: switch.kettle
temperature: sensor.kettle_temperature
target_temperature: number.kettle_set_temperature
error: binary_sensor.kettle_error
```

<p align="center"><img src="../kettle-select.gif" width="360" alt="Kettle driven by a select: one button per option"></p>

**ProfiCook PC-WKS 1167G (photo)**: `model: proficook` shows the cut-out photo of this glass tea kettle (bubbles in the tea, glow on the base, lit keys and steam); without it, the drawing is used. It combines with any of the configurations below.

**ProfiCook PC-WKS 1167G with ESPHome** (the [Tuya MCU → ESP32 firmware by Bohdan Sverdliuk, dou.ua](https://dou.ua/forums/topic/51822/)): the device exposes a state text sensor (`Lifted`, `Standby`, `Heating`, `Cooling`, `Maintaining Temp`), an error text sensor (`OK`, `Empty`, `Overheated`, `other error`), a mode `select` (`45°`, `60°`, `85°`, `100°`, `100° and off`, `Custom`, `Off`), a custom temperature `number` (35 to 100) and the temperature and remaining time sensors:

```yaml
type: custom:appliance-kettle-card
model: proficook
entity: sensor.proficook_pc_wks_1167g_kettle_state
mode: select.proficook_pc_wks_1167g_kettle_mode
temperature: sensor.proficook_pc_wks_1167g_kettle_temperature
target_temperature: number.proficook_pc_wks_1167g_kettle_custom_temperature
remaining: sensor.proficook_pc_wks_1167g_kettle_remaining_time
error: sensor.proficook_pc_wks_1167g_kettle_error
```

`Heating` shows **Boiling**, `Cooling` and `Maintaining Temp` show **Hot water**, `Lifted` shows its own text. The "Target" tile follows the selected mode (45°, 60°, 85°, 100°); with `Custom`, a slider appears under the buttons and sets the `number`. An error other than `OK` shows an alert with its text (`Empty`, `Overheated`…). The entity names above follow the ESPHome naming (device name + entity name): adapt them to yours.

**Kettle driven by a `select`** (heating mode: `100° and off`, `45°`, `60°`, `85°`, `100°`, `Custom`, `Off`…): put the `select` in `mode`, and the kettle state in `entity`. One button per option of the `select` is shown (the active one is highlighted, a click selects it), and the other entities fill the tiles:

```yaml
type: custom:appliance-kettle-card
entity: sensor.kettle_state              # ready / heating / cooling
mode: select.kettle_heating_mode         # one button per option
temperature: sensor.kettle_water_temperature
target_temperature: number.kettle_set_temperature
remaining: sensor.kettle_remaining_time
error: sensor.kettle_error               # "OK" / "none" = no fault
```

With a text `entity`, `heating` shows **Boiling**, `cooling` shows **Hot water** and `ready` is idle. `show_modes: false` hides the buttons. A tap action `toggle` on an entity that cannot be toggled (`select`, `number`, sensors…) opens its details instead of failing.


[← All cards](../../README.md#the-cards)
