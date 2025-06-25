import React, { useEffect, useRef } from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import { useLocalSearchParams } from "expo-router";
import * as FileSystem from 'expo-file-system';
import {Asset} from 'expo-asset';
import WebView from 'react-native-webview';


export default function MovementProcessor() {
  //extracts videoUri from route's query parameters
  const { videoUri } = useLocalSearchParams();
  //creates a ref object that attaches to the WebView component
  //allows interactions with WebView from React code
  const webViewRef = useRef<WebView>(null);
  //ensures videoUri is a string
  const sentUri = Array.isArray(videoUri) ? videoUri[0] : videoUri;

  //constructs file path where the HTML file is stored on the device
  const htmlPath = FileSystem.documentDirectory + 'mediapipe-analysis.html';

  useEffect(() => {
    //creates and calls an async function
    (async () => {
      //imports HTML file from assets and gets file path (URI)
      const htmlUri = Asset.fromModule(require('../../assets/mediapipe/stroke-analysis.html.txt')).uri;

      console.log('htmlUri:', htmlUri);


      //reads the contents of the HTML file
      const content = await FileSystem.readAsStringAsync(htmlUri);

      console.log("here");
      //writes the HTML content to a new file at htmlPath
      try {
        await FileSystem.writeAsStringAsync(htmlPath, content, {encoding: FileSystem.EncodingType.UTF8});
        console.log('File written to: ', htmlPath);
      } catch (error) {
        console.error('Failed to write file: ', error);
      }
    })();
  }, []); //empty dependency array; code runs when component mounts (and runs on re-mount)

  //converts file URI for WebView (accounts for iOS and Android)
  const webViewUri = Platform.OS === 'ios' ? htmlPath : 'file://' + htmlPath;

  return (
    <View style = {{flex : 1}}>
      <WebView
        //allows for referencing webView instance in code
        ref={webViewRef}
        //allows WebView to load content from any origin
        originWhitelist={['*']}
        //tells WebView what to load
        source = {{uri: webViewUri }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadEnd={() => {
          //sends video URI to WebView
          webViewRef.current?.postMessage(sentUri);
        }}
        style ={styles.webview} />
    </View>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  }
});