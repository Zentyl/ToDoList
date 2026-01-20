import type { Task } from './App';

interface TaskItemProps {
    task: Task;
    isEditing: boolean;
    onFinish: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number, text: string) => void;
    onStartEdit: (id: number) => void;
    onStopEdit: (id: number, text: string) => void;
}

const TaskItem = ({
    task, isEditing, onFinish, onDelete, onEdit, onStartEdit, onStopEdit
}: TaskItemProps) => {
    return (
        <li key={task.id}>
            <div className="flex flex-wrap sm:flex-nowrap justify-between gap-4 items-center mt-2">
                <div className="flex-1 text-left ms-2 min-w-0">
                    {isEditing ? (
                        <textarea
                            className="border-2 rounded placeholder:text-gray-500 focus:outline-none p-2"
                            placeholder="Wpisz tekst"
                            value={task.text}
                            onChange={(e) => onEdit(task.id, e.target.value)}
                        />
                    ) : (
                        <p className="justify-start whitespace-normal break-normal">
                            {task.text}</p>
                    )}
                </div>
                <div className="justify-end shrink-0 flex gap-4">
                    {isEditing ? (
                        <>
                            <button onClick={() => onStopEdit(task.id, task.text)}
                                className=" hover:bg-green-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                                Zapisz
                            </button>
                            <button onClick={() => onStopEdit(task.id, task.text)}
                                className=" hover:bg-red-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                                Anuluj
                            </button>
                        </>
                    ) : (
                        <>
                            {task.status ?
                                <></> : <button onClick={() => onStartEdit(task.id)}
                                    className=" hover:bg-yellow-500 border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded">
                                    Edytuj </button>}

                            <button onClick={() => onFinish(task.id)}
                                className={`${task.status ? "hover:bg-yellow-500" : "hover:bg-green-500"}  border-2 max-w-fit border-black hover:text-white text-black font-bold py-1 px-2 rounded`}>
                                {task.status ? "Cofnij" : "Ukończ"}
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