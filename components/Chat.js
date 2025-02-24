import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {collection, query, addDoc, onSnapshot, orderBy} from "firebase/firestore"
export default function ChatScreen({route, db}){
    const {color, userID, name} = route.params
    const [messages, setMessages] = useState([])

    const onSend = (newMessages) => {
        //store directly in fb
        addDoc(collection(db, "messages"), newMessages[0])
    }
    
    useEffect(() => {
        //query your messages collection order by createdAt desc
        const messageQuery = query(collection(db, "messages"), orderBy('createdAt', "desc"))
        //defines a function to unsubcribe while getting the messages
        const unSubMessages = onSnapshot(messageQuery, (docSnapshot) => {
            let newMessages = []
            docSnapshot.forEach(doc => {
                newMessages.push({id: doc.id, ...doc.data(), createdAt: new Date(doc.data().createdAt.toMillis())})
            });
            setMessages(newMessages)
        })

        //clean up code
        return () => {
            if(unSubMessages){
                unSubMessages()
            }
        }
    },[])

    return (
        <View style={[styles.container, {backgroundColor: color}]}>
            
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name
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