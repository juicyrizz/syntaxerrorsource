# Music Files

Place your MP3 files in this folder. The music player will automatically load them.

## How to add your music:

1. Copy your MP3 files to this `public/music/` folder
2. Update the `musicTracks` array in `src/components/SimpleMusicPlayer.tsx` with your file names
3. The files will be accessible at `/music/your-filename.mp3`

## Example:
If you have a file called `my-song.mp3`, place it here and reference it as:
```
src: "/music/my-song.mp3"
```

## Current files expected:
- Break The Loop.mp3
- Like It.mp3  
- Day Dreaming.mp3

You can rename these or add your own files and update the player accordingly.