
// Projetos.jsx


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, supabase } from '../supabaseClient';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  CircularProgress,
} from '@mui/material';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // Modal para adicionar projeto
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleOpen = () => {
    setNewProjectName('');
    setNewProjectDescription('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddProject = async () => {
    if (!newProjectName.trim()) return;
    
    setAdding(true);
    
    // Obtém o usuário logado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("Usuário não autenticado");
      setAdding(false);
      return;
    }
  
    // Insere o projeto com o user_id do usuário logado
    const { error } = await supabase
      .from("projects")
      .insert([{ 
        name: newProjectName, 
        description: newProjectDescription, 
        user_id: user.id 
      }]);
  
    if (error) {
      console.error("Erro ao adicionar projeto:", error);
    } else {
      const updatedProjects = await getProjects();
      setProjects(updatedProjects);
      handleClose();
    }
  
    setAdding(false);
  };
  

  return (
    <Container sx={{ mt: 10, mb: 12 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" sx={{ mb: 2 }}>Meus Projetos</Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Adicionar Projeto
          </Button>
        </Box>
        {projects.length > 0 ? (
          <List>
            {projects.map((project) => (
              <ListItemButton 
                key={project.id} 
                component={Link} 
                to={`/projeto/${project.id}`}
              >
                <ListItemText 
                  primary={project.name} 
                  secondary={project.description}
                  sx={{
                    '& .MuiListItemText-primary': {
                      borderBottom: '1px solid #ccc',
                      color: '#202020',
                    },
                  }} 
                />
              </ListItemButton>
            ))}
          </List>
        ) : (
          <Typography variant="body1">Nenhum projeto encontrado.</Typography>
        )}
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Adicionar Projeto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Preencha os dados para adicionar um novo projeto.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Nome do Projeto"
            type="text"
            fullWidth
            variant="outlined"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Descrição"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={adding}>Cancelar</Button>
          <Button onClick={handleAddProject} variant="contained" disabled={adding}>
            {adding ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Projects;




