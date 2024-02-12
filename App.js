import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './HomeScreen';
import ListScreen from './ListScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'List') {
              iconName = focused ? 'list' : 'list-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'gold',
          tabBarInactiveTintColor: 'white',
          tabBarStyle: [
            {
              display: 'flex',
              backgroundColor: '#0F2394', // Taustaväri
            },
            null,
          ],
         
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ headerTitle: '' }} />
        <Tab.Screen name="List" component={ListScreen} options={{ headerTitle: '' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#8395f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
