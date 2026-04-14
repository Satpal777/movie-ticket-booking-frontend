import { useEffect, useState } from 'react';
import { apiMovies } from '../api.js';
import { Ticket, Film, Star, Clock, Globe } from 'lucide-react';

const DUMMY_POSTERS = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1478479405421-ce83c92fb3ba?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop',
];

const HERO_BANNERS = [
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop',
];

export default function MoviesPage({ onSelect }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.classList.add('bg-black');
    
    apiMovies()
      .then(setMovies)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

    return () => document.body.classList.remove('bg-black');
  }, []);

  if (loading) return <Centered>Loading cinematic experience...</Centered>;
  if (error) return <Centered className="text-red-500">{error}</Centered>;
  if (!movies.length) return <Centered>No movies showing. Please run the seed script.</Centered>;

  const featuredMovie = movies.find((m) => m.id === 32) || movies[0];
  const featuredBanner = featuredMovie.image || HERO_BANNERS[featuredMovie.id % HERO_BANNERS.length];

  return (
    <div className="w-full pb-12">
      <div className="relative w-full h-[80vh] min-h-[500px] flex items-end mb-12 group select-none">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={featuredBanner} 
            alt={featuredMovie.title}
            className="w-full h-full object-cover object-[center_top] opacity-60"
            draggable="false"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-12">
          <div className="max-w-2xl transform transition-transform duration-700 translate-y-0 opacity-100">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-[#E50914] bg-black/50 backdrop-blur-md rounded-sm border border-[#E50914]/30 uppercase shadow-[0_0_10px_rgba(229,9,20,0.3)]">
              Now Premiering
            </span>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg font-mono uppercase">
              {featuredMovie.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-300 font-medium mb-8">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> {featuredMovie.duration} min</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full" />
              <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-gray-400" /> {featuredMovie.language}</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full" />
              <span className="px-2 py-0.5 border border-gray-600 rounded text-xs tracking-wider">UA</span>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => onSelect(featuredMovie)}
                className="bg-[#E50914] hover:bg-[#b81d24] text-white font-bold py-3 px-8 rounded-md transition-all ease-in-out duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] flex items-center gap-2"
              >
                <Ticket className="w-5 h-5 fill-white/20" /> Book Tickets
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-xl font-bold text-white mb-6 border-l-4 border-[#E50914] pl-3 font-mono">
          Recommended Movies
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((m) => {
            const posterImg = m.image || DUMMY_POSTERS[m.id % DUMMY_POSTERS.length];

            return (
              <div 
                key={m.id} 
                onClick={() => onSelect(m)}
                className="group relative cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden mb-3 bg-gray-800 shadow-lg transition-all duration-300 ease-out group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-[1.03] group-hover:ring-2 group-hover:ring-gray-600">
                  <img 
                    src={posterImg} 
                    alt={m.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    draggable="false"
                  />
                  
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 to-transparent" />
                  
                  <span className="absolute top-2 right-2 bg-black/60 backdrop-blur border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {m.language}
                  </span>

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                     <Star className="w-8 h-8 mb-2 fill-yellow-500 text-yellow-500 shadow-lg" />
                     <span className="font-bold text-lg font-mono">Book Now</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base leading-snug truncate group-hover:text-gray-300 transition-colors font-mono">
                    {m.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {m.duration} min
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Centered({ children, className = 'text-gray-400' }) {
  return <div className={`flex items-center justify-center min-h-[60vh] text-lg font-medium ${className}`}>{children}</div>;
}
