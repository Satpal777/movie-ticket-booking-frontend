import { useEffect, useState } from 'react';
import { apiSeats, apiBook } from '../api.js';
import { ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';

const TYPE_COLOR = {
  vip: 'bg-yellow-500 text-black',
  premium: 'bg-purple-600 text-white',
  regular: 'bg-blue-600 text-white',
};

export default function SeatsPage({ show, movie, onBack, isLoggedIn }) {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [booking, setBooking] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const loadSeats = () => {
    setLoading(true);
    apiSeats(show.id).then(setSeats).finally(() => setLoading(false));
  };

  useEffect(() => { loadSeats(); }, [show.id]);

  function toggleSeat(seat) {
    if (seat.isBooked) return;
    setSelected((sel) =>
      sel.includes(seat.id) ? sel.filter((id) => id !== seat.id) : [...sel, seat.id]
    );
  }

  async function handleBook() {
    if (!selected.length) return;
    setBooking(true); setError(''); setResult(null);
    try {
      const r = await apiBook(show.id, selected);
      setResult(r);
      setSelected([]);
      loadSeats();
    } catch (e) {
      setError(e.message);
      setSelected([]);
      loadSeats();
    } finally {
      setBooking(false);
    }
  }

  const byRow = seats.reduce((acc, s) => {
    (acc[s.row] = acc[s.row] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to shows
      </button>
      <h2 className="text-white font-bold text-2xl font-mono uppercase">{movie.title}</h2>
      <p className="text-gray-400 text-sm mb-2">{show.screenName} · ₹{show.price}/seat</p>

      <div className="flex flex-wrap gap-4 text-xs mb-8 mt-4">
        {[['vip', 'VIP'], ['premium', 'Premium'], ['regular', 'Regular'], ['booked', 'Booked']].map(([k, label]) => (
          <span key={k} className="flex items-center gap-1.5 uppercase font-semibold tracking-wider text-gray-500">
            <span className={`w-4 h-4 rounded-sm ${k === 'booked' ? 'bg-gray-800 border border-gray-600' : TYPE_COLOR[k].split(' ')[0]} ${k === 'selected' ? 'ring-2 ring-[#E50914]' : ''}`} />
            {label}
          </span>
        ))}
        <span className="flex items-center gap-1.5 uppercase font-semibold tracking-wider text-gray-400">
          <span className="w-4 h-4 rounded-sm ring-2 ring-white bg-[#E50914]" />
          Selected
        </span>
      </div>

      <div className="bg-gradient-to-b from-gray-800 to-transparent border-t-2 border-gray-600 rounded-t-[100%] shadow-[0_-10px_20px_rgba(255,255,255,0.05)] text-center text-gray-400 text-xs py-4 mb-8 tracking-[0.3em] font-mono shadow-inner">
        SCREEN
      </div>

      {loading ? (
        <p className="text-gray-400 text-center animate-pulse">Loading seats map...</p>
      ) : (
        <div className="space-y-4 max-w-fit mx-auto">
          {Object.entries(byRow).sort().map(([row, rowSeats]) => (
            <div key={row} className="flex items-center gap-4">
              <span className="text-gray-500 w-5 text-sm font-bold font-mono">{row}</span>
              <div className="flex gap-2.5 flex-wrap">
                {rowSeats.sort((a, b) => a.number - b.number).map((seat) => {
                  const isSelected = selected.includes(seat.id);
                  const disabled = seat.isBooked;
                  return (
                    <button
                      key={seat.id}
                      onClick={() => toggleSeat(seat)}
                      disabled={disabled}
                      title={`${seat.row}${seat.number} · ${seat.type}`}
                      className={`w-10 h-10 rounded-md text-xs font-bold transition-all
                        ${disabled ? 'bg-[#151515] text-[#333] cursor-not-allowed border border-[#222]' :
                          isSelected ? 'bg-[#E50914] text-white ring-2 ring-white scale-110 shadow-[0_0_10px_rgba(229,9,20,0.5)]' :
                            `${TYPE_COLOR[seat.type]} hover:scale-110 hover:shadow-md`
                        }`}
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-12 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 backdrop-blur-md shadow-lg">
          <p className="text-white text-base mb-4 font-mono">
            Selected: <strong className="text-white">{selected.length}</strong> seat(s) &nbsp;·&nbsp; Total: <strong className="text-[#E50914] text-xl tracking-tight leading-none">₹{(selected.length * Number(show.price)).toFixed(2)}</strong>
          </p>
          {!isLoggedIn ? (
            <p className="flex items-center gap-2 text-yellow-500 text-sm font-semibold bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
              <AlertTriangle className="w-4 h-4" /> Sign In to book seats
            </p>
          ) : (
            <button
              onClick={handleBook}
              disabled={booking}
              className="w-full flex justify-center items-center gap-2 bg-[#E50914] hover:bg-[#b81d24] shadow-[0_0_15px_rgba(229,9,20,0.2)] disabled:opacity-60 text-white py-3 rounded-xl font-bold transition-all"
            >
              {booking ? 'Processing...' : <><CheckCircle2 className="w-5 h-5" /> Confirm Booking</>}
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-2 bg-red-950/80 border border-red-900 rounded-xl p-4 text-red-400 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}

      {result && (
        <div className="mt-4 flex items-center gap-2 bg-green-950/80 border border-green-900 rounded-xl p-4 text-green-400 font-medium">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          Booking confirmed! {result.totalSeats} seat(s) · ₹{result.totalPrice}
        </div>
      )}

    </div>
  );
}
