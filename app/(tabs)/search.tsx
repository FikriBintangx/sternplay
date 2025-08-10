import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, TrendingUp, Clock } from 'lucide-react-native';
import { GlassMorphismCard } from '@/components/GlassMorphismCard';

const trendingSearches = [
  'Luna Eclipse',
  'Cyber Symphony',
  'Ethereal Sounds',
  'Tech Beats',
  'Cosmic Melodies',
];

const recentSearches = [
  'midnight dreams',
  'neon nights',
  'electronic music',
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <LinearGradient
      colors={['#0F0C29', '#24243e', '#302B63', '#0F0C29']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      <GlassMorphismCard style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="rgba(255, 255, 255, 0.6)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Artists, songs, or albums"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </GlassMorphismCard>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Trending */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={24} color="#00D4FF" />
            <Text style={styles.sectionTitle}>Trending</Text>
          </View>
          
          {trendingSearches.map((item, index) => (
            <GlassMorphismCard key={index} style={styles.searchItem}>
              <TouchableOpacity style={styles.searchItemContent}>
                <Text style={styles.searchItemText}>{item}</Text>
              </TouchableOpacity>
            </GlassMorphismCard>
          ))}
        </View>

        {/* Recent Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={24} color="#00D4FF" />
            <Text style={styles.sectionTitle}>Recent Searches</Text>
          </View>
          
          {recentSearches.map((item, index) => (
            <GlassMorphismCard key={index} style={styles.searchItem}>
              <TouchableOpacity style={styles.searchItemContent}>
                <Text style={styles.searchItemText}>{item}</Text>
              </TouchableOpacity>
            </GlassMorphismCard>
          ))}
        </View>
      </ScrollView>
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
    paddingBottom: 20,
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
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginLeft: 10,
  },
  searchItem: {
    marginBottom: 10,
  },
  searchItemContent: {
    padding: 15,
  },
  searchItemText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
});