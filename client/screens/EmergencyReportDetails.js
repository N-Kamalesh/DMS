import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Alert, Button, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";

export default function EmergencyReportDetails() {
  const route = useRoute();
  const { id } = route.params; // Retrieve id from route parameters
  const [report, setReport] = useState(null);
  const [acknowledgedCount, setAcknowledgedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/emergency/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch report details");
        }
        const data = await response.json();
        setReport(data);
        setAcknowledgedCount(data.acknowledgment.accepts);
        setRejectedCount(data.acknowledgment.rejects);
      } catch (error) {
        Alert.alert("Error", "Could not load emergency report details.");
      }
    };

    fetchReportDetails();
  }, [id]);

  const handleAcknowledge = () => {
    if (!isAcknowledged && !isRejected) {
      setAcknowledgedCount(acknowledgedCount + 1);
      setIsAcknowledged(true);
    }
  };

  const handleReject = () => {
    if (!isAcknowledged && !isRejected) {
      setRejectedCount(rejectedCount + 1);
      setIsRejected(true);
    }
  };

  if (!report) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{report.description}</Text>
      <Text style={styles.reportedBy}>Reported by: {report.userEmail}</Text>

      <Text style={styles.sectionTitle}>Photos:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {report.photos.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: photo }}
            style={styles.photo}
          />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Location:</Text>
      <Text>Latitude: {report.location.latitude}</Text>
      <Text>Longitude: {report.location.longitude}</Text>

      <Text style={styles.sectionTitle}>Acknowledgment:</Text>
      <Text>Acknowledged: {acknowledgedCount}</Text>
      <Button
        title="Acknowledge"
        onPress={handleAcknowledge}
        color="#28a745"
        disabled={isAcknowledged || isRejected} // Disable if acknowledged or rejected
      />

      <Text style={styles.sectionTitle}>Rejection:</Text>
      <Text>Rejected: {rejectedCount}</Text>
      <Button
        title="Reject"
        onPress={handleReject}
        color="#dc3545"
        disabled={isAcknowledged || isRejected} // Disable if acknowledged or rejected
      />

      <View style={styles.donateButtonContainer}>
        <Button
          title="Donate Funds"
          onPress={() => navigation.navigate("Funds")}
          color="#1E90FF"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  reportedBy: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 8,
  },
  donateButtonContainer: {
    marginTop: 20,
  },
});
