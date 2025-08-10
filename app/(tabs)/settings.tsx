import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Volume2,
  Palette,
  Download,
  Bell,
  Shield,
  Info,
  ChevronRight,
} from 'lucide-react-native';
import { GlassMorphismCard } from '@/components/GlassMorphismCard';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [enhancedAudio, setEnhancedAudio] = useState(true);

  const settingsGroups = [
    {
      title: 'Audio',
      items: [
        {
          icon: Volume2,
          title: 'Audio Quality',
          subtitle: 'High Quality',
          type: 'navigation',
        },
        {
          icon: Volume2,
          title: 'Enhanced Audio',
          subtitle: 'Spatial audio and EQ',
          type: 'toggle',
          value: enhancedAudio,
          onToggle: setEnhancedAudio,
        },
      ],
    },
    {
      title: 'Personalization',
      items: [
        {
          icon: Palette,
          title: 'Theme',
          subtitle: 'Liquid Glass (Default)',
          type: 'navigation',
        },
        {
          icon: Bell,
          title: 'Notifications',
          subtitle: 'New releases and updates',
          type: 'toggle',
          value: notifications,
          onToggle: setNotifications,
        },
      ],
    },
    {
      title: 'Downloads',
      items: [
        {
          icon: Download,
          title: 'Auto Download',
          subtitle: 'Download on Wi-Fi',
          type: 'toggle',
          value: autoDownload,
          onToggle: setAutoDownload,
        },
        {
          icon: Download,
          title: 'Storage',
          subtitle: '2.4 GB used',
          type: 'navigation',
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: Shield,
          title: 'Privacy Policy',
          subtitle: 'How we protect your data',
          type: 'navigation',
        },
        {
          icon: Info,
          title: 'About',
          subtitle: 'Version 1.0.0',
          type: 'navigation',
        },
      ],
    },
  ];

  return (
    <LinearGradient
      colors={['#0F0C29', '#24243e', '#302B63', '#0F0C29']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            
            <GlassMorphismCard style={styles.groupCard}>
              {group.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                      <View style={styles.iconContainer}>
                        <item.icon size={20} color="#00D4FF" />
                      </View>
                      <View style={styles.settingText}>
                        <Text style={styles.settingTitle}>{item.title}</Text>
                        <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.settingRight}>
                      {item.type === 'toggle' ? (
                        <Switch
                          value={item.value}
                          onValueChange={item.onToggle}
                          trackColor={{
                            false: 'rgba(255, 255, 255, 0.2)',
                            true: 'rgba(0, 212, 255, 0.5)',
                          }}
                          thumbColor={item.value ? '#00D4FF' : 'rgba(255, 255, 255, 0.8)'}
                        />
                      ) : (
                        <ChevronRight size={20} color="rgba(255, 255, 255, 0.6)" />
                      )}
                    </View>
                  </TouchableOpacity>
                  
                  {itemIndex < group.items.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
            </GlassMorphismCard>
          </View>
        ))}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  settingsGroup: {
    marginBottom: 30,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 15,
    marginLeft: 5,
  },
  groupCard: {
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  settingRight: {
    marginLeft: 15,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 75,
  },
});