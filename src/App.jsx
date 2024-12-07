import { useState, useEffect, useRef } from 'react';

export default function() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const songRefs = useRef([]); // Why useRef?

  // Sample playlist data
  const playlist = [
    { id: 1, title: "Song 1", duration: "3:45" },
    { id: 2, title: "Song 2", duration: "4:20" },
    { id: 3, title: "Song 3", duration: "3:30" },
    { id: 4, title: "Song 4", duration: "5:15" },
    { id: 5, title: "Song 5", duration: "3:55" },
    { id: 6, title: "Song 6", duration: "4:10" },
    { id: 7, title: "Song 7", duration: "3:25" },
    { id: 8, title: "Song 8", duration: "4:45" },
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

      <div className="h-64 overflow-y-auto border rounded">
        {playlist.map((song, index) => {
          return (
            <div
              key={song.id}
              ref={el => songRefs.current[index] = el }
              className={`p-4 border-b cursor-pointer ${
                currentSongIndex === index ? 'bg-blue-100' : 'hover:bg-gray-50'
              }`}
              onClick={() => playSong(index)}>
                <div className="font-medium">{song.title}</div>
                <div className="text-sm text-gray-500">{song.duration}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}