export interface YouTubeVideo {
  id: string;
  video_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  published_at: string;
  duration: string;
  view_count: number;
  is_live: boolean;
  live_viewer_count: number;
  created_at: string;
  updated_at: string;
}

export interface YouTubeConfig {
  id: string;
  api_key: string;
  channel_id: string;
  updated_at: string;
}

export interface YouTubeApiVideo {
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    liveBroadcastContent: string;
  };
}

export interface YouTubeApiVideoDetails {
  id: string;
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
    likeCount?: string;
  };
  liveStreamingDetails?: {
    concurrentViewers?: string;
    actualStartTime?: string;
  };
}
