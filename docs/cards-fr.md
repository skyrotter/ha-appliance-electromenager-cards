# Cartes : descriptions détaillées (français)

[← README en français](../README.fr.md) · Les tableaux d'options complets sont dans les [pages de chaque carte](cards/) (en anglais).

Quarante-quatre cartes Lovelace pour l'électroménager et l'énergie (lave-linge, sèche-linge, lave-vaisselle, ballon d'eau chaude, four, micro-ondes, réfrigérateur, poêle à granulés, pompe de piscine, imprimante 3D, congélateur coffre, congélateur à tiroirs, panneaux solaires, VMC, plaques de cuisson, radiateur électrique, airfryer, cafetière, téléviseur, hotte aspirante, climatiseur et pompe à chaleur) : illustration animée, état en direct, puissance, énergie et coût. Elles suivent le thème de Home Assistant et s'affichent en français si Home Assistant est en français.

**Installation HACS** : dans HACS, cherche **Appliance Cards**, installe, puis recharge le navigateur (Ctrl+F5). Si la carte n'apparaît pas encore dans la recherche (en attente d'ajout au catalogue HACS par défaut) : HACS → ⋮ → *Dépôts personnalisés* → `https://github.com/skyrotter/ha-appliance-electromenager-cards`, catégorie **Dashboard**.

**Configuration** : éditeur visuel disponible ; les entités sont détectées automatiquement à l'ajout (noms contenant `lave_linge`, `seche_linge`, `lave_vaisselle`, `ballon`, `four`, `micro_ondes`, `frigo`, `washer`, `dryer`, `fridge`…). Les options sont les mêmes que ci-dessus.

```yaml
type: custom:appliance-washer-card
entity: binary_sensor.lave_linge_en_cours
power: sensor.lave_linge_puissance
energy: sensor.lave_linge_energie_jour
cost: sensor.lave_linge_cout_jour
```

**Prise connectée + détection de cycle** : pour le lave-linge, le sèche-linge et le lave-vaisselle, utilise l'automatisation de détection de cycle décrite plus haut (section *Smart plug + cycle detection*). Elle allume un `input_boolean` au démarrage (plus de 100 W pendant 30 s) et l'éteint à la fin (moins de 20 W pendant 8 min). Ça évite que la carte passe en « Veille » pendant le trempage.

**Poêle à granulés** : avec une simple prise connectée, la carte distingue l'**allumage** (plus de 250 W, la résistance chauffe) de la **chauffe** (20 à 250 W, ventilateur et vis sans fin). L'extinction et les alarmes viennent d'une entité d'état ou de l'intégration du poêle. ⚠️ Ne coupe jamais l'alimentation d'un poêle en fonctionnement ou en extinction : le ventilateur doit évacuer les fumées.

**Pompe de piscine** : l'eau circule sur le dessin (bassin → préfiltre → pompe → bassin) avec le ventilateur du moteur qui tourne. Au-dessus de 50 W, la carte affiche « Filtration ». La vitesse de l'animation suit la vitesse de la pompe (tr/min, %, ou puissance / `max_power`). Tuiles : température de l'eau et durée de filtration du jour (capteur `history_stats`, exemple ci-dessus).

**Imprimante 3D** : la tête va et vient, le portique monte couche par couche et la pièce grandit selon la progression. Fonctionne avec l'intégration Bambu Lab, OctoPrint, Moonraker… (états `prepare`, `running`, `pause`, `finish`, `failed`), ou avec une simple prise (au-dessus de 40 W = impression, la pièce grandit alors en boucle). Couleur du filament réglable (`filament_color`).

**Congélateurs** : le coffre lève son couvercle quand le capteur d'ouverture s'ouvre (intérieur éclairé, froid qui s'échappe). Le congélateur armoire ouvre sa porte sur 4 tiroirs, et un tiroir sort. Alerte « Trop chaud » au-dessus de −12 °C (réglable) et alerte porte ouverte. Couper un congélateur demande toujours une confirmation.

**Panneaux solaires** : uniquement le soleil, deux panneaux sur leur structure et l'onduleur (sans fond). En production, le soleil jaune grossit selon la production (par rapport à `max_power`), un reflet balaie les panneaux et l'énergie circule jusqu'à l'onduleur. Sans production, le soleil devient gris et les panneaux s'assombrissent. Tuiles : production, énergie du jour, économies, % de la crête.

**VMC** : façade blanche murale, grille ronde à lamelles et hélice visible, sur un mur carrelé. L'hélice tourne, l'air humide est aspiré vers la grille, et en cas d'humidité élevée la buée monte et la condensation coule sur le carrelage. Petite vitesse (5–35 W) et grande vitesse (au-dessus de 35 W) détectées par la prise, via une entité de vitesse, ou via `preset_mode` / `percentage` (au-dessus de 60 %) d'une entité `fan`. Alerte humidité au-dessus de 70 %.

**Plaques de cuisson** : table vitrocéramique noire avec 4 foyers qui rougeoient selon leur niveau, une casserole qui fume (couvercle qui tremble à feu fort) et une poêle qui grésille. Le bandeau affiche le niveau de chaque foyer et un « H » de chaleur résiduelle après l'arrêt. Niveaux par foyer via l'intégration de la plaque, ou déduits de la puissance totale (≈ 1500 W par foyer). ⚠️ Une plaque n'est jamais sur une prise connectée : mesure-la avec un compteur modulaire ou une pince au tableau.

**Radiateur électrique** : radiateur à inertie mural à 6 éléments avec son boîtier de commande (écran, icônes de mode, boutons). En chauffe, les éléments rougeoient et des ondes de chaleur montent (selon la puissance). Mode affiché : soleil = Confort, lune = Éco, flocon = Hors-gel (fil pilote, `climate` ou liste). Fenêtre ouverte : air froid et alerte. Capteur d'humidité facultatif (`humidity`, aussi sur le sèche-serviettes), sinon l'humidité du thermostat `climate` s'il la fournit. Fonctionne avec un thermostat `climate`, un fil pilote ou une simple mesure de puissance.

**Airfryer** : airfryer noir double bac avec bandeau tactile et deux tiroirs inox à hublot (frites à gauche, nuggets à droite). En cuisson (au-dessus de 50 W sur la prise), les bacs s'éclairent, les résistances rougeoient, l'air chaud tourbillonne, les frites sautillent et de la vapeur sort du dessus. L'écran affiche le temps restant (`remaining`), sinon la température, sinon `ON` ; `End` en vert quand c'est terminé. Type : `custom:appliance-air-fryer-card`.

**Cafetière** : trois dessins au choix avec `style` : `filtre` (verseuse en verre, par défaut), `dosette` (Senseo, Nespresso, Dolce Gusto…) ou `expresso` (machine à grains). Au-dessus de 300 W sur la prise, le café coule, la verseuse ou la tasse se remplit, le réservoir d'eau se vide et la vapeur monte (écran `CAFE`). Entre 5 et 300 W : « Maintien au chaud » (plaque rouge) pour une cafetière filtre, « Prêt » pour les autres. Type : `custom:appliance-coffee-maker-card`.

**Téléviseur** : écran plat fixé au mur, sans pied. À l'allumage, une ligne lumineuse s'ouvre, des faisceaux convergent vers un logo de démarrage, puis l'écran d'accueil de streaming apparaît ; à l'extinction, l'image se replie en une ligne puis un point. Allumée : écran d'accueil animé (bannière, rangées de vignettes qui défilent) ; veille : écran noir et voyant rouge ; éteinte : rien. Avec une prise : allumée au-dessus de 25 W, veille entre 0,2 et 25 W. Avec un `media_player`, l'appli ou la source s'affiche (« Allumée · Netflix »). Type : `custom:appliance-tv-card`.

**PlayStation 5** (`custom:appliance-ps5-card`) : console debout sur son socle, manette posée au pied (silhouette seule, sans logo). **Éteinte** : bandeaux gris. **Mode repos** : bandeaux orange qui respirent, manette en charge (câble branché, barre lumineuse orange). **Allumée** : au démarrage, balayage bleu des bandeaux puis blanc fixe, barre de la manette bleue, un peu d'air chaud par les ouïes. **En jeu** : halo bleu, air chaud plus marqué, la manette est prise en main (elle se soulève et bouge, les boutons s'allument). Avec une prise (`power`) : allumée au-dessus de 25 W (`threshold`), en jeu au-dessus de 100 W (`gaming_threshold`), mode repos entre 0,8 W (`standby_threshold`) et 25 W. Avec l'intégration **PlayStation Network** (`entity: media_player.…`) : « En jeu » et le titre du jeu (« En jeu · Astro Bot ») ; sans prise, elle suffit. Avec un `switch`, couper la prise console allumée ou en mode repos demande deux clics (« Console allumée – cliquer encore pour couper », `confirm_off: false` pour désactiver). Voir [ps5.md](cards/ps5.md).

