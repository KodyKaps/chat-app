import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { createStaticNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from './components/Chat';
import StartScreen from './components/Start';

import { initializeApp } from 'firebase/app';
import { disableNetwork, enableNetwork, getFirestore } from 'firebase/firestore';
import { useNetInfo } from '@react-native-community/netinfo';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID
} from "@env"
import { useEffect } from 'react';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};

// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);
const db = getFirestore(firebase_app)

//navigator
const Stack = createNativeStackNavigator();

export default function App() {
  const connectionStatus = useNetInfo()
  //when connection status changes update 
  useEffect(() => {
    if(connectionStatus.isConnected === false){
      Alert.alert("Connection lost!")
      disableNetwork(db)
    } else if(connectionStatus.isConnected === true){
      enableNetwork(db)
    }
  },[connectionStatus.isConnected])
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="home"
      >
        <Stack.Screen
          name="home"
        >
          {props => <StartScreen db={db} isConnected={connectionStatus.isConnected} {...props}/>}
        </Stack.Screen>
        <Stack.Screen
          name="chat"
        >
          {props => <ChatScreen db={db} isConnected={connectionStatus.isConnected} {...props}/>}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
