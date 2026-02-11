import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import api from './api/axios';
import type { SyntheticEvent } from 'react';
import type { NestErrorResponse } from './types'

function Register() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [annoucement, setAnnoucement] = useState("");

  const handleRegister = async (e: SyntheticEvent) => {
    e.preventDefault();
    setAnnoucement("");


    try {
      await api.post('/register', {
        login: login,
        password: password,
        email: email
      });
      setLogin('');
      setPassword('');
      setEmail('');
      setAnnoucement('Udało się zarejestrować!');
    } catch (error: unknown) {
      console.error('Nie udało się zarejestrować!', error);

      if (axios.isAxiosError<NestErrorResponse>(error)) {
        const data = error.response?.data;
        const msg = data?.message;

        if (msg) {
          setAnnoucement(Array.isArray(msg) ? msg.join(', ') : msg);
        } else {
          setAnnoucement(`Błąd serwera: ${error.message}`);
        }
      } else if (error instanceof Error) {
        setAnnoucement(`Wystąpił nieoczekiwany błąd: ${error.message}`);
      } else {
        setAnnoucement("Wystąpił nieznany błąd.");
      }
    }
  };

  return (
    <div className="mx-auto flex flex-col items-center max-w-sm min-h-[80vh] justify-center">
      <h1 className="text-4xl mb-2">Rejestracja</h1>
      {annoucement && (
        <div className="text-error">
          {annoucement}
        </div>
      )}
      <form onSubmit={handleRegister} className='w-full flex flex-col items-center'>
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
        <label className="text-lg flex flex-col mt-4 text-left w-3/4">
          E-mail
        </label>
        <input
          className="border-2 rounded mt-2 p-2 w-3/4"
          placeholder='Podaj E-mail'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type='submit'
          className="btn btn-outline btn-info mt-4 py-2 px-4 rounded">
          Zarejestruj się
        </button>
      </form>
      <Link
        to="/login"
        className="mt-2 text-info hover:underline">
        Wróć do logowania
      </Link>
    </div>
  )
};

export default Register
