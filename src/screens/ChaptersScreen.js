import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { getChapterStatus, toggleChapterComplete } from '../database/index';

export default function ChaptersScreen({ route, navigation }) {
  const { bookName, totalChapters } = route.params;
  const { isDarkMode } = useContext(ThemeContext);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    loadChaptersStatus();
  }, []);

  const loadChaptersStatus = () => {
    const chaptersArray = [];
    let completedCount = 0;
    
    for (let i = 1; i <= totalChapters; i++) {
      chaptersArray.push({ number: i, completed: false });
    }
    
    chaptersArray.forEach((chapter, index) => {
      getChapterStatus(bookName, chapter.number, (completed) => {
        chaptersArray[index].completed = completed;
        if (completed) completedCount++;
        
        if (completedCount === totalChapters && totalChapters > 0) {
          Alert.alert('🎉 Parabéns!', `Você completou o livro de ${bookName}!`);
        }
        
        setChapters([...chaptersArray]);
      });
    });
  };

  const toggleChapter = (chapterNumber, currentStatus) => {
    const newStatus = !currentStatus;
    toggleChapterComplete(bookName, chapterNumber, newStatus, () => {
      loadChaptersStatus();
    });
  };

  const renderChapter = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.chapterCard,
        item.completed && styles.completedCard,
        isDarkMode && styles.darkCard
      ]}
      onPress={() => navigation.navigate('Verses', { bookName, chapter: item.number })}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleChapter(item.number, item.completed)}
      >
        <Text style={styles.checkboxText}>{item.completed ? '✓' : '○'}</Text>
      </TouchableOpacity>
      <Text style={[styles.chapterText, isDarkMode && styles.darkText]}>
        Capítulo {item.number}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>
        {bookName}
      </Text>
      <FlatList
        data={chapters}
        renderItem={renderChapter}
        keyExtractor={(item) => item.number.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#1A1A2E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  chapterCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    margin: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: '#E8F5E9',
  },
  darkCard: {
    backgroundColor: '#16213E',
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxText: {
    fontSize: 24,
    color: '#4A90E2',
  },
  chapterText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  darkText: {
    color: '#FFFFFF',
  },
});