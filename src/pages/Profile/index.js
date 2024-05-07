import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import { Container, Name, Email, Button, ButtonText, UpLoadButton, UploadText, Avatar, ModalContainer, ButtonBack, Input } from "./styles";
import { Modal, Platform } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import firestore from "@react-native-firebase/firestore";
import { launchImageLibrary } from "react-native-image-picker";
import storage from '@react-native-firebase/storage';


export default function Profile(){
    const { signOut, user, setUser, storageUser } = useContext(AuthContext);
    const [nome, setNome] = useState(user?.nome);
    const [url, setUrl] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        let isActive = true;

        async function loadAvatar(){
            try {
                if(isActive){
                    let response = await storage().ref('users').child(user?.uid).getDownloadURL();
                    setUrl(response);                
                }
            } catch (err) {
                console.log(`Imagem não encontrada: ${err}`)
            }
        }

        loadAvatar();

        return () => isActive = false;
    }, [])


    async function handleSignOut(){
        await signOut();
    }

    async function updateProfile(){
        if(nome === ''){
            return;
        }

        await firestore().collection('users')
        .doc(user?.uid)
        .update({
            nome: nome
        })

        const postDocs = await firestore().collection('posts')
        .where('userId', '==', user?.uid)
        .get();

        postDocs.forEach( async (doc) => {
            await firestore().collection('posts').doc(doc.id)
            .update({
                autor: nome
            })
        })

        let data = {
            uid: user.uid,
            nome: nome,
            email: user.email
        }

        setUser(data);
        storageUser(data);
        setOpen(false);

        
    }

    const uploadFile = () => {
        const options = {
            noData: true,
            mediaType: 'photo'
        }

        launchImageLibrary(options, response => {
            if(response.didCancel){
                console.log('cancelou');
            }else if(response.errorMessage){
                console.log(response.errorMessage);
            }else{
                uploadFileFirebase(response)
                .then(() => {
                    uploadAvatarPosts();
                })
                setUrl(response.assets[0].uri)
            }
        })
    }

    const getFileLocalPath = (response) => {
        console.log(response.assets[0].uri)
        return response.assets[0].uri
    }

    const uploadFileFirebase = async (response) => {
        const fileSource = getFileLocalPath(response);
        const storageRef = storage().ref('users').child(user?.uid);
        return await storageRef.putFile(fileSource);
    }

    const uploadAvatarPosts = async () =>{
        const storageRef = storage().ref('users').child(user?.uid);
        const url = await storageRef.getDownloadURL()
        .then( async (image) => {
            const postDocs = await firestore().collection('posts')
            .where('userId', '==', user.uid).get();

            postDocs.forEach( async (u) => {
                await firestore().collection('posts').doc(u.id).update({
                    avatarUrl: image
                })
            })
        })
        .catch((err) => {
            console.log(`Erro ao salvar a imagem: ${err}`)
        })
    }

    return(
        <Container>
            <Header/>

            {url ? (
                <UpLoadButton onPress={() => uploadFile()}>
                    <UploadText>+</UploadText>
                    <Avatar
                        source={{uri: url}}
                    />
                </UpLoadButton>
            ): (
                <UpLoadButton onPress={() => uploadFile()}>
                    <UploadText>+</UploadText>
                    <Avatar
                        source={require('../../assets/avatar.png')}
                    />
                </UpLoadButton>
            )}

            <Name>{user?.nome}</Name>
            <Email>{user?.email}</Email>

            <Button bg="#428CFD" onPress={() => setOpen(true)}>
                <ButtonText color="#FFF">Atualizar Perfil</ButtonText>
            </Button>

            <Button bg="#DDD" onPress={handleSignOut}>
                <ButtonText color="#353840">Sair</ButtonText>
            </Button>

            <Modal visible={open} animationType="slide" transparent={true}>
                <ModalContainer behavior={Platform.OS === 'android' ? '' : 'padding'}>
                    <ButtonBack onPress={() => setOpen(false)}>
                        <Feather name='arrow-left' size={22} color='#121212'/>
                        <ButtonText color="#121212">Voltar</ButtonText>
                    </ButtonBack>

                    <Input 
                        placeholder={user?.nome}
                        value={nome}
                        onChangeText={(text) => setNome(text)}
                    />

                    <Button bg="#428CFD" onPress={updateProfile}>
                        <ButtonText color="#FFF">Salvar</ButtonText>
                    </Button>

                </ModalContainer>
            </Modal>
        </Container>
    )
}