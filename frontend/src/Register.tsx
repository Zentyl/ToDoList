import { useState, useEffect } from 'react'
import {
  API_URL
} from './config/constants';


function Register() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
      } catch (error) {
        console.error("Błąd pobierania: ", error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="mx-auto flex flex-col items-center max-w-sm min-h-[80vh] justify-center">
      <h1 className="text-4xl mb-2">Rejestracja</h1>
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label className="text-lg flex flex-col mt-4 text-left w-3/4">
        E-mail
      </label>
      <input
        className="border-2 rounded mt-2 p-2 w-3/4"
        placeholder='Podaj E-mail'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="btn btn-outline btn-info mt-4 py-2 px-4 rounded">
        Zarejestruj się
      </button>
    </div>
  )
};

export default Register
