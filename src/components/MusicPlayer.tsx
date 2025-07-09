import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Shuffle, Repeat, Heart } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  filename: string;
  duration?: number;
}

// Your actual music files from the public/music folder
const musicLibrary: Song[] = [
  {
    id: '1',
    title: 'Break The Loop',
    artist: '1096 Gang ft. @trvmata7292',
    filename: '1096 Gang ft. @trvmata7292 - BREAK THE LOOP (Official Music Video) prod. by Asiaboi x Guddisc [MvuDoBGTy6g].mp3'
  },
  {
    id: '2',
    title: 'Like It',
    artist: '14K SOJA',
    filename: '14K SOJA - Like It (Booty Music Remix) [dJyw6Q3SADs].mp3'
  },
  {
    id: '3',
    title: 'Day Dreaming',
    artist: 'Youngwise, Trvmata & Guddhist',
    filename: 'Day Dreaming - Youngwise, Trvmata & Guddhist (Prod.By_ Macky Llaneta) [AThXIvwDe9I].mp3'
  },
  {
    id: '4',
    title: 'My Day',
    artist: 'HELLMERRY',
    filename: 'HELLMERRY - My Day (Official Music Video) [5v8CYpYAHT0].mp3'
  },
  {
    id: '5',
    title: 'Para Sa Streets',
    artist: 'Hev Abi',
    filename: 'Hev Abi - Para Sa Streets (Official Lyric Video) (Prod. Noane) [75UGXuyoFII].mp3'
  },
  {
    id: '6',
    title: 'Lynx',
    artist: 'Elohim',
    filename: 'Lynx - Elohim [PLNVDKbeMRc].mp3'
  },
  {
    id: '7',
    title: 'MAN IN THE MERROR',
    artist: 'WAIIAN',
    filename: 'WAIIAN - MAN IN THE MERROR (Official Lyric Video) [nrj9JlraMn0].mp3'
  }
];

