import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import api from './api/axios';
import type { SyntheticEvent } from 'react';
import type { NestErrorResponse } from './types'

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await api.post('/login', {
        login: login,
        password: password,
      })

      const token = response.data.access_token;

      if (token) {
        localStorage.setItem('token', token);
        navigate('/');
      }
    } catch (error: unknown) {
      console.error('Nie udało się zalogować!', error);

      if (axios.isAxiosError<NestErrorResponse>(error)) {
        const data = error.response?.data;
        const msg = data?.message;

        if (msg) {
          setError(Array.isArray(msg) ? msg.join(', ') : msg);
        } else {
          setError(`Błąd serwera: ${error.message}`);
        }
      } else if (error instanceof Error) {
        setError(`Wystąpił nieoczekiwany błąd: ${error.message}`);
      } else {
        setError("Wystąpił nieznany błąd.");
      }
    }
  };



  return (
    <div className="mx-auto flex flex-col items-center max-w-sm min-h-[80vh] justify-center">
      <h1 className="text-4xl mb-2">Logowanie</h1>
      {error && (
        <div className="text-error">
          {error}
        </div>
      )}
      <form onSubmit={handleLogin} className='w-full flex flex-col items-center'>
        <label className="text-lg flex flex-col mt-4 text-left w-3/4">
          Login
        </label>
        <input
          className="border-2 rounded mt-2 p-2 w-3/4"
          placeholder='Podaj login'
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
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
          required
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
