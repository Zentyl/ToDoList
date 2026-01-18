import { useState } from 'react'

import './App.css'

interface Note {
  id: number;
  text: string;
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [unfinished, setUnfinished] = useState<Note[]>([]);
  const [finished, setFinished] = useState<Note[]>([]);

  const addNote = () => {
    if (inputValue.trim() !== "") {
      const newNote: Note = {
        id: Date.now(),
        text: inputValue
      };
      setUnfinished([...unfinished, newNote]);
      setInputValue("");
    }
  }

  const moveToFinished = (id: number) => {
    const noteToMove = unfinished.find(item => item.id === id);

    if (noteToMove) {
      setUnfinished(unfinished.filter(item => item.id !== id));
      setFinished([...finished, noteToMove]);
    }
  }

  const deleteNote = (id: number, array: Note[]) => {
    const noteToDelete = array.find(item => item.id === id)

    if (noteToDelete) {
      if (array === unfinished) {
        setUnfinished(prev => prev.filter(item => item.id !== id));
      }
      else if (array === finished) {
        setFinished(prev => prev.filter(item => item.id !== id));
      }
    }
  }

  return (
    <>
      <div className="mx-auto flex flex-col items-center max-w-sm">
        <label className="text-lg">
          Dodaj zadanie
          <br></br>
          <textarea
            className="border-2 rounded mt-2 placeholder:text-gray-500 focus:outline-none  p-2"
            placeholder='Wpisz tekst'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </label>
        <button onClick={addNote}
          className="mt-2 hover:bg-blue-500 border-2 border-black hover:text-white text-black font-bold py-2 px-4 rounded">
          Zapisz
        </button>
      </div>
      <div className="flex items-start flex-col lg:flex-row gap-4 mt-2 pt-2">
        <div className="border-black border-2 rounded w-full lg:w-1/2 px-2 pt-4 pb-2 min-w-0">
          <h1 className="text-lg">Nieukończone zadania</h1>
          <div className="mb-2">
            <ul>
              {unfinished.map((note) => (
                <li key={note.id}>
                  <div className="flex flex-wrap sm:flex-nowrap justify-between gap-4 items-center mt-2">
                    <div className="flex-1 text-left ms-2 min-w-0">
                      <p className="justify-start whitespace-normal break-normal">{note.text}</p>
                    </div>
                    <div className="justify-end shrink-0 flex gap-4">
                      <button onClick={() => moveToFinished(note.id)}
                        className=" hover:bg-green-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                        Ukończ
                      </button>
                      <button onClick={() => deleteNote(note.id, unfinished)}
                        className=" hover:bg-red-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                        Usuń
                      </button>
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
              {finished.map((note) => (
                <li key={note.id}>
                  <div className="flex justify-between gap-4 items-center mt-2">
                    <div className="flex-1 min-w-0 text-left ms-2">
                      <p className="justify-start whitespace-normal break-normal">{note.text}</p>
                    </div>
                    <button onClick={() => deleteNote(note.id, finished)}
                      className="justify-end hover:bg-red-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                      Usuń
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
