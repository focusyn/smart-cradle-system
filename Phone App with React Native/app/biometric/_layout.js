import { Tabs } from 'expo-router';
import { AntDesign, Entypo } from '@expo/vector-icons';

export default function HomeLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="camera" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
