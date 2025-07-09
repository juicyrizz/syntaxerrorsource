import React, { useState, useEffect } from 'react';
import { User, Activity, Gamepad2, Music, Tv, ExternalLink, Code2, Bot } from 'lucide-react';

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  global_name?: string;
}

interface DiscordActivity {
  name: string;
  type: number;
  state?: string;
  details?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
}

interface LanyardData {
  success: boolean;
  data: {
    discord_user: DiscordUser;
    discord_status: 'online' | 'idle' | 'dnd' | 'offline';
    activities: DiscordActivity[];
    listening_to_spotify?: {
      song: string;
      artist: string;
      album: string;
      album_art_url: string;
    };
  };
}

interface Member {
  id: string;
  discordUrl: string;
  customMessage: string;
  portfolioUrl?: string;
  icon: 'developer' | 'assistant';
}

const members: Member[] = [
  {
    id: '1374742430183718914',
    discordUrl: 'https://www.facebook.com/janper.boncales',
    customMessage: 'while(!Coding) _Error()',
    portfolioUrl: 'https://whosjuicy.byethost18.com/',
    icon: 'developer'
  },
  {
    id: '1367129983042060379', 
    discordUrl: 'https://www.facebook.com/aaran.santos.iu',
    customMessage: 'bellissima creazione',
    portfolioUrl: 'https://your-portfolio-url.com',
    icon: 'developer'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-green-500';
    case 'idle': return 'bg-yellow-500';
    case 'dnd': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getActivityIcon = (type: number) => {
  switch (type) {
    case 0: return <Gamepad2 className="w-4 h-4" />;
    case 1: return <Tv className="w-4 h-4" />;
    case 2: return <Music className="w-4 h-4" />;
    default: return <Activity className="w-4 h-4" />;
  }
};

const getProfileIcon = (iconType: 'developer' | 'assistant') => {
  switch (iconType) {
    case 'developer':
      return <Code2 className="w-5 h-5 text-green-400" />;
    case 'assistant':
      return <Bot className="w-5 h-5 text-blue-400" />;
    default:
      return null;
  }
};

const DiscordProfile: React.FC<{ memberId: string; discordUrl: string; customMessage: string; portfolioUrl?: string; icon: 'developer' | 'assistant' }> = ({ memberId, discordUrl, customMessage, portfolioUrl, icon }) => {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDiscordData = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${memberId}`);
        if (response.ok) {
          const result: LanyardData = await response.json();
          setData(result);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscordData();
    const interval = setInterval(fetchDiscordData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [memberId]);

  if (loading) {
    return (
      <div className="bg-black/60 rounded-2xl p-6 flex flex-col justify-center items-center backdrop-blur-lg border border-white/15 shadow-[0_0_20px_rgba(0,0,0,0.7)] min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-300"></div>
        <p className="text-cyan-300 mt-4">Loading profile...</p>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <a
        href={discordUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block no-underline text-inherit group"
      >
        <div className="bg-black/60 rounded-2xl p-6 flex flex-col justify-center items-center backdrop-blur-lg border border-white/15 shadow-[0_0_20px_rgba(0,0,0,0.7)] transition-all duration-300 group-hover:transform group-hover:-translate-y-3 group-hover:scale-102 group-hover:shadow-[0_0_30px_rgba(173,216,230,0.5)] group-hover:cursor-pointer min-h-[300px]">
          <User className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-400 text-center">Discord profile unavailable</p>
          <p className="font-mono text-sm text-cyan-300 m-0 pb-1 text-center mt-4 animate-text-glow">
            {customMessage}
          </p>
        </div>
      </a>
    );
  }

  const { discord_user, discord_status, activities, listening_to_spotify } = data.data;
  const avatarUrl = discord_user.avatar 
    ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(discord_user.discriminator) % 5}.png`;

  const displayName = discord_user.global_name || discord_user.username;
  const gameActivity = activities.find(activity => activity.type === 0);
  const customActivity = activities.find(activity => activity.type === 4);

  return (
    <a
      href={discordUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block no-underline text-inherit group"
    >
      <div className="bg-black/60 rounded-2xl p-6 backdrop-blur-lg border border-white/15 shadow-[0_0_20px_rgba(0,0,0,0.7)] transition-all duration-300 group-hover:transform group-hover:-translate-y-3 group-hover:scale-102 group-hover:shadow-[0_0_30px_rgba(173,216,230,0.5)] group-hover:cursor-pointer">
        {/* User Header */}
        <div className="flex items-center mb-4">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={`${displayName}'s avatar`}
              className="w-16 h-16 rounded-full border-2 border-gray-600"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-black ${getStatusColor(discord_status)}`}></div>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold text-lg">{displayName}</h3>
              {getProfileIcon(icon)}
            </div>
            {discord_user.discriminator !== '0' && (
              <p className="text-gray-400 text-sm">#{discord_user.discriminator}</p>
            )}
            <p className="text-cyan-300 text-xs capitalize">{discord_status}</p>
          </div>
        </div>

        {/* Spotify */}
        {listening_to_spotify && (
          <div className="mb-4 p-3 bg-green-900/30 rounded-lg border border-green-500/30">
            <div className="flex items-center mb-2">
              <Music className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-green-400 text-sm font-medium">Listening to Spotify</span>
            </div>
            <p className="text-white text-sm font-medium">{listening_to_spotify.song}</p>
            <p className="text-gray-300 text-xs">by {listening_to_spotify.artist}</p>
            <p className="text-gray-400 text-xs">on {listening_to_spotify.album}</p>
          </div>
        )}

        {/* Game Activity */}
        {gameActivity && (
          <div className="mb-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
            <div className="flex items-center mb-2">
              {getActivityIcon(gameActivity.type)}
              <span className="text-purple-400 text-sm font-medium ml-2">Playing a game</span>
            </div>
            <p className="text-white text-sm font-medium">{gameActivity.name}</p>
            {gameActivity.details && (
              <p className="text-gray-300 text-xs">{gameActivity.details}</p>
            )}
            {gameActivity.state && (
              <p className="text-gray-400 text-xs">{gameActivity.state}</p>
            )}
          </div>
        )}

        {/* Custom Status */}
        {customActivity && (
          <div className="mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
            <div className="flex items-center mb-1">
              <Activity className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm font-medium">Status</span>
            </div>
            <p className="text-white text-sm">{customActivity.state || customActivity.name}</p>
          </div>
        )}

        {/* No Activity */}
        {!listening_to_spotify && !gameActivity && !customActivity && (
          <div className="mb-4 p-3 bg-gray-900/30 rounded-lg border border-gray-500/30">
            <p className="text-gray-400 text-sm text-center">I'm not currently doing anything!</p>
          </div>
        )}

        {/* Just chillin text */}
        <p className="font-mono text-sm text-cyan-300 m-0 pb-1 text-center animate-text-glow">
          {customMessage}
        </p>
        
        {/* Portfolio Link */}
        {portfolioUrl && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/80 to-blue-600/80 rounded-lg border border-purple-400/50 text-white text-sm font-medium transition-all duration-300 hover:from-purple-500/90 hover:to-blue-500/90 hover:border-purple-300 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:scale-105 group"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              Portfolio
            </a>
          </div>
        )}
      </div>
    </a>
  );
};

export const MembersSection: React.FC = () => {
  return (
    <section className="relative z-10 py-15 px-5 max-w-6xl mx-auto">
      <h2 className="font-orbitron text-center mb-12 text-6xl uppercase tracking-[3px] text-cyan-300 sticky top-0 py-5 border-b-2 border-white/15 backdrop-blur-md bg-gradient-to-b from-black/90 via-black/70 to-transparent z-10"
          style={{ 
            textShadow: '0 0 20px #ADF8FF, 0 0 30px rgba(173, 216, 230, 0.4)',
            fontFamily: 'Orbitron, sans-serif'
          }}>
        Members
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center">
        {members.map((member) => (
          <DiscordProfile
            key={member.id}
            memberId={member.id}
            discordUrl={member.discordUrl}
            customMessage={member.customMessage}
            portfolioUrl={member.portfolioUrl}
            icon={member.icon}
          />
        ))}
      </div>
    </section>
  );
};