import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import type { SyntheticEvent } from 'react';
import {
  API_URL
} from './config/constants';


function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();

    if ([login, password].some(field => !field.trim())) {
      alert("Wypełnij wszystkie pola!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: login,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Błąd serwera: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }

      navigate('/');
    } catch (error) {
      console.error('Nie udało się zalogować!', error);
    }
  };

  return (
    <div className="mx-auto flex flex-col items-center max-w-sm min-h-[80vh] justify-center">
      <h1 className="text-4xl mb-2">Logowanie</h1>
      <form onSubmit={handleLogin} className='w-full flex flex-col items-center'>
        <label className="text-lg flex flex-col mt-4 text-left w-3/4">
          Login
        </label>
        <input
          className="border-2 rounded mt-2 p-2 w-3/4"
          placeholder='Podaj login'
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <label className="text-lg flex flex-col mt-4 text-left w-3/4">
          Hasło
        </label>
        <input
          className="border-2 rounded mt-2 p-2 w-3/4"
          placeholder='Podaj hasło'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type='submit'
          className="btn btn-outline btn-info mt-4 py-2 px-4 rounded">
          Zaloguj się
        </button>
      </form>
      <Link
        to="/register"
        className="mt-2 text-info hover:underline">
        Nie masz konta? Zarejestruj się
      </Link>
    </div>
  )
};

export default Login
