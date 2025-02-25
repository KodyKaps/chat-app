import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import {collection, query, addDoc, onSnapshot, orderBy} from "firebase/firestore"
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen({route, db, isConnected}){
    const {color, userID, name} = route.params
    const [messages, setMessages] = useState([])

    const onSend = (newMessages) => {
        //store directly in fb
        addDoc(collection(db, "messages"), newMessages[0])
    }

    const cacheMessages = async(messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache))
        } catch (error) {
            console.log('error caching message',error.message)
        }
    }

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem('messages') || []
        setMessages(JSON.parse(cacheMessages))
    }
    
    useEffect(() => {
        let unSubMessages;
        if(isConnected === true){

            //un-register other listeners
            if(unSubMessages){
                unSubMessages()
                unSubMessages = null
            }
            
            //query your messages collection order by createdAt desc
            const messageQuery = query(collection(db, "messages"), orderBy('createdAt', "desc"))
            //defines a function to unsubcribe while getting the messages
            unSubMessages = onSnapshot(messageQuery, async (docSnapshot) => {
                let newMessages = []
                docSnapshot.forEach(doc => {
                    newMessages.push({id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis())})
                });
                cacheMessages(newMessages)
                setMessages(newMessages)
            })
        }
        else{
            loadCachedMessages()
        }

        //clean up code
        return () => {
            if(unSubMessages){
                unSubMessages()
            }
        }
    },[isConnected])

    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    }
    return (
        <View style={[styles.container, {backgroundColor: color}]}>
            
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name
                }}
                renderInputToolbar={renderInputToolbar}
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