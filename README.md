# 🧠 QuizApp

![License](https://img.shields.io/github/license/granafilo/quizApp)
![Repo size](https://img.shields.io/github/repo-size/granafilo/quizApp)
![Last commit](https://img.shields.io/github/last-commit/granafilo/quizApp)
![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-blue)

**QuizApp** is a modern, fast, and interactive trivia quiz web application.  
Questions are fetched dynamically from the **Open Trivia Database (OpenTDB)** API, featuring category selection, weighted scoring, combo multipliers, micro-animations, and a persistent local leaderboard.

The application is completely client-side and requires zero backend infrastructure.

---

## ✨ Features

- 🎯 **Dynamic Quiz Generation**: Real-time questions fetched from the OpenTDB API with rate-limit retry handling.
- 📚 **Category Selection**: Choose from 12+ popular categories (Video Games, Cinema, Anime & Manga, Science & Nature, Tech, Sports, Geography, History, Books, and more) or play Mixed.
- 🧩 **Difficulty Levels & Weighted Scoring**: Easy (+1 pt), Medium (+2 pts), Hard (+3 pts), or Mixed.
- 🔥 **Streak & Combo Multiplier**: Consecutive correct answers activate dynamic combo badges and award bonus points.
- 💡 **50/50 Lifeline**: Eliminate two incorrect answers for a small point penalty.
- 👤 **Player Customization**: Custom nickname input and a wide selection of illustrated profile avatars.
- ⏸️ **Pause & Resume Modal**: In-game pause menu with keyboard shortcuts (`Esc` for pause/resume, `Enter` for next question).
- ✨ **Tactile Micro-Animations**: Smooth slide-in question transitions, pop effect on correct answers, and shake feedback on wrong answers.
- 📊 **Detailed Match Summary**: Final score overview with total points, correct/wrong count, and maximum combo reached.
- 📈 **Persistent Leaderboard**: Last matches and high scores stored locally in browser storage (`localStorage`).
- 📱 **Mobile-First Responsive Design**: Optimized UI for mobile phones, tablets, and desktop displays.

---

## 🧱 Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure, accessible layout, and native `<dialog>` modals |
| **TailwindCSS (v4)** | Utility-first styling, color tokens, responsive breakpoints, and animations |
| **DaisyUI (v4)** | Custom themes (`#37274d`, `#eedcff`), component library, and UI widgets |
| **JavaScript (ES6+)** | Modular game logic, asynchronous API handling, state management, and DOM updates |
| **Vite** | Development server, fast HMR, asset bundling, and GitHub Pages production build |
| **Open Trivia DB API** | Trivia questions, categories, and answers database |
| **Web Storage (localStorage)** | Local persistence for scoreboard and match history |

> For design tokens and color palette details, check out the [Design System Documentation](docs/stile.md).

---

## 🌐 Deployment & Architecture

The project is distributed as a lightweight static website hosted via **GitHub Pages**.

Built with **Vite**, the setup provides:
- Optimized static bundle output
- Fast development workflow with instant Hot Module Replacement (HMR)
- Zero backend dependencies and fast loading speeds

---

## 🚀 Live Demo

Hosted via GitHub Pages on a personal domain:  
👉 **[https://quizapp.granafilo-ha.foo/](https://quizapp.granafilo-ha.foo/)**

GitHub Repository:  
👉 **[https://github.com/granafilo/quizApp](https://github.com/granafilo/quizApp)**

---

## 📜 License

This project is released under the **GPL-2.0 License**.  
You are free to use, modify, and redistribute it under the terms of the license.
