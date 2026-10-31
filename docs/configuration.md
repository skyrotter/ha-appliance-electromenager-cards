# Configuration


All cards have a visual editor. When added from the card picker, entities are detected automatically by name (`lave_linge`, `washer`, `dryer`, `frigo`, `ballon`…).

## Common options

| Option | Description |
|---|---|
| `entity` | Status entity: `switch`, `input_boolean`, `binary_sensor`, `sensor`, `input_select`, `water_heater`… |
| `power` | Power sensor (W or kW) |
| `energy` | Energy sensor (Wh, kWh or MWh, shown in kWh) — e.g. today's consumption |
| `cost` | Cost sensor (any currency) |
| `energy_period` | `day`, `week` or `month` (calendar: since midnight, Monday, the 1st), or `24h`, `7d`, `30d` (rolling: last 24 hours, 7 days, 30 days): show the energy used in that period instead of the raw counter, computed by Home Assistant from the long-term statistics of `energy` (like the Energy dashboard), so a cumulative smart-plug counter works without a Utility Meter. Needs a sensor with statistics (`state_class: total_increasing`); otherwise the counter is shown |
| `last_cycle` | Washer, dryer, dishwasher, water heater: `true` shows, between cycles, the last cycle start → end, duration, energy and cost, read from the history of `power` (last 4 days; water heater: `power` + `power_solar`, and `energy` + `energy_solar` for the energy). `cycle_gap` (min, default 15): drops below `threshold` shorter than this stay in the same cycle |
| `estimate` | Washer, dryer, dishwasher: `true` estimates the remaining time and progress during a cycle from the median duration of the last 7 cycles (history of `power`, 10 days): "≈ 1 h 30", "Estimated end", then "Almost done". A `remaining` / `progress` sensor wins |
| `price_per_kwh` | Price of a kWh (number or tariff entity) for the last cycle cost and, with `display: cost`, the period cost |
| `display` | How consumption is shown when `price_per_kwh` is set: `energy` (kWh only, hides the cycle cost), `cost` (money only: hides the cycle energy and, with `energy_period`, shows the cost of the period instead of its kWh). Default: both |
| `switch` | Switch controlled by the power button (button hidden if unset) |
| `threshold` | Power above which the appliance is considered running (W). Defaults: 10 (washer/dryer/dishwasher), 20 (fridge), 50 (others) |
| `heating_power` | Washer and dishwasher: power draw threshold (W) above which the cycle phase is inferred as `heat` (default: `1000`) |
| `spin_power` | Washer: power draw threshold (W) above which the cycle phase is inferred as `spin` (default: `200`) |
| `layout` | Layout mode: `default` (vertical on narrow viewports) or `split` (compact horizontal side-by-side layout, keeps illustration beside telemetry even in narrow columns) |
| `name` | Custom name |
| `color` | Accent color (any CSS color) |
| `show_toggle` | `false` to hide the power button |
| `tap_action` / `hold_action` | Core cards: standard Home Assistant action when tapping / holding (0.5 s) the illustration: `more-info`, `toggle`, `navigate`, `url`, `perform-action`, `none`. `toggle` switches the `switch` plug, with the same safety confirmation as the power button (`confirm_off`). Default: tap opens more-info, hold does nothing. The tiles keep opening the more-info of their own entity |
| `show_power` | `false` to hide the power chip (e.g. when `power` is an estimated sensor used only to detect the running state) |
| `hide_zero_power` | `true` hides the power tiles while they read 0 (under 1 W): the tile appears only when the appliance draws power (water heater: grid and solar surplus tiles) |
| `hide_when_inactive` | `true` hides the card while the appliance is not working (off, idle, standby, finished) and has no alert: it appears when a cycle starts, like a `conditional` card but using the card's own state. In the card editor and in dashboard edit mode the card stays visible, faded |
| `hide_delay` | with `hide_when_inactive`: minutes the card stays visible after the activity ends, e.g. `30` to still see "Finished" (default `0`) |
| `animations` | `false` to disable animations. By default the cards follow the "reduce animations" setting of the device (Windows: Accessibility → Visual effects → Animation effects; Android: Remove animations; iOS / macOS: Reduce motion); `true` keeps the core cards animated even when it is on |
| `illustration_size` | Size of the drawing in % (30–300, default 100), on every card. In a sections dashboard, every card can also be resized with the mouse, from 3 columns wide and in height |
| `transparent` | `true` removes the card background, shadow and border, so the dashboard background shows through, on every card |
| `temperature_unit` | `C` or `F`: temperature unit of the aquarium, battery, pellet boiler, gas boiler, diesel heater, hot tub, pump, pool robot, sauna, underfloor heating and water heat pump cards. Default: the unit of Home Assistant. Sensors are converted from their own unit, and temperature thresholds are entered in this unit |
| `confirm_off` | Washer, dryer, dishwasher, pellet stove, 3D printer, freezers, desktop PC, server rack: `false` to turn off the safety confirmation (default `true`, see below) |

