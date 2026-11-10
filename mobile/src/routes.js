/*
 * routes.js · navegação em pilha: mapa (Main) e perfil do GitHub (Profile), com React Navigation 7.
 */
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Main from "./pages/Main";
import Profile from "./pages/Profile";

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerTintColor: "#FFF",
  headerBackButtonDisplayMode: "minimal",
  headerStyle: { backgroundColor: "#7D40E7" },
};

/* Pilha de telas do app. */
export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main" screenOptions={screenOptions}>
        <Stack.Screen name="Main" component={Main} options={{ title: "DevRadar" }} />
        <Stack.Screen name="Profile" component={Profile} options={{ title: "Perfil no GitHub" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
/* fim de routes.js */
