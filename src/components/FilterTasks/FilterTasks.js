import React, { useState } from 'react';
import useStore from '../../store';

import {
  Button, Switch, Stack, DialogTitle
} from "@mui/material";

function FilterTasks({ filterApplied, setFilterApplied  }) {
  // const today = new Date().toISOString().split('T')[0];
  const todos = useStore(state => state.todos);
  const setTodos = useStore(state => state.setTodos);
 
  function filterTodos() {

    fetch(`http://localhost:3001/duetaskstoday`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    }).then((response) => response.json())
      .then((filteredTodos) => {
        setTodos(filteredTodos);
      });

  }

  const handleToggle = () => {
    setFilterApplied(prev => !prev);
   console.log(filterApplied);
};

  function clearFilter(){
    console.log(setClearFilter);
    setClearFilter((prev) => !prev) ;
  }

  return (
  <>
  <Switch 
      checked={filterApplied}
      onClick={handleToggle}
      />
      Filter Due Tasks Today
    {/* <Button variant='outlined' onClick={filterTodos}>Filter Due Tasks Today</Button>
    <Button variant='outlined' onClick={clearFilter}>Clear Filter</Button> */}
  </>

  );
}

export default FilterTasks;