import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';

export default function Camera() {
  const cameraRef = useRef<CameraView>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const router = useRouter();


  //ask for camera and media/library permissions
  useEffect(() => {
      if (!cameraPermission?.granted) {
          requestCameraPermission();
      }
      if (!mediaPermission?.granted) {
          requestMediaPermission();
      }
  }, [cameraPermission, mediaPermission]);


  //verify permissions: camera
  if (!cameraPermission?.granted) {
      return (
          <View style = {styles.permissionContainer}>
          <Text>Camera permission required</Text>
          <TouchableOpacity onPress={requestCameraPermission} style = {styles.permissionBtn}>
              <Text style = {styles.permissionTxt}>Give Permission</Text>
          </TouchableOpacity>
          </View>
      );
  }


  //verify permissions: library/gallery
  if (!mediaPermission?.granted) {
      return (
          <View style = {styles.permissionContainer}>
          <Text>Media library permission required</Text>
          <TouchableOpacity onPress={requestMediaPermission} style = {styles.permissionBtn}>
              <Text style = {styles.permissionTxt}>Give Permission</Text>
          </TouchableOpacity>
          </View>
      );
  }

  //recording functionality
  const toggleRecording = async() => {
      //ensures reference is not null/undefined
      if (!cameraRef.current) {
          return;
      }

      //stops recording if was recording
      if (isRecording) {
          try {
          await cameraRef.current.stopRecording();
          } catch (error) {
          Alert.alert('Error', 'Failed to stop recording');
          } finally {
          setIsRecording(false);
          }
          return;
      }

      //starts recording
      setIsRecording(true);
      try {
          const video = await cameraRef.current.recordAsync();


          if (video?.uri) {
          //verify permissions: gallery
          if (!mediaPermission?.granted) {
              await requestMediaPermission();
          }

          //checks if album RAQA already exists
          let album = await MediaLibrary.getAlbumAsync("RAQA");

          //creates album if it doesn't exist
          if (!album) {
              album = await MediaLibrary.createAlbumAsync("RAQA", video.uri, false);
          }

          //add video to album
          const vid = await MediaLibrary.createAssetAsync(video.uri);
          await MediaLibrary.addAssetsToAlbumAsync([vid], album, false);

          Alert.alert("Success", 'Video saved to RAQA album!');


          //move to movement-processor screen
          router.push(
              {
              pathname: '/(strokes)/movement-processor',
              params: {videoUri: video.uri},
              }
          );
          }
      } catch (error) {
          Alert.alert('Error', 'Recording failed');
      } finally {
          setIsRecording(false);
      }
  };

  return (
      <View style = {styles.container}>
          <CameraView
              ref = {cameraRef}
              style = {styles.camera}
              facing = "back"
              mode = "video">
          </CameraView>


          <TouchableOpacity
              onPress = {toggleRecording}
              style = {[styles.recordBtn, isRecording && styles.recording]}>
          </TouchableOpacity>
      </View>
  );
}

//styling
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#353535',
  },
      camera: {
      flex: 1,
  },
  permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  permissionBtn: {
      marginTop: 20,
      padding: 15,
      backgroundColor: "#6A9860",
      borderRadius: 5,
  },
  permissionTxt: {
      color: '#EBEBEB'
  },
  recordBtn: {
      position: 'absolute',
      bottom: 32,
      alignSelf: 'center',
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: '#D74E4E',
      borderWidth: 3,
      borderColor: '#EBEBEB',
  },
  recording: {
      backgroundColor: '#962828',
  }
})











