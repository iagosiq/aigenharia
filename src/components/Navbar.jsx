// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Conversa
        </Button>
        <Button color="inherit" component={Link} to="/projetos">
          Projetos
        </Button>
        <Button color="inherit" component={Link} to="/perfil">
          Perfil
        </Button>
        <Button color="inherit" component={Link} to="/login">
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