**Hotte aspirante** : hotte cheminée au-dessus d'une plaque et d'une casserole qui fume. Moteur en marche : l'hélice tourne, la vapeur est aspirée, l'air monte (plus vite en grande vitesse). Éclairage : les spots éclairent la plaque (quelques watts sans moteur = « Éclairage », ou entité `light`). Vitesses : au-dessus de 40 W petite vitesse, au-dessus de 130 W grande vitesse (`high_threshold`), ou entité `speed`. Type : `custom:appliance-range-hood-card`.

**Pack clim** : deux cartes à mettre côte à côte, pilotées par la même entité `climate` (et/ou une prise). **Split intérieur** (`custom:appliance-ac-split-card`) : le volet s'ouvre et balaie, l'air souffle (bleu en froid, orange en chaud, gris en ventilation, gouttes en déshumidification), l'écran affiche la consigne. **Unité extérieure** (`custom:appliance-heat-pump-card`) : l'hélice tourne, le groupe vibre quand le compresseur tourne, ondes d'air chaud en clim et d'air froid en chauffage, vapeur pendant le dégivrage. Consigne atteinte : hélice au ralenti. Sans entité `climate`, régler `hvac: cool` ou `hvac: heat` (par défaut : clim de mai à septembre, chauffage sinon).

**Sécurité du bouton marche/arrêt** : sur le lave-linge, le sèche-linge, le lave-vaisselle et le poêle à granulés, couper la prise pendant un cycle (ou poêle allumé) demande deux clics (le bouton devient rouge et affiche « Cycle en cours – cliquer encore pour couper »). Sur le PC fixe et la baie serveur, couper la prise machine allumée ou en veille demande aussi deux clics (« Ordinateur allumé – cliquer encore pour couper »). Option `confirm_off: false` pour désactiver. Conseil : sur un lave-linge, ne mets pas de `switch:` du tout.

**Clic sur l'illustration** (cartes principales) : `tap_action` et `hold_action` (appui long, 0,5 s) acceptent les actions standard de Home Assistant (`more-info`, `toggle`, `navigate`, `url`, `perform-action`, `none`). `toggle` allume / éteint la prise `switch`, avec la même confirmation que le bouton pendant un cycle. Par défaut, un clic ouvre la fiche de l'entité ; les tuiles ouvrent toujours la fiche de leur propre entité.

```yaml
type: custom:appliance-washer-card
entity: input_boolean.washer_running
switch: switch.washer_plug
tap_action:
  action: toggle
hold_action:
  action: more-info
```

**Pompe à bière** (`custom:appliance-beer-tap-card`) : tireuse avec fenêtre du fût, robinet chromé et pinte. Au-dessus de 30 W : refroidissement (flocon, brume froide, buée sur le verre) ; prise allumée sous le seuil : prête (pinte pleine, bulles). Avec un capteur `pouring` : la manette bascule, la bière coule et le verre se remplit. `temperature` sur l'écran, `keg_level` (%) remplit la fenêtre du fût avec alerte « Fût presque vide ».

**Ampli home cinéma** (`custom:appliance-av-receiver-card`) : ampli avec écran, gros bouton de volume et égaliseur. En lecture, les barres dansent, l'anneau du volume s'illumine, des ondes et des notes sortent ; l'amplitude suit le volume (`media_player`) ou la puissance. L'écran affiche la source, `MUTE` en sourdine ; veille : voyant rouge. Avec une prise : lecture au-dessus de 40 W.

**Ventilateur** (`custom:appliance-fan-card`) : ventilateur sur pied avec grille, cinq pales et un petit ruban. Trois vitesses : les pales tournent plus vite, l'air souffle plus fort, le ruban s'agite et les voyants du socle s'allument (1, 2 ou 3) ; la tête oscille (`oscillating: false` pour l'arrêter). Avec une entité `fan` : le pourcentage et l'oscillation sont lus. Avec une prise : vitesse 1 au-dessus de 5 W, vitesse 2 au-dessus de 30 W (`mid_threshold`), vitesse 3 au-dessus de 40 W (`high_threshold`).

