import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import img1 from "../assets/background1.png";
import img2 from "../assets/light.png";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useNavigation } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";

export default function Signup() {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        navigation.navigate("Home");
      }
    };
    checkToken();
  }, [navigation]);

  const onSubmit = async (data) => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission not granted");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      data.location = { latitude, longitude };

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", responseData.error);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      Alert.alert("Error", responseData.error);
    }
  };

  return (
    <View className="bg-white h-full w-full">
      <StatusBar style="light" />

      {/* Background Image (img1 covering img2 and signup text) */}
      <Image
        source={img1}
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          height: 450,
          resizeMode: "cover",
          zIndex: -1,
        }}
      />

      {/* Top Container with Overlay Images */}
      <View className="absolute top-0 w-full h-[450] items-center z-10">
        <View className="flex-row justify-around w-full absolute top-10">
          <Animated.Image
            entering={FadeInUp.delay(200).duration(1000).springify()}
            className="h-[225] w-[90]"
            source={img2}
          />
          <Animated.Image
            entering={FadeInUp.delay(400).duration(1000).springify()}
            className="h-[160] w-[65]"
            source={img2}
          />
        </View>

        {/* Signup Text */}
        <Animated.Text
          entering={FadeInUp.duration(1000).springify()}
          className="text-white font-bold tracking-wider text-4xl absolute top-40"
          style={{ zIndex: 2 }}
        >
          SignUp
        </Animated.Text>
      </View>

      {/* Form Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView edges={["bottom", "left", "right"]}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            style={{ marginTop: 450 }}
          >
            <View className="flex items-center mx-4 space-y-4">
              {/* Username Input */}
              <View className="bg-black/5 p-5 rounded-2xl w-full">
                <Controller
                  control={control}
                  name="name"
                  rules={{ required: "Username is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Username"
                      placeholderTextColor="black"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.username && (
                  <Text className="text-red-500">
                    {errors.username.message}
                  </Text>
                )}
              </View>

              {/* Email Input */}
              <View className="bg-black/5 p-5 rounded-2xl w-full">
                <Controller
                  control={control}
                  name="email"
                  rules={{ required: "Email is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor="black"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.email && (
                  <Text className="text-red-500">{errors.email.message}</Text>
                )}
              </View>

              {/* Password Input */}
              <View className="bg-black/5 p-5 rounded-2xl w-full mb-3">
                <Controller
                  control={control}
                  name="password"
                  rules={{ required: "Password is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor="black"
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.password && (
                  <Text className="text-red-500">
                    {errors.password.message}
                  </Text>
                )}
              </View>

              {/* Aadhar Number Input */}
              <View className="bg-black/5 p-5 rounded-2xl w-full mb-3">
                <Controller
                  control={control}
                  name="aadhar"
                  rules={{ required: "Aadhar Number is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Aadhar Number"
                      placeholderTextColor="black"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.aadhar && (
                  <Text className="text-red-500">{errors.aadhar.message}</Text>
                )}
              </View>

              {/* Mobile Number Input */}
              <View className="bg-black/5 p-5 rounded-2xl w-full mb-3">
                <Controller
                  control={control}
                  name="mobile"
                  rules={{ required: "Mobile Number is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Mobile Number"
                      placeholderTextColor="black"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.mobile && (
                  <Text className="text-red-500">{errors.mobile.message}</Text>
                )}
              </View>

              {/* Signup Button */}
              <View className="w-full">
                <TouchableOpacity
                  className="w-full bg-red-600 p-3 rounded-2xl mb-3"
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text className="text-xl font-bold text-center text-white">
                    SignUp
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Link */}
              <View
                className="justify-center flex-row"
                style={{ marginBottom: 0 }}
              >
                <Text>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.push("Login")}>
                  <Text className="text-sky-600">Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
