import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Play, Music, Folder } from 'lucide-react-native';
import { GlassMorphismCard } from './GlassMorphismCard';

interface AudioFile {
  id: string;
  filename: string;
  uri: string;
  duration: number;
  creationTime: number;
}

interface MusicLibraryProps {
  onPlaySong?: (song: AudioFile) => void;
}

export function MusicLibrary({ onPlaySong }: MusicLibraryProps) {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudioFiles();
  }, []);

  const loadAudioFiles = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Akses ke media library diperlukan');
        return;
      }

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 100,
        sortBy: 'creationTime',
      });

      setAudioFiles(media.assets as AudioFile[]);
    } catch (error) {
      console.error('Error loading audio files:', error);
      Alert.alert('Error', 'Gagal memuat file audio');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderAudioItem = ({ item }: { item: AudioFile }) => (
    <GlassMorphismCard style={styles.audioItem}>
      <TouchableOpacity
        style={styles.audioItemContent}
        onPress={() => onPlaySong?.(item)}
      >
        <View style={styles.audioIcon}>
          <Music size={24} color="#00D4FF" />
        </View>
        
        <View style={styles.audioInfo}>
          <Text style={styles.audioTitle} numberOfLines={1}>
            {item.filename.replace(/\.[^/.]+$/, '')}
          </Text>
          <Text style={styles.audioDuration}>
            {formatDuration(item.duration)}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.playButton}>
          <Play size={20} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    </GlassMorphismCard>
  );

  if (loading) {
    return (
      <GlassMorphismCard style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading music library...</Text>
      </GlassMorphismCard>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Folder size={24} color="#00D4FF" />
        <Text style={styles.headerTitle}>Local Music ({audioFiles.length})</Text>
      </View>

      <FlatList
        data={audioFiles}
        renderItem={renderAudioItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    margin: 20,
    padding: 30,
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  audioItem: {
    marginBottom: 10,
  },
  audioItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  audioIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  audioDuration: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00D4FF',
  },
});