# Mental Math

#### Video Demo: https://www.youtube.com/watch?v=rPMNzs_C8Kg

#### Description:

My final project is a gamified way to practice mental math skills built using React with Vite on the front end and SQLite with localStorage as a database for the High Score table.

The app allows users to play a game where they choose an operation to focus on (i.e. addition, subtraction, multiplication or division), and also decide between different levels of complexity that introduce decimals and negative numbers. The player then has 3 minutes to complete as many problems as possible while the numbers get bigger and bigger for every correct answer. The game ends either when the time runs out or when they get 3 problems wrong.

When the game is over the user is presented with a table of the problems they got right and wrong, and also how long they spent on each problem. This allows them to learn from their mistakes and discover patterns in which problems they are unable to solve quickly.

---

##### Design choices

First I want to clearly disclose my use of generative AI for this project as it's explicitly accepted as reasonable on the Final Project description page. I used Cursor as my IDE which integrates many different models, and gpt-4o and Claude-sonnet-3.5 was mainly used. This was my first experience using generative AI to code and I made many mistakes and learned a lot about it's limitations especially regarding the design process once a codebase grows.

When it comes to the games design it was originally supposed to have more modes; probability, conversion, percentage were all planned and even started on. But the design was simplified due to the time it was taking to design levelling algorithms for all the different modes and the sheer amount of individual high score tables that resulted from having that many options. Practice mode was implemented to keep at least some parts of the original design. Having very clear and detailed plan has been a lesson hard learned.

The database design and choice was especially difficult. The first option considered was a server solution but it was dismissed due to the added complexity it would introduce, so that left local storage solutions and SQLite was chosen due to it's simplicity and lightweight solution. Then came the problem of persistence between sessions. The first idea was to use IndexedDB but the more advanced API and features were considered to be a bit overkill for this small project. After looking into it further localStorage stood out as a good and simple solution.

---

#### Files

This being my first experience with React, I was very surprised by how many different files I ended up with because of all the different components. Towards the end of the project, I realized I had not been following best practices in file management. However, by that point, it was too big a project to rewrite. This issue was partly due to an over-reliance on the AIs in Cursor, which caused numerous other issues as the complexity of the codebase grew. This was, at the very least, an important lesson.

##### Key Files

- **index.html**:  
   This is the only html file in the project and the first file that the browser loads. It just contains the extremely basic HTML structure and the root script element where React injects the entire application from the main.jsx.
- **main.jsx**:  
   This file is also very barebones and handles how the app is started and mounted to the Document Object Model (DOM), and is kept separate from App.jsx to follow the principle of "Separation of concerns".
- **App.jsx**:  
  This is the main control centre of the application and it serves two very key functions. First, it calls the function that initializes the SQLite database. Second, it is responsible for all the routing between different parts of the app.
- **database.js**:  
   This file, as the name suggests, manages the database logic for the High Scores. It initializes the database, creates the two different tables and provides the functions for saving and retrieving data from it. It also handles persistence between sessions by storing the database state in the browser's localStorage.

##### Components

- **MainMenu.jsx**:  
   This presents the main navigation for the game between the actual game, practice mode and the High Score table.
- **GameModeSelect.jsx**:  
   This is where the different game options are presented to and selected by the player.
- **GameScreen.jsx**:  
   This renders the actual game screen that presents the problems to be solved. It also shows the player key details how many lives and points they have and also how much time they have left. It then renders the GameOver component once the game is over.
- **GameOver.jsx**:  
   Displays the Game Over screen when called by `GameScreen.jsx`. It shows a table of the problems solved or failed and allows the player to save their score to the High Scores by entering a username.
- **PracticeMode.jsx**:  
   Functions like an alternative to `GameModeSelect` but with fewer limitations. It lets players practice multiple operations simultaneously, set their own time limit, or even play without one. Initially intended as a standalone game mode but was reworked into a sandbox-style option to avoid creating too many High Score tables for various combinations.
- **HighScores.jsx**:  
   Queries the database and displays the relevant High Score table based on user-selected options.


##### Styles

This is admittedly a mess. I originally thought every component needed it's own styling file with all it's styles, and only later learned that there definitely should be shared styling files as well. This caused a lot of redundancies, overlap and an infuriating amount of hours editing code with zero visual changes. This should be refactored in the future.

###### Important Style Files

- **index.css**:  
   Here I ended up defining a lot of variables that was used repeatedly.
- **shared.css**:  
   This was an attempt at centralizing some of the recurring and overlapping styles but only with moderate success.
- **Rest of the CSS files**:  
   The rest of the styling files relate directly to their respective namesake components.


##### Other Files

- **Overview**  
   The project also includes a lot of files that came with React, Vite, SQLite, and Node.js etc. I must admit I have no idea what most of these files do.
