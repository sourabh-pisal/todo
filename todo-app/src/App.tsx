import Add from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  AppBar,
  Box,
  Container,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

export type Todo = {
  readonly id: string;
  readonly text: string;
  readonly completed: boolean;
};

function App(): JSX.Element {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);
  const [todoText, setTodoText] = useState<string>("");

  const addTodo = () => {
    if (todoText === "") return;

    setTodos([
      ...todos,
      {
        id: uuidv4(),
        text: todoText,
        completed: false,
      },
    ]);
    setTodoText("");
  };

  const deleteTodo = (todoToBeDelete: Todo) => {
    setTodos(todos.filter((todo) => todo.id !== todoToBeDelete.id));
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} marginBottom={10}>
        <AppBar>
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit" component="div">
              Todo App
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Container
        maxWidth="xs"
        fixed
        sx={{
          marginY: 5,
        }}
      >
        <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Todo"
            inputProps={{ "aria-label": "todo" }}
            required
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") addTodo();
            }}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton
            color="primary"
            size="small"
            aria-label="add"
            disabled={todoText === ""}
            onClick={addTodo}
          >
            <Add />
          </IconButton>
        </Paper>
        <Divider
          sx={{
            marginY: 2,
          }}
        />
        <Typography variant="body1" marginTop={3}>
          Current ToDo's
        </Typography>
        <List>
          {todos.map((todo) => (
            <ListItem
              secondaryAction={
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => deleteTodo(todo)}
                  size="small"
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              }
              divider
              dense
            >
              <ListItemText primary={todo.text} id={todo.id} />
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
}

export default App;
