import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';

export default function VideoUpload() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const pickVideo = async () => {
    try {
      //updates state and shows loading on screen
      setUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        //only allows video files
        type: 'video/*',
        //ensures file is locally accessible
        copyToCacheDirectory: true,
        //only one file to be chosen
        multiple: false,
      });

      //selection for vid is cancelled
      if (result.canceled) {
        return;
      }

      //obtains first file of the array (aka the only file chosen)
      const asset = result.assets[0];
      if (asset && asset.uri) {
        setVideoUri(asset.uri);

        router.push({
          pathname: '/(strokes)/movement-processor',
          params: { videoUri: asset.uri },
        });
      } else {
        Alert.alert('No video selected', 'Please choose a video file.');
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Could not upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Your Video</Text>
      <Button title="Pick a Video File" onPress={pickVideo} />
      {uploading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#6A9860" />
          <Text>Uploading...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  loading: {
    marginTop: 20,
    alignItems: 'center',
  },
});