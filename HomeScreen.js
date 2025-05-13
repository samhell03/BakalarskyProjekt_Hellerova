import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
          source={require('./assets/mainlogo.png')} 
          style={styles.image} />
      <Text style={styles.subheader}>Plánujte vaše výlety snadno a rychle!</Text>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEDF0',
  },
  header: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FF1493',
    textAlign: 'center',
    letterSpacing: 2,
  },
  subheader: {
    fontSize: 20,
    color: '#FF1493',
    textAlign: 'center',
    fontWeight: '600',
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#FF1493',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 30,
    shadowColor: '#FF1493',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
