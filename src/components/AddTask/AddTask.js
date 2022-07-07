import React, { useState } from 'react';
import makeStyles from "@mui/styles/makeStyles";
import {
    Container,
    Typography,
    Button,
    Icon,
    Paper,
    Box,
    TextField,
    Checkbox,
} from "@mui/material";

const useStyles = makeStyles({
    addTodoContainer: { padding: 10 },
    addTodoButton: { marginLeft: 5 },
    todosContainer: { marginTop: 10, padding: 10 },
    todoContainer: {
      borderTop: "1px solid #bfbfbf",
      marginTop: 5,
      "&:first-child": {
        margin: 0,
        borderTop: "none",
      },
      "&:hover": {
        "& $deleteTodo": {
          visibility: "visible",
        },
      },
    },
    todoTextCompleted: {
      textDecoration: "line-through",
    },
    deleteTodo: {
      visibility: "hidden",
    },
  });


function AddTask({ setTodos, setTotalTasks}) {
    const [newTodoText, setNewTodoText] = useState("");
    const classes = useStyles();

   

    function addTodo(text) {
        if (text === "") {
            alert("Add Task Name");
            return;
        }
        fetch("http://localhost:3001/", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ text }),
        })
            .then((response) => response.json())
            .then((todo) => {
                setTotalTasks(totalTasks + 1);
                setTodos((prev) => [...prev, todo])
            });
        setNewTodoText("");
    }

    return (
        <Paper className={classes.addTodoContainer}>
            <Box display="flex" flexDirection="row">
                <Box flexGrow={1}>
                    <TextField
                        fullWidth
                        value={newTodoText}
                        onKeyPress={(event) => {
                            if (event.key === "Enter") {
                                addTodo(newTodoText);
                            }
                        }}
                        onChange={(event) => setNewTodoText(event.target.value)}
                    />
                </Box>
                <Button
                    className={classes.addTodoButton}
                    startIcon={<Icon>add</Icon>}
                    onClick={() => addTodo(newTodoText)}
                >
                    Add
                </Button>
            </Box>
        </Paper>
    );
}

export default AddTask;