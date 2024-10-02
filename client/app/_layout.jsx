import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Signup from '../screens/Signup';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer independent={true}> 
      <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}} >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
