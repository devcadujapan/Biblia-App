import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import VerseList from './src/components/VerseList';
import { ThemeProvider } from './src/context/ThemeContext';
import { initDatabase } from './src/database/index';
import ChaptersScreen from './src/screens/ChaptersScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BibleStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4A90E2' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    >
      <Stack.Screen 
        name="Books" 
        component={HomeScreen} 
        options={{ title: 'Livros da Bíblia' }}
      />
      <Stack.Screen 
        name="Chapters" 
        component={ChaptersScreen} 
        options={({ route }) => ({ title: route.params.bookName })}
      />
      <Stack.Screen 
        name="Verses" 
        component={VerseList} 
        options={({ route }) => ({ 
          title: `${route.params.bookName} - Capítulo ${route.params.chapter}`
        })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Bíblia') iconName = 'menu-book';
              else if (route.name === 'Perfil') iconName = 'person';
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4A90E2',
            tabBarInactiveTintColor: 'gray',
            headerShown: false
          })}
        >
          <Tab.Screen name="Bíblia" component={BibleStack} />
          <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}