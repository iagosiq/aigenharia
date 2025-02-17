// src/pages/Login.jsx
import React from 'react';
import { Container, Paper, Box, TextField, Button, Typography } from '@mui/material';

function Login() {
  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 70px)', // compensando a Navbar fixa
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <TextField label="Email" variant="outlined" fullWidth margin="normal" />
          <TextField label="Senha" type="password" variant="outlined" fullWidth margin="normal" />
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Entrar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
