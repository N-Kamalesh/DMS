// CustomDrawerContent.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // Clear token
      await AsyncStorage.removeItem("email"); // Clear token
      navigation.navigate("Login"); // Navigate to Login screen
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ flex: 1 }}>
        <DrawerItemList {...props} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    padding: 15,
    backgroundColor: "red",
    margin: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default CustomDrawerContent;
