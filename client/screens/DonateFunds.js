import React, { useState } from 'react';
import { View, Button, Alert, Text, TextInput } from 'react-native';
import { Linking } from 'react-native';

export default function DonateFunds() {
  const [amount, setAmount] = useState('');

  const upiPayment = async () => {
    // Validate the amount entered
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to proceed.');
      return;
    }

    // Replace with your actual UPI ID (e.g., your-business@upi)
    const upiID = 'kamaltvt579@oksbi'; // Example UPI ID

    // UPI payment URL format
    const upiURL = `upi://pay?pa=${upiID}&pn=DMU&mc=0000&tid=txn1234&tr=unique-trx-id&am=${amount}&cu=INR&url=https://yourwebsite.com`;

    try {
      // Check if UPI app is installed
      const supported = await Linking.canOpenURL(upiURL);
      if (supported) {
        setAmount(''); // Clear amount field after initiating payment
        await Linking.openURL(upiURL); // Open UPI app
      } else {
        Alert.alert('Error', 'No UPI app found. Please install a UPI app (e.g., GPay, PhonePe, Paytm) to complete the transaction.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while trying to initiate payment');
      console.error(error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter Amount to Donate:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginVertical: 10,
          borderRadius: 5,
          width: '100%',
        }}
        placeholder="Enter amount in INR"
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />
      <Button title="Pay Now" onPress={upiPayment} />
    </View>
  );
}
