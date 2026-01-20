import { useState } from 'react'

import './App.css'

interface Task {
  id: number;
  text: string;
  status: boolean; // false - nieukończone, true - ukończone
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingIds, setEditingIds] = useState<number[]>([]);

  const createTask = () => {
    if (inputValue.trim() !== "") {
      const newTask: Task = {
        id: Math.floor((Date.now() + Math.random()) % 100000),
        text: inputValue,
        status: false
      };
      setTasks([...tasks, newTask]);
      setInputValue("");
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
                  <li key={task.id}>
                    <div className="flex flex-wrap sm:flex-nowrap justify-between gap-4 items-center mt-2">
                      <div className="flex-1 text-left ms-2 min-w-0">
                        {editingIds.includes(task.id) ? (
                          <textarea
                            className="border-2 rounded placeholder:text-gray-500 focus:outline-none p-2"
                            placeholder="Wpisz tekst"
                            value={task.text}
                            onChange={(e) => editTask(task.id, e.target.value)}
                          />
                        ) : (
                          <p className="justify-start whitespace-normal break-normal"
                            id={`paragraph-${task.id}`}>{task.text}</p>
                        )}
                      </div>
                      <div className="justify-end shrink-0 flex gap-4">
                        {editingIds.includes(task.id) ? (
                          <>
                            <button onClick={() => stopEdit(task.id, task.text)}
                              className=" hover:bg-green-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                              Zapisz
                            </button>
                            <button onClick={() => stopEdit(task.id, task.text)}
                              className=" hover:bg-red-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                              Anuluj
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(task.id)}
                              className=" hover:bg-yellow-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                              Edytuj
                            </button>
                            <button onClick={() => finishTask(task.id)}
                              className=" hover:bg-green-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                              Ukończ
                            </button>
                            <button onClick={() => deleteTask(task.id)}
                              className=" hover:bg-red-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                              Usuń
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
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
                  <li key={task.id}>
                    <div className="flex justify-between gap-4 items-center mt-2">
                      <div className="flex-1 min-w-0 text-left ms-2">
                        <p className="justify-start whitespace-normal break-normal">{task.text}</p>
                      </div>
                      <button onClick={() => deleteTask(task.id)}
                        className="justify-end hover:bg-red-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                        Usuń
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div >
    </>
  )
}

export default App
