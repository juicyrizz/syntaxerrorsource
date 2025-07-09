import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Music } from 'lucide-react';

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
  }
];

export const OptimizedMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [preloadedTracks, setPreloadedTracks] = useState<Set<number>>(new Set());
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const preloadRefs = useRef<HTMLAudioElement[]>([]);
  const loadTimeoutRef = useRef<NodeJS.Timeout>();

  // Preload audio files for instant playback
  const preloadTrack = useCallback((trackIndex: number) => {
    if (preloadedTracks.has(trackIndex)) return;

    const track = musicTracks[trackIndex];
    if (!track) return;

    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = track.src;
    
    // Set cache headers for better performance
    audio.crossOrigin = 'anonymous';
    
    const handleCanPlayThrough = () => {
      setPreloadedTracks(prev => new Set(prev).add(trackIndex));
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    preloadRefs.current[trackIndex] = audio;
  }, [preloadedTracks]);

  // Preload next and previous tracks
  useEffect(() => {
    if (!isPlayerVisible) return;

    const preloadNext = () => {
      const nextTrack = (currentTrack + 1) % musicTracks.length;
      const prevTrack = currentTrack === 0 ? musicTracks.length - 1 : currentTrack - 1;
      
      // Preload current, next, and previous tracks
      [currentTrack, nextTrack, prevTrack].forEach(index => {
        setTimeout(() => preloadTrack(index), index === currentTrack ? 0 : 500);
      });
    };

    preloadNext();
  }, [currentTrack, isPlayerVisible, preloadTrack]);

  // Audio event handlers with timeout protection
  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !isNaN(audio.duration)) {
      setDuration(audio.duration);
      setIsLoading(false);
      setError(null);
      
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
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
    setError(null);
    
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setIsLoading(false);
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

  const handleError = useCallback(() => {
    setError('Failed to load audio file');
    setIsPlaying(false);
    setIsLoading(false);
    
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
  }, []);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    // Set a timeout to prevent infinite loading
    loadTimeoutRef.current = setTimeout(() => {
      setError('Audio loading timeout');
      setIsLoading(false);
    }, 10000); // 10 second timeout
  }, []);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [handleLoadedMetadata, handleTimeUpdate, handleCanPlay, handlePlay, handlePause, handleEnded, handleError, handleLoadStart]);

  // Handle track changes with preloaded audio optimization
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentTrackData = musicTracks[currentTrack];
    if (!currentTrackData) return;

    // Reset states
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    
    // Check if we have a preloaded version
    const preloadedAudio = preloadRefs.current[currentTrack];
    
    if (preloadedAudio && preloadedTracks.has(currentTrack)) {
      // Use preloaded audio for instant playback
      audio.src = preloadedAudio.src;
      audio.currentTime = 0;
      
      // Copy the buffered data if possible
      if (preloadedAudio.readyState >= 2) {
        setIsLoading(false);
        setDuration(preloadedAudio.duration);
      } else {
        setIsLoading(true);
        audio.load();
      }
    } else {
      // Fallback to regular loading
      setIsLoading(true);
      audio.src = currentTrackData.src;
      audio.load();
    }

  }, [currentTrack, preloadedTracks]);

  // Update volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      
      // Clean up preloaded audio
      preloadRefs.current.forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || isLoading) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        // Ensure audio is ready before playing
        if (audio.readyState < 2) {
          setIsLoading(true);
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Audio loading timeout'));
            }, 5000);

            const onCanPlay = () => {
              clearTimeout(timeout);
              audio.removeEventListener('canplay', onCanPlay);
              setIsLoading(false);
              resolve(void 0);
            };
            
            audio.addEventListener('canplay', onCanPlay);
          });
        }
        
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setError('Failed to play audio');
      setIsPlaying(false);
      setIsLoading(false);
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
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsPlayerVisible(!isPlayerVisible)}
        className="mt-6 mx-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 rounded-lg border border-cyan-400/50 text-white font-medium transition-all duration-300 hover:from-cyan-500/90 hover:to-blue-500/90 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(173,248,255,0.5)] hover:scale-105"
      >
        <Music className="w-5 h-5" />
        {isPlayerVisible ? 'Hide Music Player' : 'Show Music Player'}
      </button>

      {/* Music Player */}
      {isPlayerVisible && (
        <div className="mt-4 max-w-md mx-auto">
          <audio 
            ref={audioRef} 
            preload="auto"
            crossOrigin="anonymous"
          />
          
          <div className="bg-black/60 backdrop-blur-lg rounded-xl border border-cyan-300/20 p-4 shadow-[0_0_20px_rgba(173,248,255,0.2)]">
            
            {/* Error Message */}
            {error && (
              <div className="text-center mb-3 p-2 bg-red-900/40 border border-red-500/40 rounded">
                <p className="text-red-300 text-xs">{error}</p>
              </div>
            )}
            
            {/* Track Info */}
            <div className="text-center mb-3">
              <p className="text-cyan-300 text-sm font-mono truncate">
                {musicTracks[currentTrack]?.title || 'Unknown Track'}
              </p>
              <p className="text-gray-400 text-xs">
                {currentTrack + 1} of {musicTracks.length}
                {preloadedTracks.has(currentTrack) && (
                  <span className="ml-2 text-green-400">● Ready</span>
                )}
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
                    ? 'bg-gray-600/50 border-gray-500/50 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400/50 hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_15px_rgba(173,248,255,0.5)] hover:scale-110 cursor-pointer'
                }`}
              >
                {isLoading ? (
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
            <div className="space-y-1 max-h-32 overflow-y-auto">
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
                  
                  {/* Preload status indicator */}
                  {preloadedTracks.has(index) && (
                    <div className="w-2 h-2 bg-green-400 rounded-full" title="Preloaded"></div>
                  )}
                  
                  {/* Playing indicator */}
                  {index === currentTrack && isPlaying && (
                    <div className="flex gap-1">
                      <div className="w-1 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
                      <div className="w-1 h-2 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-2 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                  
                  {/* Loading indicator for current track */}
                  {index === currentTrack && isLoading && (
                    <div className="animate-spin rounded-full h-3 w-3 border border-cyan-300 border-t-transparent"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};