import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { books } from '../data/books';
import { getAllProgress } from '../database/index';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isDarkMode } = useContext(ThemeContext);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    loadProgress();
    const unsubscribe = navigation.addListener('focus', loadProgress);
    return unsubscribe;
  }, [navigation]);

  const loadProgress = () => {
    getAllProgress((data) => {
      const progressMap = {};
      data.forEach(item => {
        if (!progressMap[item.book_name]) progressMap[item.book_name] = 0;
        if (item.completed === 1) progressMap[item.book_name]++;
      });
      setProgress(progressMap);
    });
  };

  const renderBook = ({ item, index }) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7D794'];
    const completedChapters = progress[item.name] || 0;
    const percentage = (completedChapters / item.chapters) * 100;

    return (
      <TouchableOpacity
        style={[
          styles.bookCard,
          { backgroundColor: colors[index % colors.length] + '20' },
          isDarkMode && styles.darkCard
        ]}
        onPress={() => navigation.navigate('Chapters', { bookName: item.name, totalChapters: item.chapters })}
      >
        <View style={styles.bookInfo}>
          <Text style={[styles.bookName, isDarkMode && styles.darkText]}>
            {item.name}
          </Text>
          <Text style={[styles.chapterCount, isDarkMode && styles.darkTextLight]}>
            {completedChapters}/{item.chapters} capítulos
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percentage}%` }]} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text style={[styles.header, isDarkMode && styles.darkText]}>
        📖 Livros da Bíblia
      </Text>
      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item) => item.name}
        showsVerticalScrollIndicator={false}
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
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  bookCard: {
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#16213E',
    shadowColor: '#fff',
  },
  bookInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bookName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  chapterCount: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 2,
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkTextLight: {
    color: '#B0B0B0',
  },
});