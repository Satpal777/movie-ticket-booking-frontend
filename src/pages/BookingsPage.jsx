import { useEffect, useState } from 'react';
import { apiMyBookings } from '../api.js';
import { ArrowLeft, Ticket } from 'lucide-react';

export default function BookingsPage({ onBack }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiMyBookings().then(setBookings).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h2 className="text-3xl font-extrabold text-white mb-8 font-mono uppercase tracking-tight flex items-center gap-3">
        <Ticket className="w-8 h-8 text-[#E50914]" /> My Tickets
      </h2>

      {loading && <p className="text-gray-400 animate-pulse font-mono">Loading data...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !bookings.length && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-10 text-center">
           <Ticket className="w-12 h-12 text-gray-700 mx-auto mb-4" />
           <p className="text-gray-400 font-medium">You haven't booked any movies yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {bookings.map((b, i) => (
          <div key={i} className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 relative overflow-hidden group hover:border-gray-500 transition-colors shadow-lg">
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-[#0A0A0A] rounded-full border-r border-gray-700 group-hover:border-gray-500 transition-colors" />
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center ml-2 relative z-10 gap-4">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-24 sm:w-20 sm:h-28 flex-shrink-0 bg-gray-800 rounded-md overflow-hidden">
                  <img src={b.movieImage || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop"} alt={b.movieTitle} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-white font-bold text-xl font-mono truncate max-w-sm">{b.movieTitle}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {b.screenName} &nbsp;·&nbsp; Seat <strong className="text-white bg-gray-700 px-1.5 py-0.5 rounded font-mono mx-0.5">{b.seatRow}{b.seatNumber}</strong> ({b.seatType})
                  </p>
                  <p className="text-gray-500 text-xs mt-2 uppercase tracking-wide font-medium">
                    {new Date(b.showTime).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
              <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-gray-800 pt-3 sm:pt-0">
                <p className="text-[#E50914] font-bold text-2xl drop-shadow-sm">₹{b.price}</p>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm mt-1 ${b.status === 'confirmed' ? 'bg-green-900/40 text-green-400 border border-green-800' : 'bg-red-900/40 text-red-400 border border-red-800'}`}>
                  {b.status}
                </span>
              </div>
            </div>
            
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-[#0A0A0A] rounded-full border-l border-gray-700 group-hover:border-gray-500 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
