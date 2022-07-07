import React from 'react';
import {
    Typography
  } from "@mui/material";

function Header({title}) {
    return (
        <Typography variant="h3" component="h1" gutterBottom>
        {title}
      </Typography>
    );
}

export default Header;


