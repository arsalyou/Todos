import React from 'react';
import Todo from '../Todo/Todo';
import makeStyles from "@mui/styles/makeStyles";

import { DragDropContext, Droppable } from "react-beautiful-dnd";
import {
  Paper,
  Box,
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

function TodoList({ todos, setTodos, setTotalTasks, totalTasks, setLoadedTaskCount, sendQuery }) {
  const classes = useStyles();

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const prevTodos = todos;
    const sourceId = todos[result.source.index].id;
    const destinationIndex = result.destination.index;
    const sourceIndex = result.source.index;

    if (sourceIndex === destinationIndex) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    let newId = null;
    let body = null;
    let prevId = null, nextId = null;
    if (totalTasks > todos?.length && destinationIndex === (todos?.length - 1)) {
      body = JSON.stringify({
        updatedId: null,
        destinationId: todos[destinationIndex].id
      })

    } else {
      switch (result.destination.index) {
        case 0: {
          newId = todos[destinationIndex].id - 1000;
          reorderedItem.id = newId;
          break;
        }
        case todos.length - 1: {
          newId = todos[destinationIndex].id + 1000;
          reorderedItem.id = newId;
          break;
        }
        default: {
          if (sourceIndex > destinationIndex) {
            prevId = todos[destinationIndex - 1].id;
            nextId = todos[destinationIndex].id;
          } else if (destinationIndex > sourceIndex) {
            prevId = todos[destinationIndex].id;
            nextId = todos[destinationIndex + 1].id;
          }

          newId = Math.round((parseInt(prevId) + parseInt(nextId)) / 2);
          console.log(newId);
          reorderedItem.id = newId;
          break;
        }
      }
      body = JSON.stringify({
        updatedId: newId?.toString(),
        destinationId: null
      })
    }
    fetch(`http://localhost:3001/updateId/${sourceId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: body,
    }).then((response) => response.json())
      .then((updatedIdObj) => {
        reorderedItem.id = updatedIdObj.updatedId;
        setTodos(items);
      }).catch(() => {
        //setTodos(prevTodos);
        alert('Some error occur');
      });
    setTodos(items);
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="characters">
        {(provided) => (
          todos.length > 0 && (
            <Paper className={classes.todosContainer}>
              <Box display="flex" flexDirection="column" alignItems="stretch" {...provided.droppableProps} ref={provided.innerRef}>
                {todos.map(({ id, text, dueDate, completed }, index) => (
                  <Todo key={id} todos={todos} setTodos={setTodos} id={id} text={text} dueDate={dueDate} completed={completed} setTotalTasks={setTotalTasks} index={index} setLoadedTaskCount={setLoadedTaskCount} totalTasks={totalTasks} sendQuery={sendQuery} />
                ))}
                {provided.placeholder}
              </Box>
            </Paper>
          ))}
      </Droppable>
    </DragDropContext>
  );
}

export default TodoList;