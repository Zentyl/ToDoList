import { useState, useEffect, useRef } from 'react'
import TaskItem from './TaskItem';
import DateTimePicker from 'react-datetime-picker'
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import './index.css'

const API_URL = 'http://localhost:3000/tasks';

type DateValue = Date | null;
type DateRange = DateValue | [DateValue, DateValue];

export interface Task {
  id: number;
  text: string;
  finished: boolean;
  date: Date | null;
  priority: number;
}

function App() {
  const [isDateDisabled, setIsDateDisabled] = useState(false);
  const [dateValue, onChangeDate] = useState<DateRange>(new Date());
  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingIds, setEditingIds] = useState<number[]>([]);
  const newTaskInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Błąd pobierania: ", error);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    adjustNewTaskInputHeight();
  }, [inputValue]);

  const createTask = async () => {
    if (inputValue.trim() === "") return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputValue,
          date: isDateDisabled ? null : dateValue,
          priority: priority ?? 1
        }),
      });

      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      setInputValue("");
    } catch (error) {
      console.error("Nie udało się dodać zadania", error);
    }
  };


  const toggleFinished = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finished: !task.finished }),
      });
      setTasks(prev =>
        prev.map(
          t => t.id === id ? { ...t, finished: !t.finished } : t));
    } catch (error) {
      console.error("Błąd aktualizacji statusu", error);
    }
  };

  const adjustNewTaskInputHeight = () => {
    const el = newTaskInputRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const startEdit = (id: number) => {
    if (!editingIds.includes(id)) {
      setEditingIds(prev => [...prev, id]);
    }
  };

  const cancelEdit = (id: number) => {
    setEditingIds(prev => prev.filter(currentId => currentId !== id));
  }

  const saveEdit = async (id: number, newText: string, newDate: Date | null, priority: number) => {
    if (newText.trim() === "") return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newText,
          date: newDate,
          priority: priority
        }),
      });
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, text: newText, date: newDate, priority: priority} : task
        )
      );
      setEditingIds(prev => prev.filter(currentId => currentId !== id));
    } catch (error) {
      console.error("Błąd zapisu tekstu", error);
    };
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      setTasks(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Błąd usuwania", error);
    }
  };

  return (
    <>
      <div className="max-w-7xl py-8 px-4 mx-auto text-center">
        <div className="mx-auto flex flex-col items-center max-w-sm">
          <h1 className="text-4xl mb-4">To-Do List</h1>
          <label className="text-lg flex flex-col">
            Dodaj zadanie
          </label>
          <textarea
            ref={newTaskInputRef}
            onInput={adjustNewTaskInputHeight}
            className="resize-none border-2 rounded mt-2 placeholder:text-gray-500 focus:outline-none p-2 w-3/4"
            placeholder='Wpisz tekst'
            rows={3}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="m-2 flex gap-2">
            Data i godzina wykonania
            <input
              type="checkbox"
              onChange={(e) => setIsDateDisabled(e.target.checked)}
            >
            </input>
          </div>
          <DateTimePicker onChange={onChangeDate} id="datePicker" value={dateValue}
            disableClock format="dd.MM.y HH:mm" openWidgetsOnFocus={false}
            disabled={isDateDisabled}
          />
          <div className="dropdown">
            <div tabIndex={0} role="button" className="select-none mt-4 hover:bg-orange-500 border-2 border-black hover:text-white text-black px-2 py-1 rounded">Priorytet {priority ?? 1}</div>
            <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-max p-2 shadow-sm">
              {[1, 2, 3, 4].map((num) => (
                <li key={num}>
                  <a
                    className="whitespace-nowrap"
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
            className="mt-4 hover:bg-blue-500 border-2 border-black hover:text-white text-black font-bold py-2 px-4 rounded">
            Zapisz
          </button>
        </div>
        <div className="flex items-start flex-col lg:flex-row gap-4 mt-2 pt-2">
          <div className="border-black border-2 rounded w-full lg:w-1/2 px-2 pt-4 pb-2 min-w-0">
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
                      onStartEdit={startEdit}
                      onSaveEdit={saveEdit}
                      onCancelEdit={cancelEdit}
                    />
                  ))}
              </ul>
            </div>
          </div>
          <div className="border-black border-2 rounded w-full lg:w-1/2 px-2 pt-4 pb-2 min-w-0">
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
                      onStartEdit={startEdit}
                      onSaveEdit={saveEdit}
                      onCancelEdit={cancelEdit}
                    />
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div >
    </>
  )
};

export default App
