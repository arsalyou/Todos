import React, { useState } from 'react';
import makeStyles from "@mui/styles/makeStyles";
import {
    Button,
    Icon,
    Paper,
    Box,
    TextField,
} from "@mui/material";
import useStore from '../../store';
import DatePicker from '../DatePicker/DatePicker';
const useStyles = makeStyles({
    addTodoContainer: { padding: 10 },
    addTodoButton: { marginLeft: 5 },
  });

function AddTask({ totalTasks, setTotalTasks}) {
    const [newTodoText, setNewTodoText] = useState("");
    const todos = useStore(state => state.todos);
    const setTodos = useStore(state => state.setTodos);
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
                if(totalTasks > todos.length){
                     // task added but to keep order of id, not loading it on frontend other startegy was to move assigning of ids at backend
                     alert('Task successfully added. Scroll to Load and view task');
                }else{
                    setTodos( [...todos, todo])
                }
                setTotalTasks((prev)=> prev+1); 
            });
        setNewTodoText("");
    }

    return (
        <Paper className={classes.addTodoContainer}>
            <Box display="flex" flexDirection="row">
                <Box flexGrow={1}>
                    <TextField
                        fullWidth
                        placeholder='Add a new todo'
                        value={newTodoText}
                        onKeyPress={(event) => {
                            if (event.key === "Enter") {
                                addTodo(newTodoText);
                            }
                        }}
                        onChange={(event) => setNewTodoText(event.target.value)}
                    />
                </Box>
                {/* <DatePicker /> */}
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