**Ventilateur de plafond** (`custom:appliance-ceiling-fan-card`) : quatre pales en bois vues en perspective, bloc moteur, globe lumineux et chaînettes. Trois vitesses comme le ventilateur sur pied (`percentage` de l'entité `fan`, ou puissance : `threshold` 5 W, `mid_threshold` 30 W, `high_threshold` 40 W) : les pales tournent plus vite, l'air descend et les chaînettes se balancent. Avec une entité `light`, le globe s'allume et éclaire la pièce, même pales arrêtées (état « Éclairage »).

**Bouilloire** (`custom:appliance-kettle-card`) : bouilloire en verre sur son socle. Au-dessus de `threshold` (500 W) : « Ébullition », le socle s'éclaire en bleu, les bulles montent, la surface frémit et la vapeur sort du bec. Après la coupure : « Eau chaude » (voyant orange, légère vapeur) pendant `hot_minutes` (5 min). Avec un capteur `temperature`, tuile et barre de température de l'eau, et « Eau chaude » tant que l'eau dépasse `hot_temperature` (60 °C). Voir [kettle-toaster.md](cards/kettle-toaster.md).

**Grille-pain** (`custom:appliance-toaster-card`) : grille-pain inox deux fentes. Au-dessus de `threshold` (200 W) : « Grillage », le levier descend, les tranches s'enfoncent, les fentes rougeoient. À la coupure, les toasts dorés sautent : « Toasts prêts ! » pendant `ready_minutes` (2 min).

**Multiprise** (`custom:appliance-power-strip-card`) : multiprise française vue de trois quarts. Sous tension (puissance au-dessus de 1 W, `switch` allumé ou une prise commandée allumée), l'interrupteur rougeoie et le courant circule dans le cordon. `outlets` : une entité `switch` par prise, chacune dessine une fiche avec un anneau LED bleu quand elle est allumée, et un bouton numéroté sous la carte la bascule (nom de l'entité en infobulle). `sockets` (2 à 6) règle le nombre de prises.

**Chargeur de téléphone** (`custom:appliance-phone-charger-card`) : smartphone sur un socle à induction. Au-dessus de 2 W : « En charge », l'anneau pulse en bleu, l'écran affiche l'heure et la batterie qui se remplit (`battery_level`). Entre 0,3 W et le seuil, ou à 100 % : « Chargée », anneau vert.

**Piano numérique** (`custom:appliance-piano-card`) : au-dessus de 3 W l'écran s'allume, les touches jouent et des notes s'envolent ; veille entre 0,3 W et le seuil.

**Guirlande LED** (`custom:appliance-garland-card`) : globes en festons sous une poutre de terrasse. Avec une entité `light` (ou une prise au-dessus de 1 W), la scène passe en nuit et les globes brillent en arc-en-ciel. Une couleur choisie sur la lumière (autre que le blanc chaud) sans effet les allume de cette couleur ; la luminosité règle le halo ; l'effet en cours s'affiche dans une tuile. `multicolor: false` utilise toujours la couleur de la lumière. Le bouton marche/arrêt pilote la lumière. Voir [plugs-piano-garland.md](cards/plugs-piano-garland.md).

**Compteur d'eau** (`custom:appliance-water-meter-card`) : compteur laiton à cadran bleu, totalisateur m³ (noir) et litres (rouge), étoile de débit qui tourne selon le débit, eau qui circule dans les tuyaux. Tous les capteurs sont facultatifs : `entity_index` (m³, L, gal, ft³ convertis), `entity_flow` (L/min, L/h, m³/h, gal/min convertis ; **sans lui, le débit est calculé à partir de l'index**), `entity_today`, `entity_cost`, `entity_leak` (détecteur de fuite), `entity_valve` (vanne d'arrêt : bouton Fermer / Ouvrir la vanne). Sans détecteur : « Fuite possible » si l'eau coule sans interruption plus de `leak_minutes` (60 min). Voir [water-meter.md](cards/water-meter.md).

**Fenêtre de toit** (`custom:appliance-roof-window-card`) : fenêtre de toit à rotation (Velux, Fakro…) sur un toit en tuiles. L'ouvrant pivote selon `current_position` et laisse voir la pièce (éclairée la nuit). Mêmes états, boutons et options que les volets. `entity_blind` : volet roulant extérieur qui descend sur la vitre, bouton et tuile **Volet** ; `entity_rain` : ciel gris et pluie, tuile **Pluie**.

**Climat de la pièce** (`custom:appliance-room-climate-card`) : carte compacte pour la température et l'humidité d'une pièce. Le mercure du thermomètre monte, l'eau ondule dans la goutte, un halo coloré suit le confort et la courbe des 24 h s'affiche sous les valeurs, avec la tendance sur 1 h. Badge **Confort / Frais / Chaud / Humide / Sec** selon les seuils réglés dans l'éditeur (`comfort_temp_min`, `comfort_temp_max`, `humidity_min`, `humidity_max`) ; **alertes** au-dessus ou en dessous d'un seuil (`alert_temp_max`, `alert_temp_min`, `alert_humidity_max`, `alert_humidity_min`). **Point de rosée**, **risque de moisissure** (humidité au-dessus de `mold_humidity`, 70 %) et **risque de condensation** sur les vitres (avec une température extérieure). Capteurs extérieurs (`entity_outdoor_temperature`, `entity_outdoor_humidity`) : comparaison et conseil **Aérer** quand l'air extérieur est plus sec (humidité absolue) ou plus frais. **Fenêtre ouverte** : capteur `entity_window`, sinon détectée par une chute brutale de température (`window_drop` en 15 min, 1,5 °C ; `0` désactive). **Batterie faible** : `entity_battery` ou attribut `battery_level` du capteur, seuil `battery_low` (20 %). **Un clic ouvre le pop-up d'historique** : 24 h / 7 jours / 30 jours, Les deux / Température / Humidité, actuelle, moyenne, min, max, infobulle, zone idéale, extérieur en pointillés et récap jour par jour ; 7 et 30 jours viennent des statistiques long terme de Home Assistant. Ouverture par défaut réglable (`history_days`, `history_mode`) ; bouton **Comparer** : période précédente (hier en 24 h) en pointillés. **12 styles animés** (`variant` ; l'ancien nom `style` marche encore, sauf dans une carte `picture-elements` où `style` sert au positionnement) : `standard`, `gauge` (jauge), `gradient` (dégradé et vagues), `minimal`, `lcd` (station météo, `lcd_color` : auto / green / blue / amber), `tile` (tuile mini), `thermometer` (grand thermomètre gradué, min / moy / max 24 h), `gradient_ring` (anneau dégradé, mini-courbes sur le côté), `double_ring` (double anneau, min / moy / max avec l'heure), `dial` (cadran laiton à aiguilles), `neon`, `bars` (barres). `icon` : icône de la pièce, dans tous les styles. `entity_climate` : thermostat lié, consigne et boutons − / +. `tap_action` : `history` (pop-up), `more-info`, `navigate` (`navigation_path`), `none`. Couleurs personnalisées : `color_comfort`, `color_cool`, `color_warm`, `color_humidity`, `color_dry`, `color_alert`. Voir [room-climate.md](cards/room-climate.md).

**Déshumidificateur** (`custom:appliance-dehumidifier-card`) : déshumidificateur mobile avec grille de sortie en haut, grille avant et bac à eau transparent. En marche, l'air humide est aspiré sur les côtés, les gouttelettes sont captées derrière la grille, le ventilateur tourne, l'air sec sort par le haut et des gouttes tombent dans le bac. L'écran affiche l'humidité, `FULL` quand le bac est plein, `OFF` à l'arrêt. Fonctionne avec une entité `humidifier` (état, `action`, humidité, consigne, mode ; le bouton marche/arrêt la pilote s'il n'y a pas de `switch`) et/ou une prise (en marche au-dessus de 50 W, « Consigne atteinte » entre 1 W et le seuil). Options : `humidity`, `target_humidity`, `temperature`, `tank_full` (bac dessiné plein, alerte « Videz le bac »), `fan_speed` (texte bas / moyen / haut, pourcentage ou entité `fan` : règle la vitesse de l'animation), `mode`, `humidity_max` (alerte humidité). Voir [dehumidifier.md](cards/dehumidifier.md).

