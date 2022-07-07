import React, {useState, useEffect, useRef, useCallback} from 'react';
import Header from '../components/Header/Header';
import FilterTasks from '../components/FilterTasks/FilterTasks';
import AddTask from '../components/AddTask/AddTask';
import TodoList from '../components/TodoList/TodoList';
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

function TodoPage() {
    const [todos, setTodos] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [loading, setLoading] = useState(true);
    const loader = useRef(null);
    const [loadMore, setLoadMore] = useState(1);
    const today = new Date().setHours(0, 0, 0, 0);

    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
            setLoadMore((prev) => prev + 1);
        }
    }, []);

    const sendQuery = useCallback( () => {
        try {
            setLoading(true);
          if (totalTasks > todos.length) {
            console.log(lastElement);
    
            fetch(`http://localhost:3001/loadtasks/${todos[todos.length-1]?.id}`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              method: "GET",
            }).then((response) => response.json())
              .then((newTodos) => {
                setTodos((prev) => [...prev, ...newTodos])    
              });
          }
          setLoading(false);
        } catch (err) {
            console.log(err);
        }
      }, [loadMore]);

    useEffect(() => {
        sendQuery();
    }, [ loadMore]);

    useEffect(() => {
        const option = {
          root: null,
          rootMargin: "10px",
          threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);
      }, [handleObserver]);
    
    useEffect(() => {
        fetch("http://localhost:3001/")
          .then((response) => response.json())
          .then((responseTodos) => {
            setTodos(responseTodos?.response)
            setTotalTasks(responseTodos?.totalTasks);
          });
      }, []);



    return (
        <Container maxWidth="md">
            <Header title="Todos" />
            <FilterTasks todos={todos} setTodos={setTodos} setTotalTasks={setTotalTasks}/>
            <AddTask setTodos={setTodos} setTotalTasks={setTotalTasks}/>
            <TodoList todos={todos} setTodos={setTodos} />
            {loading && <p>Loading...</p>}
            <div ref={loader} />
        </Container>
    );
}

export default TodoPage;