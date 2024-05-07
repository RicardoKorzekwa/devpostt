import React, { useCallback, useContext, useState } from "react";
import Feather from 'react-native-vector-icons/Feather';
import { Container, ButtonPost, ListPosts } from "./styles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from "../../components/Header";
import { AuthContext } from "../../contexts/auth";
import firestore from '@react-native-firebase/firestore'
import { ActivityIndicator, Text, View } from "react-native";
import PostsList from "../../components/PostsList";

export default function Home(){
    const navigation = useNavigation();
    const {user} = useContext(AuthContext);

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [loadingRefresh, setLoadingRefresh] = useState(false);
    const [lastItem, setLastItem] = useState('');
    const [emptyList, setEmpityList] = useState(false);

    

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            function fetchPosts(){
                firestore().collection('posts')
                .orderBy('created', 'desc')
                .limit(7)
                .get()
                .then((snapshot) => {
                    if(isActive){
                        setPosts([]);
                        const postList = [];
                        snapshot.docs.map(u => {
                            postList.push({
                                ...u.data(),
                                id: u.id,
                            })
                        })
                        setPosts(postList);
                        setLastItem(snapshot.docs[snapshot.docs.length -1]);
                        setEmpityList(!!snapshot.empty);
                        setLoading(false);
                    }
                })
            }

            fetchPosts();
            

            return() => {
                isActive = false;
            }
        }, [])
    )

    async function handleRefreshPosts(){
        setLoadingRefresh(true);

        firestore().collection('posts')
        .orderBy('created', 'desc')
        .limit(6)
        .get()
        .then((snapshot) => {

            setPosts([]);
            const postList = [];

                snapshot.docs.map(u => {
                    postList.push({
                        ...u.data(),
                        id: u.id,
                    })
                })
                    
                setEmpityList(false);
                setPosts(postList);
                setLastItem(snapshot.docs[snapshot.docs.length -1]);
                setLoading(false);
            })

            setLoadingRefresh(false);
    }

    async function getListPosts(){
        if(emptyList){
            setLoading(false);
            return null;
        }

        if(loading) return;

        firestore().collection('posts')
        .orderBy('created', 'desc')
        .limit(7)
        .startAfter(lastItem)
        .get()
        .then((snapshot) => {
            const postList = [];
            snapshot.docs.map( u => {
                postList.push({
                    ...u.data(),
                    id: u.id
                })
            })
            setEmpityList(!!snapshot.empty);
            setLastItem(snapshot.docs[snapshot.docs.length -1]);
            setPosts(oldPosts => [...oldPosts, ...postList]);
            setLoading(false);
        })


    }

    return(
        <Container>
            <Header/>
            {
                loading ? (
                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                        <ActivityIndicator size={50} color="#E52246"/>
                    </View>
                ):
                (
                    <ListPosts
                        showsVerticalScrollIndicator={false}
                        data={posts}
                        renderItem={ ({item}) => (
                            <PostsList
                                data={item}
                                userId={user?.uid}
                            />
                        )}
                        refreshing={loadingRefresh}
                        onRefresh={handleRefreshPosts}
                        onEndReached={() => getListPosts()}
                        onEndReachedThreshold={0.1}
                    />
                )
            }
            <ButtonPost 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('NewPost')}
            >
                <Feather
                    name="edit-2"
                    color="#FFF"
                    size={25}
                />
            </ButtonPost>
        </Container>
    )
}