// src/pages/Perfil.jsx
import React from 'react';
import { Container, Paper, Box, TextField, Button, Typography } from '@mui/material';

function Perfil() {
  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 70px)',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Perfil do Usuário
        </Typography>
        <Box component="form" noValidate sx={{ mt: 2, backgroundColor: 'transparent' }}>
          <TextField label="Nome" variant="outlined" fullWidth margin="normal" />
          <TextField label="Email" variant="outlined" fullWidth margin="normal" />
          <TextField label="Senha" type="password" variant="outlined" fullWidth margin="normal" />
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Salvar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Perfil;
