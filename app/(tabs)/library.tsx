import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { GlassMorphismCard } from '@/components/GlassMorphismCard';
import { YouTubeDownloader } from '@/components/YouTubeDownloader';
import { MusicLibrary } from '@/components/MusicLibrary';

const mockLibrary = [
  {
    id: 1,
    title: 'Midnight Dreams',
    artist: 'Luna Eclipse',
    duration: '3:45',
    cover: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
  },
  {
    id: 2,
    title: 'Neon Nights',
    artist: 'Cyber Symphony',
    duration: '4:12',
    cover: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg',
  },
  {
    id: 3,
    title: 'Ocean Waves',
    artist: 'Ethereal Sounds',
    duration: '5:28',
    cover: 'https://images.pexels.com/photos/158251/forest-the-sun-morning-tucholskie-158251.jpeg',
  },
  {
    id: 4,
    title: 'Digital Horizon',
    artist: 'Tech Beats',
    duration: '3:33',
    cover: 'https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg',
  },
  {
    id: 5,
    title: 'Starlight Serenade',
    artist: 'Cosmic Melodies',
    duration: '4:05',
    cover: 'https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg',
  },
];

export default function LibraryScreen() {
  const [selectedSong, setSelectedSong] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'downloaded' | 'local'>('downloaded');

  return (
    <LinearGradient
      colors={['#0F0C29', '#24243e', '#302B63', '#0F0C29']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Library</Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'downloaded' && styles.activeTab]}
            onPress={() => setActiveTab('downloaded')}
          >
            <Text style={[styles.tabText, activeTab === 'downloaded' && styles.activeTabText]}>
              Downloaded
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'local' && styles.activeTab]}
            onPress={() => setActiveTab('local')}
          >
            <Text style={[styles.tabText, activeTab === 'local' && styles.activeTabText]}>
              Local Files
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'downloaded' ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <YouTubeDownloader />
          
          {mockLibrary.map((song) => (
            <GlassMorphismCard key={song.id} style={styles.songCard}>
              <TouchableOpacity
                style={styles.songItem}
                onPress={() => setSelectedSong(song.id)}
              >
                <View style={styles.songCover}>
                  <ImageBackground
                    source={{ uri: song.cover }}
                    style={styles.coverImage}
                    imageStyle={{ borderRadius: 12 }}
                  >
                    <View style={styles.playOverlay}>
                      <Play size={20} color="white" />
                    </View>
                  </ImageBackground>
                </View>
                
                <View style={styles.songDetails}>
                  <Text style={styles.songTitle} numberOfLines={1}>
                    {song.title}
                  </Text>
                  <Text style={styles.songArtist} numberOfLines={1}>
                    {song.artist}
                  </Text>
                </View>
                
                <View style={styles.songActions}>
                  <Text style={styles.duration}>{song.duration}</Text>
                  <TouchableOpacity style={styles.moreButton}>
                    <MoreHorizontal size={20} color="rgba(255, 255, 255, 0.6)" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </GlassMorphismCard>
          ))}
        </ScrollView>
      ) : (
        <MusicLibrary />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    borderWidth: 1,
    borderColor: '#00D4FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  songCard: {
    marginBottom: 15,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  songCover: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songDetails: {
    flex: 1,
    marginRight: 10,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  songActions: {
    alignItems: 'flex-end',
  },
  duration: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  moreButton: {
    padding: 5,
  },
});