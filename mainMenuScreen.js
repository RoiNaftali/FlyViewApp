import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, View, Button, TextInput, Image, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, TouchableNativeFeedback, ImageBackground } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useDispatch } from "react-redux";
import backImage from "./assets/splash.jpg"
import colors from "./constants/Colors";


export default function mainMenuScreen({ navigation }) {
    const dispatch = useDispatch();
    const userId = navigation.getParam('userId');
    const screenId = navigation.getParam('screenId');
    console.log("userId from main " + userId);
    console.log("screenId from main " + screenId);
    let ButtonComponent = TouchableOpacity;
    if (Platform.Version >= 21) {
        ButtonComponent = TouchableOpacity;
    }

    // const [username, setUsername] = useState("");
    return (
        <View style={styles.screen}>
            <ImageBackground source={backImage} style={styles.image}>
                <Text style={styles.Title}>Expirence your flight</Text>
                <View style={styles.buttonContainer} >

                    <ButtonComponent activeOpacity={0.6} style={styles.button} onPress={() => { navigation.navigate("JoinChat") }}>
                        <View>
                            <Text style={styles.buttonText}> Chat</Text>
                            <Ionicons></Ionicons>
                        </View>
                    </ButtonComponent>

                    <ButtonComponent activeOpacity={0.6} style={styles.button} onPress={() => { navigation.navigate("Products") }}>
                        <View>
                            <Text style={styles.buttonText}> Flight services</Text>
                            <Ionicons></Ionicons>
                        </View>
                    </ButtonComponent>

                    <ButtonComponent activeOpacity={0.6} style={styles.button} onPress={() => { navigation.navigate("files") }}>
                        <View>
                            <Text style={styles.buttonText}> My Files</Text>
                            <Ionicons></Ionicons>
                        </View>
                    </ButtonComponent>

                </View>
                <KeyboardAvoidingView behavior="padding" />
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 5,
        padding: 10,
        justifyContent: 'space-between',
        width: '80%',
    },
    screen: {
        flex: 1,
    },
    Title: {
        fontFamily: 'Oswald-Bold',
        fontSize: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 120,
        paddingHorizontal: 50,
        flexDirection: 'column',
        justifyContent: 'space-around',
        overflow: 'hidden',        
    },
    buttonText: {
        color: "black",
        fontFamily: 'oswald-Bold',
        fontSize: 30,
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
});

