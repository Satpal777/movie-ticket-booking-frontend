import { ArrowLeft, MonitorPlay, Users, Clock } from 'lucide-react';

export default function ShowsPage({ movie, hall, onSelect, onBack }) {
  const shows = hall.shows;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to screens
      </button>

      <h2 className="text-white font-bold text-2xl mb-1 font-mono uppercase">{movie.title}</h2>
      <div className="flex items-center gap-4 text-gray-400 text-sm mb-8 font-medium">
        <span className="flex items-center gap-1.5"><MonitorPlay className="w-4 h-4" /> {hall.screenName}</span>
        <span className="w-1 h-1 bg-gray-600 rounded-full" />
        <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-gray-500" /> {hall.totalSeats} seats</span>
      </div>

      {!shows.length && <p className="text-gray-400">No shows available for this screen.</p>}

      <div className="space-y-4">
        {shows.map((s) => {
          const date = new Date(s.startsAt);
          return (
            <button key={s.id} onClick={() => onSelect(s)}
              className="w-full bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 hover:border-[#E50914] rounded-xl p-5 text-left flex justify-between items-center transition-all group shadow-sm hover:shadow-md">
              <div>
                <p className="text-white font-semibold text-lg font-mono">
                  {date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                </p>
                <p className="flex items-center gap-1.5 text-gray-400 text-sm mt-1.5 font-medium">
                  <Clock className="w-4 h-4 text-gray-500" /> {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#E50914] font-bold text-xl drop-shadow-sm group-hover:scale-105 transition-transform">₹{s.price}</p>
                <p className="text-gray-500 text-xs mt-0.5 tracking-wide uppercase">per seat</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
