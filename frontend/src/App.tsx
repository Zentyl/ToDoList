import { useState, useEffect } from 'react'
import TaskItem from './TaskItem';
import './App.css'

const API_URL = 'http://localhost:3000/tasks';

export interface Task {
  id: number;
  text: string;
  status: boolean; // false - nieukończone, true - ukończone
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingIds, setEditingIds] = useState<number[]>([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Błąd pobierania:", err));
  }, []);

const createTask = async () => {
    if (inputValue.trim() === "") return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue }),
      });
      
      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      setInputValue("");
    } catch (error) {
      console.error("Nie udało się dodać zadania", error);
    }
  }

  const finishTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: !task.status } : task
      )
    );
  }

  const startEdit = (id: number) => {
    if (!editingIds.includes(id)) {
      setEditingIds(prev => [...prev, id]);
    }
  }

  const editTask = (id: number, newText: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  }

  const stopEdit = (id: number, newText: string) => {
    if (newText.trim() !== "") {
      setEditingIds(prev => prev.filter(currentId => currentId !== id));
    }
  }

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(item => item.id !== id));
  }

  return (
    <>
      <div className="mx-auto flex flex-col items-center max-w-sm">
        <h1 className="text-4xl mb-4">To-Do List</h1>
        <label className="text-lg">
          Dodaj zadanie
          <br></br>
          <textarea
            className="resize-none border-2 rounded mt-2 placeholder:text-gray-500 focus:outline-none p-2 w-full"
            placeholder='Wpisz tekst'
            rows={3}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </label>
        <button onClick={createTask}
          className="mt-2 hover:bg-blue-500 border-2 border-black hover:text-white text-black font-bold py-2 px-4 rounded">
          Zapisz
        </button>
      </div>
      <div className="flex items-start flex-col lg:flex-row gap-4 mt-2 pt-2">
        <div className="border-black border-2 rounded w-full lg:w-1/2 px-2 pt-4 pb-2 min-w-0">
          <h1 className="text-lg">Nieukończone zadania</h1>
          <div className="mb-2">
            <ul>
              {tasks
                .filter((task) => !task.status)
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isEditing={editingIds.includes(task.id)}
                    onFinish={finishTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    onStartEdit={startEdit}
                    onStopEdit={stopEdit}
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
                .filter((task) => task.status)
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isEditing={false}
                    onFinish={finishTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    onStartEdit={startEdit}
                    onStopEdit={stopEdit}
                  />
                ))}
            </ul>
          </div>
        </div>
      </div >
    </>
  )
}

export default App
