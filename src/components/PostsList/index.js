import React, { useState } from "react";

import { 
    Container,
    Name, 
    Header, 
    Avatar, 
    ContentView, 
    Content, 
    Actions, 
    LikeButton, 
    Like, 
    TimePost 
} from "./styles";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";


export default function PostsList({data, userId}){
    const [likePost, setLikePost] = useState(data?.likes);
    const navigation = useNavigation();

    async function handleLikePost(id, likes){
        const docId = `${userId}_${id}`;
        const doc = await firestore().collection('likes')
        .doc(docId)
        .get();

        if(doc.exists){
            await firestore().collection('posts')
            .doc(id).update({
                likes: likes -1
            })

            await firestore().collection('likes').doc(docId).delete()
            .then(() => {
                setLikePost(likes -1);
            })

            return;

        }

        await firestore().collection('likes')
        .doc(docId).set({
            postId: id,
            userId: userId
        })

        await firestore().collection('posts')
        .doc(id).update({
            likes: likes + 1
        })
        .then(() => {
            setLikePost(likes + 1);
        })


    }

    function formatTimePost(){
        let datePost = new Date(data.created.seconds * 1000);
        if(isNaN(datePost)){
            datePost = 0;
        }
        return formatDistance(
            new Date(),
            datePost,
            {
                locale: ptBR
            }
        )
    }

    return(
        <Container>
            <Header onPress={() => navigation.navigate('PostsUser', { title: data.autor, userId: data.userId })}>
                {data.avatarUrl ? (
                    <Avatar
                    source={{ uri: data.avatarUrl }}
                />
                ):(
                    <Avatar
                        source={require('../../assets/avatar.png')}
                    />
                   )
                }
                
                <Name numberOfLines={1}>
                    {data?.autor}
                </Name>
            </Header>
            <ContentView>
                <Content>
                    {data?.content}
                </Content>
            </ContentView>
            <Actions>
                <LikeButton onPress={ () => handleLikePost(data.id, likePost) }>
                    <Like>
                        {likePost === 0 ? '' : likePost}
                    </Like>
                    <MaterialCommunityIcons
                        name={likePost === 0 ? "heart-plus-outline" : "cards-heart"}
                        size={20}
                        color="#E52246"
                    />
                </LikeButton>
                <TimePost>
                    {data.created ? formatTimePost() : 'há algum tempo'}
                </TimePost>
            </Actions>
        </Container>
    )
}