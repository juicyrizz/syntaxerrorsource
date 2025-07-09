import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const musicTracks = [
  {
    title: "Break The Loop",
    src: "/music/break-the-loop.mp3"
  },
  {
    title: "Like It",
    src: "/music/like-it.mp3"
  },
  {
    title: "Day Dreaming", 
    src: "/music/day-dreaming.mp3"
  },
  {
    title: "Your Song Here",
    src: "/music/your-song.mp3"
  }
];

export const SimpleMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      // Auto play next track
      const nextTrack = (currentTrack + 1) % musicTracks.length;
      setCurrentTrack(nextTrack);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mt-6 max-w-md mx-auto">
      <audio 
        ref={audioRef} 
        src={musicTracks[currentTrack].src}
        preload="metadata"
      />
      
      <div className="bg-black/60 backdrop-blur-lg rounded-xl border border-cyan-300/20 p-4 shadow-[0_0_20px_rgba(173,248,255,0.2)]">
        {/* Track Info */}
        <div className="text-center mb-3">
          <p className="text-cyan-300 text-sm font-mono truncate">
            {musicTracks[currentTrack].title}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full h-1 bg-gray-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 border border-cyan-400/50 text-white transition-all duration-300 hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_15px_rgba(173,248,255,0.5)] hover:scale-110"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-cyan-300 transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-gray-700/50 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(isMuted ? 0 : volume) * 100}%, rgba(55, 65, 81, 0.5) ${(isMuted ? 0 : volume) * 100}%, rgba(55, 65, 81, 0.5) 100%)`
              }}
            />
          </div>

          {/* Track Selector */}
          <select
            value={currentTrack}
            onChange={(e) => setCurrentTrack(parseInt(e.target.value))}
            className="bg-gray-800/60 border border-gray-600/50 text-gray-300 text-xs rounded px-2 py-1 focus:border-cyan-300/50 focus:outline-none"
          >
            {musicTracks.map((track, index) => (
              <option key={index} value={index}>
                {track.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};