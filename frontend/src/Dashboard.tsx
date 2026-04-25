import { useState, useEffect, useRef } from 'react'
import {
  PRIORITY_BTN_STYLES, PRIORITY_BORDER_STYLES,
  PRIORITY_TEXT_STYLES, PRIORITY_HOVER_BG_STYLES
} from './config/constants';
import { useNavigate } from 'react-router-dom';
import api from './api/axios';
import type { Task } from './types'
import TaskItem from './components/TaskItem';
import DateTimePicker from 'react-datetime-picker'
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

type DateValue = Date | null;
type DateRange = DateValue | [DateValue, DateValue];

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDateEnabled, setIsDateEnabled] = useState(false);
  const [dateValue, onChangeDate] = useState<DateRange>(new Date());
  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingIds, setEditingIds] = useState<number[]>([]);
  const newTaskInputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {

    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error("Błąd pobierania zadań: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [navigate]);

  useEffect(() => {
    adjustNewTaskInputHeight();
  }, [inputValue]);

  const createTask = async () => {
    if (inputValue.trim() === "") return;

    try {
      const response = await api.post('/tasks', {
        text: inputValue,
        date: isDateEnabled ? dateValue : null,
        priority: priority ?? 1
      });

      setTasks(prev => [...prev, response.data]);
      setInputValue("");
    } catch (error) {
      console.error("Nie udało się dodać zadania", error);
    }
  };

  const toggleFinished = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const oldTasks = [...tasks];
    setTasks(prev =>
      prev.map(
        t => t.id === id ? { ...t, finished: !t.finished } : t
      )
    );

    try {
      await api.patch(`/tasks/${id}`, { finished: !task.finished });
    } catch (error) {
      console.error("Błąd aktualizacji statusu", error);
      setTasks(oldTasks);
    }
  };

  const adjustNewTaskInputHeight = () => {
    const el = newTaskInputRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const enableEdit = (id: number) => {
    setEditingIds(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  };

  const editTask = async (id: number, newText: string, newDate: Date | null, priority: number) => {
    if (newText.trim() === "") return;

    try {
      await api.patch(`/tasks/${id}`, {
        text: newText,
        date: newDate,
        priority: priority
      });

      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, text: newText, date: newDate, priority: priority } : task
        )
      );
      setEditingIds(prev => prev.filter(currentId => currentId !== id));
    } catch (error) {
      console.error("Błąd zapisu tekstu", error);
    };
  };

  const deleteTask = async (id: number) => {
    const oldTasks = [...tasks];
    setTasks(prev => prev.filter(item => item.id !== id));

    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error("Błąd usuwania", error);
      setTasks(oldTasks);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto flex flex-col items-center max-w-sm">
        <div className="absolute flex flex-col top-4 left-4">
          <button className="btn btn-error btn-outline mb-2"
            onClick={handleLogout}>
            Wyloguj
          </button>
          <a
            href={`http://localhost:3000/tasks?token=${localStorage.getItem('token')}`}
            rel="noopener noreferrer"
            className="btn btn-warning btn-outline">
            API
          </a>
        </div>
        <h1 className="text-4xl mb-4">To-Do List</h1>
        <label className="text-lg flex flex-col">
          Dodaj zadanie
        </label>
        <textarea
          ref={newTaskInputRef}
          onInput={adjustNewTaskInputHeight}
          className="resize-none border-2 rounded mt-2 focus:outline-none p-2 w-3/4"
          placeholder='Wpisz tekst'
          rows={3}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="my-2 flex gap-2">
          Data i godzina wykonania
          <input
            type="checkbox"
            checked={isDateEnabled}
            onChange={(e) => setIsDateEnabled(e.target.checked)}
          >
          </input>
        </div>
        <DateTimePicker onChange={onChangeDate} id="datePicker" value={dateValue}
          disableClock format="dd.MM.y HH:mm" openWidgetsOnFocus={false}
          disabled={isDateEnabled}
        />
        <div className="dropdown">
          <div tabIndex={0} role="button"
            className={`btn btn-outline select-none mt-4 px-3 rounded ${PRIORITY_BTN_STYLES[priority ?? 1]}`}>
            Priorytet {priority ?? 1}</div>
          <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-max p-2 shadow-sm">
            {[1, 2, 3, 4].map((num) => (
              <li key={num}>
                <a
                  className={`whitespace-nowrap border my-1
                      ${PRIORITY_BORDER_STYLES[num]} ${PRIORITY_TEXT_STYLES[num]}
                      ${PRIORITY_HOVER_BG_STYLES[num]} hover:text-base-200`}
                  onClick={() => {
                    setPriority(num);
                    (document.activeElement as HTMLElement).blur();
                  }}
                >
                  Priorytet {num}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={createTask}
          className="btn btn-outline btn-info mt-4 py-2 px-4 rounded">
          Zapisz
        </button>
      </div>
      <div className="flex items-start flex-col lg:flex-row gap-4 mt-4">
        <div className="bg-base-100 border-2 rounded w-full lg:w-1/2 px-2 pt-4 pb-2 min-w-0">
          <h1 className="text-lg">Nieukończone zadania</h1>
          <div className="mb-2">
            <ul>
              {tasks
                .filter((task) => !task.finished)
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isEditing={editingIds.includes(task.id)}
                    onToggle={toggleFinished}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    onEnable={enableEdit}
                  />
                ))}
            </ul>
          </div>
        </div>
        <div className="bg-base-100 border-2 rounded w-full lg:w-1/2 px-2 pt-4 pb-2 min-w-0">
          <h1 className="text-lg">Ukończone zadania</h1>
          <div className="mb-2">
            <ul>
              {tasks
                .filter((task) => task.finished)
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isEditing={editingIds.includes(task.id)}
                    onToggle={toggleFinished}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    onEnable={enableEdit}
                  />
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
};

export default Dashboard
