import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';

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
    src: "/music/Day Dreaming.mp3"
  }
];

export const SimpleMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [preloadedTracks, setPreloadedTracks] = useState<Map<number, HTMLAudioElement>>(new Map());
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const preloadRefs = useRef<HTMLAudioElement[]>([]);

  // Preload all tracks on component mount for instant switching
  useEffect(() => {
    const preloadAllTracks = async () => {
      const preloadMap = new Map<number, HTMLAudioElement>();
      
      // Create audio elements for all tracks
      musicTracks.forEach((track, index) => {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = track.src;
        audio.volume = 0; // Mute preloaded tracks
        
        // Add event listeners for preloading status
        audio.addEventListener('canplaythrough', () => {
          console.log(`Track ${index} preloaded successfully`);
        });
        
        audio.addEventListener('error', (e) => {
          console.error(`Failed to preload track ${index}:`, e);
        });
        
        preloadMap.set(index, audio);
        preloadRefs.current.push(audio);
      });
      
      setPreloadedTracks(preloadMap);
    };

    preloadAllTracks();

    // Cleanup on unmount
    return () => {
      preloadRefs.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      preloadRefs.current = [];
    };
  }, []);

  // Switch to preloaded track instantly
  const switchToTrack = useCallback((trackIndex: number) => {
    const audio = audioRef.current;
    const preloadedAudio = preloadedTracks.get(trackIndex);
    
    if (!audio || !preloadedAudio) return;

    // Stop current audio
    audio.pause();
    setIsPlaying(false);
    setCurrentTime(0);
    setIsBuffering(false);

    // Copy the preloaded audio state to main audio element
    audio.src = preloadedAudio.src;
    audio.currentTime = 0;
    audio.volume = isMuted ? 0 : volume;
    
    // If the preloaded audio is ready, we can play immediately
    if (preloadedAudio.readyState >= 3) { // HAVE_FUTURE_DATA or better
      setDuration(preloadedAudio.duration);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [preloadedTracks, volume, isMuted]);

  // Handle track change
  useEffect(() => {
    switchToTrack(currentTrack);
  }, [currentTrack, switchToTrack]);

  // Audio event handlers
  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !isNaN(audio.duration)) {
      setDuration(audio.duration);
      setIsLoading(false);
      setIsBuffering(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !isNaN(audio.currentTime)) {
      setCurrentTime(audio.currentTime);
    }
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
    setIsBuffering(false);
  }, []);

  const handleWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handleCanPlayThrough = useCallback(() => {
    setIsBuffering(false);
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    // Auto play next track
    const nextTrack = (currentTrack + 1) % musicTracks.length;
    setCurrentTrack(nextTrack);
  }, [currentTrack]);

  const handleError = useCallback((e: Event) => {
    console.error('Audio error:', e);
    setIsPlaying(false);
    setIsLoading(false);
    setIsBuffering(false);
  }, []);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
  }, []);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [handleLoadedMetadata, handleTimeUpdate, handleCanPlay, handleWaiting, handleCanPlayThrough, handlePlay, handlePause, handleEnded, handleError, handleLoadStart]);

  // Update volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || isLoading) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        // Ensure audio is ready before playing
        if (audio.readyState < 2) {
          setIsBuffering(true);
          // Wait for audio to be ready
          await new Promise<void>((resolve) => {
            const onCanPlay = () => {
              audio.removeEventListener('canplay', onCanPlay);
              setIsBuffering(false);
              resolve();
            };
            audio.addEventListener('canplay', onCanPlay);
          });
        }
        
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      setIsBuffering(false);
    }
  };

  const handleNext = () => {
    const nextTrack = (currentTrack + 1) % musicTracks.length;
    setCurrentTrack(nextTrack);
  };

  const handlePrevious = () => {
    const prevTrack = currentTrack === 0 ? musicTracks.length - 1 : currentTrack - 1;
    setCurrentTrack(prevTrack);
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

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
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
        preload="auto"
      />
      
      <div className="bg-black/60 backdrop-blur-lg rounded-xl border border-cyan-300/20 p-4 shadow-[0_0_20px_rgba(173,248,255,0.2)]">
        
        {/* Loading/Buffering Indicator */}
        {(isLoading || isBuffering) && (
          <div className="text-center mb-3">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
              <p className="text-cyan-300 text-xs">
                {isLoading ? 'Loading...' : 'Buffering...'}
              </p>
            </div>
          </div>
        )}
        
        {/* Track Info */}
        <div className="text-center mb-3">
          <p className="text-cyan-300 text-sm font-mono truncate">
            {musicTracks[currentTrack].title}
          </p>
          <p className="text-gray-400 text-xs">
            {currentTrack + 1} of {musicTracks.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="100"
            value={progressPercentage}
            onChange={handleProgressChange}
            className="w-full h-2 bg-gray-700/50 rounded-full appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${progressPercentage}%, rgba(55, 65, 81, 0.5) ${progressPercentage}%, rgba(55, 65, 81, 0.5) 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={handlePrevious}
            className="p-2 rounded-full border bg-gray-800/60 border-gray-600/50 text-gray-300 hover:text-white hover:border-cyan-300/50 hover:shadow-[0_0_15px_rgba(173,248,255,0.3)] transition-all duration-300"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className={`p-3 rounded-full border text-white transition-all duration-300 transform ${
              isLoading
                ? 'bg-gray-600/50 border-gray-500/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400/50 hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_15px_rgba(173,248,255,0.5)] hover:scale-110 cursor-pointer'
            }`}
          >
            {isLoading || isBuffering ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          
          <button
            onClick={handleNext}
            className="p-2 rounded-full border bg-gray-800/60 border-gray-600/50 text-gray-300 hover:text-white hover:border-cyan-300/50 hover:shadow-[0_0_15px_rgba(173,248,255,0.3)] transition-all duration-300"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 mb-3">
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
          
          <span className="text-xs text-gray-400 w-8 text-right">
            {Math.round((isMuted ? 0 : volume) * 100)}
          </span>
        </div>

        {/* Track List */}
        <div className="space-y-1">
          {musicTracks.map((track, index) => (
            <button
              key={index}
              onClick={() => setCurrentTrack(index)}
              className={`w-full text-left p-2 rounded text-xs transition-all duration-300 flex items-center gap-2 ${
                index === currentTrack
                  ? 'bg-cyan-600/20 border border-cyan-400/30 text-cyan-300'
                  : 'bg-gray-800/30 border border-gray-700/30 text-gray-300 hover:bg-gray-700/40 hover:border-gray-600/40 hover:text-white'
              }`}
            >
              <span className={`w-4 text-center ${
                index === currentTrack ? 'text-cyan-300' : 'text-gray-500'
              }`}>
                {index + 1}
              </span>
              <span className="flex-1 truncate">{track.title}</span>
              {index === currentTrack && isPlaying && (
                <div className="flex gap-1">
                  <div className="w-1 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
                  <div className="w-1 h-2 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-2 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
              {preloadedTracks.has(index) && (
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full opacity-60" title="Ready"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};