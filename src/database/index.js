import * as SQLite from 'expo-sqlite';
import * as webStorage from './webStorage';

// Detecta se está rodando na web
const isWeb = typeof window !== 'undefined' && window.document;

// Exporta a implementação correta para cada plataforma
export const initDatabase = () => {
  if (isWeb) {
    return webStorage.initDatabase();
  }
  // Implementação SQLite para mobile
  const db = SQLite.openDatabase('bible.db');
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS reading_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_name TEXT,
        chapter INTEGER,
        completed INTEGER,
        UNIQUE(book_name, chapter)
      );`,
      [],
      () => console.log('Tabela criada no SQLite'),
      (_, error) => console.error('Erro:', error)
    );
  });
  return db;
};

export const saveUserName = (name, callback) => {
  if (isWeb) {
    return webStorage.saveUserName(name, callback);
  }
  // Lógica SQLite...
};

export const getUserName = (callback) => {
  if (isWeb) {
    return webStorage.getUserName(callback);
  }
  // Lógica SQLite...
};

export const toggleChapterComplete = (bookName, chapter, completed, callback) => {
  if (isWeb) {
    return webStorage.toggleChapterComplete(bookName, chapter, completed, callback);
  }
  // Lógica SQLite...
};

export const getChapterStatus = (bookName, chapter, callback) => {
  if (isWeb) {
    return webStorage.getChapterStatus(bookName, chapter, callback);
  }
  // Lógica SQLite...
};

export const getAllProgress = (callback) => {
  if (isWeb) {
    return webStorage.getAllProgress(callback);
  }
  // Lógica SQLite...
};