import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Todos from "./Todos";
import TodoPage from './pages/TodoPage';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <TodoPage />
  </React.StrictMode>,
  document.getElementById("root")
);
