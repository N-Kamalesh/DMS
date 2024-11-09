import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Alert } from "react-native";
import { API_URL } from "@env";

export default function EmergencyReportDetails() {
  const id = "672cf00dcca7fbc5bacb1e77";
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/emergency/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch report details");
        }
        const data = await response.json();
        setReport(data);
      } catch (error) {
        Alert.alert("Error", "Could not load emergency report details.");
      }
    };

    fetchReportDetails();
  }, [id]);

  if (!report) return <Text>Loading...</Text>;

  return (
    <ScrollView className="p-5 bg-[#f9f9f9]">
      <Text className="text-2xl font-bold mb-2">{report.description}</Text>
      <Text className="text-md text-gray-600 mb-4">
        Reported by: {report.userEmail}
      </Text>

      <Text className="text-lg font-semibold mt-2">Photos:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {report.photos.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: photo }}
            className="w-40 h-40 rounded-lg m-2"
          />
        ))}
      </ScrollView>

      <Text className="text-lg font-semibold mt-4">Location:</Text>
      <Text>Latitude: {report.location.latitude}</Text>
      <Text>Longitude: {report.location.longitude}</Text>

      <Text className="text-lg font-semibold mt-4">Acknowledgment:</Text>
      <Text>Accepted: {report.acknowledgment.accepts}</Text>
      <Text>Rejected: {report.acknowledgment.rejects}</Text>
    </ScrollView>
  );
}
