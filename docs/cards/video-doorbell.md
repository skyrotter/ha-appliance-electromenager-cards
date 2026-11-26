# Video doorbell (`custom:appliance-video-doorbell-card`)

Animated smart video doorbell with ringing LED halo and bell waves, camera snapshot viewport (or animated porch SVG scene), visitor / motion / package detections, last ring time, battery & Wi-Fi tiles, lock/chime/light controls, `extra_tiles`, and `icons`.

## Example configuration

```yaml
type: custom:appliance-video-doorbell-card
name: Front doorbell
entity_camera: camera.front_doorbell
entity_ring: binary_sensor.front_doorbell_ring
entity_last_ring: sensor.front_doorbell_last_ring
entity_motion: binary_sensor.front_doorbell_motion
entity_person: binary_sensor.front_doorbell_person
entity_package: binary_sensor.front_doorbell_package
entity_battery: sensor.front_doorbell_battery
entity_signal: sensor.front_doorbell_wifi_signal
entity_chime: switch.front_doorbell_chime
entity_lock: lock.front_door
entity_light: light.porch_light
entity_night: binary_sensor.front_doorbell_night_vision
ring_duration: 30
```
