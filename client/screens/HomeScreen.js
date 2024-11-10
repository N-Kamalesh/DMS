import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import img from '../assets/alert.png'; // Default image if no photo is available
import backgroundImg from '../assets/redbg.jpg';
import { API_URL } from '@env';

export default function HomeScreen({ navigation }) {
    const [emergencies, setEmergencies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Request location permission and get the current location
        Geolocation.requestAuthorization('whenInUse').then((status) => {
            if (status === 'granted') {
                Geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchEmergenciesNearby(latitude, longitude);
                    },
                    (error) => Alert.alert('Error', error.message),
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            } else {
                Alert.alert('Permission Denied', 'Location access is needed to find nearby emergencies.');
            }
        });
    }, []);

    // Fetch emergencies within 1km from backend
    const fetchEmergenciesNearby = async (latitude, longitude) => {
        try {
            const response = await fetch(`${API_URL}/emergencies?lat=${latitude}&lon=${longitude}&radius=1`);
            const data = await response.json();
            setEmergencies(data); // Assuming API returns an array of emergencies
        } catch (error) {
            Alert.alert('Error', 'Could not fetch emergencies.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={backgroundImg} style={styles.background}>
            <View style={styles.container}>
                {loading ? (
                    <Text>Loading...</Text>
                ) : emergencies.length > 0 ? (
                    emergencies.map((emergency, index) => (
                        <View key={index} style={styles.box}>
                            <Image 
                                source={{ uri: emergency.photos?.[0] || img }} 
                                style={styles.image} 
                                resizeMode="cover" 
                            />
                            <View style={styles.content}>
                                <Text style={styles.title}>Emergency</Text>
                                <Text style={styles.description}>{emergency.description}</Text>
                                <TouchableOpacity 
                                    style={styles.button}
                                    onPress={() => navigation.navigate("EmergencyReportDetails", { id: emergency._id })}
                                >
                                    <Text style={styles.buttonText}>View</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text>No emergencies nearby.</Text>
                )}
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
    marginBottom: 15,
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
