import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Search from "../pages/Search";
// import NewPost from "../pages/NewPost";
// import PostsUser from "../pages/PostsUser";

const Tab = createBottomTabNavigator();

export default function AppRoutes(){
    return(
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} options={{headerShown: false}}/>
            <Tab.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
            <Tab.Screen name="Search" component={Search} options={{headerShown: false}}/>
            {/* <Tab.Screen name="NewPost" component={NewPost} options={{headerShown: false}}/> */}
            {/* <Tab.Screen name="PostsUser" component={PostsUser} options={{headerShown: false}}/> */}
        </Tab.Navigator>
    )
}