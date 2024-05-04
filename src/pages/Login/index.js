import React, { useState, useContext } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Button, ButtonText, Container, Input, SignUpButton, SignUpText, Title } from "./styles";

import { AuthContext } from "../../contexts/auth";

export default function Login(){
    const [login, setLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signUp, signIn, loadingAuth } = useContext(AuthContext);

    function toggleLogin(){
        setLogin(!login);
        setName("");
        setEmail("");
        setPassword("");
    }

    async function handleSignIn(){
        if(email === '' || password === ''){
            console.log("Preencha todos os campos");
            return;
        }

        await signIn(email, password);
    }

    async function handleSignUp(){
        if(name === '' || email === '' || password === ''){
            console.log("Preencha todos os campos para cadastrar");
            return;
        }
        
        await signUp(email, password, name);
    }

    if(login){
        return(
            <Container>
                <Title>
                    Dev<Text style={{color: '#E52246'}}>Post</Text>
                </Title>
    
                <Input 
                    placeholder="seuemail@teste.com"
                    value={email}
                    onChangeText={ (text) => setEmail(text) }
                />
                <Input 
                    placeholder="******"
                    value={password}
                    onChangeText={ (text) => setPassword(text) }
                />
    
                <Button onPress={handleSignIn}>
                    {!loadingAuth ? <ButtonText>Acessar</ButtonText> : <ButtonText><ActivityIndicator size={20} color="#FFF"/></ButtonText>}
                    
                </Button>
    
                <SignUpButton onPress={toggleLogin}>
                    <SignUpText>Criar uma conta</SignUpText>
                </SignUpButton>
            </Container>
        )
    }

    return(
        <Container>
            <Title>
                Dev<Text style={{color: '#E52246'}}>Post</Text>
            </Title>

            <Input 
                placeholder="Seu Nome"
                value={name}
                onChangeText={ (text) => setName(text) }
            />
            
            <Input 
                placeholder="seuemail@teste.com"
                value={email}
                onChangeText={ (text) => setEmail(text) }
            />
            
            <Input 
                placeholder="******"
                value={password}
                onChangeText={ (text) => setPassword(text) }
            />

            <Button onPress={handleSignUp}>
            {!loadingAuth ? <ButtonText>Cadastrar</ButtonText> : <ButtonText><ActivityIndicator size={20} color="#FFF"/></ButtonText>}
            </Button>

            <SignUpButton onPress={toggleLogin}>
                <SignUpText>Já tenho uma conta</SignUpText>
            </SignUpButton>
        </Container>
    )
}