export const MusicPlayer: React.FC = () => {
  const [songs] = useState<Song[]>(musicLibrary);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [isLiked, setIsLiked] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [preloadedAudio, setPreloadedAudio] = useState<Map<string, HTMLAudioElement>>(new Map());
  const [isBuffering, setIsBuffering] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const preloadRef = useRef<HTMLAudioElement[]>([]);
  const currentSong = songs[currentSongIndex];

  // Preload next and previous songs for instant playback
  useEffect(() => {
    const preloadSongs = () => {
      const nextIndex = (currentSongIndex + 1) % songs.length;
      const prevIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
      
      [nextIndex, prevIndex].forEach((index) => {
        const song = songs[index];
        if (song && !preloadedAudio.has(song.id)) {
          const audio = new Audio();
          audio.preload = 'auto';
          audio.src = `/music/${encodeURIComponent(song.filename)}`;
          
          // Store preloaded audio
          setPreloadedAudio(prev => new Map(prev.set(song.id, audio)));
          preloadRef.current.push(audio);
        }
      });
    };

    // Preload after a short delay to not interfere with current song
    const timeoutId = setTimeout(preloadSongs, 1000);
    return () => clearTimeout(timeoutId);
  }, [currentSongIndex, songs, preloadedAudio]);

  // Clean up preloaded audio when component unmounts
  useEffect(() => {
    return () => {
      preloadRef.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      preloadRef.current = [];
    };
  }, []);

  // Audio event handlers
  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
      setIsLoading(false);
      setIsBuffering(false);
      setError(null);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
    }
  }, []);

  const handleEnded = useCallback(() => {
    if (repeatMode === 'one') {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
    } else {
      handleNext();
    }
  }, [repeatMode]);

  const handleError = useCallback(() => {
    setError(`Failed to load: ${currentSong?.title || 'Unknown'}`);
    setIsLoading(false);
    setIsBuffering(false);
    setIsPlaying(false);
  }, [currentSong]);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setIsBuffering(true);
    setError(null);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
    setIsBuffering(false);
    setError(null);
  }, []);

  const handleWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  const handleCanPlayThrough = useCallback(() => {
    setIsBuffering(false);
  }, []);

  // Initialize audio element and event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, [handleLoadedMetadata, handleTimeUpdate, handleEnded, handleError, handleLoadStart, handleCanPlay, handleWaiting, handleCanPlayThrough]);

  // Update audio source when song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    const wasPlaying = isPlaying;
    setIsPlaying(false);
    setCurrentTime(0);
    setError(null);
    setIsBuffering(true);

    // Check if we have a preloaded version
    const preloadedAudioElement = preloadedAudio.get(currentSong.id);
    
    if (preloadedAudioElement && preloadedAudioElement.readyState >= 2) {
      // Use preloaded audio for instant playback
      audio.src = preloadedAudioElement.src;
      audio.currentTime = 0;
      setIsBuffering(false);
      
      if (wasPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error('Error playing preloaded audio:', error);
              setError('Failed to play audio');
            });
        }
      }
    } else {
      // Fallback to regular loading
      audio.src = `/music/${encodeURIComponent(currentSong.filename)}`;
      audio.load();
      
      if (wasPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error('Error playing audio:', error);
              setError('Failed to play audio');
            });
        }
      }
    }

  }, [currentSongIndex, currentSong, preloadedAudio]);

  // Update volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || isLoading || isBuffering) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        // Ensure audio is ready before playing
        if (audio.readyState < 2) {
          setIsBuffering(true);
          await new Promise((resolve) => {
            const onCanPlay = () => {
              audio.removeEventListener('canplay', onCanPlay);
              setIsBuffering(false);
              resolve(void 0);
            };
            audio.addEventListener('canplay', onCanPlay);
          });
        }
        
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setError('Failed to play audio');
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    let nextIndex;
    
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * songs.length);
    } else if (repeatMode === 'all' && currentSongIndex === songs.length - 1) {
      nextIndex = 0;
    } else {
      nextIndex = currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0;
    }
    
    setCurrentSongIndex(nextIndex);
  };

  const handlePrevious = () => {
    let prevIndex;
    
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * songs.length);
    } else {
      prevIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1;
    }
    
    setCurrentSongIndex(prevIndex);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
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
        <div className="mt-4 max-w-lg mx-auto">
          {/* Hidden Audio Element */}
          <audio 
            ref={audioRef} 
            preload="metadata"
            crossOrigin="anonymous"
          />
          
          {/* Music Player Container */}
          <div className="bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl border border-cyan-300/20 p-6 shadow-[0_0_40px_rgba(173,248,255,0.2)]">
            
            {/* Error Message */}
            {error && (
              <div className="text-center mb-4 p-3 bg-red-900/40 border border-red-500/40 rounded-xl">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            
            {/* Buffering Indicator */}
            {isBuffering && !isLoading && (
              <div className="text-center mb-4 p-3 bg-yellow-900/40 border border-yellow-500/40 rounded-xl">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                  <p className="text-yellow-300 text-sm">Buffering...</p>
                </div>
              </div>
            )}
            
            {/* Album Art Placeholder */}
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-cyan-300/30">
              <Music className="w-16 h-16 text-cyan-300/60" />
            </div>
            
            {/* Song Info */}
            <div className="text-center mb-6">
              <h3 
                className="text-white font-bold text-xl mb-1"
                style={{ 
                  textShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
                }}
              >
                {currentSong?.title || 'No Song Selected'}
              </h3>
              <p className="text-cyan-300/80 text-sm font-medium">
                {currentSong?.artist || 'Unknown Artist'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="relative">
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
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex justify-center items-center gap-6 mb-6">
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isShuffled 
                    ? 'text-cyan-300 bg-cyan-300/20 border border-cyan-300/50' 
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>
              
              <button
                onClick={handlePrevious}
                className="p-3 rounded-full border bg-gray-800/60 border-gray-600/50 text-gray-300 hover:text-white hover:border-cyan-300/50 hover:shadow-[0_0_15px_rgba(173,248,255,0.3)] transition-all duration-300"
              >
                <SkipBack className="w-6 h-6" />
              </button>
              
              <button
                onClick={handlePlayPause}
                disabled={isLoading || isBuffering}
                className={`p-4 rounded-full border text-white transition-all duration-300 transform ${
                  isLoading || isBuffering
                    ? 'bg-gray-600/50 border-gray-500/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400/50 hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_25px_rgba(173,248,255,0.6)] hover:scale-110 cursor-pointer'
                }`}
              >
                {isLoading || isBuffering ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                ) : isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>
              
              <button
                onClick={handleNext}
                className="p-3 rounded-full border bg-gray-800/60 border-gray-600/50 text-gray-300 hover:text-white hover:border-cyan-300/50 hover:shadow-[0_0_15px_rgba(173,248,255,0.3)] transition-all duration-300"
              >
                <SkipForward className="w-6 h-6" />
              </button>
              
              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-full transition-all duration-300 relative ${
                  repeatMode !== 'none' 
                    ? 'text-cyan-300 bg-cyan-300/20 border border-cyan-300/50' 
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <Repeat className="w-5 h-5" />
                {repeatMode === 'one' && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-300 text-black rounded-full text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                )}
              </button>
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={toggleLike}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isLiked 
                    ? 'text-red-400 bg-red-400/20 border border-red-400/50' 
                    : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              {/* Volume Control */}
              <div className="flex items-center gap-3 flex-1 max-w-xs mx-4">
                <button
                  onClick={toggleMute}
                  className="text-gray-400 hover:text-cyan-300 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-gray-700/50 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${isMuted ? 0 : volume}%, rgba(55, 65, 81, 0.5) ${isMuted ? 0 : volume}%, rgba(55, 65, 81, 0.5) 100%)`
                    }}
                  />
                </div>
                
                <span className="text-xs text-gray-400 w-8 text-right">
                  {isMuted ? 0 : volume}
                </span>
              </div>

              <div className="w-8"></div> {/* Spacer for balance */}
            </div>

            {/* Playlist */}
            <div className="pt-4 border-t border-gray-700/30">
              <h4 className="text-cyan-300 text-sm font-semibold mb-3 text-center">Playlist</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {songs.map((song, index) => (
                  <button
                    key={song.id}
                    onClick={() => setCurrentSongIndex(index)}
                    className={`w-full text-left p-2 rounded-lg transition-all duration-300 ${
                      index === currentSongIndex
                        ? 'bg-cyan-600/20 border border-cyan-400/30 text-cyan-300'
                        : 'bg-gray-800/30 border border-gray-700/30 text-gray-300 hover:bg-gray-700/40 hover:border-gray-600/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono w-6 text-center ${
                        index === currentSongIndex ? 'text-cyan-300' : 'text-gray-500'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">{song.title}</p>
                        <p className="text-xs opacity-70 truncate">{song.artist}</p>
                      </div>
                      {index === currentSongIndex && isPlaying && (
                        <div className="flex gap-1">
                          <div className="w-1 h-3 bg-cyan-300 rounded-full animate-pulse"></div>
                          <div className="w-1 h-3 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-1 h-3 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      )}
                      {preloadedAudio.has(song.id) && (
                        <div className="w-2 h-2 bg-green-400 rounded-full opacity-60" title="Preloaded"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};