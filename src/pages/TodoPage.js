import React, {useState, useEffect, useRef, useCallback} from 'react';
import Header from '../components/Header/Header';
import FilterTasks from '../components/FilterTasks/FilterTasks';
import AddTask from '../components/AddTask/AddTask';
import TodoList from '../components/TodoList/TodoList';
import useStore from '../store';
import {
  Container
} from "@mui/material";

function TodoPage() {
    
    const todos = useStore(state => state.todos);
    const setTodos = useStore(state => state.setTodos);
    //const [todos, setTodos] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [loading, setLoading] = useState(true);
    const loader = useRef(null);
    const [loadMore, setLoadMore] = useState(1);
    const [filterApplied, setFilterApplied] = React.useState(false);

    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
            setLoadMore((prev) => prev + 1);
        }
    }, []);


    console.log(loadMore);
    const sendQuery = useCallback(() => {
      console.log(loadMore);
        try {
            setLoading(true);
          if (totalTasks > todos.length) {
    
            fetch(`http://localhost:3001/loadTasksNew/${todos[todos.length-1]?.id}`, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              method: "GET",
            }).then((response) => response.json())
              .then((newTodos) => {
                //setTodos((prev) => [...prev, ...newTodos]);
                setTodos([...todos, ...newTodos]);
                console.log('todos?.length '+ todos?.length);    
              });
          }
          setLoading(false);
        } catch (err) {
            console.log(err);
        }
      }, [loadMore, filterApplied]);

    useEffect(() => {
        sendQuery();
    }, [ loadMore]);

    useEffect(() => {
      sendQuery();
  }, [ filterApplied]);

    useEffect(() => {
        const option = {
          root: null,
          rootMargin: "10px",
          threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);
      }, [handleObserver]);

      const fetchTasks = () => {

      }
    
    useEffect(() => {
        fetch("http://localhost:3001/")
          .then((response) => response.json())
          .then((responseTodos) => {
            setTodos(responseTodos?.response)
            console.log(responseTodos?.totalTasks);
            setTotalTasks(responseTodos?.totalTasks);
          });
      }, []);

    return (
        <Container maxWidth="md">
            <Header title="Todos" />
            <FilterTasks filterApplied={filterApplied} setFilterApplied={setFilterApplied} totalTasks={totalTasks} />
            <AddTask totalTasks={totalTasks} setTotalTasks={setTotalTasks} />
            {todos?.length > 0 ? 
            <TodoList  setTotalTasks={setTotalTasks} totalTasks={totalTasks}  sendQuery={sendQuery}/> :
            <p>No Task Added...</p>
            }
            {loading && <p>Loading...</p>}
            <div ref={loader} />
        </Container>
    );
}

export default TodoPage;