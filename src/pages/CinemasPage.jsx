import { useEffect, useState } from 'react';
import { apiCinemas } from '../api.js';
import { Globe, Clock, MapPin, Phone, Video, ArrowLeft } from 'lucide-react';

export default function CinemasPage({ movie, onSelect, onBack }) {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiCinemas(movie.id)
      .then(setCinemas)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [movie.id]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to movies
      </button>

      <h2 className="text-white font-bold text-2xl mb-1 font-mono uppercase">{movie.title}</h2>
      <div className="flex gap-4 text-gray-400 text-sm mb-6">
        <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-gray-500" /> {movie.language}</span>
        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-500" /> {movie.duration} min</span>
      </div>

      <h3 className="text-gray-300 text-sm font-semibold uppercase tracking-wider mb-4 border-l-2 border-[#E50914] pl-2 font-mono">
        Select a Cinema
      </h3>

      {loading && <p className="text-gray-400 animate-pulse">Loading cinemas...</p>}
      {error   && <p className="text-red-400">{error}</p>}

      {!loading && !error && !cinemas.length && (
        <p className="text-gray-400">No cinemas are showing this movie right now.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cinemas.map((cinema) => (
          <button
            key={cinema.id}
            onClick={() => onSelect(cinema)}
            className="bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 hover:border-[#E50914] rounded-xl p-5 text-left transition-all group shadow-sm hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="bg-gray-900 p-2.5 rounded-lg border border-gray-700 group-hover:border-[#E50914]/50 transition-colors">
                 <Video className="w-6 h-6 text-[#E50914]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-lg group-hover:text-[#E50914] transition-colors truncate font-mono">
                  {cinema.name}
                </h4>
                <p className="text-gray-400 text-sm mt-0.5 truncate flex items-center gap-1">
                  {cinema.address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs font-semibold tracking-wide text-gray-500 uppercase">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {cinema.city}, {cinema.state}</span>
              {cinema.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {cinema.phone}</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
