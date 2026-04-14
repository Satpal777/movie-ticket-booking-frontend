const BASE = 'https://cinebook.satpal.cloud/api/v1';

function getToken() {
  return localStorage.getItem('accessToken');
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

async function request(method, path, body, auth = false, isRetry = false) {
  const headers = { 'Content-Type': 'application/json' };
  
  if (auth) {
    if (path === '/auth/refresh') {
      headers['x-refresh-token'] = getRefreshToken();
    } else {
      headers['Authorization'] = `Bearer ${getToken()}`;
    }
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401 && auth && !isRetry && path !== '/auth/refresh' && getRefreshToken()) {
      try {
        const refreshData = await request('GET', '/auth/refresh', null, true, true);
        localStorage.setItem('accessToken', refreshData.accessToken);
        localStorage.setItem('refreshToken', refreshData.refreshToken);
        
        return await request(method, path, body, auth, true);
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('Session expired. Please log in again.');
      }
    }
    throw new Error(data.message || 'Request failed');
  }
  return data.data;
}

export const apiRegister = (name, email, password) =>
  request('POST', '/auth/register', { name, email, password });

export const apiVerifyEmail = (userId, token) =>
  request('POST', '/auth/verify-email', { userId, token });

export const apiLogin = (email, password) =>
  request('POST', '/auth/login', { email, password });

export const apiMe = () => request('GET', '/auth/me', null, true);

export const apiMovies = () => request('GET', '/movies');

export const apiCinemas = (movieId) => request('GET', `/movies/${movieId}/cinemas`);

export const apiShowsByCinema = (movieId, cinemaId) =>
  request('GET', `/movies/${movieId}/cinemas/${cinemaId}/shows`);

export const apiShows = (movieId) => request('GET', `/movies/${movieId}/shows`);

export const apiSeats = (showId) => request('GET', `/movies/shows/${showId}/seats`);

export const apiBook = (showId, seatIds) =>
  request('POST', `/movies/shows/${showId}/book`, { seatIds }, true);

export const apiMyBookings = () => request('GET', '/movies/my/bookings', null, true);
