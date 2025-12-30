# Portfolio di Biagio (Undertale Edition) 🎮

> Un portfolio interattivo ispirato a Undertale, dove puoi esplorare le informazioni come in un gioco RPG 2D.

![Portfolio Preview](./public/assets/sprites/savepoint.gif)

## 🎮 Panoramica

Questo progetto è un portfolio personale reimmaginato come un'esperienza RPG 2D. Costruito con **React** e **TypeScript**, evita volutamente motori di gioco pesanti, optando invece per un'implementazione Canvas personalizzata e leggera per gestire movimento e interazioni, mentre usa React per gli overlay UI.

### 🎬 Demo

![Frisk Running](./public/assets/sprites/frisk/corsa.gif)  
*Frisk in movimento*

![Save Point](./public/assets/sprites/savepoint.gif)  
*Save Point - Sistema di salvataggio*

## ✨ Funzionalità

### 🎯 Schermata Iniziale
- Menu autentico in stile Undertale con navigazione da tastiera
- **Selezione lingua**: Italiano, English, Español
- Effetti sonori e animazioni fluide
- Design pixel-art fedele all'estetica originale

### 🗺️ Modalità Esplorazione
- **Canvas HTML5** con game loop ottimizzato per prestazioni
- **Sistema di movimento fluido** con scroll automatico che segue il personaggio
- **Due personaggi giocabili**:
  - **Frisk**: Personaggio principale controllabile con animazioni sprite (Idle, camminata/corsa in tutte le direzioni)
  - **Sans**: Personaggio secondario sbloccabile, con animazioni frame-by-frame per ogni direzione
- **Sistema di switch tra personaggi**: Puoi scambiarti con Sans per esplorare il portfolio da una prospettiva diversa
- **Save Point**: Sistema di salvataggio stile Undertale con stella gialla animata

### 📋 Card Interattive
Cinque card informative posizionate strategicamente nel mondo:
- **PROFILE**: Informazioni personali e tecnologie principali (Giallo dorato)
- **EXPERIENCE**: Storia lavorativa e posizioni ricoperte (Cyan morbido)
- **SKILLS**: Competenze tecniche dettagliate (linguaggi, framework, database, tools) - Sky blue
- **PROJECTS**: Portfolio progetti completi con link e descrizioni (Coral morbido)
- **CONTACT**: Informazioni di contatto e social (Mint green)

Ogni card ha un colore distintivo per migliorare la leggibilità e l'organizzazione visiva!

### 💬 Sistema di Dialoghi
- **Dialoghi tipo typewriter**: Testo che appare carattere per carattere
- **Dialoghi con scelte**: Sistema di scelta multipla per interagire con i personaggi
- **Link cliccabili**: Collegamenti ipertestuali nei dialoghi per progetti e risorse
- **Overlay modale**: Finestre di dialogo che pausano il gioco
- **Colori dinamici**: Ogni sezione nei dialoghi ha colori diversi per migliorare la leggibilità:
  - **Skills**: Linguaggi (Cyan), Framework (Coral), Database (Sky blue), Altro (Mint)
  - **Projects**: Ogni progetto ha un colore unico
  - **Experience**: Ogni azienda ha un colore distintivo

### 💾 Sistema Save/Load - "DETERMINATION"
- **Save Point**: Stella gialla animata dove puoi salvare il tuo progresso
- **Salvataggio automatico**: Posizione, personaggio attivo, card visitate, volume audio, lingua
- **Load automatico**: Al riavvio, il gioco riprende esattamente dove l'avevi lasciato
- **Dialoghi stile Undertale**: "* Sei pieno di DETERMINAZIONE. Vuoi salvare?"

### 🎵 Sistema Audio
- **Effetti sonori**: Audio per interazioni e selezioni
- **Musica di sottofondo**: Atmosfera sonora in stile Undertale
- **Gestione audio**: Sistema centralizzato per riproduzione e controllo
- **Salvataggio stato audio**: Il volume viene salvato e ripristinato

