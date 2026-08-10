# 🎨 Guida di Stile e Design System - QuizApp

Questo documento descrive le linee guida di design, la palette colori, la tipografia, i componenti UI e le convenzioni adottate in **QuizApp**.

---

## 🛠️ Stack Tecnologico di Stile

- **CSS Framework**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Component Plugin**: [DaisyUI 5](https://daisyui.com/)
- **Bundler**: [Vite](https://vitejs.dev/) (`@tailwindcss/vite`)
- **Font**: Google Fonts - [Roboto](https://fonts.google.com/specimen/Roboto) (pesi: 400, 600, 700, 800, 900)

---

## 🎨 Palette Colori

La palette è costruita su una gradazione moderna ed elegante basata sul viola, con accenti vivaci per feedback visivo immediato.

| Token / Variabile | Valore Hex | Descrizione / Utilizzo |
|-------------------|------------|------------------------|
| **Background App** | `#fbf3ff` | Sfondo generale della pagina |
| **Surface / Card** | `#FAFAFA` | Sfondo dei pannelli, card e contenitori principali |
| **Primary (Brand)** | `#4F00D0` | Colore principale di brand, accenti, titoli e bordi attivi |
| **Primary Dark** | `#37274d` | Testo principale, titoli ad alto contrasto |
| **Secondary** | `#eedcff` | Sfondo chiaro per pulsanti secondari, badge e selettori |
| **Secondary Light** | `#f3eef8` | Sfondo di default dei pulsanti di risposta |
| **Gradient CTA** | `from-[#6833e8] to-[#a285fc]` | Gradiente per pulsanti di azione primaria (Start, Next, Resume) |

### Colori di Stato e Feedback

| Stato | Background | Bordo | Testo |
|-------|------------|-------|-------|
| **Risposta Corretta** | `#dcfce7` (verde chiaro) | `#22c55e` (verde smeraldo) | `#15803d` (verde scuro) |
| **Risposta Errata** | `#feedf0` / `#fee2e2` (rosso chiaro) | `#ef4444` (rosso) | `#b91c1c` / `#b4113d` (rosso scuro) |
| **Elemento Selezionato** | - | `#4F00D0` | - |
| **50/50 Eliminato** | - | - | `line-through opacity-30 cursor-not-allowed` |

---

## 📐 Tipografia

- **Font Family**: `"Roboto", sans-serif`
- **Gerarchia**:
  - **Titoli Principali (`h1`)**: `text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#4F00D0]`
  - **Titoli Sezione (`h2`)**: `text-xl sm:text-2xl md:text-3xl font-extrabold text-primary`
  - **Testo Domande**: `text-xl sm:text-2xl md:text-3xl font-extrabold text-primary leading-snug`
  - **Opzioni di Risposta**: `text-base sm:text-lg font-bold`
  - **Didascalie & Badge**: `text-xs sm:text-sm font-bold tracking-wider`

---

## 🧩 Componenti Interattivi

### 1. Bottom-Sheet Modals (Mobile First)
Tutte le modali utilizzano le classi DaisyUI + Tailwind:
- `modal modal-bottom sm:modal-middle`: compaiono come **foglio dal basso (bottom sheet)** su smartphone e come **dialog centrato** su desktop.
- `modal-box w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl`: bordi superiori arrotondati su mobile e completi su desktop.
- **Modali Implementate**:
  - **Category Picker** (`#categoryModal`): griglia a 2 colonne con tutte le categorie OpenTDB.
  - **Difficulty Picker** (`#difficultyModal`): elenco schede con punteggi per livello (Easy 1pt, Medium 2pt, Hard 3pt, Mixed).
  - **Avatar Picker** (`#pfpModal`): griglia avatar interattivi con effetto hover/scale.
  - **Match Details** (`#gameInfoModal`): statistiche dettagliate della partita selezionata.
  - **Leaderboard** (`#scoreboardModal`): cronologia delle partite giocate.
  - **Pause Menu** (`#pauseMenu`): overlay con sfocatura sfondo (`backdrop-blur-sm`).

### 2. Pulsanti e Micro-interazioni
- **Feedback al Tocco**: `active:scale-98` e `hover:scale-102 transition-all duration-200`.
- **Card Risposte Multi-Scelta**:
  - Badge lettera (`A`, `B`, `C`, `D`) posizionato a sinistra con cambio colore su hover (`group-hover:bg-[#4F00D0] group-hover:text-white`).
  - Layout a colonna singola su smartphone e a **2 colonne (`md:grid-cols-2`)** su tablet/desktop.

---

## 📱 Breakpoint Responsivi

- **Mobile (< 640px)**:
  - Layout compatto con testata essenziale, pulsante GitHub e Classifica accessibili.
  - Dashboard verticale di gioco con avatar, indicatore `Question X / 15`, `Score: X pts`, e tasto `50/50`.
- **Tablet (`sm:` e `md:`, 640px - 1024px)**:
  - Griglia opzioni a 2 colonne, pulsanti con padding generoso.
- **Desktop (`lg:`, `xl:`, 1024px+)**:
  - Homepage con layout a 2 pannelli (pannello classifica laterale fisso + arena centrale).
  - Gamepage con arena estesa fino a `max-w-4xl`.
