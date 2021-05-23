import React, { useState, useEffect } from "react";
import RNEventSource from 'react-native-event-source'
import { Text, View, Button, TextInput, Image, KeyboardAvoidingView, Platform, StyleSheet, ImageBackground } from "react-native";
import { v4 as uuidv4 } from 'uuid';
let uuid = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
let uidArr = uuid.split('-');
const screenId = uidArr[0];
//let screenText = screenId;
import baseUrl from "./baseUrl";
const usersBaseUrl = baseUrl.localBaseUrl + "users/";
import { useDispatch} from "react-redux";
import * as SecureStore from 'expo-secure-store';
import backImage from "./assets/splash.jpg"

const connectRequest = new Request(`${usersBaseUrl}${screenId}`, {
    method: 'POST',
    body: `{"id": ${screenId}`
});

export default function home({ navigation }) {
    const dispatch = useDispatch();
    const [screenText, setScreenText] = useState(screenId);
    const [userId, setuserId] = useState('');
    const [IsConnected, setIsConnected] = useState(false);
    const [codeUpdated, setCodeUpdated] = useState(false);
    const [eventSource, setEventSource] = useState();
    const [screenData, setScreenData] = useState('')
    const [ConnectionText, setConnectionText] = useState("Please insert the code below to your device");


    function sendConnectRequest() {
        fetch(connectRequest)
            .then(response => {
                if (response.status === 200 && IsConnected === false) {
                    startListenToServer();
                } else {
                    throw new Error('Something went wrong on api server!');
                }
            }).catch(error => {
                console.log('entry Home screen error');
                console.error(error);
            });
    }

    // function stopListenToServer(){
    //     eventSource.removeAllListeners();
    //     eventSource.close();
    // }

    function startListenToServer() {
        const eventSource = new RNEventSource(`${usersBaseUrl}Listen/${screenId}`);
        eventSource.addEventListener('ping', e => {
            let data = JSON.parse(e.data);
            if (data.connectRequest === true && codeUpdated === false) {
                setuserId(data.userId);
                setConnectionText("Almost there, just enter the code below");
                setScreenText(data.code);
                console.log(data);
                console.log(screenText);
                setCodeUpdated(true)
            }
            // console.log(e);
            if (data.isConnected === true && IsConnected === false) {
                setIsConnected(true);
                eventSource.removeAllListeners();
                eventSource.close();
                console.log("move to home page now!");
                console.log("screenId from home " + screenId);
                console.log("userId from home " + data.userId);

                saveData(screenId, data.userId);

                dispatch({
                    type: "screen_id",
                    data: { screenId: screenId }
                });
                dispatch({
                    type: "user_id",
                    data: { userId: data.userId }
                });
                navigation.navigate("Home2", {
                });

            }
        });
    }

    const saveData = async (screenId, userId) => {
        SecureStore.setItemAsync('userId', userId.toString());
        SecureStore.setItemAsync('screenId', screenId.toString());
        setuserId(userId);
        setScreenData(screenId);
    }

    useEffect(() => {
        sendConnectRequest()
    }, [])

    return (

        <View style={styles.screen}>
            <ImageBackground source={backImage} style={styles.image}>
                <View style={styles.word}>
                    <Text style={styles.Title}>Welcome to Fly-View </Text>
                    <View style={styles.space}>
                        <Text style={styles.body}>{ConnectionText} </Text>
                        <Text style={styles.body}>{screenText} </Text>
                    </View>
                    <KeyboardAvoidingView behavior="padding" />
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    space: {
        width: 20, // or whatever size you need
        height: 20,
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
    },
    Title: {
        fontFamily: 'Oswald-Bold',
        fontSize: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        fontFamily: 'Oswald-Bold',
        fontSize: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    word: {
        alignItems: 'center',   
        justifyContent: 'space-around',
        flexDirection: 'column',
    },
    space: {
        marginVertical: 300,
        flexDirection: 'column',
        alignItems: 'center',

    }
});
