import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useEffect } from "react";
import img1 from "../assets/background.png";
import img2 from "../assets/light.png";
import { StatusBar } from "react-native-web";
import { TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useNavigation } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

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
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Log response status and body for debugging
      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData); // Check the response data

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to register");
      }

      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <View className="bg-white h-full w-full">
      <StatusBar style="light" />
      <Image className="h-full w-full absolute" source={img1} />
      <View className="flex-row justify-around w-full absolute">
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
      <View className="h-full w-full flex justify-around pt-48">
        <View className="flex items-center pt-10">
          <Animated.Text
            entering={FadeInUp.duration(1000).springify()}
            style={{
              fontWeight: "bold",
              letterSpacing: 1,
              fontSize: 40,
              flexDirection: "row",
              padding: 55,
            }}
          >
            <Text style={{ color: "black" }}>Sign</Text>
            <Text style={{ color: "black" }}>Up</Text>
          </Animated.Text>
        </View>
        <SafeAreaView style={{ flex: 3 }}>
          <ScrollView
            style={{ marginTop: 30, paddingTop: StatusBar.currentHeight }}
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

              {/* Location Input */}
              <View className="bg-black/5 p-5 rounded-2xl w-full mb-3">
                <Controller
                  control={control}
                  name="location"
                  rules={{ required: "Location is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Location"
                      placeholderTextColor="black"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.location && (
                  <Text className="text-red-500">
                    {errors.location.message}
                  </Text>
                )}
              </View>

              {/* Signup Button */}
              <View className="w-full">
                <TouchableOpacity
                  className="w-full bg-sky-400 p-3 rounded-2xl mb-3"
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text className="text-xl font-bold text-center text-white">
                    SignUp
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Link */}
              <View className="justify-center flex-row margin 30">
                <Text>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.push("Login")}>
                  <Text className="text-sky-600">Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
}
