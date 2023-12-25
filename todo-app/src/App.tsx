import { useState } from "react";
import "./App.css";

function App(): JSX.Element {
  const [todos, setTodos] = useState<string[]>([]);
  const [todo, setTodo] = useState<string>("");

  const addTodo = () => {
    if (todo === "") return;

    setTodos([...todos, todo]);
    setTodo("");
  };

  const deleteTodo = (todoToDelete: string) => {
    setTodos(todos.filter((todo) => todo !== todoToDelete));
  };

  return (
    <>
      <div>
        <input
          type="text"
          name="todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <br />
        <br />
        <br />
        <button onClick={addTodo}>Add</button>
      </div>
      <div>
        <ul>
          {todos.map((todo) => (
            <div>
              <li>{todo}</li>
              <button onClick={() => deleteTodo(todo)}>Delete</button>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
