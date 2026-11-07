# Appliance Cards per Home Assistant — Italiano

<p align="center"><a href="https://github.com/sponsors/skyrotter">❤️ Sponsor su GitHub</a> · <a href="https://paypal.me/skyrotter">💙 Dona con PayPal.me</a><br><a href="https://buymeacoffee.com/skyrotter"><img src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=%E2%98%95&slug=skyrotter&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff" alt="Buy me a coffee"></a></p>

[![HACS](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://hacs.xyz)

**Versione italiana della documentazione.** Il progetto offre 95 card Lovelace per gli elettrodomestici e l'energia domestica, con illustrazioni animate, stato in tempo reale e visualizzazione di potenza, energia e costo. Le card seguono il tema chiaro/scuro di Home Assistant e parlano italiano, inglese, francese, tedesco, norvegese, olandese, rumeno, russo e serbo.

[Demo interattiva](https://skyrotter.github.io/ha-appliance-electromenager-cards/docs/demo.html) · [Test automatici](https://skyrotter.github.io/ha-appliance-electromenager-cards/docs/tests.html) · [README originale in inglese/francese](README.md)

## ❤️ Sostieni il progetto

Progetto gratuito e open source. Se ti piace, una piccola donazione aiuta a creare nuove card.

## Card disponibili

Alcuni esempi (elenco completo con anteprime nel [README in inglese](README.md#the-cards)):

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
| Bimby / Thermomix (TM6 / TM7) | `custom:appliance-thermomix-card` |
| Cookeo (multicooker) | `custom:appliance-cookeo-card` |
| Televisore | `custom:appliance-tv-card` |
| Altoparlante smart (Echo, Nest, Sonos, Devialet, HomePod) | `custom:appliance-smart-speaker-card` |
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
| Contatore del gas | `custom:appliance-gas-meter-card` |
| Contatore elettrico (generico) | `custom:appliance-electric-meter-card` |
| Valvola termostatica | `custom:appliance-trv-card` |
| Batteria domestica | `custom:appliance-battery-card` |
| Colonnina di ricarica EV | `custom:appliance-ev-charger-card` |
| Robot aspirapolvere | `custom:appliance-robot-vacuum-solo-card` |
| Robot tagliaerba | `custom:appliance-robot-mower-solo-card` |
| Caldaia a pellet | `custom:appliance-pellet-boiler-card` |
| Caldaia a gas | `custom:appliance-gas-boiler-card` |

Le card funzionano sia con una semplice presa smart (sensore di potenza) sia con dispositivi integrati in Home Assistant che espongono stato, programma, tempo rimanente, avanzamento o sensore dello sportello.

## Installazione

### HACS (consigliato)

[![Apri il repository in HACS](https://my.home-assistant.io/badges/hacs_repository.svg?style=flat-square)](https://my.home-assistant.io/redirect/hacs_repository/?owner=skyrotter&repository=ha-appliance-electromenager-cards&category=dashboard)

1. Apri HACS → **Dashboard** e cerca **Animated Appliance & Energy Cards**.
2. Clicca su **Scarica**, poi ricarica il browser (Ctrl+F5).

Se la ricerca non la trova: HACS → ⋮ → **Repository personalizzati** → aggiungi `https://github.com/skyrotter/ha-appliance-electromenager-cards` con categoria **Dashboard**.

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
| `confirm_always` | `true` per chiedere sempre un secondo clic prima di togliere corrente quando la presa è accesa (qualsiasi card con `switch`) |

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

La lingua dell'interfaccia viene rilevata dalla lingua di Home Assistant. È possibile mantenere una lingua esplicita usando l'opzione `language` quando la card la supporta: `it`, `en`, `fr`, `de`, `nb`, `nl`, `ro`, `ru`, `sr` o `sr-Latn`.

## Sicurezza

Sulle card di lavatrice, asciugatrice, lavastoviglie e stufa a pellet, l'interruzione dell'alimentazione durante un ciclo o mentre la stufa è in funzione richiede una seconda conferma, se la funzione è attiva. Per una stufa a pellet, **non interrompere mai l'alimentazione durante il funzionamento o lo spegnimento**: la ventola deve poter evacuare i fumi.

## Demo e test

- [Demo interattiva](https://skyrotter.github.io/ha-appliance-electromenager-cards/docs/demo.html)
- [Test automatici](https://skyrotter.github.io/ha-appliance-electromenager-cards/docs/tests.html)
- [Repository originale](https://github.com/skyrotter/ha-appliance-electromenager-cards)

## Licenza

MIT. Traduzione italiana a cura di [LoneWolf84](https://github.com/LoneWolf84).
