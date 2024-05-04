import React, { useContext } from "react";
import { Text, View, Button } from "react-native";

import { AuthContext } from "../../contexts/auth";

export default function Profile(){
    const { signOut } = useContext(AuthContext);

    async function handleSignOut(){
        signOut();
    }

    return(
        <View>
            <Text>Página Profile</Text>
            <Button title="Sair" onPress={handleSignOut}/>
        </View>
    )
}