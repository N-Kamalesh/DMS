import { View, Text,Image, TextInput} from 'react-native'
import React from 'react'
import img1 from '../assets/background.png'
import img2 from '../assets/light.png'
import { StatusBar } from 'react-native-web'
import { TouchableOpacity } from 'react-native'
import Animated,{ FadeIn, FadeInUp, FadeOut } from 'react-native-reanimated';
import { useNavigation } from 'expo-router'

export default function Signup() {
  const navigation=useNavigation();
  return (
    <View className="bg-white h-full w-full">
      <StatusBar style='light' />
      <Image className="h-full w-full absolute" source={img1} />
      <View className="flex-row justify-around w-full absolute">
        <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className="h-[225] w-[90]" source={img2} />
        <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify()} className="h-[160] w-[65]" source={img2} />
      </View>

      <View className="h-full w-full flex justify-around pt-48">
        <View className="flex items-center">
          <Animated.Text entering={FadeInUp.duration(1000).springify()} className="text-white font-bold tracking-wider text-5xl">
            SignUp
          </Animated.Text>
        </View>
        <View className="flex items-center mx-4 space-y-4">
        <View className="bg-black/5 p-5 rounded-2xl w-full">
            <TextInput placeholder='Usermname' placeholderTextColor="#888888" />
          </View>
          <View className="bg-black/5 p-5 rounded-2xl w-full">
            <TextInput placeholder='Email' placeholderTextColor="#888888" />
          </View>
          <View className="bg-black/5 p-5 rounded-2xl w-full mb-3">
            <TextInput placeholder='Password' placeholderTextColor="#888888" secureTextEntry />
          </View>
          <View className="w-full">
            <TouchableOpacity className="w-full bg-sky-400 p-3 rounded-2xl mb-3">
              <Text className="text-xl font-bold text-center text-white">SignUp</Text>
            </TouchableOpacity>
          </View>
          <View className="justify-center flex-row">
            <Text>Already have an account?</Text>
            <TouchableOpacity onPress={()=>navigation.push('Login')}>
              <Text className="text-sky-600">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}