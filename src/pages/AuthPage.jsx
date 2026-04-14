import { useState } from 'react';
import { Mail, Lock, User, KeyRound, MonitorPlay } from 'lucide-react';
import { apiLogin, apiRegister, apiVerifyEmail } from '../api.js';

export default function AuthPage({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleLogin(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await apiLogin(form.email, form.password);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await apiRegister(form.name, form.email, form.password);
      setMsg('Registration done! An email verification link has been sent to your email.');
      setTab('login');
      setForm({ ...form, password: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-black select-none pointer-events-none group">
        <img 
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop" 
          alt="Cinematic Movie Display"
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[20s]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-16 left-16 max-w-xl z-20">
          <div className="inline-flex items-center justify-center gap-3 text-white mb-4">
            <MonitorPlay className="w-10 h-10 text-[#E50914] drop-shadow-[0_0_15px_rgba(229,9,20,0.8)]" />
            <h1 className="text-4xl font-extrabold tracking-tight">Chai N Moj</h1>
          </div>
          <p className="text-xl text-gray-300 font-medium leading-relaxed drop-shadow-md">
            Your front-row seat to the ultimate cinematic experience. Book tickets, explore showtimes, and dive into the magic of movies.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <MonitorPlay className="w-12 h-12 text-[#E50914] mx-auto mb-3" />
            <h1 className="text-3xl font-extrabold text-white">Chai N Moj</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {tab === 'login' ? 'Welcome Back' : tab === 'register' ? 'Create Account' : 'Security Check'}
            </h2>
            <p className="text-gray-400 font-medium">
              {tab === 'login' ? 'Sign in to access your booked tickets.' : 'Enter your details to join the premiere.'}
            </p>
          </div>

          <div className="flex bg-white/5 rounded-xl p-1 mb-8">
            {['login', 'register'].map((t) => (
              <button 
                key={t} 
                onClick={() => { setTab(t); setError(''); setMsg(''); }}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all duration-300 ease-out ${
                  tab === t 
                    ? 'bg-white text-black shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 bg-red-950/50 border border-red-900/50 text-red-400 text-sm rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
          {msg && (
            <div className="mb-6 bg-[#E50914]/10 border border-[#E50914]/40 text-[#E50914] text-sm rounded-xl p-4 break-all animate-in fade-in slide-in-from-top-2">
              {msg}
            </div>
          )}

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <Input 
                icon={Mail} 
                label="Email Address" 
                type="email" 
                value={form.email} 
                onChange={set('email')} 
                placeholder="Ex. hello@chainmoj.com"
              />
              <Input 
                icon={Lock} 
                label="Password" 
                type="password" 
                value={form.password} 
                onChange={set('password')} 
                placeholder="••••••••"
              />
              <Btn loading={loading}>Sign In to Account</Btn>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-5">
              <Input 
                icon={User} 
                label="Full Name" 
                value={form.name} 
                onChange={set('name')} 
                placeholder="Ex. Christopher Nolan"
              />
              <Input 
                icon={Mail} 
                label="Email Address" 
                type="email" 
                value={form.email} 
                onChange={set('email')} 
                placeholder="Ex. hello@chainmoj.com"
              />
              <Input 
                icon={Lock} 
                label="Password" 
                type="password" 
                value={form.password} 
                onChange={set('password')} 
                placeholder="Create a strong password"
              />
              <Btn loading={loading}>Create Account</Btn>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

function Input({ icon: Icon, label, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-white transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <input 
          {...props} 
          required
          className="w-full bg-white/5 text-white rounded-xl pl-11 pr-4 py-3.5 text-sm border border-white/10 placeholder-gray-600 focus:outline-none focus:border-white focus:bg-white/10 transition-all" 
        />
      </div>
    </div>
  );
}

function Btn({ loading, children }) {
  return (
    <button 
      type="submit" 
      disabled={loading}
      className="w-full bg-[#E50914] hover:bg-[#b81d24] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 text-white font-bold tracking-wide py-3.5 rounded-xl transition-all shadow-[0_4px_14px_rgba(229,9,20,0.3)] hover:shadow-[0_6px_20px_rgba(229,9,20,0.5)] mt-6"
    >
      {loading ? <span className="animate-pulse">Processing Request...</span> : children}
    </button>
  );
}