### 🎨 Design e Stile
- **Palette colori Undertale**: Giallo dorato (#ffd93d) per elementi attivi, bianco per inattivi
- **Colori personalizzati**: Ogni card e sezione ha colori distintivi per migliorare la leggibilità
- **Font VT323**: Font monospaziato pixel-perfect
- **Rendering pixelato**: Immagini e sprite con rendering crisp per mantenere lo stile retro
- **Animazioni fluide**: Transizioni e animazioni per migliorare l'esperienza utente
- **Multi-lingua**: Supporto completo per Italiano, English e Español

## 🕹️ Controlli

| Tasto | Azione |
| --- | --- |
| **Frecce Direzionali** | Muovi il personaggio (Frisk o Sans) |
| **Z** / **Enter** | Interagisci / Seleziona / Apri card |
| **ESC** | Chiudi dialoghi / Torna indietro |

### Interazioni Speciali
- **Vicino a una card**: Premi **Z** per aprire i dettagli completi
- **Vicino a Sans (come Frisk)**: Premi **Z** per parlare e scambiarti di personaggio
- **Vicino a Frisk (come Sans)**: Premi **Z** per parlare e tornare a Frisk
- **Vicino al Save Point**: Premi **Z** per salvare il tuo progresso
- **M**: Toggle mute/unmute audio

## 🚀 Setup e Installazione

### Prerequisiti
- Node.js (versione 18 o superiore)
- npm o yarn

### Installazione

1. **Clona il repository**:
   ```bash
   git clone <repository-url>
   cd portfolio-undertale
   ```

2. **Installa le dipendenze**:
   ```bash
   npm install
   ```

3. **Avvia il server di sviluppo**:
   ```bash
   npm run dev
   ```
   Il progetto sarà disponibile su `http://localhost:5173`

4. **Build per produzione**:
   ```bash
   npm run build
   ```
   I file ottimizzati saranno nella cartella `dist/`

5. **Preview della build**:
   ```bash
   npm run preview
   ```

## 📂 Struttura del Progetto

```
portfolio-undertale/
├── src/
│   ├── app/
│   │   ├── App.tsx              # Gestore principale dello stato del gioco
│   │   └── GameState.ts         # Tipi TypeScript per gli stati
│   │
│   ├── components/
│   │   ├── StartScreen.tsx      # Menu iniziale UI
│   │   ├── Explore.tsx          # Motore di gioco principale (Canvas)
│   │   ├── DialogOverlay.tsx    # UI dialoghi typewriter
│   │   └── ChoiceDialog.tsx     # UI dialoghi con scelte
│   │
│   ├── data/
│   │   └── portfolioData.ts     # Dati del portfolio (card, contenuti)
│   │
│   ├── utils/
│   │   └── audioManager.ts      # Gestione audio centralizzata
│   │
│   ├── styles/
│   │   └── undertale.css        # Stili globali in stile Undertale
│   │
│   └── main.tsx                 # Entry point React
│
├── public/
│   └── assets/
│       ├── audio/               # File audio (MP3)
│       │   ├── esc.mp3
│       │   ├── sans-parla.mp3
│       │   └── selezione.mp3
│       └── sprites/             # Sprite dei personaggi
│           ├── frisk/          # Sprite Frisk (PNG/GIF)
│           └── sans/           # Sprite Sans (PNG animati)
│
├── dist/                        # Build di produzione
├── index.html                   # HTML principale
├── vite.config.ts              # Configurazione Vite
├── tsconfig.json               # Configurazione TypeScript
└── package.json                # Dipendenze e script
```

## 🛠️ Stack Tecnologico

- **Vite**: Build tool veloce e leggero
- **React 19**: Libreria UI moderna
- **TypeScript**: Tipizzazione statica per logica di gioco robusta
- **Canvas API**: Rendering ottimizzato per performance
- **CSS Vanilla**: Styling pixel-perfect senza dipendenze
- **Font Awesome**: Set minimale di icone
- **localStorage**: Sistema di persistenza per save/load
- **i18n**: Sistema di traduzione multi-lingua

## 🎯 Caratteristiche Tecniche

### Sistema di Rendering
- **Game Loop**: `requestAnimationFrame` per animazioni fluide a 60fps
- **Collision Detection**: Sistema di rilevamento collisioni per interazioni
- **Camera System**: Scroll automatico che segue il personaggio senza scrollbar visibili
- **Sprite Animation**: Animazioni frame-by-frame per Sans, sprite statici per Frisk

### Gestione dello Stato
- **React Hooks**: `useState`, `useEffect`, `useRef` per gestione stato
- **Event System**: Eventi custom per comunicazione tra componenti
- **Ref Pattern**: Uso di ref per accedere a stato dentro closure di event listener

### Ottimizzazioni
- **Throttling**: Scroll throttled per ridurre jitter
- **Image Loading**: Caricamento lazy delle sprite
- **Canvas Clearing**: Pulizia efficiente del canvas ogni frame

## 📝 Personalizzazione

### Modificare i Dati del Portfolio
I dati del portfolio sono in `src/data/portfolioData.ts`. Puoi modificare:
- Contenuti delle card
- Informazioni personali
- Progetti e link
- Testi dei dialoghi

### Aggiungere Nuove Card
1. Aggiungi una nuova entry in `portfolioData.ts`
2. Modifica `calculateCardPositions()` in `Explore.tsx` per posizionare la nuova card
3. Aggiungi gli sprite/icone necessari

### Modificare Personaggi
- Sprite in `public/assets/sprites/`
- Logica di movimento e animazione in `Explore.tsx`
- Dimensioni e velocità modificabili tramite costanti

## 🐛 Troubleshooting

### Problemi Comuni

**Il personaggio non si muove:**
- Verifica che il canvas sia renderizzato correttamente
- Controlla la console per errori JavaScript

**Le sprite non caricano:**
- Verifica che i percorsi in `public/assets/sprites/` siano corretti
- Controlla che le immagini esistano e siano accessibili

**L'audio non funziona:**
- Verifica che i file MP3 siano nella cartella corretta
- Controlla le policy del browser per autoplay audio

## 📄 Licenza

Questo progetto è un portfolio personale. Le sprite e i riferimenti a Undertale sono proprietà di Toby Fox.

## 🙏 Crediti

- **Undertale**: Creato da Toby Fox - fonte di ispirazione per lo stile e l'estetica
- **Font VT323**: Google Fonts
- **Font Awesome**: Icone

---

*Stay Determined.* ❤️
