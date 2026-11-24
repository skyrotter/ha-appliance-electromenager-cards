# Solar house (energy flow)

`custom:appliance-solar-house-card`: an animated diagram of a photovoltaic installation: solar panels on the roof, the electrical panel / inverter in the house, a home battery, the grid (electricity poles) and, optionally, an EV charger and a water heater (solar diverter).

- **Animated energy flows**: glowing dots move along the cables in the real direction of the energy, faster when the power is higher (`max_power`, 6000 W by default, is full speed). Colour = source of the energy: yellow (sun), green (battery), purple (grid).
  - panels → house; house → battery (charging) or battery → house (discharging); house → grid (export) or grid → house (import); house → EV charger; house → water heater.
- **Live legends** on each element (production, battery level and power, import / export, house, EV, water heater) and **tiles** below.
- **Day / night** from `sun.sun` (or from the production): blue sky with sun, or night sky with moon and lit windows. The panels shine while producing, the battery level fills up (orange below 30 %, red below 15 %).
- Status badge: **Self-powered**, **Exporting** or **Drawing from grid**.
- Updates automatically whenever one of the entities changes.

| Option | Description |
| --- | --- |
| `entity_solar` | Solar production (W or kW) |
| `entity_home` | House consumption (optional: otherwise computed = production + import + discharge − export − charge − EV − water heater) |
| `entity_battery_power` | Battery power, + = charging, − = discharging (`battery_invert: true` if your sensor is the other way round) |
| `entity_battery_soc` | Battery level (%) |
| `entity_grid` | Grid power, + = import, − = export (`grid_invert: true` to invert); or `entity_grid_import` + `entity_grid_export` (two positive sensors) |
| `entity_ev`, `entity_water_heater` | Optional: EV charger and water heater power (shown only if set) |
| `max_power` | Power at which the dots reach full speed (W, default 6000) |
| `show_tiles`, `show_status`, `animations`, `labels`, `illustration_size`, `transparent`, `language` | Usual options |

```yaml
type: custom:appliance-solar-house-card
name: Solar house
entity_solar: sensor.solar_power
entity_battery_power: sensor.battery_power      # + = charging
entity_battery_soc: sensor.battery_level
entity_grid: sensor.grid_power                  # + = import, − = export
entity_ev: sensor.wallbox_power                 # optional
entity_water_heater: sensor.water_heater_power  # optional
```

**Add it to a dashboard**: edit the dashboard → *Add card* → search for "Solar house" (or *Appliance – Single card* then pick the type), choose the entities in the visual editor. In YAML: *Add card* → *Manual*, paste the example above and replace the entity ids with yours.

[← All cards](../../README.md#the-cards)
