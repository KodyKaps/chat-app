import { StyleSheet, Text, View, TextInput } from 'react-native';
export default function StartScreen(){
    return (
        <View>
            <TextInput
                style={styles.textInput}
                value={text}
                onChangeText={setText}
                placeholder='Type Something Here'
            />
            <Text>You wrote: {text}</Text>
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
  