import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { YouTubeVideo, YouTubeApiVideo, YouTubeApiVideoDetails } from '@/types/youtube';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const CACHE_DURATION = 5 * 60 * 1000;
const CHANNEL_ID = 'UC-S0Gm3Bl2-OxVP-3_W2Wug';

export function useYouTubeVideos() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [liveStream, setLiveStream] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVideoDetails = async (videoIds: string[], apiKey: string): Promise<YouTubeApiVideoDetails[]> => {
    try {
      const response = await fetch(
        `${YOUTUBE_API_BASE}/videos?part=contentDetails,statistics,liveStreamingDetails&id=${videoIds.join(',')}&key=${apiKey}`
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Video details API error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorBody
        });
        throw new Error(`Failed to fetch video details: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (err) {
      console.error('Error fetching video details:', err);
      return [];
    }
  };

  const fetchLiveStream = async (apiKey: string): Promise<YouTubeVideo | null> => {
    try {
      const response = await fetch(
        `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&maxResults=1&key=${apiKey}`
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Live stream API error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorBody
        });
        return null;
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        return null;
      }

      const liveVideo: YouTubeApiVideo = data.items[0];
      const videoId = liveVideo.id.videoId;

      const details = await fetchVideoDetails([videoId], apiKey);
      const videoDetails = details[0];

      const liveViewerCount = videoDetails?.liveStreamingDetails?.concurrentViewers
        ? parseInt(videoDetails.liveStreamingDetails.concurrentViewers)
        : 0;

      const video: YouTubeVideo = {
        id: videoId,
        video_id: videoId,
        title: liveVideo.snippet.title,
        description: liveVideo.snippet.description,
        thumbnail_url: liveVideo.snippet.thumbnails.high?.url || liveVideo.snippet.thumbnails.medium.url,
        published_at: liveVideo.snippet.publishedAt,
        duration: '',
        view_count: 0,
        is_live: true,
        live_viewer_count: liveViewerCount,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await supabase.from('youtube_videos').upsert(video, {
        onConflict: 'video_id',
      });

      return video;
    } catch (err) {
      console.error('Error fetching live stream:', err);
      return null;
    }
  };

  const fetchVideosFromYouTube = async (apiKey: string): Promise<YouTubeVideo[]> => {
    try {
      const trimmedKey = apiKey.trim();
      console.log('Fetching videos from YouTube API...');

      const response = await fetch(
        `${YOUTUBE_API_BASE}/search?part=snippet&channelId=${CHANNEL_ID}&order=date&type=video&maxResults=50&key=${trimmedKey}`
      );

      if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `YouTube API error: ${response.status} ${response.statusText}`;

        try {
          const errorJson = JSON.parse(errorBody);
          if (errorJson.error?.message) {
            errorMessage = errorJson.error.message;
          }
        } catch (e) {
          console.error('Could not parse error response');
        }

        console.error('YouTube API error details:', {
          status: response.status,
          statusText: response.statusText,
          body: errorBody
        });

        throw new Error(errorMessage);
      }

      const data = await response.json();
      const searchResults: YouTubeApiVideo[] = data.items || [];

      const regularVideos = searchResults.filter(
        video => video.snippet.liveBroadcastContent !== 'live'
      );

      const videoIds = regularVideos.map(video => video.id.videoId);

      if (videoIds.length === 0) {
        return [];
      }

      const details = await fetchVideoDetails(videoIds, apiKey);

      const videos: YouTubeVideo[] = regularVideos.map((video, index) => {
        const videoDetails = details.find(d => d.id === video.id.videoId);

        return {
          id: video.id.videoId,
          video_id: video.id.videoId,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail_url: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium.url,
          published_at: video.snippet.publishedAt,
          duration: videoDetails?.contentDetails?.duration || '',
          view_count: videoDetails?.statistics?.viewCount ? parseInt(videoDetails.statistics.viewCount) : 0,
          is_live: false,
          live_viewer_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });

      await supabase.from('youtube_videos').upsert(videos, {
        onConflict: 'video_id',
      });

      return videos;
    } catch (err) {
      console.error('Error fetching videos from YouTube:', err);
      throw err;
    }
  };

  const loadVideos = async (forceRefresh = false) => {
    try {
      setError(null);

      const { data: cachedVideos } = await supabase
        .from('youtube_videos')
        .select('*')
        .eq('is_live', false)
        .order('published_at', { ascending: false });

      const shouldFetchFromAPI =
        forceRefresh ||
        !cachedVideos ||
        cachedVideos.length === 0 ||
        (cachedVideos.length > 0 &&
         new Date().getTime() - new Date(cachedVideos[0].updated_at).getTime() > CACHE_DURATION);

      if (shouldFetchFromAPI) {
        const { data: config, error: configError } = await supabase
          .from('youtube_config')
          .select('api_key')
          .single();

        if (configError) {
          console.error('Error fetching YouTube config:', configError);
          throw new Error('Failed to load YouTube configuration');
        }

        if (!config?.api_key || config.api_key.trim() === '') {
          console.error('YouTube API key is missing or empty');
          if (cachedVideos && cachedVideos.length > 0) {
            setVideos(cachedVideos);
          } else {
            setError('YouTube API key not configured. Please add your API key to continue.');
          }
          return;
        }

        const freshVideos = await fetchVideosFromYouTube(config.api_key);
        setVideos(freshVideos);

        const live = await fetchLiveStream(config.api_key);
        setLiveStream(live);
      } else {
        setVideos(cachedVideos || []);

        const { data: config } = await supabase
          .from('youtube_config')
          .select('api_key')
          .single();

        if (config?.api_key && config.api_key.trim() !== '') {
          const live = await fetchLiveStream(config.api_key);
          setLiveStream(live);
        }
      }
    } catch (err) {
      console.error('Error loading videos:', err);

      const errorMessage = err instanceof Error ? err.message : 'Failed to load videos';
      setError(errorMessage);

      const { data: cachedVideos } = await supabase
        .from('youtube_videos')
        .select('*')
        .eq('is_live', false)
        .order('published_at', { ascending: false });

      if (cachedVideos && cachedVideos.length > 0) {
        setVideos(cachedVideos);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await loadVideos(true);
  }, []);

  useEffect(() => {
    loadVideos();
  }, []);

  return {
    videos,
    liveStream,
    loading,
    error,
    refreshing,
    refresh,
  };
}
