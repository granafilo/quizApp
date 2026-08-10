# Linee Guida di Stile e Design System (Homepage)

Questo documento descrive le linee guida di stile, la palette colori, la tipografia e le regole di layout ricavate direttamente dall'analisi della homepage del progetto ([index.html](file:///home/granafilo/Scrivania/quizApp/index.html) e il foglio di stile [index.css](file:///home/granafilo/Scrivania/quizApp/src/styles/home/index.css)).

---

## 1. Stack Tecnologico del Design
* **TailwindCSS**: Gestito tramite direttiva `@import "tailwindcss";` (configurazione v4).
* **DaisyUI v4**: Integrato come plugin (`@plugin "daisyui";`) con tema chiaro di default.

---

## 2. Palette Colori (Color Palette)

Il design si basa su una combinazione di tonalità violacee (pastello e sature) con accenti neutri e caldi:

### Colori Principali del Tema (Configurazione DaisyUI)
* **Primary (`--color-primary`)**: `#37274d` (Viola scuro profondo). Usato per intestazioni principali, testi evidenziati e hover dei pulsanti di opzione.
* **Secondary (`--color-secondary`)**: `#eedcff` (Lilla pastello chiaro). Usato per sfondi di input, select, modali e pulsanti secondari.

### Colori di Sfondo
* **Sfondo Pagina Principale**: `#fbf3ff` (Rosa/viola chiarissimo pastello, applicato a `<main>` con `bg-[#fbf3ff]!`).
* **Sfondo Header e Card**: `#FAFAFA` (Bianco caldo/grigio ultraleggero, applicato all'header e al pannello principale).

### Accenti e Testi
* **Viola Elettrico (`text-[#4F00D0]`)**: Usato per dare contrasto ed enfasi (es. logo "Quiz App", voci attive del menu).
* **Testo Secondario (`text-[#66547d]`)**: Viola desaturato utilizzato per i sottotitoli e le descrizioni secondarie.
* **Grigio Neutro (`text-[#64748b]`)**: Slate-gray standard per elementi non attivi e link secondari (es. link GitHub nell'header).

### Pulsante d'Azione (Start Game)
* **Gradiente Lineare**: `bg-gradient-to-br from-[#6833e8] to-[#a285fc]` (da viola elettrico a viola pastello).
* **Colore Testo**: `#FAFAFA` (Quasi bianco, per massima leggibilità).
* **Hover**: Ombra estesa (`shadow-lg`), ingrandimento leggero (`scale-105`) e transizioni fluide (`transition-all duration-300`).

---

## 3. Tipografia

* **Font Family**: `"Roboto", sans-serif` (importato tramite Google Fonts).
* **Dimensioni e Pesi (Scala Gerarchica)**:
  * **Titolo Logo (Header)**: `text-3xl lg:text-4xl font-extrabold text-[#4F00D0]`.
  * **Titolo Card ("Ready to Play?")**: `text-5xl font-extrabold text-primary`.
  * **Sottotitoli**: `text-lg` o dimensioni base con colore `#66547d`.
  * **Input & Select**: `text-2xl` con testi centrati o allineati.
  * **Pulsante di Avvio**: `text-4xl` per una forte chiamata all'azione.

---

## 4. Componenti Interfaccia Utente (UI)

### Pannello Principale (Right Panel)
* **Struttura**: Card arrotondata che racchiude il form di configurazione.
* **Classi di Stile**: `bg-[#FAFAFA] rounded-xl px-5 lg:px-30 2xl:px-100 py-15 flex flex-col gap-5`.

### Tabellone Ultimi Match (Scoreboard)
* **Struttura**: Layout verticale a colonna, visibile solo su schermi desktop/larghi.
* **Classi di Stile**: `hidden xl:flex flex-col shadow-lg py-15 rounded-[25px] gap-5`.

### Selettore Avatar (PFP Picker)
* **Struttura**: Bottone rotondo che apre la modale di selezione.
* **Classi di Stile**: `relative bg-secondary p-7 rounded-full cursor-pointer`.
* **Badge Modifica**: Cerchio piccolo sovrapposto in posizione assoluta (`absolute top-40 left-39 bg-[#4F00D0] p-2.5 rounded-full`).

### Input di Testo e Dropdown
* **Classi**: `input` e `select` di DaisyUI.
* **Personalizzazione**: Sfondo viola pastello (`bg-secondary`), angoli molto arrotondati (`rounded-[15px]`) e altezza comoda (`p-5 h-auto`).

---

## 5. Layout e Responsività (Responsive Design)

* **Layout Base**: Sviluppato in ottica mobile-first con espansione a griglia su schermi desktop.
* **Griglie e Allineamento**:
  * La sezione principale affianca Scoreboard e Pannello di Gioco usando: `flex gap-5 px-2 lg:px-15 items-start`.
  * Scoreboard nascosta su mobile (`hidden`) ed esposta su desktop (`xl:flex`).
* **Spaziature interne**: Utilizzo costante di `gap-5` e `gap-7.5` per mantenere un ritmo visivo bilanciato tra i controlli.
