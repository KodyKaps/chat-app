import { useState } from 'react';
import {useNavigation } from '@react-navigation/native';
import { ImageBackground, StyleSheet, Text, View, TextInput,Button,TouchableOpacity } from 'react-native';
import BackgroundImage from '../assets/BackgroundImage.png'
export default function StartScreen(){
    
    const [text, setText] = useState('kody')
    const [color, setColor] = useState('blue')
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <ImageBackground source={BackgroundImage} resizeMode="cover" style={styles.image}>
                <TextInput
                    style={styles.textInput}
                    value={text}
                    onChangeText={setText}
                    placeholder='Type Something Here'
                />
                <Text>You wrote: {text}</Text>
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
                <Button onPress={() => navigation.navigate('Chat', {text, color})} title='Go to Chat'>
                    
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
  