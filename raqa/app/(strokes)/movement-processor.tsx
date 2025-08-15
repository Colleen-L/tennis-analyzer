import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
//file system handling
import * as FileSystem from 'expo-file-system';
//asset handling
import { Asset } from 'expo-asset';
// allowing for embedding web content
import WebView from 'react-native-webview';

import federerJson from '../../assets/mediapipe/backview/federer.json';


export default function MovementProcessor() {
  //extracts uri from router params
  //stores uri of video captured by expo-camera
  const { videoUri } = useLocalSearchParams();
  //ensures URI is a String
  const sentUri = Array.isArray(videoUri) ? videoUri[0] : videoUri;

  //references WebView to allow for changing
  const webViewRef = useRef<WebView>(null);
  //defines the path where the HTML file will be saved
  const htmlPath = FileSystem.documentDirectory + 'stroke-analysis.html';
  
  //tracks states
  const [pageReady, setPageReady] = useState(false); //state of if the WebView page is ready
  const [readyVideoUri, setReadyVideoUri] = useState<string | null>(null); //State of if the URI is ready-to-use

  //runs once on mount (empty dependency array (param))
  useEffect(() => {
    (async () => {
      try {
        //loads HTML asset (the webpage to be embedded)
        const asset = Asset.fromModule(require('../../assets/mediapipe/stroke-analysis.html'));
        //downloads HTML asset if it isn't local/already cached
        await asset.downloadAsync();
        const assetUri = asset.localUri || asset.uri;

        let content;
        try {
          //from local URI
          //reads HTML file content as a string and assigns to variable, content
          content = await FileSystem.readAsStringAsync(assetUri);
        } catch (e) {
          //from remote URI (tries after reading from local URI fails)
          if (assetUri.startsWith('http')) {
            //downloads the HTML file to htmlPath
            const downloadResult = await FileSystem.downloadAsync(assetUri, htmlPath);
            //reads the file as a String to content
            content = await FileSystem.readAsStringAsync(downloadResult.uri);
          } else {
            throw e;
          }
        }
        //writes the content to htmlPath
        await FileSystem.writeAsStringAsync(htmlPath, content, {
          //uses UTF-8 to save the file
          encoding: FileSystem.EncodingType.UTF8,
        });
      } catch (error) {
        console.error('Error reading/writing HTML file:', error);
      }
    })();
  }, []);

  useEffect(() => {
    //returns if sentUri is null/undefined
    if (!sentUri) return;

    (async () => {
      try {
        //obtains information about the sentUri file
        const fileInfo = await FileSystem.getInfoAsync(sentUri);
        if (!fileInfo.exists) {
          console.error('Original video does not exist:', sentUri);
          return;
        }

        //takes the filename from full URI
        const filename = sentUri.split('/').pop() || 'video.mp4';
        //creates a destination URI
        const destUri = `${FileSystem.documentDirectory}${filename}`;

        //accounts for the video not being in document directory
        if (destUri !== sentUri) {
          //copies video file from sentUri to destUri
          await FileSystem.copyAsync({
            from: sentUri,
            to: destUri,
          });
          console.log('Video copied to:', destUri);
          //sets state to the new copied file location
          setReadyVideoUri(destUri);
        } else {  
          //sets state to the original URI
          setReadyVideoUri(sentUri);
        }
      } catch (e) {
        console.error('Error copying video file:', e);
      }
    })();
  }, [sentUri]);

  useEffect(() => {
    //runs if WebView page is ready and if video URI is ready
    if (pageReady && readyVideoUri) {
      (async () => {
        try {
          //reads video file as a base64 encoded string (text representation of binary data)
          const base64 = await FileSystem.readAsStringAsync(readyVideoUri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          //String of JS code to be injected into WebView
          //atob decodes the base64 string back to binary string
          //each character of binary string is converted to its numeric byte value
          //creates a Uint8Array from the numeric bytes
          //creates a Blob object
          //generates a blob URL, a temporary local URL pointing to the blob
          //calls function that receives the blob URL and handles the video
          //returns true
          const jsCode = `
            (function() {
              const byteCharacters = atob("${base64}");
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: 'video/mp4' });
              const blobUrl = URL.createObjectURL(blob);
              window.handleVideoUri(blobUrl);
            })();
            true;
          `;

          //injects the JS code into WebView only if WebView reference exists
          //allows for execution in WebView
          webViewRef.current?.injectJavaScript(jsCode);
        } catch (e) {
          console.error('Error injecting video blob JS:', e);
        }
      })();
    }
  }, [pageReady, readyVideoUri]);

  useEffect(() => {
    //checks that the page is ready
    if (!pageReady) return;

    //sends the reference sequence from pro player
    const sendReferenceJSON = async () => {
      try {
        //injects JS providing the pro player json file
        const jsCode = `
          (function() {
            try {
              //clears existing reference sequence
              window.referenceSequence = null;
              
              //injects the reference sequence
              const rawData = ${JSON.stringify(federerJson)};
              
              //assigns data to reference sequence
              window.referenceSequence = rawData;
            } catch (error) {
              window.ReactNativeWebView.postMessage("Error in reference injection: " + error.message);
            }
          })();
          true;
        `;

        webViewRef.current?.injectJavaScript(jsCode);
      } catch (e) {
        console.error("failed to inject reference sequence:", e);
      }
    };
    sendReferenceJSON();
  }, [pageReady]);


  //accounts for platform differences in file paths
  const webViewUri = Platform.OS === 'ios' ? htmlPath : 'file://' + htmlPath;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        //assigns React ref to the WebView (allows for interactions)
        ref={webViewRef}
        //allows WebView to load content from any origin
        originWhitelist={['*']}
        //loads the WebView content from webViewUri
        source={{ uri: webViewUri }}
        //enables javaScript and DOM storage APIs
        javaScriptEnabled
        domStorageEnabled
        //allows video autoplay
        mediaPlaybackRequiresUserAction={false}
        //allos videos to play inline instead of fullscreen
        allowsInlineMediaPlayback
        //disables fullscreen playback of the video
        allowsFullscreenVideo={false}
        //allows WebView to access local files
        allowFileAccess
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        //listens for messages sent from the WebView
        onMessage={(event) => {
            const rawMessage = event.nativeEvent.data;
            console.log('Raw WebView message:', rawMessage);

            try {
              const data = JSON.parse(rawMessage);

              if (data.type === "dtw") {
                console.log("DTW Distance from WebView:", data.distance);
                if (data.error) {
                  console.warn("DTW Error:", data.error);
                }
              }
            } catch (err) {
              if (rawMessage === 'pageReady') {
                setPageReady(true);
              }
            }
        }}
        style={styles.webview}
        //enables scrolling
        scrollEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
