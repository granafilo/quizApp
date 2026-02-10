# 🧠 QuizApp

![License](https://img.shields.io/github/license/granafilo/quizApp)
![Repo size](https://img.shields.io/github/repo-size/granafilo/quizApp)
![Last commit](https://img.shields.io/github/last-commit/granafilo/quizApp)
![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-blue)

**QuizApp** is a dynamic browser-based quiz web app.  
Questions are fetched from the **Open Trivia Database (OpenTDB)** API and the game includes scoring, difficulty levels, and a persistent local leaderboard.

The application is fully client-side and requires no backend.

---

## ✨ Features

- 🎯 Dynamic quiz generation via OpenTDB API  
- 🧩 Multiple difficulty levels: Easy / Medium / Hard / Mixed  
- 👤 Player personalization with nickname and avatar  
- 💡 50/50 lifeline to remove incorrect answers  
- 📊 Real-time scoring system  
- 📈 Local leaderboard stored in browser storage  
- 📱 Responsive interface (desktop + mobile)

---

## 🌐 Deployment

The project is distributed as a static website via **GitHub Pages**.

The app is built using **Vite**, which is used for:

- optimized static build output
- JavaScript bundling
- asset handling
- fast development workflow
- GitHub Pages–ready deployment

This architecture ensures:

- fast loading times
- lightweight bundles
- free hosting
- zero backend infrastructure

👉 The entire application runs client-side.

---

## 🧱 Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Application structure and page layout |
| **CSS3** | Styling, responsive design and UI layout |
| **JavaScript (ES6+)** | Game logic, API handling, scoring system |
| **Vite** | Build tool, bundler and development server |
| **Open Trivia DB API** | External quiz question source |
| **localStorage API** | Persistent leaderboard and player data |

No external frameworks or backend services are required.

---

## 📁 Project Structure

quizApp/
├── public/
├── src/
│ ├── index.html
│ ├── game.html
│ ├── index.css
│ ├── game.js
│ ├── storageFunctions.js
│ └── ...
├── package.json
├── vite.config.js
├── LICENSE
└── README.md


---

## 📜 License

This project is released under the **GPL-2.0 License**.  
You are free to use, modify and redistribute it under the terms of the license.

---

## 🚀 Live Demo

Hosted via GitHub Pages on a personal domain:  
👉 https://quizapp.granafilo-ha.foo/
