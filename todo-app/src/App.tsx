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
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
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
            width: 400,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Todo"
            inputProps={{ "aria-label": "todo" }}
            required
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") addTodo();
            }}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton
            color="primary"
            size="small"
            aria-label="add"
            disabled={todo === ""}
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
              <ListItemText primary={todo} />
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
}

export default App;
