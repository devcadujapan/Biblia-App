import bibleData from '../data/bible_acf.json';

// Array com todos os livros na ordem correta
const booksList = [];

// Extrair informações dos livros e seus capítulos/versículos
for (let i = 0; i <= 65; i++) { // 66 livros (0-65)
  const book = bibleData[i.toString()];
  if (book && book.name) {
    booksList.push({
      index: i,
      name: book.name,
      abbrev: book.abbrev,
      chapters: book.chapters.length, // Número de capítulos
      versesData: book.chapters // Array de capítulos com versículos
    });
  }
}

// Mapear nomes para índices
const bookNameToIndex = {};
const bookAbbrevToIndex = {};

booksList.forEach(book => {
  bookNameToIndex[book.name] = book.index;
  bookNameToIndex[book.name.toLowerCase()] = book.index;
  bookAbbrevToIndex[book.abbrev] = book.index;
});

// Função para obter versículos de um capítulo
export const getChapter = (bookName, chapterNumber) => {
  try {
    // Encontra o índice do livro
    let bookIndex = bookNameToIndex[bookName];
    
    if (!bookIndex) {
      // Tenta com nome minúsculo
      bookIndex = bookNameToIndex[bookName.toLowerCase()];
    }
    
    if (!bookIndex) {
      // Tenta encontrar pela abreviatura
      for (let [abbrev, index] of Object.entries(bookAbbrevToIndex)) {
        const book = booksList.find(b => b.index === index);
        if (book && book.name.toLowerCase() === bookName.toLowerCase()) {
          bookIndex = index;
          break;
        }
      }
    }
    
    if (bookIndex === undefined) {
      console.warn(`Livro "${bookName}" não encontrado`);
      return [];
    }
    
    const book = booksList.find(b => b.index === bookIndex);
    if (!book) return [];
    
    // Verifica se o capítulo existe
    const chapterIndex = chapterNumber - 1; // Array começa em 0
    if (chapterIndex >= book.versesData.length) {
      console.warn(`Capítulo ${chapterNumber} não encontrado em ${book.name}`);
      return [];
    }
    
    const chapterVerses = book.versesData[chapterIndex];
    
    // Converte o array de versículos para o formato esperado
    const versesArray = chapterVerses.map((text, index) => ({
      number: index + 1,
      text: text
    }));
    
    return versesArray;
  } catch (error) {
    console.error('Erro ao carregar capítulo:', error);
    return [];
  }
};

// Função para obter todos os livros
export const getAllBooks = () => {
  return booksList.map(book => ({
    name: book.name,
    chapters: book.chapters,
    abbrev: book.abbrev
  }));
};

// Função para obter número de capítulos de um livro
export const getBookChapters = (bookName) => {
  const book = booksList.find(b => 
    b.name === bookName || 
    b.name.toLowerCase() === bookName.toLowerCase()
  );
  return book ? book.chapters : 0;
};

// Função para obter nome do livro pelo índice
export const getBookNameByIndex = (index) => {
  const book = booksList.find(b => b.index === index);
  return book ? book.name : null;
};