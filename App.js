import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HardwareProvider } from "./src/context/HardwareContext";

import Build from "./src/screens/BuildScreen";
import Home from "./src/screens/HomeScreen";
import Result from "./src/screens/ResultScreen";
import Saved from "./src/screens/SavedScreen"; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <HardwareProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Build" component={Build} />
          <Stack.Screen name="Result" component={Result} />
          <Stack.Screen name="Saved" component={Saved} />
        </Stack.Navigator>
      </NavigationContainer>
    </HardwareProvider>
  );
}
