import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { getAllProgress, getUserName, saveUserName } from '../database/index';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [tempName, setTempName] = useState('');
  const [stats, setStats] = useState({ totalChapters: 0, completedChapters: 0 });
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    loadUserData();
    loadStats();
  }, []);

  const loadUserData = () => {
    getUserName((userName) => {
      setName(userName);
      setTempName(userName);
    });
  };

  const loadStats = () => {
    getAllProgress((progress) => {
      const completed = progress.filter(p => p.completed === 1).length;
      setStats({ completedChapters: completed, totalChapters: 1189 }); // Bíblia tem 1189 capítulos
    });
  };

  const saveProfile = () => {
    if (tempName.trim()) {
      saveUserName(tempName, () => {
        setName(tempName);
        Alert.alert('Sucesso', 'Nome salvo com sucesso!');
      });
    } else {
      Alert.alert('Erro', 'Por favor, insira um nome');
    }
  };

  const percentage = (stats.completedChapters / stats.totalChapters) * 100;

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Seu Nome</Text>
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          value={tempName}
          onChangeText={setTempName}
          placeholder="Digite seu nome"
          placeholderTextColor={isDarkMode ? '#888' : '#999'}
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Progresso Geral</Text>
        <Text style={[styles.statsText, isDarkMode && styles.darkTextLight]}>
          {stats.completedChapters} de {stats.totalChapters} capítulos lidos
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={[styles.percentageText, isDarkMode && styles.darkText]}>
          {percentage.toFixed(1)}% completo
        </Text>
      </View>

      <View style={[styles.card, styles.themeCard, isDarkMode && styles.darkCard]}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>🌙 Tema Escuro</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkMode ? '#4A90E2' : '#f4f3f4'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#1A1A2E',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#16213E',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  darkInput: {
    backgroundColor: '#0F3460',
    borderColor: '#2C3E50',
    color: '#FFF',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsText: {
    fontSize: 16,
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
  },
  percentageText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  themeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkText: {
    color: '#FFF',
  },
  darkTextLight: {
    color: '#B0B0B0',
  },
});