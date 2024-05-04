import React from "react";
import { StatusBar, Text, View } from "react-native";

import Routes from "./src/routes";
import { NavigationContainer } from "@react-navigation/native";

import AuthProvider from "./src/contexts/auth";

export default function App(){
  return(
    <NavigationContainer>
      <AuthProvider>
        <StatusBar backgroundColor="#36393F" barStyle="light-content" translucent={false}/>
        <Routes/>
      </AuthProvider>
    </NavigationContainer>
  )
}