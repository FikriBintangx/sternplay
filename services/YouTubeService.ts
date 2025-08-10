import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export interface VideoInfo {
  title: string;
  duration: string;
  thumbnail: string;
  videoId: string;
}

export class YouTubeService {
  private static readonly API_BASE = 'https://your-backend-api.com/api';

  static extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  static async getVideoInfo(videoId: string): Promise<VideoInfo | null> {
    try {
      // In production, this would call your backend API
      // that uses youtube-dl or similar to get video info
      const response = await fetch(`${this.API_BASE}/video-info/${videoId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch video info');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching video info:', error);
      return null;
    }
  }

  static async downloadAudio(
    videoId: string,
    onProgress?: (progress: number) => void
  ): Promise<string | null> {
    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Media library permission required');
      }

      const fileName = `youtube_${videoId}_${Date.now()}.mp3`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // In production, this would download from your backend API
      // that converts YouTube videos to audio
      const downloadUrl = `${this.API_BASE}/download-audio/${videoId}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          onProgress?.(Math.round(progress * 100));
        }
      );

      const result = await downloadResumable.downloadAsync();
      
      if (!result) {
        throw new Error('Download failed');
      }

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(result.uri);
      const album = await MediaLibrary.getAlbumAsync('Downloaded Music');
      
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync('Downloaded Music', asset, false);
      }

      return result.uri;
    } catch (error) {
      console.error('Download error:', error);
      return null;
    }
  }

  static async getDownloadedFiles(): Promise<AudioFile[]> {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        return [];
      }

      const album = await MediaLibrary.getAlbumAsync('Downloaded Music');
      if (!album) {
        return [];
      }

      const assets = await MediaLibrary.getAssetsAsync({
        album: album,
        mediaType: 'audio',
        first: 1000,
      });

      return assets.assets.map(asset => ({
        id: asset.id,
        filename: asset.filename,
        uri: asset.uri,
        duration: asset.duration,
        creationTime: asset.creationTime,
      }));
    } catch (error) {
      console.error('Error getting downloaded files:', error);
      return [];
    }
  }
}

interface AudioFile {
  id: string;
  filename: string;
  uri: string;
  duration: number;
  creationTime: number;
}