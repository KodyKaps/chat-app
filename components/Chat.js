import { StyleSheet, Text, View, TextInput } from 'react-native';
export default function ChatScreen({route}){
    const {text, color} = route.params
    return (
        <View style={[styles.container, {backgroundColor: color}]}>
            
            <Text>Chat screen{text} {color}</Text>
        </View>
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