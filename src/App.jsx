import { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage.jsx';
import MoviesPage from './pages/MoviesPage.jsx';
import CinemasPage from './pages/CinemasPage.jsx';
import HallsPage from './pages/HallsPage.jsx';
import ShowsPage from './pages/ShowsPage.jsx';
import SeatsPage from './pages/SeatsPage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';
import { apiMe } from './api.js';

import { Ticket, LogOut, User as UserIcon, ChevronRight, MonitorPlay } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [page, setPage] = useState('movies');
  const [verifyParams, setVerifyParams] = useState(null);

  const [movie, setMovie] = useState(null);
  const [cinema, setCinema] = useState(null);
  const [hall, setHall] = useState(null);
  const [show, setShow] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uId = params.get('userId');
    const tok = params.get('token');

    if (uId && tok) {
      setVerifyParams({ userId: Number(uId), token: tok });
      setPage('verify');
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      apiMe().then(setUser).catch(() => localStorage.removeItem('accessToken'))
        .finally(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }
  }, []);

  function handleLogin(data) {
    setUser({ name: data.name, email: data.email });
    setPage('movies');
  }

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    goHome();
  }

  function goHome() {
    setPage('movies');
    setMovie(null);
    setCinema(null);
    setHall(null);
    setShow(null);
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-400">
        <div className="animate-pulse flex items-center gap-2 text-xl font-semibold tracking-widest text-[#E50914]">
          <MonitorPlay className="w-6 h-6 animate-bounce" /> Loading...
        </div>
      </div>
    );
  }

  const crumbs = [];
  if (movie) crumbs.push(movie.title);
  if (cinema) crumbs.push(cinema.name);
  if (hall) crumbs.push(hall.screenName);
  if (show) {
    crumbs.push(
      new Date(show.startsAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    );
  }

  let view;
  if (page === 'verify' && verifyParams) {
    view = (
      <VerifyEmailPage
        userId={verifyParams.userId}
        token={verifyParams.token}
        onSuccess={() => {
          window.history.replaceState({}, document.title, window.location.pathname);
          setVerifyParams(null);
          setPage('auth');
        }}
      />
    );
  } else if (page === 'auth') {
    view = <AuthPage onLogin={handleLogin} />;
  } else if (page === 'bookings') {
    view = <BookingsPage onBack={() => setPage('movies')} />;
  } else if (show) {
    view = (
      <SeatsPage
        show={show}
        movie={movie}
        isLoggedIn={!!user}
        onBack={() => setShow(null)}
      />
    );
  } else if (hall) {
    view = (
      <ShowsPage
        movie={movie}
        hall={hall}
        onSelect={setShow}
        onBack={() => setHall(null)}
      />
    );
  } else if (cinema) {
    view = (
      <HallsPage
        movie={movie}
        cinema={cinema}
        onSelect={setHall}
        onBack={() => setCinema(null)}
      />
    );
  } else if (movie) {
    view = (
      <CinemasPage
        movie={movie}
        onSelect={(c) => { setCinema(c); setHall(null); setShow(null); }}
        onBack={() => setMovie(null)}
      />
    );
  } else {
    view = (
      <MoviesPage
        onSelect={(m) => { setMovie(m); setCinema(null); setHall(null); setShow(null); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#E50914] selection:text-white pb-12">
      <nav className="bg-black/50 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50 transition-all duration-300">

        <button
          onClick={goHome}
          className="flex items-center gap-2 text-[#E50914] font-extrabold text-2xl tracking-tighter hover:text-white transition-colors duration-300 group"
        >
          <MonitorPlay className="w-7 h-7 transition-transform group-hover:scale-110" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E50914] to-red-600">
            CineBook
          </span>
        </button>

        {crumbs.length > 0 && (
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-500 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-3 h-3 text-gray-600" strokeWidth={3} />}
                <span className={i === crumbs.length - 1 ? 'text-gray-200' : 'hover:text-gray-300 cursor-default'}>
                  {c}
                </span>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button
                onClick={() => setPage('bookings')}
                className="flex items-center gap-1.5 text-gray-300 hover:text-white text-sm font-medium transition-colors hover:bg-white/10 px-3 py-1.5 rounded-lg"
              >
                <Ticket className="w-4 h-4" />
                <span className="hidden sm:block">My Bookings</span>
              </button>

              <div className="h-5 w-px bg-white/20 hidden sm:block"></div>

              <div className="hidden sm:flex items-center gap-2 text-gray-400 text-sm font-medium">
                <div className="bg-gray-800 p-1.5 rounded-full border border-gray-700">
                  <UserIcon className="w-4 h-4 text-gray-300" />
                </div>
                {user.name.split(' ')[0]}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-gray-800/80 hover:bg-red-900/50 hover:text-red-400 border border-transparent hover:border-red-900/50 text-gray-300 text-sm px-3 py-1.5 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setPage('auth')}
              className="flex items-center gap-2 bg-[#E50914] hover:bg-[#b81d24] text-white text-sm px-5 py-2 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_20px_rgba(229,9,20,0.6)]"
            >
              <UserIcon className="w-4 h-4" strokeWidth={2.5} />
              Sign In
            </button>
          )}
        </div>
      </nav>

      <main className="w-full h-full">
        {view}
      </main>
    </div>
  );
}
