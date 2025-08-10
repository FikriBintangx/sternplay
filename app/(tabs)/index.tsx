import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Repeat,
  Shuffle,
} from 'lucide-react-native';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { GlassMorphismCard } from '@/components/GlassMorphismCard';

const { width, height } = Dimensions.get('window');

const mockSong = {
  title: 'Midnight Dreams',
  artist: 'Luna Eclipse',
  album: 'Cosmic Journey',
  duration: '3:45',
  cover: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
};

export default function PlayerScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(225); // 3:45 in seconds
  const [volume, setVolume] = useState(0.8);
  const [isLiked, setIsLiked] = useState(false);
  
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPlaying) {
      // Rotation animation for album cover
      Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        })
      ).start();

      // Glow effect animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Progress simulation
      const interval = setInterval(() => {
        setCurrentTime(prev => (prev < duration ? prev + 1 : prev));
      }, 1000);

      return () => clearInterval(interval);
    } else {
      rotationAnim.stopAnimation();
      glowAnim.stopAnimation();
    }
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    Animated.spring(scaleAnim, {
      toValue: isPlaying ? 1 : 0.95,
      useNativeDriver: true,
    }).start();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <ImageBackground
      source={{ uri: mockSong.cover }}
      style={styles.background}
      blurRadius={50}
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 50, 100, 0.6)', 'rgba(0, 0, 0, 0.9)']}
        style={styles.gradientOverlay}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Now Playing</Text>
          </View>

          {/* Album Cover with 3D Effect */}
          <View style={styles.albumSection}>
            <Animated.View
              style={[
                styles.albumCoverContainer,
                {
                  transform: [
                    { rotate: rotation },
                    { scale: scaleAnim },
                  ],
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.glowEffect,
                  { opacity: glowOpacity }
                ]}
              />
              <GlassMorphismCard style={styles.albumCover}>
                <ImageBackground
                  source={{ uri: mockSong.cover }}
                  style={styles.coverImage}
                  imageStyle={{ borderRadius: 20 }}
                />
              </GlassMorphismCard>
            </Animated.View>
          </View>

          {/* Audio Visualizer */}
          <AudioVisualizer isPlaying={isPlaying} />

          {/* Song Info */}
          <GlassMorphismCard style={styles.songInfo}>
            <Text style={styles.songTitle}>{mockSong.title}</Text>
            <Text style={styles.artistName}>{mockSong.artist}</Text>
            <Text style={styles.albumName}>{mockSong.album}</Text>
          </GlassMorphismCard>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(currentTime / duration) * 100}%` },
                  ]}
                />
              </View>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Controls */}
          <GlassMorphismCard style={styles.controlsContainer}>
            <View style={styles.secondaryControls}>
              <TouchableOpacity>
                <Shuffle size={24} color="rgba(255, 255, 255, 0.8)" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
                <Heart
                  size={24}
                  color={isLiked ? '#FF6B6B' : 'rgba(255, 255, 255, 0.8)'}
                  fill={isLiked ? '#FF6B6B' : 'transparent'}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Repeat size={24} color="rgba(255, 255, 255, 0.8)" />
              </TouchableOpacity>
            </View>

            <View style={styles.primaryControls}>
              <TouchableOpacity style={styles.controlButton}>
                <SkipBack size={32} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.playButton}
                onPress={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause size={40} color="white" />
                ) : (
                  <Play size={40} color="white" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton}>
                <SkipForward size={32} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.volumeContainer}>
              <Volume2 size={20} color="rgba(255, 255, 255, 0.8)" />
              <View style={styles.volumeSlider}>
                <View style={styles.volumeTrack}>
                  <View
                    style={[styles.volumeFill, { width: `${volume * 100}%` }]}
                  />
                </View>
              </View>
            </View>
          </GlassMorphismCard>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  albumSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  albumCoverContainer: {
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 40,
    backgroundColor: '#00D4FF',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
  },
  albumCover: {
    width: 280,
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  songInfo: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  songTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 4,
  },
  albumName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  progressSection: {
    marginBottom: 30,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00D4FF',
    borderRadius: 3,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  controlsContainer: {
    padding: 25,
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  primaryControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  controlButton: {
    padding: 15,
    marginHorizontal: 20,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00D4FF',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  volumeSlider: {
    flex: 1,
    marginLeft: 15,
  },
  volumeTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#00D4FF',
    borderRadius: 2,
  },
});