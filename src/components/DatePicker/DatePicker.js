import React from 'react';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
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
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";



function DatePicker({todos, setTodos, dueDate}) {
  const today = new Date().setHours(0, 0, 0, 0);


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
    

    return (
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
    );
}

export default DatePicker;