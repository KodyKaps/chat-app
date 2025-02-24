import { useState } from 'react';
import {useNavigation } from '@react-navigation/native';
import { ImageBackground, StyleSheet, Text, View, TextInput,Button,TouchableOpacity } from 'react-native';
import BackgroundImage from '../assets/BackgroundImage.png'

import { getAuth, signInAnonymously } from 'firebase/auth';
export default function StartScreen(){
    const auth = getAuth();
    const [name, setName] = useState('kody')
    const [color, setColor] = useState('blue')
    const navigation = useNavigation();
    const signInUser = () => {
        signInAnonymously(auth)
          .then(result => {
            navigation.navigate('chat', {userID: result.user.uid, name, color})
            Alert.alert("Signed in Successfully!");
          })
          .catch((error) => {
            Alert.alert("Unable to sign in, try later again.");
        })
    }
    return (
        <View style={styles.container}>
            <ImageBackground source={BackgroundImage} resizeMode="cover" style={styles.image}>
                <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                    placeholder='Type Something Here'
                />
                <Text>You wrote: {name}</Text>
                <TouchableOpacity style={styles.circleButton} onPress={() => setColor('blue')}>
                    <Text>Blue</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleButton} onPress={() => setColor('red')}>
                    <Text>Red</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleButton} onPress={() => setColor('purple')}>
                    <Text>Purple</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleButton} onPress={() => setColor('teal')}>
                    <Text>Teal</Text>
                </TouchableOpacity>
                <Button onPress={signInUser} title='Go to Chat'>
                    
                </Button>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    circleButton: {
        borderRadius: 25,
        width: 50
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      //alignItems: 'center',
      justifyContent: 'center',
    },
  });
  