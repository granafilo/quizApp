# **Quiz App 🧠**

A dynamic and interactive web-based Quiz Application built with modern JavaScript (ES6+), HTML5, and CSS3. This app challenges users with questions across different difficulty levels, fetching real-time data from the [Open Trivia Database API](https://www.google.com/search?q=https://opentdb.com/api.php).

## **🚀 Features**

* **Dynamic Question Fetching:** Uses asynchronous fetch requests to retrieve 10 randomized questions per session based on the selected difficulty.  
* **Difficulty Settings:** Users can choose between *Easy*, *Medium*, *Hard*, or *Mixed* levels to tailor the challenge.  
* **User Personalization:** Supports custom nicknames and profile picture selection via an interactive modal.  
* **Lifelines/Hints:** Includes a "50/50" hint (Remove 2/4) to help players when they are stuck on multiple-choice questions.  
* **Real-time Scoring:** Tracks correct and incorrect answers, calculating a total score based on the difficulty of the questions answered.  
* **Local Leaderboard:** Saves game history (nickname, score, correct/incorrect ratio) to the browser's localStorage, allowing users to track their progress over time.  
* **Responsive Design:** Fully responsive UI built with **Bootstrap 5**, optimized for both desktop and mobile viewing.

## **🛠️ Built With**

* **Frontend:** HTML5, CSS3 (Custom Flexbox/Grid layouts).  
* **Logic:** JavaScript (ES Modules).  
* **API:** [Open Trivia DB](https://opentdb.com/).  
* **Storage:** Browser localStorage for persistent scoreboards.

## **🕹️ How to Play**

1. Enter your **Nickname**.  
2. Click on the profile icon to choose an **Avatar**.  
3. Select your preferred **Difficulty**.  
4. Answer the questions\! Use the **Hint** button if you need help.  
5. View your final stats and check the **Scoreboard** on the home page to see where you rank.

## **📁 Project Structure**

* index.html / homepage.js: The landing page where users set up their profile and view the leaderboard.  
* game.html / game.js: The core engine that handles fetching questions, validating answers, and managing the game state.  
* storageFunctions.js: Modular utility functions to handle data persistence.  
* index.css / stylesheet.css: Custom styling and animations.

