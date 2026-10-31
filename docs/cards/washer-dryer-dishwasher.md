# Smart plug + cycle detection (recommended for washer, dryer, dishwasher)

## Quick start: a smart plug is enough

A smart plug with a power sensor is all you need. No helper, no automation:

```yaml
type: custom:appliance-dryer-card   # or appliance-washer-card / appliance-dishwasher-card
power: sensor.dryer_plug_power
energy: sensor.dryer_plug_energy_today   # optional
```

How the card reads the power:
- **Running**: power is above `threshold` (**10 W by default** for washer, dryer and dishwasher).
- **Idle**: power is at or below `threshold`. If your plug itself draws a few watts, or the appliance sits at more than 10 W in standby, raise it: `threshold: 15`. Check your plug's power history to choose the value.
- The dryer shows **Drying** while it runs (the phase detection below only applies to washers and dishwashers).

## Last cycle: start, end, duration, energy, cost

`last_cycle: true` adds, between cycles, the **last cycle** tiles: start → end time (with "yesterday" or the date when it was not today), duration, energy used and, with `price_per_kwh`, its cost. The card reads them from the Home Assistant history of `power` (last 4 days): no helper, no automation, no template sensor.

```yaml
type: custom:appliance-dishwasher-card
power: sensor.dishwasher_plug_power
energy: sensor.dishwasher_plug_energy   # optional: more accurate energy
last_cycle: true
price_per_kwh: 0.2516                   # or a tariff entity: sensor.electricity_price
```

- A cycle is power above `threshold`; drops below it shorter than `cycle_gap` (**15 min** by default) stay in the same cycle (soaking, drying). Raise `cycle_gap` if a long drying phase splits the cycle in two.
- Energy is the difference of the `energy` counter over the cycle, otherwise the power history integrated over time.
- The cost uses the Home Assistant currency.

The rest of this page is only needed if the card flickers during a cycle.

## Cycle detection (stops the flicker)

A washer pauses, soaks and heats in steps: its power can drop to a few watts for several minutes in the middle of a cycle. Reading raw power alone makes the card flicker between *Running* and *Standby*. This automation fixes that. It decides a cycle has **started** when power stays above 100 W for 30 s, and that it has **ended** when power stays below 20 W for 8 minutes.

**1. Create the helper:** Settings → Devices & services → Helpers → Create helper → Toggle → name it `Washer running` (entity `input_boolean.washer_running`). Or in YAML:

```yaml
input_boolean:
  washer_running:
    name: Washer running
    icon: mdi:washing-machine
```

**2. Add the automation** (Settings → Automations → ⋮ → Edit in YAML). Replace `sensor.washer_plug_power` with your plug's power sensor:

```yaml
alias: Washer – cycle detection
mode: restart
triggers:
  - trigger: numeric_state
    entity_id: sensor.washer_plug_power
    above: 100
    for: "00:00:30"
    id: start
  - trigger: numeric_state
    entity_id: sensor.washer_plug_power
    below: 20
    for: "00:08:00"
    id: end
actions:
  - choose:
      - conditions:
          - condition: trigger
            id: start
        sequence:
          - action: input_boolean.turn_on
            target:
              entity_id: input_boolean.washer_running
      - conditions:
          - condition: trigger
            id: end
          - condition: state
            entity_id: input_boolean.washer_running
            state: "on"
        sequence:
          - action: input_boolean.turn_off
            target:
              entity_id: input_boolean.washer_running
          # optional: get notified when the laundry is done
          # - action: notify.mobile_app_your_phone
          #   data:
          #     message: "The washing machine is done 🧺"
```

**3. Use it in the card:**

```yaml
type: custom:appliance-washer-card
entity: input_boolean.washer_running
power: sensor.washer_plug_power
energy: sensor.washer_plug_energy_today
```

Suggested values for the automation (start above / end below / end delay): washer 100 W / 20 W / 8 min, dryer 100 W / 15 W / 5 min, dishwasher 50 W / 10 W / 10 min (dishwashers sit at a few watts while drying). Adjust them to your appliance by looking at its power history.

For a dryer, use the same automation with its own plug and helper (`input_boolean.dryer_running`), then:

```yaml
type: custom:appliance-dryer-card
entity: input_boolean.dryer_running
power: sensor.dryer_plug_power
energy: sensor.dryer_plug_energy_today
``` Requires Home Assistant 2024.10 or newer for the `triggers:` / `actions:` syntax; on older versions, use `trigger:` / `platform:` / `action:` / `service:`.




### Automatic cycle phase detection from power draw (washer and dishwasher)

When the appliance has no smart integration that reports its program, the card infers the cycle phase from the live power. A phase given by a status or program entity (for example Home Connect) always takes priority. This applies to **washers and dishwashers only**: a dryer shows *Drying* while it runs.

- **Heating (`heat`)**: power ≥ `heating_power` (default `1000` W). The heating element is on (steam and a warm glow on the dishwasher).
- **Spinning (`spin`)**: on washers, power ≥ `spin_power` (default `200` W).
- **Washing (`wash`)**: any other power above `threshold`.
- **Drying (`dry`)**: on dishwashers, when power falls to `threshold` or less (10 W by default) within 20 minutes after the cycle was active. The card keeps this memory in the browser, so it is lost when you reload the page.

You can change the power thresholds if your appliance runs at different wattages:

```yaml
type: custom:appliance-washer-card
power: sensor.washer_plug_power
heating_power: 1200
spin_power: 250
```

[← All cards](../../README.md#the-cards)
