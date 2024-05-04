import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button, ButtonText, Container, Input, SignUpButton, SignUpText, Title } from "./styles";

export default function Login(){
    const [login, setLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function toggleLogin(){
        setLogin(!login);
        setName("");
        setEmail("");
        setPassword("");
    }

    function handleSignIn(){
        if(email === '' || password === ''){
            console.log("Preencha todos os campos");
            return;
        }

        // Fazer o Login do usuario
    }

    function handleSignUp(){
        if(name === '' || email === '' || password === ''){
            console.log("Preencha todos os campos para cadastrar");
            return;
        }
        
        //Cadastrar no app
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
                    <ButtonText>Acessar</ButtonText>
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
                <ButtonText>Cadastrar</ButtonText>
            </Button>

            <SignUpButton onPress={toggleLogin}>
                <SignUpText>Já tenho uma conta</SignUpText>
            </SignUpButton>
        </Container>
    )
}