### Custom tile labels

`labels` renames the tiles under the drawing, in any language. Give the tile key and your text; tiles you leave out keep the built-in translation. In the visual editor, the **Custom tile labels** field takes the same `key: text` lines.

```yaml
type: custom:appliance-sauna-card
entity: switch.sauna
labels:
  temp: Chaleur
  power: Conso
  energy: Total
```

| Card | Tile keys |
|---|---|
| Washer, dryer, fridge, oven… (all appliance cards) | `power`, `energy`, `cost`, `remaining`, `temperature`, `target`, `fridge_temp`, `freezer_temp`, `zone_top`, `zone_bottom`, `humidity`, `level`, `pellets`, `keg`, `battery`, `water`, `today`, `speed`, `progress`, `nozzle`, `bed`; water heater: `grid`, `energy_grid`, `solar_surplus`, `energy_solar`; washer, dryer, dishwasher, water heater: `last_cycle`, `cycle_duration`, `cycle_energy`, `cycle_cost`; wet & dry vacuum: `clean_water`, `dirty_water`; solar: `production`, `today`, `savings`, `of_peak` |
| Aquarium | `power`, `energy`, `temp`, `cost` |
| Linky | `power`, `active`, `hp`, `hc`, `injection`, `injection_power`, `tariff`, `cost` |
| Battery | `power`, `energy`, `temp` |
| EV charger | `power`, `energy`, `soc`, `status`, `duration`, `cost` |
| Robot vacuum (solo) | `battery`, `status`, `area`, `time`, `fan`, `filter`, `brush` |
| Robot mower (solo) | `battery`, `status`, `area`, `time`, `next`, `blade` |
| Pellet boiler | `status`, `power`, `flow`, `ret`, `pellets`, `energy`, `cost` |
| Gas boiler | `power`, `energy`, `gas`, `cost`, `flow`, `ret`, `pressure`, `mod` |
| Water heat pump | `power`, `heat`, `cop`, `flow`, `ret`, `delta`, `buffer`, `src_in`, `src_out`, `rate`, `energy`, `heat_energy`, `scop` |
| Diesel heater | `power`, `energy`, `fuel`, `used`, `cost`, `temp`, `flue` |
| Jacuzzi | `power`, `energy`, `temp`, `target`, `ph`, `cost` |
| Barrier, gates, garage door | `position`, `power`, `energy`, `cost`, `since` |
| Sauna | `temp`, `target`, `humidity`, `power`, `energy`, `cost` |
| Pumps (water, industrial, sump) | `flow`, `pressure`, `power`, `temp`, `level`, `runtime`, `starts`, `energy`, `cost` |
| Pool robot | `status`, `filter`, `water_level`, `water_temp`, `time`, `battery`, `mode`, `power`, `energy` |
| UPS | `charge`, `runtime`, `load`, `power`, `input`, `output`, `energy` |
| Underfloor heating | `temp`, `target`, `floor`, `water`, `power`, `energy`, `cost` |
| Lights (all 10) | `brightness`, `power`, `energy` |

## Type-specific options

| Option | Cards |
|---|---|
| `remaining` | washer, dryer, dishwasher, oven, microwave, air fryer — minutes, `H:MM[:SS]`, or a timestamp of the end |
| `progress` | washer, dryer, dishwasher — % |
| `program` | washer, dryer, dishwasher, oven, microwave, air fryer |
| `door` | all except water heater (`binary_sensor`, `on` = open) |
| `temperature`, `target_temperature` | water heater, oven, fridge (`temperature` only) |
| `freezer_temperature`, `freezer_door` | fridge |
| `power_level` (1–5), `pellet_level` (%), `ignition_threshold` (default 250 W), `pellet_alert` (default 15 %) | pellet stove |
| `temperature` (water), `runtime` (filtration time today), `speed` (rpm or %), `max_power` | pool pump |
| `flex_temperature`, `flex_max_temperature` | Fridge: third compartment (flex / convertible zone) temperature sensor, shown as a Flex zone tile and on the lower right door (`four_door`) or top drawer (`french`); optional alert threshold |
| `progress`, `remaining`, `program` (job name), `temperature` (nozzle), `nozzle_temperatures` (list of 2–4 nozzle sensors, shown as T0, T1…), `bed_temperature`, `filament_color` | 3D printer |
| `temperature`, `door`, `freezer_max_temperature` (default −12 °C) | chest freezer, drawer freezer |
| `power` (production), `energy` (today), `cost` (savings), `max_power` (peak Wp, default 3000), `sun_entity` (default `sun.sun`) | solar panels |
| `speed` (select/sensor: text, level or %), `humidity`, `high_threshold` (default 35 W), `humidity_max` (default 70 %) | extractor fan (VMC) |
| `zone_1`…`zone_4` (level 0–9, W or %), `zone_power` (default 1500 W), `residual_minutes` (default 10) | cooktop |
| `mode` (pilot wire / select: comfort, eco, frost, off), `window`, `temperature`, `target_temperature`, `humidity`, `max_power` (default 1500 W) | electric radiator (`humidity` also on the heated towel rail; otherwise `current_humidity` of a `climate` entity) |
| `max_temperature` (default 8), `freezer_max_temperature` (default −12) | fridge alerts |
| `style`: `top` (default), `bottom`, `bottom_door`, `french`, `four_door`, `american` | fridge layout |
| `zone2_temperature`, `max_temperature_2` (default = `max_temperature`) | dual-zone wine cooler |

