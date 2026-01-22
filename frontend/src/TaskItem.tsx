import type { Task } from './App';
import { useState, useEffect, useRef, useLayoutEffect } from "react";

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
    const viewModeRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [savedHeight, setSavedHeight] = useState<number | undefined>(undefined);
    const [tempText, setTempText] = useState(task.text);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useLayoutEffect(() => {
        if (!isEditing && viewModeRef.current) {
            setSavedHeight(viewModeRef.current.offsetHeight);
        }
    }, [isEditing, task.text, task.date]);

    useEffect(() => {
        if (isEditing) {
            if (textareaRef.current && savedHeight) {
                textareaRef.current.style.height = `${savedHeight}px`;

                if (textareaRef.current.scrollHeight > savedHeight) {
                    adjustHeight();
                }
            } else {
                adjustHeight();
            }
        }
    }, [tempText, isEditing, savedHeight]);

    return (
        <li key={task.id}>
            <div className="flex flex-wrap sm:flex-nowrap justify-between gap-4 items-center mt-2 mx-1">
                <div className="flex-1 text-left min-w-0 border-2 rounded my-2 p-2 relative">
                    {isEditing ? (
                        <textarea
                            ref={textareaRef}
                            onFocus={adjustHeight}
                            className="resize-none focus:outline-none block w-full placeholder:text-gray-500"
                            placeholder="Wpisz tekst"
                            value={tempText}
                            onChange={(e) => {
                                setTempText(e.target.value);
                                adjustHeight();
                            }}
                            style={{ minHeight: savedHeight ? `${savedHeight}px` : 'auto' }}
                        />
                    ) : (
                        <div ref={viewModeRef}>
                            <p className="justify-start whitespace-normal break-normal">
                                {task.text}</p>
                        </div>
                    )}
                    <p className="mt-2 justify-start border-t-2 whitespace-normal break-normal">
                        {task.date ? `Termin: ${new Date(task.date).toLocaleString('pl-PL')}` : "Brak terminu"}
                    </p>
                </div>
                <div className="justify-end shrink-0 flex gap-4">
                    {isEditing ? (
                        <>
                            <button onClick={() => onSaveEdit(task.id, tempText)}
                                className=" hover:bg-green-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-3 rounded">
                                Zapisz
                            </button>
                            <button onClick={() => {
                                setTempText(task.text);
                                onCancelEdit(task.id);
                            }}
                                className=" hover:bg-yellow-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                                Anuluj
                            </button>
                            <button onClick={() => onDelete(task.id)}
                                className=" hover:bg-red-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                                Usuń
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => onToggle(task.id)}
                                className={`${task.finished ? "px-[0.84375rem]" : "px-2"} hover:bg-green-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 rounded`}>
                                {task.finished ? "Cofnij" : "Ukończ"}
                            </button>
                            <button onClick={() => onStartEdit(task.id)}
                                className=" hover:bg-yellow-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2.25 rounded">
                                Edytuj </button>
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