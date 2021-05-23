import React, { useState } from "react";
import axios from 'axios';
import { Buffer } from 'buffer';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import baseUrl from "./../baseUrl";
import { View, Text, ActionSheetIOS, Button } from "react-native";
import { useSelector } from 'react-redux';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';



export default function files({ navigation }) {
    //const userId = navigation.getParam('userId');
    //const screenId = navigation.getParam('screenId');
    const userId = useSelector(state => state.userId);
    const screenId = useSelector(state => state.screenId);

    const [fileObject, setFileObject] = useState();
    const api = axios.create({
        baseURL: baseUrl.localBaseUrl,
    })
    console.log("from File " + screenId);
    console.log("from File " + userId);


    api.get('files/' + screenId + '/' + userId).then(fetchData => {

        const buff = Buffer.from(fetchData.data.data.data, 'base64');

        const fileBase = buff.toString('base64');
        console.log("fileBaseeeeeeeeeeeeee " + fileBase);
        setFileObject(fileBase);
        const path = FileSystem.documentDirectory + 'zipFiles.zip';

        FileSystem.writeAsStringAsync(path, fileBase, { encoding: FileSystem.EncodingType.Base64 }).then(() => {
            const { status } = Permissions.askAsync(Permissions.MEDIA_LIBRARY)
            if (status === status) {
                MediaLibrary.createAssetAsync(path).then((media) => {
                    MediaLibrary.createAlbumAsync("Download", media, false).then((album) => {
                        console.log("title " + album.title);
                        console.log("success files loaded!");

                    })
                })
            }
            else {
                console.log("permission error " + status);
            }
        }).catch(error => console.log("writeAsStringAsync" + error));
    }).catch(error => console.log(error));

    const disconnectFromFile = async () => {
        const form = new FormData();
        console.log("file object : ", fileObject)
        form.append('file', fileObject);

        const api = axios.create({
            baseURL: baseUrl.localBaseUrl,
        })
        const headers = {
            'Content-Type': 'text/html',
            "Accept": "/",
            "Accept-Encoding": "gzip, deflate, br"
        }
        const options = {
            headers,
            responseType: 'arraybuffer',
        }

        api.post('files/' + screenId + '/' + userId, form, options).then(res => {
            if(res.status == 200){
                console.log("return to server");
            }
        }).catch(err => console.log(err));
    }




    return (
        <View >
            <Text>This is my files!</Text>
            <View>
                <Button
                    title="Disconnect"
                    onPress={disconnectFromFile}
                />
            </View>
        </View>
    );


}



// downloadFile(){
//     const uri = "http://techslides.com/demos/sample-videos/small.mp4"
//     let fileUri = FileSystem.documentDirectory + "small.mp4";
//     FileSystem.downloadAsync(uri, fileUri)
//     .then(({ uri }) => {
//         this.saveFile(uri);
//       })
//       .catch(error => {
//         console.error(error);
//       })
// }

// saveFile = async (fileUri: string) => {
//         const asset = await MediaLibrary.createAssetAsync(fileUri)
//         await MediaLibrary.createAlbumAsync("Download", asset, false)
//     }
// }
