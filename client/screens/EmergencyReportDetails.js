import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  Button,
  StyleSheet,
  TextInput,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EmergencyReportDetails() {
  const route = useRoute();
  const { id } = route.params;
  const [report, setReport] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const navigation = useNavigation();

  async function fetchReportDetails() {
    try {
      const email = await AsyncStorage.getItem("email");
      setUserEmail(email);
      console.log(email);
      const response = await fetch(`${API_URL}/emergency/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch report details");
      }
      const data = await response.json();
      if (response.ok) {
        setReport(data);
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  async function handleAcknowledge(option) {
    try {
      const response = await fetch(`${API_URL}/emergency/acknowledge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, email: userEmail, option }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch report details");
      }
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message);
        fetchReportDetails();
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  async function handleAddComment() {
    try {
      const response = await fetch(`${API_URL}/emergency/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, email: userEmail, comment }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Comment added successfully");
        setComment("");
        setShowCommentBox(false);
        fetchReportDetails();
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  if (!report)
    return (
      <View className="h-screen w-full flex justify-center items-center">
        <Text className="text-2xl">Loading...</Text>
      </View>
    );

  return (
    <ScrollView className="mt-8 p-6 bg-white">
      <Text className="mb-1 font-bold text-2xl text-red-600">
        {report.description}
      </Text>
      <Text className="mb-2 text-base text-gray-400">
        Reported by {report.userEmail == userEmail ? "you" : report.userEmail}
      </Text>

      <Text className="text-lg font-semibold mt-4 mb-1">Photos:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {report.photos.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: photo }}
            className="h-40 w-40 rounded-xl m-2"
          />
        ))}
      </ScrollView>

      <Text className="my-4 w-full text-center p-1 bg-blue-600">
        {report.status}
      </Text>
      <Text className="text-lg font-semibold mt-4 mb-1">Comments:</Text>
      <ScrollView
        style={{ maxHeight: 200 }}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        {report.comments.length > 0 ? (
          report.comments.map((comment, index) => (
            <View key={index} className="bg-red-600 p-2 mb-2 rounded-lg shadow">
              <Text className="text-base font-semibold text-white">
                {comment.email === userEmail ? "You" : comment.email}:
              </Text>
              <Text className="text-sm text-red-100">{comment.message}</Text>
              <Text className="text-xs text-red-300">
                {new Date(comment.timestamp).toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-sm text-gray-500">No comments yet.</Text>
        )}
      </ScrollView>

      <Text className="text-lg font-semibold mt-4 mb-1">Location:</Text>
      <Text className="mb-2">Latitude: {report.location.latitude}</Text>
      <Text>Longitude: {report.location.longitude}</Text>

      <Text className="text-lg font-semibold mt-4 mb-1">Acknowledgment:</Text>
      <Text className="mb-2">Accepted: {report.acknowledgment.accepts}</Text>
      {userEmail !== report.userEmail && (
        <Button
          title={
            report.acceptedUsers.includes(userEmail)
              ? "Accepted"
              : report.rejectedUsers.includes(userEmail)
              ? "Acknowledged"
              : "Accept"
          }
          onPress={() => handleAcknowledge("accept")}
          disabled={
            report.acceptedUsers.includes(userEmail) ||
            report.rejectedUsers.includes(userEmail)
          }
          color="#28a745"
        />
      )}

      <Text className="my-2">Rejected: {report.acknowledgment.rejects}</Text>
      {userEmail !== report.userEmail && (
        <Button
          title={
            report.rejectedUsers.includes(userEmail)
              ? "Rejected"
              : report.acceptedUsers.includes(userEmail)
              ? "Acknowledged"
              : "Reject"
          }
          onPress={() => handleAcknowledge("reject")}
          disabled={
            report.acceptedUsers.includes(userEmail) ||
            report.rejectedUsers.includes(userEmail)
          }
          color="#dc3545"
        />
      )}
      <View className="mt-5">
        <Button
          title="Add Comments"
          onPress={() => setShowCommentBox(true)}
          color="#FFA500"
        />
      </View>

      {showCommentBox && (
        <View className="mt-4">
          <TextInput
            placeholder="Enter your comment"
            value={comment}
            onChangeText={setComment}
            className="border border-gray-300 rounded-md p-2 mb-2"
            multiline
          />
          <Button title="Submit Comment" onPress={handleAddComment} />
        </View>
      )}
      <View className="mt-5 mb-10">
        <Button
          title="Donate Funds"
          onPress={() => navigation.navigate("Funds")}
          color="#1E90FF"
        />
      </View>
    </ScrollView>
  );
}
