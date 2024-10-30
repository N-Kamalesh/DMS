import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TrackResponse from './TrackResponse';
import ReportEmergency from './ReportEmergency';
import Notifications from './Notifications';
import HomeScreen from './HomeScreen';
const Drawer = createDrawerNavigator();

export default function Home() {
  return (
    <Drawer.Navigator initialRouteName="Homescreen">
      <Drawer.Screen name="Homescreen" component={HomeScreen} />
      <Drawer.Screen name="Notifications" component={Notifications} />
      <Drawer.Screen name="Track" component={TrackResponse} />
      <Drawer.Screen name="Report" component={ReportEmergency} />
    </Drawer.Navigator>
  );
}
