import { useState, useEffect, useRef, useCallback } from "react";
//import useFetch from "./customhook/useFetch";
import makeStyles from "@mui/styles/makeStyles";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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

function Todos() {
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newTodoText, setNewTodoText] = useState("");
  const [totalTasks, setTotalTasks] = useState(0);
  const [lastElement, setLastElement] = useState(null);
  const loader = useRef(null);
  const [page, setPage] = useState(1);
  const today = new Date().setHours(0, 0, 0, 0);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  const sendQuery = useCallback( () => {
    try {
        setLoading(true);
        setError(false);
      if (totalTasks > todos.length) {
        console.log(lastElement);

        fetch(`http://localhost:3001/loadtasks/${lastElement}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
        }).then((response) => response.json())
          .then((newTodos) => {
            setTodos((prev) => [...prev, ...newTodos])
            console.log(todos[todos.length -1].id);
            setLastElement(newTodos[newTodos.length-1]?.id)

          });
      }
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }, [ page]);

  useEffect(() => {
    sendQuery();
  }, [ page]);


  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((response) => response.json())
      .then((responseTodos) => {
        
        setTodos(responseTodos?.response)
        setTotalTasks(responseTodos?.totalTasks);
        console.log(todos[todos.length-1])
        setLastElement(responseTodos?.response[responseTodos.response.length-1]?.id)
        console.log(lastElement)
      });
    
   
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

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
        setTodos([...todos, todo])
      });
    setNewTodoText("");
  }

  function selectDueDate(id, dueDate) {
    if (dueDate < today) {
      alert('Due date can not be past date');
      return;
    }
    console.log(dueDate);
    fetch(`http://localhost:3001/dueDate/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        dueDate: dueDate,
      }),
    }).then(() => {
      const newTodos = [...todos];
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        dueDate: dueDate,
      };
      setTodos(newTodos);
    });
  }

  function toggleTodoCompleted(id) {
    fetch(`http://localhost:3001/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        completed: !todos.find((todo) => todo.id === id).completed,
      }),
    }).then(() => {
      const newTodos = [...todos];
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        completed: !newTodos[modifiedTodoIndex].completed,
      };
      setTodos(newTodos);
    });
  }

  function deleteTodo(id) {
    fetch(`http://localhost:3001/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTotalTasks(totalTasks - 1);
      setTodos(todos.filter((todo) => todo.id !== id))
    });
  }

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const prevTodos = todos;
    const sourceId = todos[result.source.index].id;
    const newIndex = result.destination.index;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    let newId = null;
    let body = null;
    if (totalTasks > todos?.length && newIndex === (todos?.length - 1)) {
      body = JSON.stringify({
        updatedId: null,
        prevId: todos[newIndex].id
      })

    } else {
      switch (result.destination.index) {
        case 0: {
          newId = todos[newIndex].id - 1000;
          reorderedItem.id = newId;
          break;
        }
        case todos.length - 1: {
          newId = todos[newIndex].id + 1000;
          reorderedItem.id = newId;
          break;
        }
        default: {
          const prevId = todos[newIndex - 1].id;
          const nextId = todos[newIndex + 1].id;
          newId = Math.round((parseInt(prevId) + parseInt(nextId)) / 2);
          console.log(newId);
          reorderedItem.id = newId;
          break;
        }

      }
      body = JSON.stringify({
        updatedId: newId?.toString(),
        prevId: null
      })
    }
    fetch(`http://localhost:3001/updateId/${sourceId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: body,
    }).then(() => {
      setTodos(items);
    }).catch(() => {
      //setTodos(prevTodos);
    });
    setTodos(items);
  }

  function filterTask() {
    if (totalTasks === todos?.length) {
    const fiteredTasks = todos.filter(todoTask => {
      todoTask.dueDate === today
    })
    setTodos(fiteredTasks);
  }else{

    fetch(`http://localhost:3001/duetaskstoday`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    }).then((response) => response.json())
      .then((todos) => setTodos(todos));
  }
  }


  function loadMoreTasks() {
    if (totalTasks > todos?.length) {
   

    fetch(`http://localhost:3001/loadtasks`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        body: JSON.stringify({
          id: todos[todos.length-1].id,
        }),
      },
      method: "GET",
    }).then((response) => response.json())
      .then((todos) => {
        setTodos(todos)

      });
  }
  }






  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Todos
      </Typography>
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
          <Button
            className={classes.addTodoButton}
            onClick={filterTask}
          >
            Filter due tasks
          </Button>
        </Box>
      </Paper>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="characters">
          {(provided) => (
            todos.length > 0 && (
              <Paper className={classes.todosContainer}>
                <Box display="flex" flexDirection="column" alignItems="stretch" {...provided.droppableProps} ref={provided.innerRef}>
                  {todos.map(({ id, text, dueDate, completed }, index) => (
                    <Draggable key={id} draggableId={id?.toString()} index={index}>
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
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DesktopDatePicker
                                label="Select Due date"
                                inputFormat="MM/dd/yyyy"
                                value={dueDate ? dueDate : null}
                                minDate={!dueDate ? today : null}
                                onChange={(selectedDate) => {
                                  selectDueDate(id, selectedDate);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                              />
                            </LocalizationProvider>
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
                  ))}
                  {provided.placeholder}
                </Box>
              </Paper>
            ))}
        </Droppable>
      </DragDropContext>
      {loading && <p>Loading...</p>}
      {error && <p>Error!</p>}
      <div ref={loader} />
    </Container>
  );
}

export default Todos;
