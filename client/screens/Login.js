import { View, Text, Image, TextInput } from "react-native";
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
    console.log(API_URL);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const responseData = await response.json();
      await AsyncStorage.setItem("token", responseData.token); // Store token if received
      await AsyncStorage.setItem("email", responseData.email);
      reset();
      navigation.navigate("Home"); // Redirect to Home on successful login
    } catch (error) {
      console.error("Error logging in:", error);
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

      <View className="h-full w-full flex justify-around pt-40 pb-10">
        <View className="flex items-center">
          <Animated.Text
            entering={FadeInUp.duration(1000).springify()}
            className="text-white font-bold tracking-wider text-5xl"
          >
            Login
          </Animated.Text>
        </View>

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
              className="w-full bg-sky-400 p-3 rounded-2xl mb-3"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-xl font-bold text-center text-white">
                Login
              </Text>
            </TouchableOpacity>
          </View>

          <View className="justify-center flex-row">
            <Text>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.push("Signup")}>
              <Text className="text-sky-600">SignUp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
