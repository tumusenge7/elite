const axios = require('axios');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

// Get latest videos from YouTube channel
const getChannelVideos = async (req, res) => {
    try {
        if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
            return res.status(500).json({ error: 'YouTube API not configured' });
        }

        const maxResults = req.query.limit || 6;

        // Fetch latest videos from channel
        const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                channelId: YOUTUBE_CHANNEL_ID,
                maxResults,
                order: 'date',
                type: 'video',
                key: YOUTUBE_API_KEY
            }
        });

        const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

        // Fetch video statistics (views, likes, duration)
        const statsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                part: 'statistics,contentDetails',
                id: videoIds,
                key: YOUTUBE_API_KEY
            }
        });

        // Combine data
        const videos = searchResponse.data.items.map((item, index) => {
            const stats = statsResponse.data.items[index];
            return {
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
                publishedAt: item.snippet.publishedAt,
                embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
                watchUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                views: stats?.statistics?.viewCount || '0',
                likes: stats?.statistics?.likeCount || '0',
                duration: stats?.contentDetails?.duration || ''
            };
        });

        res.json({
            channelId: YOUTUBE_CHANNEL_ID,
            totalResults: searchResponse.data.pageInfo.totalResults,
            videos
        });
    } catch (error) {
        console.error('YouTube API Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch YouTube videos' });
    }
};

// Get channel info
const getChannelInfo = async (req, res) => {
    try {
        if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
            return res.status(500).json({ error: 'YouTube API not configured' });
        }

        const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
            params: {
                part: 'snippet,statistics',
                id: YOUTUBE_CHANNEL_ID,
                key: YOUTUBE_API_KEY
            }
        });

        const channel = response.data.items[0];
        res.json({
            name: channel.snippet.title,
            description: channel.snippet.description,
            thumbnail: channel.snippet.thumbnails.high?.url,
            subscribers: channel.statistics.subscriberCount,
            videoCount: channel.statistics.videoCount,
            viewCount: channel.statistics.viewCount,
            channelUrl: `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`
        });
    } catch (error) {
        console.error('YouTube Channel Info Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch channel info' });
    }
};

module.exports = { getChannelVideos, getChannelInfo };
