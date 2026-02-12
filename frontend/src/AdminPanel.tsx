import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/axios';
import type { User } from './types';
import UserItem from './components/UserItem';

function AdminPanel() {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await api.get('/users');
                setUsers(response.data);
            } catch (error) {
                console.error("Błąd pobierania użytkowników: ", error);
                setErrorMsg("Nie udało się pobrać listy użytkowników.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    const editUser = async (id: number, newLogin: string, newEmail: string) => {
        const originalUsers = [...users];
        setUsers(prev => prev.map(u =>
            u.id === id ? { ...u, login: newLogin, email: newEmail } : u
        ));

        try {
            await api.patch(`/users/${id}`, {
                login: newLogin,
                email: newEmail
            });
        } catch (error) {
            console.error("Błąd edycji użytkownika", error);
            setErrorMsg("Błąd podczas zapisywania zmian.");
            setUsers(originalUsers);
        }
    };

    const deleteUser = async (id: number) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;

        const originalUsers = [...users];
        setUsers(prev => prev.filter(u => u.id !== id));

        try {
            await api.delete(`/users/${id}`);
        } catch (error) {
            console.error("Błąd usuwania użytkownika", error);
            setErrorMsg("Nie udało się usunąć użytkownika.");
            setUsers(originalUsers);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="mx-auto flex flex-col items-center max-w-2xl px-4 pb-10">
            <div className="w-full flex justify-between items-center mt-4 mb-8">
                <h1 className="text-4xl">Admin Panel</h1>
                <button
                    className="btn btn-error btn-outline"
                    onClick={handleLogout}
                >
                    Wyloguj
                </button>
            </div>

            {errorMsg && (
                <div className="alert alert-error mb-4">
                    <span>{errorMsg}</span>
                    <button onClick={() => setErrorMsg("")} className="btn btn-xs btn-ghost">X</button>
                </div>
            )}

            <div className="w-full">
                <h2 className="text-2xl mb-4 border-b-2 pb-2">Lista Użytkowników ({users.length})</h2>

                {users.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">Brak użytkowników do wyświetlenia.</p>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {users.map((user) => (
                            <UserItem
                                key={user.id}
                                user={user}
                                onEdit={editUser}
                                onDelete={deleteUser}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default AdminPanel;