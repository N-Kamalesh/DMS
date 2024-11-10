import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as ImageManipulator from "expo-image-manipulator";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { useNavigation } from "expo-router";
// API_URL="http://10.16.49.209/api"

export default function ReportEmergency() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPermissionsAndToken = async () => {
      try {
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === "granted");

        const locationStatus =
          await Location.requestForegroundPermissionsAsync();
        if (locationStatus.status === "granted") {
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
        } else {
          Alert.alert("Permission to access location was denied");
        }

        const email = await AsyncStorage.getItem("email");
        if (email) {
          setUserEmail(email);
        } else {
          console.log("No email found.");
        }
      } catch (error) {
        console.error("Error fetching permissions or token:", error);
        Alert.alert("Error", "There was an issue fetching the required data.");
      }
    };

    fetchPermissionsAndToken();
  }, []);

  const compressImage = async (uri) => {
    const compressedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return compressedImage.uri;
  };

  const pickImage = async () => {
    if (images.length >= 3) {
      Alert.alert("You can only add up to 3 photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const compressedUri = await compressImage(result.assets[0].uri);
      setImages((prevImages) => [...prevImages, compressedUri]);
    }
  };

  const captureImage = async () => {
    if (images.length >= 3) {
      Alert.alert("You can only add up to 3 photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const compressedUri = await compressImage(result.assets[0].uri);
      setImages((prevImages) => [...prevImages, compressedUri]);
    }
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Description is required");
      return;
    }

    if (!location) {
      Alert.alert("Location is required");
      return;
    }

    const base64Images = await Promise.all(
      images.map(async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      })
    );

    const submissionData = {
      description,
      userEmail,
      images: base64Images,
      location,
    };

    try {
      console.log(`${API_URL}/emergency`);
      const response = await fetch(`${API_URL}/emergency`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        console.log("Response status:", response.status);
        console.log("Response message:", await response.text());
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      Alert.alert(data.message);
      setDescription("");
      setImages([]);
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error submitting report", error.message);
    }
  };

  return (
    <View className="flex-1 p-5 bg-[#f9f9f9]">
      <Text className="text-2xl font-bold mb-2">Report Emergency</Text>

      <View className="flex-row justify-around my-2">
        <Button title="Upload Photo" onPress={pickImage} />
        <Button title="Take Photo" onPress={captureImage} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-2"
      >
        {images.map((uri, index) => (
          <View key={index} className="relative mr-2">
            <Image source={{ uri }} className="w-24 h-24 rounded-md" />
            <TouchableOpacity
              className="absolute top-1 right-1 bg-red-500 w-6 h-6 rounded-full justify-center items-center"
              onPress={() => removeImage(index)}
            >
              <Text className="text-white font-bold">X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TextInput
        className="bg-white p-3 rounded-md my-2"
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {location && (
        <MapView
          className="w-full h-72 rounded-md mt-2"
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={location} title="Current Location" />
        </MapView>
      )}

      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-md items-center mt-5"
        onPress={onSubmit}
      >
        <Text className="text-white text-lg font-bold">Submit Report</Text>
      </TouchableOpacity>
    </View>
  );
}
