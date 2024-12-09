import { useState, useEffect, useRef } from 'react';

export default function() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState('jump'); // jump or filter
  const songRefs = useRef([]); // Why useRef?

  // Sample playlist data
  const playlist = [
    { id: 1, title: "Bohemian Rhapsody", artist: "Queen", duration: "3:45" },
    { id: 2, title: "Sweet Child O' Mine", artist: "Guns N' Roses", duration: "4:20" },
    { id: 3, title: "Hotel California", artist: "Eagles", duration: "3:30" },
    { id: 4, title: "Stairway to Heaven", artist: "Led Zeppelin", duration: "5:15" },
    { id: 5, title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", duration: "3:55" },
    { id: 6, title: "Sweet Dreams", artist: "Eurythmics", duration: "4:10" },
    { id: 7, title: "Sweet Emotion", artist: "Aerosmith", duration: "3:25" },
    { id: 8, title: "November Rain", artist: "Guns N' Roses", duration: "4:45" },
  ];

  // Scroll to the current song when it changes
  useEffect(() => {
    if (songRefs.current[currentSongIndex]) {
      songRefs.current[currentSongIndex].scrollIntoView({
        behaviour: 'smooth',
        block: 'center'
      });
    }
  }, [currentSongIndex]);

  const playSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  // Simulate song completion and auto-scroll to the next song
  const handleSongEnd = () => {
    if (currentSongIndex < playlist.length - 1) {
      let nextIndex = currentSongIndex + 1;
      setCurrentSongIndex(nextIndex);
    }
  }

  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => {
      return part.toLowerCase() === searchTerm.toLowerCase()
        ? <span key={index} className="bg-yellow-200">{part}</span>
        : part
    });
  }

  useEffect(() => {
    if (searchMode === 'jump' && searchTerm) {
      const firstMatch = playlist.findIndex(song => {
        return song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase());
      });
      if (firstMatch !== -1) {
        songRefs.current[firstMatch]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }
  }, [searchMode, searchTerm]);

  const filteredPlaylist = playlist.filter(song => {
    return song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-100 p-4 mb-4 rounded">
        <div className="text-lg font-bold mb-2">
          Now Playing: {playlist[currentSongIndex].title}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsPlaying(!isPlaying)}
            className="bg-blue-500 text-white px-4 py-2 rounded">
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            {isPlaying && (
              <button onClick={handleSongEnd}
                className="bg-gray-500 text-white px-4 py-2 rounded">
                Next
              </button>
            )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-1">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search songs or artists..."
            className="w-full pl-10 pr-4 py-2 border rounded" />
          </div>
          <select value={searchMode} onChange={(e) => setSearchMode(e.target.value)} className="border rounded px-3 py-2">
            <option value="jump">Jump</option>
            <option value="filter">Filter</option>
          </select>
        </div>
      </div>

      <div className="h-64 overflow-y-auto border rounded">
        {(searchMode === 'filter' ? filteredPlaylist : playlist).map((song, index) => {
          return (
            <div
              key={song.id}
              ref={el => songRefs.current[index] = el }
              className={`p-4 border-b cursor-pointer ${
                currentSongIndex === index ? 'bg-blue-100' : 'hover:bg-gray-50'
              }`}
              onClick={() => playSong(index)}>
                <div className="font-medium">{highlightSearchTerm(song.title)}</div>
                <div className="text-sm text-gray-500">{highlightSearchTerm(song.artist)} . {song.duration}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}