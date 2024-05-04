import React from "react";
import { StatusBar, Text, View } from "react-native";

import Routes from "./src/routes";
import { NavigationContainer } from "@react-navigation/native";

export default function App(){
  return(
    <NavigationContainer>
      <StatusBar backgroundColor="#36393F" barStyle="light-content" translucent={false}/>
      <Routes/>
    </NavigationContainer>
  )
}