import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { useCloset } from '../context/ClosetContext';
import { useTheme } from '../theme';

export default function AddItemScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { addItem } = useCloset();
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);

  async function requestPermissions() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return false;
    }
    return true;
  }

  async function pickImageFromGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  }

  async function takePicture() {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  }

  async function handleUpload() {
    if (!image) {
      Alert.alert('No image', 'Please select or take a picture first');
      return;
    }

    if (!name.trim()) {
      Alert.alert('No name', 'Please enter a name for this item');
      return;
    }

    setUploading(true);
    try {
      await addItem({
        name: name.trim(),
        imageUri: image,
      });
      Alert.alert('Success', 'Item added to your closet!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload item');
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top, backgroundColor: theme.colors.grayBG || '#F6F7FB' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Add Item</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.imageSection}>
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImage(null)}
              >
                <Ionicons name="close-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.placeholder, { borderColor: theme.colors.border }]}>
              <Ionicons name="image-outline" size={64} color={theme.colors.tabIcon} />
              <Text style={[styles.placeholderText, { color: theme.colors.subtext }]}>
                No image selected
              </Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.imageButton, { backgroundColor: theme.colors.primary }]}
              onPress={pickImageFromGallery}
            >
              <Ionicons name="images-outline" size={20} color="#fff" />
              <Text style={styles.imageButtonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imageButton, { backgroundColor: theme.colors.primary }]}
              onPress={takePicture}
            >
              <Ionicons name="camera-outline" size={20} color="#fff" />
              <Text style={styles.imageButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Item Name</Text>
          <TextInput
            placeholder="e.g., Blue Jeans, White T-Shirt"
            value={name}
            onChangeText={setName}
            placeholderTextColor={theme.colors.subtext}
            style={[
              styles.input,
              {
                borderColor: theme.colors.border,
                color: theme.colors.text,
                backgroundColor: theme.colors.white,
              },
            ]}
          />
        </View>

        <PrimaryButton
          title={uploading ? 'Uploading...' : 'Upload'}
          onPress={handleUpload}
          disabled={uploading}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: { padding: 4 },
  title: { fontSize: 20, fontWeight: '700' },
  content: { flex: 1 },
  contentContainer: { padding: 16 },
  imageSection: { marginBottom: 24 },
  imageContainer: { position: 'relative', marginBottom: 16 },
  image: { width: '100%', height: 300, borderRadius: 12 },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  placeholder: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  placeholderText: { marginTop: 12, fontSize: 16 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  imageButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  formSection: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});

