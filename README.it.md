# Appliance Cards per Home Assistant — Italiano

[![HACS](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/docs/faq/custom_repositories)

**Versione italiana della documentazione.** Il progetto offre 35 card Lovelace per gli elettrodomestici e l'energia domestica, con illustrazioni animate, stato in tempo reale e visualizzazione di potenza, energia e costo. Le card seguono il tema chiaro/scuro di Home Assistant e supportano ora l'italiano, oltre a inglese e francese.

[Demo interattiva](https://skyrotter.github.io/ha-appliance-electromenager-cards/docs/demo.html) · [Test automatici](https://skyrotter.github.io/ha-appliance-electromenager-cards/docs/tests.html) · [README originale in inglese/francese](README.md)

## Card disponibili

| Elettrodomestico | Tipo Lovelace |
|---|---|
| Lavatrice | `custom:appliance-washer-card` |
| Asciugatrice | `custom:appliance-dryer-card` |
| Lavastoviglie | `custom:appliance-dishwasher-card` |
| Scaldacqua | `custom:appliance-water-heater-card` |
| Forno | `custom:appliance-oven-card` |
| Microonde | `custom:appliance-microwave-card` |
| Frigorifero | `custom:appliance-fridge-card` |
| Stufa a pellet | `custom:appliance-pellet-stove-card` |
| Pompa per piscina | `custom:appliance-pool-pump-card` |
| Stampante 3D | `custom:appliance-printer-3d-card` |
| Congelatore a pozzetto | `custom:appliance-chest-freezer-card` |
| Congelatore verticale | `custom:appliance-drawer-freezer-card` |
| Pannelli solari | `custom:appliance-solar-card` |
| Ventola di estrazione / VMC | `custom:appliance-vmc-card` |
| Piano cottura | `custom:appliance-hob-card` |
| Radiatore elettrico | `custom:appliance-radiator-card` |
| Friggitrice ad aria | `custom:appliance-air-fryer-card` |
| Macchina del caffè | `custom:appliance-coffee-maker-card` |
| Televisore | `custom:appliance-tv-card` |
| Cappa aspirante | `custom:appliance-range-hood-card` |
| Climatizzatore interno | `custom:appliance-ac-split-card` |
| Pompa di calore esterna | `custom:appliance-heat-pump-card` |
| Scaldasalviette | `custom:appliance-towel-dryer-card` |
| Armadio server / homelab | `custom:appliance-server-rack-card` |
| PC desktop | `custom:appliance-desktop-pc-card` |
| Computer portatile | `custom:appliance-laptop-card` |
| Cantinetta vino | `custom:appliance-wine-cooler-card` |
| Acquario | `custom:appliance-aquarium-card` |
| Contatore Linky | `custom:appliance-linky-card` |
| Batteria domestica | `custom:appliance-battery-card` |
| Colonnina di ricarica EV | `custom:appliance-ev-charger-card` |
| Robot aspirapolvere | `custom:appliance-robot-vacuum-solo-card` |
| Robot tagliaerba | `custom:appliance-robot-mower-solo-card` |
| Caldaia a pellet | `custom:appliance-pellet-boiler-card` |
| Caldaia a gas | `custom:appliance-gas-boiler-card` |

Le card funzionano sia con una semplice presa smart (sensore di potenza) sia con dispositivi integrati in Home Assistant che espongono stato, programma, tempo rimanente, avanzamento o sensore dello sportello.

## Installazione

### HACS (consigliato)

1. Apri HACS e seleziona il menu ⋮ → **Repository personalizzati**.
2. Aggiungi `https://github.com/skyrotter/ha-appliance-electromenager-cards` con categoria **Dashboard**.
3. Cerca **Appliance Cards**, installa e ricarica il browser con Ctrl+F5.

### Installazione manuale

1. Copia `dist/ha-appliance-electromenager-cards.js` in `/config/www/`.
2. Vai in **Impostazioni → Dashboard → ⋮ → Risorse**.
3. Aggiungi `/local/ha-appliance-electromenager-cards.js` come modulo JavaScript.

## Configurazione di base

Ogni card dispone di un editor visuale. Quando aggiungi una card dal selettore, alcune entità possono essere individuate automaticamente in base al nome. Le chiavi di configurazione e gli ID delle entità rimangono in inglese per mantenere la compatibilità.

| Opzione | Descrizione |
|---|---|
| `entity` | Entità che rappresenta lo stato: `switch`, `input_boolean`, `binary_sensor`, `sensor`, `input_select` o altra entità compatibile |
| `power` | Sensore di potenza in W o kW |
| `energy` | Sensore di energia in kWh, ad esempio il consumo giornaliero |
| `cost` | Sensore del costo, nella valuta configurata dal sensore |
| `switch` | Interruttore controllato dal pulsante di accensione della card; il pulsante non appare se l'opzione è omessa |
| `threshold` | Soglia di potenza oltre la quale l'apparecchio è considerato in funzione |
| `name` | Nome personalizzato della card |
| `color` | Colore di accento CSS |
| `show_toggle` | Imposta `false` per nascondere il pulsante di accensione |
| `animations` | Imposta `false` per disattivare le animazioni |
| `confirm_off` | Per alcune card, imposta `false` per disattivare la conferma prima di interrompere l'alimentazione durante un ciclo |

### Esempio YAML

```yaml
type: custom:appliance-washer-card
entity: binary_sensor.lavatrice_in_corso
power: sensor.lavatrice_potenza
energy: sensor.lavatrice_energia_giornaliera
cost: sensor.lavatrice_costo_giornaliero
```

Le chiavi YAML come `power`, `energy`, `entity`, `temperature` e i nomi dei tipi di card **non vanno tradotti**. Solo le etichette mostrate nell'interfaccia vengono localizzate.

## Lingua

La lingua dell'interfaccia viene rilevata dalla lingua di Home Assistant. È possibile mantenere una lingua esplicita usando l'opzione `language` quando la card la supporta: `it`, `en` o `fr`.

## Sicurezza

Sulle card di lavatrice, asciugatrice, lavastoviglie e stufa a pellet, l'interruzione dell'alimentazione durante un ciclo o mentre la stufa è in funzione richiede una seconda conferma, se la funzione è attiva. Per una stufa a pellet, **non interrompere mai l'alimentazione durante il funzionamento o lo spegnimento**: la ventola deve poter evacuare i fumi.

## Demo e test

- [Demo interattiva](https://skyrotter.github.io/ha-appliance-electromenager-cards/docs/demo.html)
- [Test automatici](https://skyrotter.github.io/ha-appliance-electromenager-cards/docs/tests.html)
- [Repository originale](https://github.com/skyrotter/ha-appliance-electromenager-cards)

## Licenza

MIT. Questa traduzione della documentazione è parte della fork italiana del progetto.
