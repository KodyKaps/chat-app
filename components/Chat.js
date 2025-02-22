import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
export default function ChatScreen({route}){
    const {text, color} = route.params
    const [messages, setMessages] = useState([])
    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
    }
    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Hi nice to meet you',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "Computer",
                    avatar: "https://placeimg.com/140/140/any"
                }
            },
            {
                _id: 2,
                text: 'Here is my ip address',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "Computer",
                    avatar: "https://placeimg.com/140/140/any"
                }
            }
        ])
    },[])
    return (
        <View style={[styles.container, {backgroundColor: color}]}>
            
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1
                }}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height'/> : null}
            {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior='padding'/> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      
    },
  });