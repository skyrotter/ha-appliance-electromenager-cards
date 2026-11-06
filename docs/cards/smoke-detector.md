# Smoke detector

`custom:appliance-smoke-detector-card`: a ceiling smoke detector, in two models picked with `model`:

- `cylinder` (default): compact cylinder with a flared base, a square LED test button and a mesh band;
- `round`: the classic flat round detector with vents.

Set `detector: gas` to use the same detector for natural gas (methane / LPG): the texts become **Gas!** / *Gas detected at {t}* and a gas cloud rises instead of smoke (`model: gas` also works and keeps the cylinder).

On alarm, smoke rises, the red LED flashes, sound waves come out of the detector and the card gets a red outline. Carbon monoxide shows an orange gas cloud and orange waves. A test presses the button and sends blue waves. A fault or a low battery turns the LED orange and shows a symbol.

| Option | What it does |
|---|---|
| `entity_smoke` | smoke sensor: `binary_sensor` (device class smoke) or a text sensor (`smoke`, `alarm`, `detected`, `fumée`… in every language; `no smoke`, `clear`, `ok` count as no alarm) |
| `model` | `cylinder` (default) or `round` |
| `detector` | `smoke` (default) or `gas` |
| `entity_co` | carbon monoxide: `binary_sensor`, or a `sensor` in ppm compared with `co_threshold` (50 ppm) |
| `entity_test` | test mode sensor: the button presses in, blue waves |
| `entity_test_button` | **Test** button (`button`, `input_button`, `script`, `switch`), shown when there is no alarm |
| `entity_siren` | siren (`siren`): used by the **Silence alarm** button when `entity_silence` is not set |
| `entity_level` | gas concentration sensor (% LEL, ppm…), shown as a tile (`show_level`) |
| `entity_valve` | gas shut-off valve (`valve`, `switch`, `input_boolean`): **Close valve** / **Open valve** button |
| `entity_silence` | **Silence alarm** button (`button`, `switch`, `siren`, `script`, `input_boolean`), shown only during an alarm |
| `entity_fault` | fault or tamper sensor (`binary_sensor`) |
| `entity_battery` | battery in % (low below `battery_low`, 20 %) or a battery `binary_sensor` (on = low) |
| `entity_temperature` | temperature tile (many Zigbee detectors have one); `temperature_unit` to force °C / °F |
| `labels` | overrides any text, the status ones too: `ok`, `alarm`, `alarm_at` (with `{t}`), `co`, `test`, `fault`, `low_battery`, and the tile labels (`since`, `battery`…) |
| `show_status`, `show_since`, `show_co`, `show_battery`, `show_temperature`, `show_level`, `show_buttons`, `animations`, `language`, `illustration_size`, `transparent` | |

States, by priority: **Smoke!**, **Carbon monoxide**, **Test**, **Fault**, **Low battery**, **OK**, **Unavailable**.

```yaml
type: custom:appliance-smoke-detector-card
name: Hallway
model: cylinder                                  # or round
entity_smoke: binary_sensor.hallway_smoke
entity_battery: sensor.hallway_smoke_battery     # optional
entity_test_button: button.hallway_smoke_test    # optional
entity_silence: siren.hallway_smoke              # optional
```

Gas detector:

```yaml
type: custom:appliance-smoke-detector-card
detector: gas
name: Gas
entity_smoke: binary_sensor.kitchen_gas
entity_level: sensor.kitchen_gas_level          # optional
entity_valve: valve.gas_shutoff                 # optional
entity_siren: siren.kitchen_gas                 # optional
entity_test_button: button.kitchen_gas_self_check
```

[← All cards](../../README.md#the-cards)
