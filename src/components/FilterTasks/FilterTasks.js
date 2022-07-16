import React, { useState } from 'react';

import {
  Button, Dialog, Stack, DialogTitle
} from "@mui/material";

function FilterTasks({ todos, totalTasks }) {
  // const today = new Date().toISOString().split('T')[0];
  const [open, setOpen] = useState(false);
  const [todayTasks, setTodayTasks] = useState([]);
  const handleClose = (event, reason) => {
    setOpen(false);
  }

  const openDialog = () => {
    setTabIndex(0);
    setOpen(true);
  }

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
      .then((filteredTodos) => {
        setTodayTasks(filteredTodos);
        setOpen(true);
      });


  }

  return (
  <>
    <Dialog open={open} onClose={handleClose} >
    <DialogTitle>{"Result"}</DialogTitle>
      <Stack spacing={1} sx={{ alignItems: 'center', p: 1 }}>
      <ul>
        {
          todayTasks?.length > 0 ?
              todayTasks.map(todayTask => (
                <li>{todayTask?.text}</li>
              ))
            :
            <h6>No Task Found</h6>
        }
        </ul>
      </Stack>
    </Dialog>
    <Button variant='outlined' onClick={filterTodos}>Filter Due Tasks Today</Button>
  </>

  );
}

export default FilterTasks;