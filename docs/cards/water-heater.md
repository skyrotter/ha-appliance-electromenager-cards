# Water heater with a solar router

The water heater card accepts a second power sensor (`power_solar`) and a second energy sensor (`energy_solar`), e.g. a classic contactor on `power` and a solar-surplus router on `power_solar`. Both are added up to detect heating; when the solar one is above `threshold`, the card shows "Solar surplus" and separate Grid / Solar tiles.

```yaml
type: custom:appliance-water-heater-card
power: sensor.contacteur_power
power_solar: sensor.routeur_solaire_power
energy: sensor.contacteur_energy
energy_solar: sensor.routeur_solaire_energy
```


## Remaining hot water

Show how much hot water is left: the tank fills with red (hot water, top) over blue (cold water, bottom), and a **Hot water** tile shows the level. Use one of:

| Option | What it does |
|---|---|
| `hot_water_level` | remaining hot water in % (`sensor`, `input_number`, `number`) |
| `hot_water_volume` | remaining hot water in litres; needs `tank_volume` for the % |
| `tank_volume` | tank capacity in litres (number or entity). With `hot_water_level`, adds a **Volume** tile in litres |

```yaml
type: custom:appliance-water-heater-card
power: sensor.ballon_power
temperature: sensor.ballon_temperature
hot_water_level: input_number.niveau_eau_chaude_restante
tank_volume: 200   # optional: also shows the litres
```

[← All cards](../../README.md#the-cards)
