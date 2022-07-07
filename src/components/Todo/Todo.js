import React from 'react';
import DatePicker from '../DatePicker/DatePicker';
import makeStyles from "@mui/styles/makeStyles";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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


function Todo({ todos, setTodos, id, text, dueDate, completed }) {
  const classes = useStyles();

    return (
        <Draggable key={id} draggableId={id?.toString()} index={id}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          key={id}
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          className={classes.todoContainer}
                        >
                          <Checkbox
                            checked={completed}
                            onChange={() => toggleTodoCompleted(id)}
                          ></Checkbox>
                          <Box flexGrow={1}>
                            <Typography
                              className={completed ? classes.todoTextCompleted : ""}
                              variant="body1"
                            >
                              {text}
                            </Typography>
                            <DatePicker todos={todos} setTodos={setTodos}  dueDate={dueDate}/>
                          </Box>
                          <Button
                            className={classes.deleteTodo}
                            startIcon={<Icon>delete</Icon>}
                            onClick={() => deleteTodo(id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </Draggable>
                 
    );
}

export default Todo;