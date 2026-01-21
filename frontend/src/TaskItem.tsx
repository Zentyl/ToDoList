import type { Task } from './App';
import { useState, useEffect, useRef } from "react";

interface TaskItemProps {
    task: Task;
    isEditing: boolean;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onStartEdit: (id: number) => void;
    onSaveEdit: (id: number, text: string) => void;
    onCancelEdit: (id: number) => void;
};

const TaskItem = ({
    task, isEditing, onToggle, onDelete, onStartEdit, onSaveEdit, onCancelEdit
}: TaskItemProps) => {
    const [tempText, setTempText] = useState(task.text);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [tempText, isEditing]);

    return (
        <li key={task.id}>
            <div className="flex flex-wrap sm:flex-nowrap justify-between gap-4 items-center mt-2">
                <div className="flex-1 text-left ms-2 min-w-0 border-2 rounded my-2 p-2">
                    {isEditing ? (
                        <textarea
                            ref={textareaRef}
                            onFocus={adjustHeight}
                            className="focus:outline-none block w-full placeholder:text-gray-500"
                            placeholder="Wpisz tekst"
                            value={tempText}
                            onChange={(e) => {
                                setTempText(e.target.value);
                            }}
                        />
                    ) : (
                        <p className="justify-start whitespace-normal break-normal">
                            {task.text}</p>

                    )}
                    <p className="mt-2 justify-start border-t-2 whitespace-normal break-normal">
                        {task.date ? `Termin: ${new Date(task.date).toLocaleString('pl-PL')}` : "Brak terminu"}
                    </p>
                </div>
                <div className="justify-end shrink-0 flex gap-4">
                    {isEditing ? (
                        <>
                            <button onClick={() => onSaveEdit(task.id, tempText)}
                                className=" hover:bg-green-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                                Zapisz
                            </button>
                            <button onClick={() => {
                                setTempText(task.text);
                                onCancelEdit(task.id);
                            }}
                                className=" hover:bg-red-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                                Anuluj
                            </button>
                        </>
                    ) : (
                        <>
                            {!task.finished && (
                                <button onClick={() => onStartEdit(task.id)}
                                    className=" hover:bg-yellow-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                                    Edytuj </button>)}

                            <button onClick={() => onToggle(task.id)}
                                className={`${task.finished ? "hover:bg-yellow-500" : "hover:bg-green-500"}  border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded`}>
                                {task.finished ? "Cofnij" : "Ukończ"}
                            </button>
                            <button onClick={() => onDelete(task.id)}
                                className=" hover:bg-red-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                                Usuń
                            </button>
                        </>
                    )}
                </div>
            </div>
        </li>
    );
};

export default TaskItem;