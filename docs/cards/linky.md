# Linky electricity meter

`custom:appliance-linky-card`

<p align="center"><img src="../linky.gif" width="300" alt="Linky card"></p>

**Linky**: lime-green meter with a scrolling LCD (power, HP/HC indexes, current period, cost — the two buttons switch pages), a gauge against the subscribed power (overload alert above 95 %) and a consumption LED blinking faster as the load rises.
  - **Several indexes**: with `indexes`, one LCD page per index instead of HP/HC, e.g. Tempo (`EASF01`…`06`) or weekday/weekend contracts. Indexes in Wh (as most TIC readers report them) or MWh are shown in kWh.
    ```yaml
    indexes:
      - entity: sensor.linky_easf01
        name: Bleu HC
      - entity: sensor.linky_easf02
        name: Bleu HP
    ```
  - **Export (solar)**: `entity_injection` (`EAIT`) and `entity_power_injection` (`SINSTI`) add their LCD pages and a "prod" LED, lit while power flows to the grid (`show_injection: false` hides them).
  - **Three-phase**: the Linky cuts off phase by phase, at a third of the subscribed power (5 kVA per phase for 15 kVA). With `entity_power_l1`…`l3` (`SINSTS1`…`3`, in VA), each phase is compared to `subscribed_power / 3` and three bars show each phase (`show_phases: false` hides them). `phase_gauge` sets the gauge: `needles` (default) one coloured needle per phase, `cycle` L1 → L2 → L3 every 3 s, `max` the most loaded phase. In every mode, the overload alert follows the most loaded phase. These entities are for three-phase meters only: a single-phase meter uses `entity_power`, and a single phase entity on its own is rejected as a configuration error (it would cut off at a third of the subscription). Otherwise the gauge compares the total to the subscribed power.
  - **Active power**: the Linky's TIC only gives apparent power (VA), which is what the cut-off limit uses, so the gauge stays in VA. For the actual consumption in W, set `entity_active_power`, e.g. a [Derivative](https://www.home-assistant.io/integrations/derivative/) helper (time unit: hours, so kWh gives kW; time window ~2 min) on a template sensor adding `entity_hp` + `entity_hc`. It is shown under the gauge and as an LCD page.

## Options

Every value tile can be hidden with its `show_…` option, and `language: fr|en|de|it|nb|nl|pl|ro|ru|sr|sr-Latn` forces the language.

- `entity_power` (W, VA, kW or kVA)
- `entity_active_power` (W, optional)
- `entity_power_l1`
- `entity_power_l2`
- `entity_power_l3` (VA per phase, three-phase meters only, at least two of them; single-phase: use `entity_power`)
- `phase_gauge` (`needles` default, `cycle` or `max`)
- `entity_hp`
- `entity_hc` (indexes, kWh, Wh or MWh)
- `indexes` (list of `entity` + `name`, replaces HP/HC: Tempo's 6 indexes, weekday/weekend…)
- `entity_injection` (export index)
- `entity_power_injection` (exported power, W or VA)
- `entity_tariff` (HP/HC) or `hc_ranges` (e.g. `01:00-07:00,12:30-14:30`)
- `entity_cost`
- `subscribed_power` (kVA, default 9)
- `show_gauge`
- `show_phases`
- `show_index`
- `show_injection`
- `show_tariff`
- `show_cost`

[← All cards](../../README.md#the-cards)
