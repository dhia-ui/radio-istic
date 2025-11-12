# Audio Files for Radio ISTIC

## Hidden Talent Episode

To add the audio for the "Hidden Talent" episode:

1. **Extract audio from Instagram Reel:**
   - Go to: https://www.instagram.com/reel/DP6wpTdDHp5/
   - Use an Instagram video downloader (e.g., https://igram.world/)
   - Download the video
   - Extract audio using FFmpeg or online converter:
     ```bash
     ffmpeg -i input_video.mp4 -q:a 0 -map a hidden-talent.mp3
     ```

2. **Place the audio file:**
   - Save as `hidden-talent.mp3` in this directory
   - Optionally create `hidden-talent.ogg` for broader browser support

3. **File formats supported:**
   - MP3 (recommended for compatibility)
   - OGG (optional, for Firefox/Chrome)

## Quick Setup

If you have the Instagram video file:

```bash
# Convert video to MP3
ffmpeg -i instagram_video.mp4 -vn -acodec libmp3lame -q:a 2 hidden-talent.mp3

# Convert to OGG (optional)
ffmpeg -i instagram_video.mp4 -vn -acodec libvorbis -q:a 4 hidden-talent.ogg
```

## Alternative: Use Direct URL

If you prefer to use a direct URL instead of hosting the file:

1. Upload the audio to a service like:
   - SoundCloud
   - Google Drive (with public sharing)
   - Cloudinary
   - AWS S3

2. Update the audio src in `/app/media/page.tsx`:
   ```tsx
   <source src="YOUR_DIRECT_URL_HERE" type="audio/mpeg" />
   ```

## Current Status

⚠️ **Action Required:** Add `hidden-talent.mp3` to this directory to enable audio playback.

The audio player is already configured in the media page and will work automatically once the file is added.
