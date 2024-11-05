import * as React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import img from '../assets/alert.png';
import backgroundImg from '../assets/redbg.jpg';  

export default function HomeScreen({ navigation }) {
    return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.box}>
          <Image source={img} style={styles.image} resizeMode="cover" />

          <View style={styles.content}>
            <Text style={styles.title}>Emergency</Text>
            <Text style={styles.description}>
              This is a brief description of the emergency.
            </Text>

            <TouchableOpacity 
              style={styles.button}
              // onPress={() => navigation.navigate('DetailScreen')}
            >
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',  
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,  
    backgroundColor: 'rgba(0, 0, 0, 0.3)',  
  },
  box: {
    width: '90%',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,  
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',  
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  button: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E90FF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
