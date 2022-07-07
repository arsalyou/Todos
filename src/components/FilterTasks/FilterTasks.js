import React from 'react';
import {
  Button
} from "@mui/material";

function FilterTasks({ todos, setTodos, totalTasks }) {
  // const today = new Date().toISOString().split('T')[0];

  function filterTodos() {
    //   if (totalTasks === todos?.length) {
    //     todos?.forEach(todo=>{
    //       console.log(todo?.dueDate?.split('T')[0] === today)
    //     });

    //   const fiteredTasks = todos.filter(todoTask => {
    //     todo?.dueDate?.split('T')[0] === today
    //   })
    //   setTodos(fiteredTasks);
    // }else{

    fetch(`http://localhost:3001/duetaskstoday`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    }).then((response) => response.json())
      .then((filteredTodos) => setTodos(filteredTodos));

  }

  return (
    <Button variant='outlined' onClick={filterTodos}>Filter Due Tasks Today</Button>
  );
}

export default FilterTasks;