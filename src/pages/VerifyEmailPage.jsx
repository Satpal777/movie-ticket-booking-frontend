import { useEffect, useState } from 'react';
import { apiVerifyEmail } from '../api.js';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage({ userId, token, onSuccess }) {
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!userId || !token) {
      setStatus('error');
      setErrorMsg('Invalid verification link.');
      return;
    }

    apiVerifyEmail(userId, token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setErrorMsg(err.message || 'Verification failed. The token may be expired or invalid.');
      });
  }, [userId, token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-[#E50914] animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2 font-mono uppercase">Verifying Email...</h2>
            <p className="text-gray-400">Please wait while we confirm your secure token.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2 font-mono uppercase">Email Verified!</h2>
            <p className="text-gray-400 mb-6">Your account is now securely activated. You can sign in to book your tickets.</p>
            <button 
              onClick={onSuccess}
              className="bg-[#E50914] hover:bg-[#b81d24] text-white font-bold py-3 px-8 rounded-xl transition-colors w-full shadow-lg"
            >
              Sign In Now
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2 font-mono uppercase">Verification Failed</h2>
            <p className="text-red-400 mb-6">{errorMsg}</p>
            <button 
              onClick={onSuccess}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-xl border border-gray-700 transition-colors w-full"
            >
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}
