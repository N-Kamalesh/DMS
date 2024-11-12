import { Text, ScrollView, Alert, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { API_URL } from "@env";

export default function Notifications() {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function getNotifications() {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/notification`);
        const data = await response.json();
        if (response.ok) {
          setNotifications(data);
        } else {
          Alert.alert("Error", data.error);
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Error", error.message);
      } finally {
        setIsLoading(false);
      }
    }
    getNotifications();
  }, [isFocused]);

  if (isLoading) {
    return (
      <View className="h-screen w-full flex justify-center items-center">
        <Text className="text-2xl">Loading...</Text>
      </View>
    );
  }
  return (
    <>
      {notifications.length == 0 ? (
        <View className="h-screen w-full flex justify-center items-center">
          <Text className="text-2xl">No notifications yet</Text>
        </View>
      ) : (
        <View className="my-8 px-6 flex flex-col items-center space-y-4">
          {notifications.map((note) => (
            <View
              key={note._id}
              className="rounded-lg bg-red-600 px-4 space-y-2 py-3 w-full"
            >
              <Text className="text-xl font-bold text-red-50">
                {note.title}
              </Text>
              <Text className="text-md font-medium text-red-200">
                {note.desc}
              </Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}
