import React, { useContext, useLayoutEffect, useState } from "react";

import { Button, ButtonText, Container, Input } from "./styles";
import { useNavigation } from "@react-navigation/native";


import firestore from "@react-native-firebase/firestore";
import storage from '@react-native-firebase/storage'
import { AuthContext } from "../../contexts/auth";


export default function NewPost(){
    const navigation = useNavigation();
    const [post, setPost] = useState("");
    const {user} = useContext(AuthContext);

    useLayoutEffect(() => {
        const options = navigation.setOptions({
            headerRight: () => (
                <Button onPress={() => handlePost()}>
                    <ButtonText>Compartilhar</ButtonText>
                </Button>
            )
        })
    }, [navigation, post]);

    async function handlePost(){
        if(post === ''){
            console.log('Conteudo invalido');
            return;
        }

        let avatarUrl = null;

        try {
            let response = await storage().ref('users').child(user?.uid).getDownloadURL();
            avatarUrl = response;
        } catch (error) {
            avatarUrl = null;
        }

        await firestore().collection('posts')
        .add({
            created: new Date(),
            content: post,
            autor: user?.nome,
            userId: user?.uid,
            likes: 0,
            avatarUrl,    
        })
        .then(() => {
            setPost('');
            console.log('Post criado com sucesso!')
        })
        .catch((err) => {
            console.log(`Error: ${err}`)
        })

        navigation.goBack();
    }

    return(
        <Container>
            <Input 
                placeholder="O que está acontecendo?"
                value={post}
                onChangeText={(text) => setPost(text)}
                autoCorrect={false}
                multiline={true}
                placeholderTextColor="#DDD"
                maxLength={300}
            />
        </Container>
    )
}