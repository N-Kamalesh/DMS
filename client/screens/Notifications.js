import * as React from 'react';
import { Button, View } from 'react-native';
// import SendSMS from 'react-native-sms';
import * as SMS from 'expo-sms';
import { useState,useEffect } from 'react';
export default function Notifications({ navigation }) {
  const [isAvailable,setIsAvailable]=useState(false);
  const [phone,setPhone]=useState(undefined);
  const [message,setMessage]=useState(undefined);
  useEffect(() => {
    async function check(){
      const isSmsAvailable=await SMS.isAvailableAsync();
      setIsAvailable(isSmsAvailable);
    }
    check();
  },[]);

  const sendSms=async ()=>{
    const {result} =await SMS.sendSMSAsync(
      ['6381086085'],
      'Sample message'
    );
    console.log(result);
  };
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Send Emergency SMS" onPress={sendSms} />
    </View>

    );
}
  