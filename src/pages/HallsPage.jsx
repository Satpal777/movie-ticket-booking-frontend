import { useEffect, useState } from 'react';
import { apiShowsByCinema } from '../api.js';
import { ArrowLeft, Monitor, MapPin, MonitorPlay, Users, Film } from 'lucide-react';

export default function HallsPage({ movie, cinema, onSelect, onBack }) {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiShowsByCinema(movie.id, cinema.id)
      .then((shows) => {
        const map = {};
        shows.forEach((s) => {
          if (!map[s.screenId]) {
            map[s.screenId] = {
              screenId:   s.screenId,
              screenName: s.screenName,
              totalSeats: s.totalSeats,
              shows: [],
            };
          }
          map[s.screenId].shows.push(s);
        });
        setHalls(Object.values(map));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [movie.id, cinema.id]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to cinemas
      </button>

      <h2 className="text-white font-bold text-2xl mb-1 font-mono uppercase">{movie.title}</h2>
      <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
        <span className="flex items-center gap-1.5"><Monitor className="w-4 h-4" /> {cinema.name}</span>
        <span className="w-1 h-1 bg-gray-600 rounded-full" />
        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {cinema.city}</span>
      </div>

      <h3 className="text-gray-300 text-sm font-semibold uppercase tracking-wider mb-4 border-l-2 border-[#E50914] pl-2 font-mono">
        Select a Screen
      </h3>

      {loading && <p className="text-gray-400 animate-pulse">Loading screens...</p>}
      {error   && <p className="text-red-400">{error}</p>}

      {!loading && !error && !halls.length && (
        <p className="text-gray-400">No screens available at this cinema for this movie.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {halls.map((hall) => (
          <button
            key={hall.screenId}
            onClick={() => onSelect(hall)}
            className="bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 hover:border-[#E50914] rounded-xl p-5 text-left transition-colors group shadow-sm hover:shadow-md"
          >
            <div className="bg-gray-900 p-2.5 rounded-lg border border-gray-700 inline-block mb-3 group-hover:border-[#E50914]/50 transition-colors">
              <MonitorPlay className="w-6 h-6 text-[#E50914]" />
            </div>
            <h4 className="text-white font-semibold text-xl group-hover:text-[#E50914] transition-colors font-mono">
              {hall.screenName}
            </h4>
            <div className="flex gap-4 mt-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-500" /> {hall.totalSeats} seats</span>
              <span className="flex items-center gap-1.5"><Film className="w-3.5 h-3.5 text-gray-500" /> {hall.shows.length} show{hall.shows.length !== 1 ? 's' : ''}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
