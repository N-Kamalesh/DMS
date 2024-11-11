import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Home from "../screens/Home";
import EmergencyReportDetails from "../screens/EmergencyReportDetails";
import { useEffect, useState } from "react";
import { Text } from "react-native";
const Stack = createNativeStackNavigator();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    setAppReady(true);
  }, []);

  if (!appReady) return <Text>Loading</Text>;
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="EmergencyReportDetails"
          component={EmergencyReportDetails}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
