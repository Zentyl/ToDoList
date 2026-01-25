import type { Task } from './App';
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import DateTimePicker from 'react-datetime-picker'
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import './index.css'

interface TaskItemProps {
    task: Task;
    isEditing: boolean;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onStartEdit: (id: number) => void;
    onSaveEdit: (id: number, text: string, date: Date | null, priority: number) => void;
    onCancelEdit: (id: number) => void;
};

const TaskItem = ({
    task, isEditing, onToggle, onDelete, onStartEdit, onSaveEdit, onCancelEdit
}: TaskItemProps) => {
    const viewModeRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [savedHeight, setSavedHeight] = useState<number | undefined>(undefined);
    const [tempText, setTempText] = useState(task.text);
    const [tempPriority, setTempPriority] = useState(task.priority);
    const [tempDate, setTempDate] = useState<Date | null>(task.date ? new Date(task.date) : null);
    const [isDisabled, setisDisabled] = useState(false);

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
            setisDisabled(true);
            if (textareaRef.current && savedHeight) {
                textareaRef.current.style.height = `${savedHeight}px`;
                if (textareaRef.current.scrollHeight > savedHeight) {
                    adjustHeight();
                }
            } else {
                adjustHeight();
            }
        }
        else {
            setisDisabled(false);
        }
    }, [tempText, isEditing, savedHeight]);

    return (
        <li key={task.id}>
            <div className="flex sm:flex-nowrap justify-between gap-4 items-center mt-2 mx-1">
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
                    {task.date || isEditing ?
                        <div className="flex flex-wrap">
                            <DateTimePicker onChange={(val: any) => setTempDate(val)}
                                id="dateEdit" value={tempDate}
                                disableClock format="dd.MM.y HH:mm" openWidgetsOnFocus={false} disableCalendar={!isDisabled}
                                disabled={!isDisabled} clearIcon={!isDisabled ? null : undefined}
                                className="mt-2 w-full justify-start border-t-2 border-t-black whitespace-normal break-normal"
                            />
                            <div className="dropdown">
                                <div tabIndex={isDisabled ? 0 : -1}
                                    role="button"
                                    className={`mt-2 border-2 px-2 py-1 rounded 
                            ${!isDisabled
                                            ? "cursor-not-allowed pointer-events-none border-white"
                                            : "select-none hover:bg-orange-500 hover:text-white cursor-pointer border-black"
                                        }`}
                                >Priorytet {tempPriority}</div>
                                <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-max p-2 shadow-sm">
                                    {[1, 2, 3, 4].map((num) => (
                                        <li key={num}>
                                            <a
                                                className="whitespace-nowrap"
                                                onClick={() => {
                                                    setTempPriority(num);
                                                    (document.activeElement as HTMLElement).blur();
                                                }}
                                            >
                                                Priorytet {num}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        : <p className="mt-2 mb-1 w-full justify-start border-t-2 border-t-black whitespace-normal break-normal">Brak terminu</p>}

                </div>
                <div>
                    <div className="justify-end shrink-0 flex gap-4">
                        {isEditing ? (
                            <>
                                <button onClick={() => onSaveEdit(task.id, tempText, tempDate, tempPriority ?? 1)}
                                    className=" hover:bg-green-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-3.25 rounded cursor-pointer">
                                    Zapisz
                                </button>

                                <button onClick={() => {
                                    setTempText(task.text);
                                    setTempDate(task.date);
                                    setTempPriority(task.priority);
                                    onCancelEdit(task.id);
                                }}
                                    className=" hover:bg-yellow-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded cursor-pointer">
                                    Anuluj
                                </button>
                                <button onClick={() => onDelete(task.id)}
                                    className=" hover:bg-red-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded cursor-pointer">
                                    Usuń
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => onToggle(task.id)}
                                    className={`${task.finished ? "px-[0.9rem]" : "px-[0.56rem]"}
                                hover:bg-green-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 rounded cursor-pointer`}>
                                    {task.finished ? "Cofnij" : "Ukończ"}
                                </button>
                                <button onClick={() => onStartEdit(task.id)}
                                    className=" hover:bg-yellow-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2.25 rounded cursor-pointer">
                                    Edytuj </button>
                                <button onClick={() => onDelete(task.id)}
                                    className=" hover:bg-red-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded cursor-pointer">
                                    Usuń
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </li>
    );
};

export default TaskItem;