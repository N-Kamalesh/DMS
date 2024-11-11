import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import img from "../assets/alert.webp";
import backgroundImg from "../assets/redbg.jpg";
import { API_URL } from "@env";
import { useIsFocused } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

export default function HomeScreen({ navigation }) {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchLocationAndEmergencies = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location access is needed to find nearby emergencies."
        );
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      console.log(latitude, longitude);
      const response = await fetch(
        `${API_URL}/emergency?lat=${latitude}&lon=${longitude}&radius=2`
      );
      const data = await response.json();
      console.log(data[0]?.photos[0]);
      setEmergencies(data);
    } catch (error) {
      Alert.alert("Error", "Could not fetch emergencies.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchLocationAndEmergencies();
    }
  }, [isFocused]);

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      <ScrollView>
        <View style={styles.container}>
          {loading ? (
            <Text className="text-white">Loading...</Text>
          ) : emergencies.length > 0 ? (
            emergencies.map((emergency, index) => (
              <View key={index} style={styles.box}>
                <Image source={img} style={styles.photo} />
                <View style={styles.content}>
                  <Text style={styles.title}>Emergency</Text>
                  <Text style={styles.description}>
                    {emergency.description}
                  </Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      if (isFocused) {
                        navigation.navigate("EmergencyReportDetails", {
                          id: emergency._id,
                        });
                      }
                    }}
                  >
                    <Text style={styles.buttonText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-white">No emergencies nearby.</Text>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  box: {
    width: "90%",
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  button: {
    alignSelf: "flex-end",
    backgroundColor: "#1E90FF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
