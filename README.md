# 🧠 QuizApp

![License](https://img.shields.io/github/license/granafilo/quizApp)
![Repo size](https://img.shields.io/github/repo-size/granafilo/quizApp)
![Last commit](https://img.shields.io/github/last-commit/granafilo/quizApp)
![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-blue)

**QuizApp** is a modern, responsive browser-based quiz web application built with clean architecture and contemporary web design principles.  
Questions are fetched dynamically from the **Open Trivia Database (OpenTDB)** API. The game features interactive category selection, challenge levels, live scoring, lifelines, a pause menu, and a persistent local leaderboard.

The application is completely client-side, ultra-fast, and requires no backend infrastructure.

---

## ✨ Features

- 🎯 **Dynamic Trivia Generation**: Real-time questions fetched via the OpenTDB API across 20+ diverse categories (General Knowledge, Science, Film, Music, Sports, History, Computers, and more).
- 🧩 **Difficulty Modes**: Choose between *Easy* (1 pt), *Medium* (2 pts), *Hard* (3 pts), or *Mixed* levels.
- 🎨 **Modern Modal System**: Elegant bottom-sheet modal selectors for Categories, Difficulty, Avatar selection, and Leaderboard.
- 👤 **Player Customization**: Personalized nickname and avatar picker with local persistence.
- 💡 **50/50 Lifeline**: Direct lifeline to eliminate 2 incorrect answers on multiple-choice questions.
- 📊 **Real-Time Match Dashboard**: Live score tracker, question progress counter, and animated progress bar.
- ⏸️ **Pause & Navigation Controls**: Centered pause modal with background blur, resume capabilities, and instant homepage navigation.
- 📈 **Persistent Leaderboard**: Stores and displays match history and detailed breakdowns (correct/wrong answers, scores) via browser `localStorage`.
- 📱 **Mobile-First Responsive Design**: Optimized layouts for small smartphones, tablets (2-column option grid), and widescreen desktop monitors.

---

## 🧱 Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure, accessibility, and dialog elements |
| **Tailwind CSS v4** | Utility-first styling framework and responsive design system |
| **DaisyUI 5** | Semantic UI components and modern bottom-sheet modals |
| **JavaScript (ES6+)** | Game logic, asynchronous API handling, and storage management |
| **Vite** | Build tool, bundler, and local development server |
| **Open Trivia DB API** | Trivia questions and answers database |
| **localStorage API** | Persistent match history and score data |

---

## 📖 Documentation

- [🎨 Guida di Stile e Design System](docs/stile.md): Documentazione completa su palette colori, tipografia, componenti e breakpoint responsivi.

---

## 🌐 Deployment & Local Development

The project is bundled using **Vite** and distributed as a static website via **GitHub Pages**.

### Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/granafilo/quizApp.git
   cd quizApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📜 License

This project is released under the **GPL-2.0 License**.  
You are free to use, modify, and redistribute it under the terms of the license.

---

## 🚀 Live Demo

Hosted via GitHub Pages on a personal domain:  
👉 [https://quizapp.granafilo-ha.foo/](https://quizapp.granafilo-ha.foo/)
