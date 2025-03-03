import { useEffect, useState } from 'react';
import { StyleSheet, Button, Text, Image, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import {collection, query, addDoc, onSnapshot, orderBy} from "firebase/firestore"
import AsyncStorage from '@react-native-async-storage/async-storage';

import MapView from 'react-native-maps';
import CustomActions from './CustomActions';
export default function ChatScreen({route, db, isConnected}){
    const {color, userID, name} = route.params
    const [messages, setMessages] = useState([])
    const [image, setImage] = useState(null)
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
    
    
    const renderCustomActions = (props) => {
        return (
            <CustomActions {...props}/>
        )
    }
    const renderCustomView = (props) => {
        const { currentMessage} = props;
        if (currentMessage.location) {
          return (
              <MapView
                style={{width: 150,
                  height: 100,
                  borderRadius: 13,
                  margin: 3}}
                region={{
                  latitude: currentMessage.location.latitude,
                  longitude: currentMessage.location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              />
          );
        }
        return null;
    }

    const pickImage = async () => {
            let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
            if (permissions?.granted) {
               let result = await ImagePicker.launchImageLibraryAsync();
        
              if (!result.canceled) setImage(result.assets[0]);
              else setImage(null)
            }
        }
    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
    
        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();
    
          if (!result.canceled) setImage(result.assets[0]);
          else setImage(null)
        }
    }
    return (
        <View style={[styles.container, {backgroundColor: color}]}>
            <Button
                title= "Pick an image from the library"
                onPress={pickImage}
            />
            <Button
                title= "Take a photo"
                onPress={takePhoto}
            />
            {image &&
            <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />
            }
            
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name
                }}
                renderInputToolbar={renderInputToolbar}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
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