import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('bible.db');

export const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      );`,
      [],
      () => console.log('Tabela user_profile criada'),
      (_, error) => console.error('Erro ao criar user_profile:', error)
    );
    
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS reading_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_name TEXT,
        chapter INTEGER,
        completed INTEGER,
        UNIQUE(book_name, chapter)
      );`,
      [],
      () => console.log('Tabela reading_progress criada'),
      (_, error) => console.error('Erro ao criar reading_progress:', error)
    );
  });
};

export const saveUserName = (name, callback) => {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM user_profile', []);
    tx.executeSql(
      'INSERT INTO user_profile (name) VALUES (?)',
      [name],
      (_, result) => callback && callback(result)
    );
  });
};

export const getUserName = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT name FROM user_profile LIMIT 1',
      [],
      (_, { rows }) => callback && callback(rows._array[0]?.name || '')
    );
  });
};

export const toggleChapterComplete = (bookName, chapter, completed, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT OR REPLACE INTO reading_progress (book_name, chapter, completed) 
       VALUES (?, ?, ?)`,
      [bookName, chapter, completed ? 1 : 0],
      (_, result) => callback && callback(result)
    );
  });
};

export const getChapterStatus = (bookName, chapter, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT completed FROM reading_progress 
       WHERE book_name = ? AND chapter = ?`,
      [bookName, chapter],
      (_, { rows }) => {
        const completed = rows._array[0]?.completed === 1;
        callback && callback(completed);
      }
    );
  });
};

export const getAllProgress = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT book_name, chapter, completed FROM reading_progress`,
      [],
      (_, { rows }) => callback && callback(rows._array)
    );
  });
};