**Aspirateur laveur** (`custom:appliance-wet-vacuum-card`) : balai laveur sans fil (manche, écran rond, réservoir d'eau propre à l'arrière, bac d'eau sale transparent, rouleau), sur sa base ou en train de laver. **Lavage** : la base disparaît, l'appareil va et vient, le rouleau tourne et mouille le sol. **Auto-nettoyage** : rouleau rapide, eau et bulles dans le bac de la base. **Séchage** : air chaud autour de la tête. **En charge / Chargée** : éclair et anneau verts. L'écran affiche la batterie, `FULL` quand le bac sale est plein. Deux sources, ensemble ou séparément : une entité de statut (`vacuum` ou capteur dont l'état contient `cleaning`, `self_cleaning`, `drying`, `charging`… ou leurs équivalents français), ou une prise sur la base (`power` : au-dessus de `selfclean_threshold`, 60 W = auto-nettoyage, au-dessus de 3 W = charge ; le séchage n'est visible qu'avec une entité de statut). Options : `battery_level`, `clean_water` et `dirty_water` (% ou capteur binaire ; alertes « Réservoir d'eau propre vide », « Bac d'eau sale plein »), `mode`, `battery_low` (alerte « Batterie faible », 20 %). Voir [wet-vacuum.md](cards/wet-vacuum.md).

**Chargeur de batterie d'outils** (`custom:appliance-tool-charger-card`) : batterie d'outil sans fil (perceuse, visseuse…) posée sur son chargeur, avec le cordon, les voyants du socle et la jauge 4 LED de la batterie. En charge (au-dessus de `threshold`, 10 W) : le voyant clignote en vert, l'énergie circule dans le cordon, un halo et un éclair pulsent et la jauge se remplit LED par LED. Chargée (entre `standby_threshold`, 1 W, et `threshold`, la plupart des chargeurs consomment un peu pour maintenir la batterie) : les quatre LED restent allumées. En dessous : veille (socle vide). `battery_level` (%) en option : la jauge affiche le vrai niveau (25 % par LED, la suivante clignote), avec barre de progression et pastille Batterie ; la batterie est considérée chargée à partir de `full_level` (100 %).

