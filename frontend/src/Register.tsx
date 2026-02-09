import { useState } from 'react'
import type { SyntheticEvent } from 'react';
import {
  API_URL
} from './config/constants';


function Register() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = async (e: SyntheticEvent) => {
    e.preventDefault();

    if ([login, password, email].some(field => !field.trim())) {
      alert("Wypełnij wszystkie pola!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: login,
          password: password,
          email: email
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Błąd serwera: ${response.status} - ${errorText}`);
      }

      setLogin('');
      setPassword('');
      setEmail('');
      alert('Udało się zarejestrować!');
    } catch (error) {
      console.error('Nie udało się zarejestrować!', error);
    }
  };

  return (
    <div className="mx-auto flex flex-col items-center max-w-sm min-h-[80vh] justify-center">
      <h1 className="text-4xl mb-2">Rejestracja</h1>
      <form onSubmit={handleRegister} className='w-full flex flex-col items-center'>
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
        <label className="text-lg flex flex-col mt-4 text-left w-3/4">
          E-mail
        </label>
        <input
          className="border-2 rounded mt-2 p-2 w-3/4"
          placeholder='Podaj E-mail'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type='submit'
          className="btn btn-outline btn-info mt-4 py-2 px-4 rounded">
          Zarejestruj się
        </button>
      </form>
    </div>
  )
};

export default Register
