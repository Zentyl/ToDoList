import { useState } from "react";
import type { User } from "../types";

interface UserItemProps {
    user: User;
    onDelete: (id: number) => void;
    onEdit: (id: number, newLogin: string, newPassword: string, newEmail: string) => void;
}

const UserItem = ({ user, onDelete, onEdit }: UserItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempLogin, setTempLogin] = useState(user.login);
    const [tempPassword, setTempPassword] = useState("");
    const [tempEmail, setTempEmail] = useState(user.email);

    const handleSave = () => {
        if (tempLogin.trim() === "" || tempEmail.trim() === "") return;

        onEdit(user.id, tempLogin, tempPassword, tempEmail);

        setTempPassword("");
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempLogin(user.login);
        setTempPassword("");
        setTempEmail(user.email);
        setIsEditing(false);
    };

    return (
        <li className="list-none">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2 mx-1 border-2 rounded p-4 bg-base-100">

                <div className="flex-1 w-full flex flex-col gap-2">
                    {isEditing ? (
                        <>
                            <label className="text-left w-3/4">Login</label>
                            <input
                                className="border-2 rounded p-2 w-full focus:outline-none focus:border-info"
                                value={tempLogin}
                                onChange={(e) => setTempLogin(e.target.value)}
                                placeholder="Login"
                            />
                            <label className="text-left w-3/4">Hasło</label>
                            <input
                                className="border-2 rounded p-2 w-full focus:outline-none focus:border-info"
                                value={tempPassword}
                                onChange={(e) => setTempPassword(e.target.value)}
                                placeholder="Hasło"
                                type="password"
                            />
                            <label className="text-left w-3/4">E-mail</label>
                            <input
                                className="border-2 rounded p-2 w-full focus:outline-none focus:border-info"
                                value={tempEmail}
                                onChange={(e) => setTempEmail(e.target.value)}
                                placeholder="E-mail"
                                type="email"
                            />
                        </>
                    ) : (
                        <>
                            <div className="text-lg font-semibold break-all">{user.login}</div>
                            <div className="text-sm text-gray-500 break-all">{user.email}</div>
                            <div className="text-xs text-gray-400">ID: {user.id}</div>
                        </>
                    )}
                </div>

                <div className="flex gap-2 shrink-0">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="btn btn-outline btn-success"
                            >
                                Zapisz
                            </button>
                            <button
                                onClick={handleCancel}
                                className="btn btn-outline btn-warning"
                            >
                                Anuluj
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn btn-outline btn-info"
                            >
                                Edytuj
                            </button>
                            <button
                                onClick={() => onDelete(user.id)}
                                className="btn btn-outline btn-error"
                            >
                                Usuń
                            </button>
                        </>
                    )}
                </div>
            </div>
        </li>
    );
};

export default UserItem;