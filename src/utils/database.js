import initSqlJs from 'sql.js';

const STORAGE_KEY = 'math_game_db';

export const initDatabase = async () => {
  console.log('Initializing database...');
  try {
    const SQL = await initSqlJs({
      locateFile: file => `/${file}`
    });

    let db;
    
    const savedDB = localStorage.getItem(STORAGE_KEY);
    if (savedDB) {
      try {
        const uint8Array = new Uint8Array(JSON.parse(savedDB));
        db = new SQL.Database(uint8Array);
        console.log('Loaded existing database from localStorage');
      } catch (error) {
        console.error('Failed to load saved database:', error);
        db = new SQL.Database();
        console.log('Created new database after load failure');
      }
    } else {
      db = new SQL.Database();
      console.log('Created new database');
    }

    // Create high scores table
    db.run(`
      CREATE TABLE IF NOT EXISTS high_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        score INTEGER NOT NULL,
        username TEXT,
        difficulty TEXT NOT NULL,
        problem_type TEXT NOT NULL,
        date TEXT NOT NULL
      )
    `);

    // Create problem history table
    db.run(`
      CREATE TABLE IF NOT EXISTS problem_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        high_score_id INTEGER NOT NULL,
        problem TEXT NOT NULL,
        solution REAL NOT NULL,
        user_answer REAL NOT NULL,
        time_spent REAL NOT NULL,
        is_correct BOOLEAN NOT NULL,
        problem_number INTEGER NOT NULL,
        FOREIGN KEY (high_score_id) REFERENCES high_scores(id)
      )
    `);

    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

const saveDatabase = (db) => {
  try {
    const data = db.export();
    const array = Array.from(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(array));
    console.log('Database saved to localStorage');
  } catch (error) {
    console.error('Error saving database to localStorage:', error);
    throw error;
  }
};

// Helper functions for high scores
export const saveHighScoreWithHistory = async (db, scoreData, problemHistory) => {
  const { score, username, difficulty, problemType } = scoreData;
  const date = new Date().toISOString();

  try {
    // Start a transaction
    db.run('BEGIN TRANSACTION');

    // Insert into high_scores
    db.run(`
      INSERT INTO high_scores (score, username, difficulty, problem_type, date)
      VALUES (?, ?, ?, ?, ?)
    `, [score, username, difficulty, problemType, date]);

    // Get the ID of the inserted high score
    const result = db.exec('SELECT last_insert_rowid()');
    const highScoreId = result[0].values[0][0];

    // Insert into problem_history
    problemHistory.forEach(problem => {
      const { problemText, solution, userAnswer, timeSpent, isCorrect, problemNumber } = problem;
      db.run(`
        INSERT INTO problem_history (high_score_id, problem, solution, user_answer, time_spent, is_correct, problem_number)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [highScoreId, problemText, solution, userAnswer, timeSpent, isCorrect, problemNumber]);
    });

    // Commit the transaction
    db.run('COMMIT');

    saveDatabase(db);

    return highScoreId;
  } catch (error) {
    db.run('ROLLBACK');
    console.error('Error saving high score and problem history:', error);
    throw error;
  }
};

export const getTopScores = (db, difficulty, problemType, limit = 10) => {
  try {
    const result = db.exec(`
      SELECT * FROM high_scores 
      WHERE difficulty = '${difficulty}' 
      AND problem_type = '${problemType}'
      ORDER BY score DESC 
      LIMIT ${limit}
    `);
    
    return result[0]?.values || [];
  } catch (error) {
    console.error('Error getting top scores:', error);
    throw error;
  }
};
