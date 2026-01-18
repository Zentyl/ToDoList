import { useState } from 'react'

import './App.css'

function App() {
  const [inputValue, setInputValue] = useState("");
  const [products, setProducts] = useState<string[]>([]);

  const addProduct = () => {
    if (inputValue.trim() !== "") {
      setProducts([...products, inputValue]);
      setInputValue("");
    }
  }

  return (
    <>
      <div className="mx-auto flex flex-col items-center max-w-sm">
        <label className="text-lg">
          Dodaj zadanie
          <br></br>
          <textarea
            className="border-2 rounded mt-2 placeholder:text-gray-500 focus:outline-none sm:text-sm/6 p-2"
            placeholder='Wpisz tekst'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </label>
        <button onClick={addProduct}
          className="mt-2 hover:bg-blue-500 border-2 border-black hover:text-white text-black font-bold py-2 px-4 rounded">
          Zapisz
        </button>
      </div>
      <div className="flex gap-4 mt-2 pt-2">
        <div className="border-black border-2 rounded w-1/2 px-2 pt-4 pb-2">
          <h1 className="text-lg">Nieukończone zadania</h1>
          <div className="mb-2">
            <ul>
              {products.map((product, index) => (
                <li key={index}>
                  <div className="flex justify-between gap-4 items-center mt-2">
                    <div className="flex-1 min-w-0 text-left ms-4">
                      <p className="justify-start whitespace-normal break-normal">{product}</p>
                    </div>
                    <div className="justify-end flex gap-4">
                      <button onClick={addProduct}
                        className=" hover:bg-green-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-3 rounded">
                        Ukończ
                      </button>
                      <button onClick={addProduct}
                        className=" hover:bg-red-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-3 rounded">
                        Usuń
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-black border-2 rounded w-1/2 p-2">
          <h1 className="text-lg">Ukończone zadania</h1>
        </div>
      </div>
    </>
  )
}

export default App
