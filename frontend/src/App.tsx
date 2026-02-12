import { useState, useEffect } from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard'
import Register from './Register'
import Login from './Login'
import AdminPanel from './AdminPanel'

function App() {
    const [theme, setTheme] = useState("business");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        document.querySelector('html')?.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "business" ? "light" : "business");
    };
    return (
        <BrowserRouter>
            <div className={
                `min-h-screen w-full transition-all duration-300 **:transition-all **:duration-300
      ${theme === 'business' ? 'bg-base-200' : 'bg-base-100'}`
            }>
                <div className="min-h-screen max-w-7xl py-8 px-4 mx-auto text-center">
                    <div className="absolute top-4 right-4">
                        <button onClick={toggleTheme}>
                            {theme === 'business' ?
                                <SunIcon className="size-9 hover:text-yellow-300" />
                                : <MoonIcon className="size-9 hover:text-blue-500" />
                            }
                        </button>
                    </div>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin" element={<AdminPanel />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>

    );
}

export default App;