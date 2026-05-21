import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { getChapter } from '../utils/bibleLoader';

export default function VerseList({ route }) {
  const { bookName, chapter } = route.params;
  const { isDarkMode } = useContext(ThemeContext);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVerses();
  }, [bookName, chapter]);

  const loadVerses = () => {
    try {
      setLoading(true);
      const chapterVerses = getChapter(bookName, chapter);
      
      if (chapterVerses && chapterVerses.length > 0) {
        setVerses(chapterVerses);
        setError(null);
      } else {
        setError(`Nenhum versículo encontrado para ${bookName} ${chapter}`);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar os versículos');
    } finally {
      setLoading(false);
    }
  };

  const renderVerse = ({ item }) => (
    <View style={[styles.verseContainer, isDarkMode && styles.darkVerseContainer]}>
      <Text style={[styles.verseNumber, isDarkMode && styles.darkText]}>
        {item.number}
      </Text>
      <Text style={[styles.verseText, isDarkMode && styles.darkText]}>
        {item.text}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.centerContainer, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
          Carregando {bookName} capítulo {chapter}...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, isDarkMode && styles.darkContainer]}>
        <Text style={[styles.errorText, isDarkMode && styles.darkText]}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, isDarkMode && styles.darkText]}>
          {bookName} - Capítulo {chapter}
        </Text>
        <Text style={[styles.verseCount, isDarkMode && styles.darkTextLight]}>
          {verses.length} versículos
        </Text>
      </View>
      <FlatList
        data={verses}
        renderItem={renderVerse}
        keyExtractor={(item) => `${chapter}-${item.number}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  darkContainer: {
    backgroundColor: '#1A1A2E',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#4A90E2',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  verseCount: {
    fontSize: 14,
    color: '#E0E0E0',
    marginTop: 5,
  },
  listContent: {
    padding: 16,
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  darkVerseContainer: {
    backgroundColor: '#16213E',
  },
  verseNumber: {
    width: 35,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginRight: 10,
  },
  verseText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#2C3E50',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkTextLight: {
    color: '#B0B0B0',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A90E2',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
});