**Réfrigérateur : quatre modèles** avec `style` (aussi dans l'éditeur visuel) : `top` (congélateur en haut, par défaut), `bottom` (combiné : frigo en haut, deux tiroirs de congélation en bas), `french` (deux portes en haut, deux tiroirs en bas), `american` (side-by-side : congélateur à gauche avec distributeur de glaçons et d'eau qui s'éclaire et goutte pendant le froid, frigo à droite). `door` ouvre la ou les portes du frigo, `freezer_door` ouvre la porte du congélateur ou sort le tiroir du haut.

**Cave à vin bi-zone** : ajoute `zone2_temperature` (zone basse, vins blancs) pour avoir deux afficheurs, une séparation, une zone basse plus froide et deux pastilles Zone haute / Zone basse. `max_temperature_2` règle l'alerte de la zone basse (par défaut `max_temperature`).

**Zone flex du frigo** : `flex_temperature` (capteur) ajoute une tuile « Zone flex » pour le 3e compartiment à température réglable, et un petit écran sur la porte basse droite (`style: four_door`) ou le tiroir du haut (`style: french`) ; `flex_max_temperature` déclenche l'alerte « Trop chaud ».

**Taille des cartes** : dans un tableau de bord en sections, toutes les cartes se redimensionnent à la souris, en largeur (dès 3 colonnes) et en hauteur. `illustration_size` (en %, 30 à 300, champ « Taille de l'illustration » de l'éditeur) agrandit ou réduit le dessin, sur toutes les cartes et dans tous les types de tableau de bord. `transparent: true` (« Fond transparent » dans l'éditeur) retire le fond, l'ombre et la bordure de la carte, pour laisser voir le fond d'écran du tableau de bord.

**°C ou °F** : les cartes aquarium, batterie, chaudières à granulés, gaz et diesel, jacuzzi, pompes, robot de piscine, sauna, plancher chauffant et PAC eau/eau affichent les températures dans l'unité de Home Assistant, ou dans celle forcée par `temperature_unit: C|F` (« Unité de température » dans l'éditeur). Chaque capteur est converti depuis sa propre unité. Les seuils de température se saisissent dans l'unité affichée ; les valeurs par défaut (en °C dans cette page) sont converties, par exemple 40 °C → 104 °F.

**Plusieurs appareils du même type** : chaque carte est indépendante (ses propres entités, son état, ses minuteries). Deux lave-linge ou plusieurs frigos peuvent cohabiter, il suffit de donner à chaque carte ses entités (et un `name`).

**Consommation du jour** : avec un compteur d'énergie cumulé (la plupart des prises connectées), `energy_period: day` (ou `week`, `month`) affiche ce qui a été consommé depuis minuit (depuis lundi, depuis le 1er) au lieu du compteur total. En glissant : `24h`, `7d` ou `30d` affichent les 24 dernières heures, les 7 ou les 30 derniers jours. Home Assistant le calcule à partir des statistiques longue durée, comme le tableau de bord Énergie : plus besoin de créer un Utility Meter par appareil. Il faut un capteur avec statistiques (`state_class: total_increasing`), sinon la carte affiche le compteur.

```yaml
type: custom:appliance-washer-card
power: sensor.prise_lave_linge_puissance
energy: sensor.prise_lave_linge_energie
energy_period: day
```

**Dernier cycle** (lave-linge, sèche-linge, lave-vaisselle) : `last_cycle: true` affiche entre deux cycles les tuiles du **dernier cycle** : heure de début → fin (avec « hier » ou la date si ce n'était pas aujourd'hui), durée, conso et, avec `price_per_kwh`, son coût. La carte les calcule à partir de l'historique de `power` (4 derniers jours) : pas de helper, d'automatisation ni de capteur template. Un creux sous `threshold` plus court que `cycle_gap` (**15 min** par défaut) reste dans le même cycle (trempage, séchage). La conso est l'écart du compteur `energy` sur le cycle, sinon l'intégrale de la puissance. `price_per_kwh` accepte un nombre ou une entité de tarif ; le coût est dans la devise de Home Assistant.

**Temps restant et progression estimés** (sans capteur) : `estimate: true` estime pendant le cycle le temps restant et la progression à partir de l'historique de `power` (10 derniers jours) : la durée de référence est la **médiane des 7 derniers cycles**. La carte affiche « ≈ 1 h 30 », « Fin estimée à 12:19 » et la barre de progression ; au-delà de la durée de référence, « Bientôt fini » (barre à 99 %). Idéal si tu utilises surtout le même programme. Un capteur `remaining` ou `progress` reste prioritaire. Il faut au moins un cycle complet dans l'historique.

**kWh ou €** : `display: energy` n'affiche que les kWh (pas de coût du cycle) ; `display: cost` n'affiche que les coûts : la conso du cycle disparaît et, avec `energy_period`, la tuile de la période devient son coût (« Coût du jour », « Coût sur 7 jours »…) (conso × `price_per_kwh`). Sans prix valide, les kWh restent affichés. Par défaut, les deux.

```yaml
type: custom:appliance-dishwasher-card
power: sensor.prise_lave_vaisselle_puissance
energy: sensor.prise_lave_vaisselle_energie
last_cycle: true
price_per_kwh: 0.2516
```

**Libellés perso des tuiles** : l'option `labels` renomme les tuiles sous le dessin, dans la langue de ton choix. Tu donnes la clé de la tuile et ton texte ; les tuiles non listées gardent la traduction. Le champ **Libellés perso des tuiles** de l'éditeur visuel prend les mêmes lignes `clé: texte`. La liste des clés par carte est dans [configuration.md](configuration.md#custom-tile-labels).

```yaml
type: custom:appliance-sauna-card
entity: switch.sauna
labels:
  temp: Chaleur
  power: Conso
  energy: Total
```

**Carte générique** (`custom:appliance-generic-card`) : pour tout appareil sans carte dédiée (enceinte, lampe, pompe…), renseigne ta propre image dans `image` (`/local/mon-appareil.png` pour un fichier de `config/www/`, ou une URL `https://`). La carte garde le statut (en cours / inactif / éteint), la puissance, l'énergie, le coût et le bouton ; l'image est atténuée quand l'appareil est éteint et brille doucement en marche. **Plusieurs images selon l'état** : `images` est une liste d'entrées `image` avec des conditions ; la carte affiche la dernière entrée dont toutes les conditions sont vraies (une entrée sans condition sert d'image par défaut, à mettre en premier). `above` / `below` comparent la puissance en W (ou la valeur de l'`entity` de l'entrée), `state` l'état de l'entité de la carte (ou de l'`entity` de l'entrée).

```yaml
type: custom:appliance-generic-card
name: VMC double flux
power: sensor.vmc_puissance
images:
  - image: /local/vmc-arret.png        # par défaut
  - above: 20
    image: /local/vmc-vitesse1.png     # au-dessus de 20 W
  - above: 60
    image: /local/vmc-vitesse2.png     # au-dessus de 60 W
```


**Sèche-serviettes, baie informatique, PC fixe, PC portable, cave à vin** : cinq cartes pilotées par une prise connectée (`power`). `custom:appliance-towel-dryer-card` : au-dessus de 50 W, les barres rougeoient, la chaleur monte, les serviettes se balancent et fument ; prise allumée sous le seuil : « Consigne atteinte ». `custom:appliance-server-rack-card` (homelab) : au-dessus de 30 W, les LED clignotent, les ventilateurs tournent, les baies de disques s'allument en bleu et les données circulent dans les câbles ; la vitesse suit la charge (`max_power`, 300 W par défaut) et l'onduleur affiche la puissance. `custom:appliance-desktop-pc-card` : au-dessus de 40 W, l'écran s'allume (code qui s'écrit, graphique, curseur) et les ventilateurs RGB tournent ; entre 0,5 W et le seuil : veille (voyant orange). `custom:appliance-laptop-card` : au-dessus de 15 W, l'écran affiche un tableau de bord animé et le clavier est rétroéclairé ; en dessous : veille. `custom:appliance-wine-cooler-card` : cave vitrée ; quand le compresseur tourne (au-dessus de 15 W), l'intérieur s'éclaire, l'air froid circule entre les bouteilles et la condensation coule ; la porte s'ouvre avec un capteur `door` ; alerte au-dessus de `max_temperature` (18 °C).

**Aquarium, Linky, batterie, borne de recharge, robots, chaudière à granulés** : sept cartes avec leurs propres options (`entity_…`, voir le tableau en anglais) et l'éditeur visuel. Chaque tuile se masque avec son option `show_…`. `custom:appliance-aquarium-card` : poissons qui nagent, bulles et queues plus rapides selon la puissance, eau qui change de couleur selon la température (alerte hors plage), éclairage jour/nuit. `custom:appliance-linky-card` : compteur vert anis avec écran LCD qui défile (puissance, index HP/HC, période en cours, coût — les boutons changent de page), jauge par rapport à la puissance souscrite (alerte au-delà de 95 %), voyant conso qui clignote plus vite quand ça consomme ; en triphasé, avec `entity_power_l1`…`l3` (`SINSTS1`…`3`), chaque phase est comparée à 1/3 de la puissance souscrite, avec une barre par phase ; `phase_gauge` choisit la jauge : `needles` (par défaut) une aiguille de couleur par phase, `cycle` L1 → L2 → L3 toutes les 3 s, `max` la phase la plus chargée ; l'alerte suit toujours la phase la plus chargée ; `entity_active_power` (capteur en W, par ex. le helper « Dérivée » sur la somme des index) affiche la consommation réelle sous la jauge et sur l'écran ; `indexes` (liste d'`entity` + `name`) remplace HP/HC par autant de pages que d'index (les 6 index Tempo, semaine/week-end…), en kWh même si le capteur est en Wh ; `entity_injection` (`EAIT`) et `entity_power_injection` (`SINSTI`) ajoutent l'index et la puissance injectés, avec un voyant « prod » allumé pendant l'injection. `custom:appliance-battery-card` : trois modules reliés par des câbles orange, sans fond ; le niveau monte dans les modules, l'énergie circule dans un sens en charge et dans l'autre en décharge, avec le temps restant avant plein ou vide. `custom:appliance-ev-charger-card` : wallbox murale et voiture de profil ; voyant selon le statut, énergie qui circule dans le câble, jauge de batterie sur la portière, durée et coût de la session. `custom:appliance-robot-vacuum-solo-card` et `custom:appliance-robot-mower-solo-card` : le robot seul, sans fond ; brosses, lidar et anneau de batterie pour l'aspirateur, roues, lame, herbe projetée et pluie pour la tondeuse, avec les boutons **Démarrer / Pause / Base**. `layout: compact` donne aux deux robots le même format que les cartes électroménager (vignette à gauche, nom et point d'état, tuiles, boutons dessous) ; `image` remplace le dessin par ta propre photo (`/local/mon-robot.png`). `custom:appliance-pellet-boiler-card` : chaudière à granulés sans fond, avec trémie, hublot de niveau et vis sans fin ; à l'allumage la résistance rougit, en chauffe la flamme danse, les granulés montent dans la vis et l'eau circule dans les tuyaux départ/retour qui rougissent avec la température ; alerte « Granulés bas » sous `pellet_alert` (15 %).

**PAC eau/eau (géothermie, nappe)** : `custom:appliance-water-heat-pump-card`, sans ventilateur ni flux d'air, contrairement à l'unité extérieure de la carte *Pompe à chaleur*. Le compresseur vibre entre l'évaporateur (boucle de captage qui descend dans le sol, à gauche) et le condenseur (boucle de chauffage vers un radiateur, à droite). Le départ et le retour passent du bleu (20 °C) au rouge (55 °C), l'eau circule quand le débit est non nul. Le COP vient de `entity_cop`, ou est calculé avec un compteur de chaleur (`entity_heat_power`) et un compteur électrique (`entity_power`). Températures de captage facultatives. Options : voir le tableau en anglais.

**Chauffage diesel** : `custom:appliance-diesel-heater-card`, poêle à gazole en volume (plateau fonte en perspective, conduit inox). La chambre de combustion montre la couronne bleue du brûleur à mèche et des flammes en trois couches ; le hublot de niveau de gazole passe au rouge sous `fuel_alert` (15 %). États : arrêt, veille, allumage (bougie rougeoyante, petites flammes), chauffe, purge (le souffleur tourne vite après l'extinction, braises qui s'éteignent) et défaut. Sans entité d'état, il se déduit de la puissance (60 W allumage, 15 W chauffe). Options : voir le tableau en anglais.

**Jacuzzi** : `custom:appliance-jacuzzi-card`, spa vu en plongée avec l'épaisseur d'acrylique au rebord, l'eau en dégradé de profondeur, la banquette immergée, les buses chromées, les appuie-têtes, le bec de cascade et la trappe du spa pack. États : arrêt, veille, filtration, chauffe, jets, défaut. Bulles, jets et cascade accélèrent avec la puissance, la vapeur monte en chauffe, l'éclairage LED suit `entity_light` (couleur `rgb_color` si disponible). Alertes pH hors de `ph_min`–`ph_max` et eau au-dessus de `temp_max` (40 °C). Sans entité d'état, il se déduit de la puissance (30 W filtration, 700 W jets, 1800 W chauffe). Options : voir le tableau en anglais.

**Barrière, portail coulissant, portail battant, porte de garage** : `custom:appliance-barrier-card`, `custom:appliance-sliding-gate-card`, `custom:appliance-swing-gate-card`, `custom:appliance-garage-door-card`, sans fond. Barrière : armoire jaune, bras rayé rouge et blanc qui se lève à 90° puis redescend, LED du bras rouges fermé et vertes ouvert. Portail coulissant : le vantail à barreaux glisse sur son rail derrière le pilier, les roues tournent. Portail battant : un ou deux vantaux (`leaves`) dessinés en 3D qui pivotent **vers l'intérieur** de la propriété. Porte de garage : la porte sectionnelle remonte sous le linteau et dévoile le garage éclairé et la voiture. États : ouvert, fermé, ouverture, fermeture, entrouvert (`current_position` entre 1 et 99), indisponible. Le gyrophare orange clignote pendant le mouvement ou dès que le moteur dépasse `moving_threshold` (15 W). Le mouvement dure le temps de course réel (`travel_time`) ; avec une cover qui fournit `current_position`, le dessin suit la position. Boutons **Ouvrir / Stop / Fermer** pour une `cover`, ou un bouton **Commande** pour une entité d'impulsion (`entity_control` : `button`, `script`, `switch`…). `entity` accepte aussi un `binary_sensor` / `input_boolean` (on = ouvert, `invert: true` pour l'inverse). Tuiles : position, puissance du moteur, énergie, coût et dernier mouvement. Options : voir [access.md](cards/access.md).

```yaml
type: custom:appliance-garage-door-card
name: Garage
entity: cover.porte_garage
entity_power: sensor.prise_garage_puissance
entity_energy: sensor.prise_garage_energie
price_per_kwh: 0.2516
travel_time: 14
```

**Sauna** : `custom:appliance-sauna-card`, cabine en lames de bois vue de face avec porte vitrée teintée (banquettes, poêle et pierres visibles), thermomètre mural, panneau de commande et conduit de ventilation. États : arrêt, chauffe, prêt (à `ready_margin` = 3 °C de la consigne), refroidissement (éteint mais au-dessus de 40 °C) et défaut. La lueur du poêle et les braises suivent la température, les ondes de chaleur montent au-dessus des pierres, la vapeur sort du conduit, le thermomètre se remplit ; alerte au-dessus de `temp_max` (110 °C). Avec une entité `climate`, la température et la consigne viennent de ses attributs et les boutons **− / Allumer-Éteindre / +** pilotent le thermostat. Tuiles : température, consigne, humidité, puissance du poêle, énergie, coût. Options : voir [sauna.md](cards/sauna.md).

```yaml
type: custom:appliance-sauna-card
entity: climate.sauna
entity_humidity: sensor.sauna_humidite
entity_power: sensor.poele_sauna_puissance
entity_energy: sensor.poele_sauna_energie
price_per_kwh: 0.2516
```

**Pompe à eau** : `custom:appliance-water-pump-card`, style sobre pour une pompe d'arrosage, de puits, de récupération d'eau de pluie ou de piscine. Cuve source (son niveau suit `entity_level` en %), volute avec roue à aubes qui tourne, moteur à ailettes, tuyau de refoulement qui se déverse dans un bassin. L'eau circule dans les tuyaux, des vagues bougent dans la cuve et le bassin, des ronds se forment sous le jet. La vitesse de l'animation suit le débit (`entity_flow` / `max_flow`), sinon la puissance (`entity_power` / `max_power`). Le capteur de débit peut être en L/min, m³/h, L/h, L/s ou gal/min : il est converti en L/min pour l'animation et les seuils (`max_flow`, `no_flow_threshold` en L/min ; 12 m³/h = 200 L/min), la tuile garde l'unité du capteur.

**Pompe industrielle** : `custom:appliance-industrial-pump-card`, groupe motopompe robuste sur châssis acier : pompe à engrenage interne à brides boulonnées, carter d'accouplement rayé, moteur à ailettes avec plaque affichant la puissance, voyants **RUN / ALERTE / DÉFAUT** et manomètre dont l'aiguille suit `entity_pressure`. En marche, le tuyau de refoulement gonfle à chaque pulsation, des ondes de pression partent de la bride, l'aiguille tremble et le groupe vibre.

Pour les deux pompes : états arrêt, en marche, alerte (en marche avec une alerte), défaut (`entity_fault` à `on`) et indisponible. Alertes : pas de débit en marche (marche à sec), surpression (`pressure_max`), moteur trop chaud (`temp_max`), niveau bas (`level_min`). Bouton Démarrer/Arrêter avec une entité `switch`, `input_boolean` ou `fan`. Couleur du fluide réglable (`fluid_color`). Options : voir [pumps.md](cards/pumps.md).

```yaml
type: custom:appliance-water-pump-card
name: Pompe d'arrosage
entity: switch.pompe_arrosage
entity_power: sensor.pompe_arrosage_puissance
entity_flow: sensor.pompe_arrosage_debit
entity_pressure: sensor.pompe_arrosage_pression
entity_level: sensor.cuve_eau_pluie_niveau
entity_energy: sensor.pompe_arrosage_energie
price_per_kwh: 0.2516
```

**Robot de piscine** : `custom:appliance-pool-robot-card`, bassin vu en coupe (margelle, carrelage, eau avec vagues et reflets au fond) et robot à chenilles avec son câble flottant. En nettoyage, le robot fait des allers-retours sur le fond et fait demi-tour à chaque paroi, chenilles et brosse avant tournent, les débris sont aspirés, des bulles remontent. La surface de l'eau suit `entity_water_level` avec un repère rouge **min** sur la paroi, et la fenêtre du filtre sur la coque se remplit selon `entity_filter` (rouge au-delà de `filter_alert`, 80 %). États : nettoyage, pause, remontée, au repos, erreur, indisponible. Avec une entité `vacuum`, boutons **Démarrer / Pause / Remonter** ; avec un `switch`, un bouton Marche/Arrêt. Les deux se combinent : `entity` = le vacuum, `entity_switch` = la prise qui alimente le robot (bouton Marche/Arrêt en plus ; prise coupée = robot au repos, même si le vacuum est indisponible). Tuiles : état, filtre, niveau d'eau, température de l'eau, temps restant, batterie, mode, puissance, énergie. Options : voir [pool-robot.md](cards/pool-robot.md).

```yaml
type: custom:appliance-pool-robot-card
entity: vacuum.robot_piscine
entity_switch: switch.prise_robot_piscine
entity_power: sensor.prise_robot_piscine_puissance
entity_filter: sensor.robot_piscine_filtre
entity_water_level: sensor.piscine_niveau_eau
entity_water_temp: sensor.piscine_temperature
entity_time: sensor.robot_piscine_temps_restant
entity_mode: select.robot_piscine_mode
```

**Pompe de relevage** : `custom:appliance-sump-pump-card`, fosse enterrée vue en coupe. L'eau arrive goutte à goutte par le drain, le niveau suit `entity_level` (%) avec un repère rouge **max** à `level_max` (80 %), le flotteur flotte à la surface, la pompe immergée vibre et refoule l'eau vers l'égout. Au-dessus de `level_max` ou quand le flotteur d'alarme `entity_float` est à `on`, la carte affiche **Niveau d'eau trop haut** et un gyrophare clignote au sol ; si la pompe est arrêtée à ce moment-là, l'état passe à **Niveau haut**. Sans capteur de niveau, la fosse se vide pendant que la pompe tourne. `entity_starts` affiche le nombre de démarrages (compteur `history_stats` par exemple). Options : voir [pumps.md](cards/pumps.md).

```yaml
type: custom:appliance-sump-pump-card
entity: switch.pompe_relevage
entity_power: sensor.pompe_relevage_puissance
entity_level: sensor.fosse_niveau
entity_float: binary_sensor.fosse_niveau_haut
entity_starts: sensor.pompe_relevage_demarrages_jour
```

**Onduleur** : `custom:appliance-ups-card`, prise murale → onduleur tour → box internet et NAS protégés. Sur secteur, le courant circule de la prise vers les appareils ; sur batterie, la prise s'éteint (éclair barré), l'écran passe à l'orange, l'onduleur bipe et le courant part de la batterie. La batterie visible sur le flanc suit `entity_charge`, la barre de 5 LED suit `entity_load`. L'état vient de l'intégration **NUT** : codes bruts de `sensor.<onduleur>_status_data` (`OL`, `OB`, `LB`, `CHRG`, `RB`, `OVER`, `OFF`…) ou texte de `sensor.<onduleur>_status`, sinon un `binary_sensor` (on = secteur présent) ou la tension d'entrée. Alertes : batterie faible, surcharge, batterie à remplacer. Tuiles : batterie, autonomie, charge, puissance, tensions d'entrée et de sortie, énergie. Options : voir [ups.md](cards/ups.md).

```yaml
type: custom:appliance-ups-card
entity: sensor.onduleur_status_data
entity_charge: sensor.onduleur_battery_charge
entity_runtime: sensor.onduleur_battery_runtime
entity_load: sensor.onduleur_load
entity_input_voltage: sensor.onduleur_input_voltage
```

**Plancher chauffant** : `custom:appliance-underfloor-heating-card`, pièce en coupe avec la dalle en perspective. Le carrelage est retiré à gauche pour montrer le serpentin : circuit d'eau avec collecteur départ / retour au mur, ou câble chauffant (`heating_type: electric`). En chauffe, l'eau ou le courant circule, la dalle rougeoit selon la température du sol (de 20 °C à `floor_max`) et des ondes de chaleur montent du sol. États : arrêt, chauffe, en veille (consigne atteinte), défaut. Avec une entité `climate`, `hvac_action` décide entre chauffe et veille, et les boutons **− / Allumer-Éteindre / +** pilotent le thermostat. Alertes : sol trop chaud (au-dessus de `floor_max`, 29 °C) et eau trop chaude (au-dessus de `water_max`, 45 °C). Tuiles : pièce, consigne, sol, départ d'eau, puissance, énergie, coût. Options : voir [underfloor-heating.md](cards/underfloor-heating.md).

```yaml
type: custom:appliance-underfloor-heating-card
name: Plancher séjour
entity: climate.plancher_sejour
entity_floor_temp: sensor.sejour_temperature_sol
entity_water_temp: sensor.plancher_temperature_depart
price_per_kwh: 0.2516
```

**Éclairage** : 10 luminaires animés, `custom:appliance-light-bulb-card` (ampoule), `-color-bulb-` (ampoule couleur), `-filament-bulb-` (ampoule à filament), `-pendant-light-` (suspension), `-pendant-cluster-` (suspensions en grappe), `-desk-lamp-` (lampe de bureau), `-floor-lamp-` (lampadaire), `-chandelier-` (lustre), `-garden-spotlight-` (spot de jardin), `-christmas-tree-card` (sapin de Noël). Éteints, on voit le luminaire nu ; allumés, ils rayonnent dans la couleur de la lumière, à la luminosité de l'ampoule : verre qui se remplit de lumière, filament incandescent, cône de lumière, globes qui se balancent, bougies qui vacillent, cristaux qui scintillent, faisceau du spot, guirlande qui clignote. **Couleur** : par défaut celle de l'ampoule dans Home Assistant (RVB ou température de blanc) ; décoche `follow_light_color` pour utiliser la couleur choisie dans l'éditeur (`color`). L'ampoule couleur a un bouton **Couleur** et un défilement des teintes (`color_cycle`), le sapin une guirlande multicolore ou d'une seule couleur (`multicolor: false`). Boutons Allumer / Éteindre, tuiles luminosité, puissance, énergie. Options : voir [lights.md](cards/lights.md).

```yaml
type: custom:appliance-chandelier-card
entity: light.salle_a_manger
follow_light_color: false
color: [255, 190, 110]
```

**Volets et stores** : 3 cartes pilotées par une entité `cover`, `custom:appliance-roller-shutter-card` (volet roulant), `-venetian-blind-` (store vénitien), `-swing-shutter-card` (volets battants). La vue par la fenêtre suit le soleil : ciel de jour avec le soleil, ou ciel de nuit avec la lune et les étoiles quand `sun.sun` est sous l'horizon (`sun_entity` pour une autre entité). Volet roulant : les lames alu remontent dans le coffre selon `current_position`, avec des jours de lumière entre les lames et un faisceau dans la pièce quand il est ouvert. Store vénitien : les lamelles se tassent sous le caisson et pivotent selon `current_tilt_position`, avec un curseur **Inclinaison**. Volets battants : deux vantaux à persiennes qui pivotent en 3D et se rabattent contre le mur. Pendant le mouvement, le voyant du coffre clignote et une flèche suit le volet ; `travel_time` (s) règle la vitesse du dessin sur celle du moteur. Boutons Ouvrir / Stop / Fermer, curseur de position, tuiles position, inclinaison, moteur et dernier changement ; `color` change la couleur des lames ou des vantaux. `invert: true` (« Inverser la position » dans l'éditeur) corrige une cover qui remonte sa position à l'envers (0 = ouvert, 100 = fermé), fréquent avec Tuya : dessin, badge, tuiles et curseur sont inversés, les boutons Ouvrir / Fermer ne changent pas. Options : voir [shutters.md](cards/shutters.md).

**Pergola bioclimatique** (`custom:appliance-pergola-card`) : pergola alu anthracite devant une maison contemporaine (bardage bois, baie vitrée), terrasse en pierre, canapé d'angle et piscine au premier plan. Mêmes états, boutons et options que les volets. Les lames pivotent selon `current_tilt_position` (sinon `current_position`) : rayons de soleil et ombres rayées sur la terrasse, badge « Ouverte à 40 % » / « Fermeture… 30 % », tuile **Lames**. En option : `entity_rain` (ciel gris, pluie, eau qui descend dans le poteau, tuile Pluie), `entity_light` (bouton **LED**, bandeau et halo sur la terrasse la nuit), `entity_wind` (tuile Vent).

```yaml
type: custom:appliance-roller-shutter-card
name: Volet séjour
entity: cover.volet_sejour
entity_power: sensor.volet_sejour_puissance
travel_time: 20
```

**Développement et traductions** : `dist/` est généré, on modifie `src/` puis on lance `node build.js` (sans dépendance). Le code est découpé en petits fichiers : `src/core/` pour les 28 cartes de base (un dessin par appareil dans `svg/`, un fichier CSS par appareil dans `style/`), `src/cards/` pour les cartes autonomes, et les textes dans un fichier par langue (`src/i18n/en.json`, `src/i18n/fr.json`, `src/i18n/de.json`, `src/i18n/nb.json`, `src/i18n/nl.json`, `src/i18n/ro.json`). Voir *Development and translations* plus haut.
