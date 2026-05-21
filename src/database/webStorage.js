// Versão web usando localStorage
export const initDatabase = () => {
  console.log('Inicializando storage web');
};

export const saveUserName = (name, callback) => {
  localStorage.setItem('user_name', name);
  callback && callback();
};

export const getUserName = (callback) => {
  const name = localStorage.getItem('user_name') || '';
  callback && callback(name);
};

export const toggleChapterComplete = (bookName, chapter, completed, callback) => {
  const key = `progress_${bookName}_${chapter}`;
  localStorage.setItem(key, JSON.stringify(completed));
  callback && callback();
};

export const getChapterStatus = (bookName, chapter, callback) => {
  const key = `progress_${bookName}_${chapter}`;
  const saved = localStorage.getItem(key);
  const completed = saved ? JSON.parse(saved) : false;
  callback && callback(completed);
};

export const getAllProgress = (callback) => {
  const progress = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('progress_')) {
      const parts = key.split('_');
      const bookName = parts[1];
      const chapter = parseInt(parts[2]);
      const completed = JSON.parse(localStorage.getItem(key));
      progress.push({ book_name: bookName, chapter, completed: completed ? 1 : 0 });
    }
  }
  callback && callback(progress);
};