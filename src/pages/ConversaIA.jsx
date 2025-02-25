// src/pages/ConversaIA.jsx
import React, { useState } from 'react';
import { Container, Paper, Box, TextField, Button, Typography } from '@mui/material';

function ConversaIA() {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Pergunta enviada:', question);
    setQuestion('');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}> {/* mt:10 ~ 80px */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Converse com AIgenharia
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', alignItems: 'center', mt: 2 }}
        >
          <TextField
            label="Digite sua pergunta"
            variant="outlined"
            fullWidth
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
            Enviar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default ConversaIA;
