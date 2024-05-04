import React, {useState, createContext, useEffect} from "react";

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({});

function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [loadingAuth, setLoadingAuth] = useState(false);

    useEffect(() => {
        async function loadStorage(){
            const storageUser = await AsyncStorage.getItem('@devapp');

            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }
                setLoading(false);
        }

        loadStorage();
    }, [])

    async function signUp(email, password, name){
        
        setLoadingAuth(true);

        await auth().createUserWithEmailAndPassword(email, password)
        .then( async (value) => {
            let uid = value.user.uid;
            await firestore().collection('users')
            .doc(uid).set({
                nome: name,
                createdAt: new Date(),
            })
            .then(()=>{
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email
                }
    
                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
            })
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
            setLoadingAuth(false);
        })
    }

    async function signIn(email, password){

        setLoadingAuth(true);

        await auth().signInWithEmailAndPassword(email, password)
        .then(async (value) => {
            let uid = value.user.uid;

            const userProfile = await firestore().collection('users')
            .doc(uid).get();

            let data = {
                uid,
                nome: userProfile.data().nome,
                email: userProfile.data().email
            };

            setUser(data);
            setLoadingAuth(false);
            storageUser(data);
        })
        .catch((err) =>{
            console.log(`Error: ${err}`);
            setLoadingAuth(false);
        })
    }

    async function storageUser(data){
     
        await AsyncStorage.setItem('@devapp', JSON.stringify(data));
    
    }

    async function signOut(){

        await auth().signOut();

        await AsyncStorage.clear()
        .then(() => {
            setUser(null);
        });
    }
    return(
        <AuthContext.Provider value={{signed: !!user, signUp, signIn, signOut, loadingAuth, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;