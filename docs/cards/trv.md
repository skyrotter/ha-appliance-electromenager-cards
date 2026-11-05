# Radiator valve (TRV)

`custom:appliance-trv-card`: a thermostatic radiator valve for water radiators (photo of a Tado X head). The screen is drawn live: the target temperature in large digits, the measured temperature below, heat waves while heating, `OFF` when the valve is off and a snowflake when a window is open. An orange halo breathes around the head while it heats.

It works with the `climate` entity of any smart radiator valve (Zigbee2MQTT, ZHA, Tado, Netatmo, Danfoss Ally, Aqara…).

| Option | What it does |
|---|---|
| `entity` | the `climate` entity of the valve: current temperature, target, `hvac_action`, `hvac_modes` |
| `entity_window` | window sensor (`binary_sensor`). Without it, the `window_open` attribute of the valve is used when it has one |
| `entity_battery` | battery (`sensor` %, or a low-battery `binary_sensor`). Without it, the `battery` attribute of the valve is used |
| `entity_valve_position` | valve opening in % (`sensor` / `number`). Without it, the `pi_heating_demand` / `valve_position` attribute is used |
| `show_hvac_modes` | mode buttons (off, heat, auto…), only the modes the valve offers (default `true`) |
| `show_status`, `show_temperature`, `show_valve`, `show_battery`, `show_window`, `animations`, `labels`, `language`, `illustration_size`, `transparent` | |

**Target**: **− / +** buttons, sent 0.8 s after the last tap, respecting the valve's step and limits.

States: **Heating** (from `hvac_action`, or the valve opening when there is no `hvac_action`), **At target**, **Off**, **Window open** (blue alert), **Unavailable**.

```yaml
type: custom:appliance-trv-card
entity: climate.bedroom_valve
entity_window: binary_sensor.bedroom_window     # optional
entity_battery: sensor.bedroom_valve_battery    # optional
```


[← All cards](../../README.md#the-cards)
