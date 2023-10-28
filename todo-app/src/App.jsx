import React, { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");

  const addTodo = () => {
    if (todo) {
      setTodos([...todos, todo]);
      setTodo("");
    }
  };

  const deleteTodo = (todoToDelete) => {
    setTodos(todos.filter((todo) => todo !== todoToDelete));
  };

  return (
    <>
      <div>
        <input
          type="text"
          id="todo"
          name="todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <br />
        <br />
        <button onClick={addTodo}>Add</button>
      </div>
      <div>
        <ul>
          {todos.map((todo, index) => (
            <div>
              <li key={index}>{todo}</li>
              <button onClick={() => deleteTodo(todo)}>Delete</button>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
