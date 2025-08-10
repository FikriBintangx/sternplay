import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Clipboard from 'expo-clipboard';
import { Download, Link, CircleCheck as CheckCircle } from 'lucide-react-native';
import { GlassMorphismCard } from './GlassMorphismCard';

interface DownloadProgress {
  totalBytesWritten: number;
  totalBytesExpectedToWrite: number;
}

export function YouTubeDownloader() {
  const [url, setUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const pasteFromClipboard = async () => {
    try {
      const clipboardContent = await Clipboard.getStringAsync();
      if (clipboardContent.includes('youtube.com') || clipboardContent.includes('youtu.be')) {
        setUrl(clipboardContent);
      } else {
        Alert.alert('Error', 'Clipboard tidak berisi link YouTube yang valid');
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengambil dari clipboard');
    }
  };

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const downloadFromYouTube = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Masukkan URL YouTube terlebih dahulu');
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      Alert.alert('Error', 'URL YouTube tidak valid');
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadProgress(0);

      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Permission untuk menyimpan file diperlukan');
        return;
      }

      // Simulate YouTube download process
      // Note: Actual YouTube download requires server-side processing
      // This is a demonstration of the download flow
      
      const fileName = `youtube_audio_${videoId}.mp3`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Simulate download with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setDownloadProgress(i);
      }

      // Create a dummy audio file for demonstration
      await FileSystem.writeAsStringAsync(
        fileUri,
        'This is a placeholder for the downloaded audio file',
        { encoding: FileSystem.EncodingType.UTF8 }
      );

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Downloaded Music', asset, false);

      Alert.alert(
        'Download Selesai!',
        `File berhasil disimpan ke galeri musik Anda`,
        [{ text: 'OK' }]
      );

      setUrl('');
      setDownloadProgress(0);

    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Gagal mendownload file');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <GlassMorphismCard style={styles.container}>
      <View style={styles.header}>
        <Download size={24} color="#00D4FF" />
        <Text style={styles.title}>YouTube Downloader</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Paste YouTube URL here..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={url}
          onChangeText={setUrl}
          multiline
        />
        <TouchableOpacity style={styles.pasteButton} onPress={pasteFromClipboard}>
          <Link size={20} color="#00D4FF" />
        </TouchableOpacity>
      </View>

      {isDownloading && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${downloadProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{downloadProgress}%</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.downloadButton, isDownloading && styles.downloadButtonDisabled]}
        onPress={downloadFromYouTube}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <CheckCircle size={20} color="white" />
        )}
        <Text style={styles.downloadButtonText}>
          {isDownloading ? 'Downloading...' : 'Download Audio'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        * Pastikan Anda memiliki hak untuk mendownload konten
      </Text>
    </GlassMorphismCard>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    color: 'white',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    maxHeight: 80,
  },
  pasteButton: {
    marginLeft: 10,
    padding: 15,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00D4FF',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00D4FF',
    borderRadius: 3,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: '#00D4FF',
    marginBottom: 15,
  },
  downloadButtonDisabled: {
    opacity: 0.6,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disclaimer: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});