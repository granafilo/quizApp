# Linee Guida di Stile e Design System (QuizApp)

Questo documento descrive le linee guida di stile, la palette colori, la tipografia, i componenti UI e le micro-animazioni condivise tra la **Homepage** ([index.html](file:///home/granafilo/Scrivania/quizApp/index.html)) e la **Game Page** ([game.html](file:///home/granafilo/Scrivania/quizApp/game.html)).

---

## 1. Stack Tecnologico del Design
* **TailwindCSS**: Configurazione v4 con direttiva `@import "tailwindcss";`.
* **DaisyUI v4**: Integrato come plugin (`@plugin "daisyui";`) con tema chiaro personalizzato.

---

## 2. Palette Colori (Color Palette)

Il design system unificato utilizza tonalità violacee pastello e accese, affiancate da colori semantici ad alto contrasto per il feedback di gioco:

### Colori Principali del Tema (Configurazione DaisyUI)
* **Primary (`--color-primary`)**: `#37274d` (Viola scuro profondo). Utilizzato per intestazioni principali, testi evidenziati e hover dei pulsanti.
* **Secondary (`--color-secondary`)**: `#eedcff` (Lilla pastello chiaro). Utilizzato per lo sfondo di input, select, modali, avatar e pulsanti di risposta.

### Colori di Sfondo
* **Sfondo Generale della Pagina**: `#fbf3ff` (Rosa/viola chiarissimo pastello, applicato al `<main>` con `bg-[#fbf3ff]!`).
* **Sfondo Header e Card**: `#FAFAFA` (Bianco caldo/grigio ultraleggero, applicato all'header e a tutte le card principali).

### Colori Semantici di Feedback e Gioco
* **Viola Elettrico / Brand (`text-[#4F00D0]`)**: Logo "Quiz App", punteggio tracker e accenti visivi.
* **Risposta Corretta**: `bg-emerald-600` (Verde smeraldo brillante con ombra `shadow-emerald-400/40`).
* **Risposta Errata**: `bg-rose-600` (Rosso roseo morbido con ombra `shadow-rose-400/40`).
* **Streak & Combo Multiplier**: Gradiente `from-amber-500 to-orange-500` (Arancione/oro brillante con animazione di rimbalzo).

### Testi Secondari e Neutri
* **Testo Secondario (`text-[#66547d]`)**: Viola desaturato per sottotitoli e didascalie.
* **Grigio Neutro (`text-[#64748b]`)**: Slate-gray per link di navigazione e footer.

### Pulsanti d'Azione Principali (Start Game & Prossima Domanda)
* **Gradiente Lineare**: `bg-gradient-to-br from-[#6833e8] to-[#a285fc]` (da viola elettrico a lilla chiaro).
* **Colore Testo**: `#FAFAFA` (Quasi bianco per massima leggibilità).
* **Stato Hover**: Ombra estesa (`shadow-lg`), ingrandimento (`scale-105`) e transizioni fluide (`transition-all duration-300`).

---

## 3. Tipografia

* **Font Family**: `"Roboto", sans-serif` (importato tramite Google Fonts).
* **Gerarchia dei Testi**:
  * **Titolo Logo (Header)**: `text-3xl lg:text-4xl font-extrabold text-[#4F00D0]`.
  * **Titoli Principali delle Card**: `text-4xl lg:text-5xl font-extrabold text-primary`.
  * **Testo Domanda**: `text-2xl lg:text-3xl font-extrabold text-primary leading-snug`.
  * **Input, Select e Pulsanti Opzione**: `text-xl lg:text-2xl font-bold`.
  * **Punteggi e Statistiche Finali**: `text-4xl lg:text-6xl font-black`.

---

## 4. Componenti Interfaccia Utente (UI)

### Card e Contenitori Principali
* **Card Centrale**: `bg-[#FAFAFA] rounded-2xl shadow-xl p-6 lg:p-10 flex flex-col gap-6`.
* **Scoreboard (Classifica Ultimi Match)**: `hidden xl:flex flex-col shadow-lg py-15 rounded-[25px] gap-5`.

### Selettori e Form (Homepage)
* **Input Nickname**: Sfondo `bg-secondary`, angoli `rounded-[15px]`, testo centrato `text-2xl font-bold`.
* **Griglia Difficoltà e Categoria**: Due select affiancate in griglia responsive (`grid grid-cols-1 md:grid-cols-2 gap-4`).
* **Selettore Avatar (PFP Picker)**: Pulsante circolare `bg-secondary p-7 rounded-full` con badge penna sovrapposto.

### Elementi In-Game (Game Page)
* **Top Bar di Gioco**: Badge giocatore (avatar + nickname), barra di avanzamento a gradiente viola (`h-3 rounded-full`), badge combo e pulsanti 50/50 e pausa.
* **Griglia delle Opzioni**: Disposizione responsive 2x2 (`grid grid-cols-1 md:grid-cols-2 gap-4`) con altezza minima uniforme (`min-h-[64px]`).
* **Modale di Pausa**: `<dialog>` DaisyUI con sfondo scuro sfocato (`backdrop-blur-xs`) e opzioni per riprendere o uscire.
* **Schermata Riepilogo Finale**: Griglia a 4 schede (`grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4`) per Punti Totali, Risposte Corrette, Risposte Errate e Max Combo.

---

## 5. Micro-Animazioni e Feedback Visivo

| Animazione | Proprietà CSS / Keyframe | Effetto |
| :--- | :--- | :--- |
| **Transizione Domanda** | `.question-animate` (`questionSlideFade`) | Entrata fluida verso l'alto con dissolvenza (`opacity + translateY`). |
| **Risposta Corretta** | `.correct-option` (`popCorrect`) | Ingrandimento elastico a gradiente verde smeraldo con bagliore. |
| **Risposta Errata** | `.wrong-option` (`shakeWrong`) | Vibrazione orizzontale rapida con accento rosso roseo. |
| **Opzioni Eliminate (50/50)** | `.eliminated-option` | Trasparenza (`opacity-25`), testo barrato e disattivazione click. |
| **Combo Infuocata** | `#streakBadge` (`animate-bounce`) | Rimbalzo dinamico del badge combo con icona fiamma. |
| **Pausa Blur** | `.game-blur` (`filter: blur(4px)`) | Sfocatura morbida del tabellone di gioco quando la modale è attiva. |

---

## 6. Layout e Responsività (Responsive Design)

* **Approccio Mobile-First**: Layout ad una colonna sui dispositivi mobili con padding comodi (`px-4 py-6`) che si espandono a griglie a due e quattro colonne su schermi larghi (`lg:`, `xl:`).
* **Spaziature Coerenti**: Utilizzo standard di `gap-4`, `gap-5` e `gap-6` per mantenere un ritmo visivo armonioso tra tutti gli elementi interattivi.