## How the status is computed

1. `entity` set to a descriptive state (`running`, `finished`, `idle`, `off`… or a free text such as *Rinsing*) → used as-is.
2. `entity` is an `input_boolean`/`binary_sensor` → `on` = running.
3. `entity`/`switch` is a plug that is on → the **power sensor** decides (above `threshold` = running, otherwise standby).
4. Power only → above `threshold` = running.

**Phases** (washer, dryer, dishwasher): if the status entity or `program` contains *wash/lavage*, *rinse/rinçage*, *spin/essorage*, *dry/séchage* or *cool/refroidissement*, the illustration and LCD follow that phase (water, foam, fast spin…). Otherwise the default phase is used.

**Detecting the state without the power sensor**: when `entity` is a `binary_sensor` or an `input_boolean`, its state wins over the power sensor on the **laptop and desktop PC** cards (since 1.23.1). Useful when a charging automation cuts the plug while the machine is still running: a `ping` binary sensor then reports the real state, and the power tile keeps showing the plug's consumption. In that case do not set `switch:` to that plug — a plug reported `off` forces the off state.

Tip: for washers, a cycle-detection automation driving an `input_boolean` is more reliable than raw power (soaking phases drop to a few watts). Ready-to-use example below.

## Several appliances of the same kind

Each card is independent: it only reads the entities in its own configuration and keeps its own status, timers and drawing. Two washing machines, a washer and a washer-dryer or several fridges can sit side by side; just give each card its own entities (and a `name` to tell them apart).

## Modes (radiator and heated towel rail)

With a `mode` entity (`select`, `input_select`, or a `climate` entity used as `entity`), the radiator and the heated towel rail show four buttons — **Comfort, Eco, Frost protection, Off** — to switch mode, and the active mode is highlighted. Options are matched by name (Confort, Eco/Nuit, Hors-gel, Arrêt/Off…); a button is only shown if a matching option exists. Hide them with `show_modes: false`.

```yaml
type: custom:appliance-towel-dryer-card
power: sensor.towel_rail_power
mode: select.towel_rail_mode
```

## Power button safety

The power button only appears when you set `switch:`. On the **washer, dryer, dishwasher and pellet stove**, cutting the plug **while a cycle is running (or the stove is burning)** takes **two clicks**: the first one turns the button red and shows "Cycle running – click again to cut power" for 4 seconds. On the **desktop PC and server rack**, cutting the plug while the machine is on or asleep also takes two clicks ("Computer on – click again to cut power"). Turning the plug on, or off while idle, stays a single click. Set `confirm_off: false` to turn this off.

Advice: on a washing machine you usually don't need `switch:` at all. Leave it out and the button won't be shown.

## Examples

```yaml
type: custom:appliance-washer-card
entity: input_boolean.washer_running
power: sensor.washer_power
energy: sensor.washer_energy_daily
cost: sensor.washer_cost_today
```

```yaml
type: custom:appliance-water-heater-card
switch: switch.water_heater
power: sensor.water_heater_power
temperature: sensor.water_heater_temperature
target_temperature: input_number.water_heater_target
```

```yaml
type: custom:appliance-fridge-card
power: sensor.fridge_power
temperature: sensor.fridge_temperature
freezer_temperature: sensor.freezer_temperature
door: binary_sensor.fridge_door
```

## Theming

The cards use your theme variables. You can override them in a theme or with card-mod:

```yaml
appliance-active-color: "#03a9f4"
appliance-heat-color: "#ff8a3d"
appliance-cold-color: "#2b9af9"
appliance-alert-color: "#db4437"
appliance-ok-color: "#43a047"
appliance-illustration-size: 116px
```
