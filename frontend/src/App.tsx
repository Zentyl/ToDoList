import { useState, useEffect } from 'react'
import TaskItem from './TaskItem';
import DateTimePicker from 'react-datetime-picker'
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import './App.css'

const API_URL = 'http://localhost:3000/tasks';

type DateValue = Date | null;
type DateRange = DateValue | [DateValue, DateValue];

export interface Task {
  id: number;
  text: string;
  finished: boolean;
  date: Date;
}

function App() {
  const [isDateDisabled, setIsDateDisabled] = useState(false);
  const [dateValue, onChangeDate] = useState<DateRange>(new Date());
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingIds, setEditingIds] = useState<number[]>([]);

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

  const createTask = async () => {
    if (inputValue.trim() === "") return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputValue,
          date: isDateDisabled ? null : dateValue
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

  const startEdit = (id: number) => {
    if (!editingIds.includes(id)) {
      setEditingIds(prev => [...prev, id]);
    }
  };

  const cancelEdit = (id: number) => {
    setEditingIds(prev => prev.filter(currentId => currentId !== id));
  }

  const saveEdit = async (id: number, newText: string) => {
    if (newText.trim() === "") return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText }),
      });
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, text: newText } : task
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
      <div className="max-w-7xl p-8 mx-auto text-center">
        <div className="mx-auto flex flex-col items-center max-w-sm">
          <h1 className="text-4xl mb-4">To-Do List</h1>
          <label className="text-lg flex flex-col">
            Dodaj zadanie
            <textarea
              className="resize-none border-2 rounded mt-2 placeholder:text-gray-500 focus:outline-none p-2 w-full"
              placeholder='Wpisz tekst'
              rows={3}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </label>
          <div className="m-2 flex gap-2">
            Data i godzina wykonania
            <input
              type="checkbox"
              onChange={(e) => setIsDateDisabled(e.target.checked)}
            >
            </input>
          </div>
          <DateTimePicker onChange={onChangeDate} id="datePicker" value={dateValue}
            disableClock format="dd.MMy HH:mm" openWidgetsOnFocus={false}
            disabled={isDateDisabled}
          />
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
                      isEditing={false}
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
