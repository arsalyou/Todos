import React from 'react';
import {
    Container,
    Stack,
    Button,
    Icon,
    Paper,
    Box,
    TextField,
    Checkbox,
  } from "@mui/material";

function FilterTasks(todos, setTodos) {

    function  filterTodos() {
        if (totalTasks === todos?.length) {
          todos.forEach(to=>{
            console.log(new Date(to.dueDate).getMilliseconds() === new Date(today).getMilliseconds())
          });
         
        const fiteredTasks = todos.filter(todoTask => {
          new Date(todoTask.dueDate).getMilliseconds() === new Date(today).getMilliseconds()
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
          .then((filteredTodos) => setTodos(filteredTodos));
      }
      }

    const clearFilter = () => {
        setTodos(todos);

    }

    return (
        <Stack direction='row' sx={{m: 2}}>
            <Button  onClick={filterTodos}>Filter Due Tasks Today</Button>
            <Button  onClick={clearFilter}>Clear Filter</Button>
        </Stack>
    );
}

export default FilterTasks;