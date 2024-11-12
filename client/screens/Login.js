import {
  View,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "react-native-web";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useNavigation } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import img1 from "../assets/background1.png";
import img2 from "../assets/light.png";
import { API_URL } from "@env";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Login() {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    reset,
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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to login");

      const responseData = await response.json();
      await AsyncStorage.setItem("token", responseData.token);
      await AsyncStorage.setItem("email",responseData.email)
      reset();
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <View className="bg-white h-full w-full">
      <StatusBar style="light" />

      {/* Background Image (img1 above email field, covering img2 and login text) */}
      <Image
        source={img1}
        style={{
          position: "absolute",
          width: "100%",
          height: 350, // Adjust height to cover img2 and login text
          resizeMode: "cover",
          zIndex: -1,
        }}
      />

      {/* Top Container with Overlay and Text */}
      <View className="absolute top-0 w-full h-[350] items-center z-10">
        {/* Overlay Image */}
        <View className="flex-row justify-around w-full absolute top-10" style={{ zIndex: 1 }}>
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

        {/* Login Text on Top */}
        <Animated.Text
          entering={FadeInUp.duration(1000).springify()}
          className="text-white font-bold tracking-wider text-4xl absolute top-40"
          style={{ zIndex: 2 }}
        >
          Login
        </Animated.Text>
      </View>

      {/* Form Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeAreaView edges={["bottom", "left", "right"]}>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraScrollHeight={Platform.OS === "android" ? 100 : 0}
            enableAutomaticScroll
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            style={{ marginTop: 350 }} // Ensure the form starts below img1
          >
            <View className="flex items-center mx-4 space-y-4">
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
                  <Text className="text-red-500">{errors.password.message}</Text>
                )}
              </View>

              <View className="w-full">
                <TouchableOpacity
                  className="w-full bg-red-600 p-3 rounded-2xl mb-3"
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text className="text-xl font-bold text-center text-white">
                    Login
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="justify-center flex-row" style={{ marginBottom: 0 }}>
                <Text>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.push("Signup")}>
                  <Text className="text-sky-600">SignUp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
