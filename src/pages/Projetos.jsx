// src/pages/Projects.jsx
import { useEffect, useState } from 'react';
import { getProjects, supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  List,
  ListItem,
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
  const [open, setOpen] = useState(false); // controle do modal de adição
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [adding, setAdding] = useState(false);

  // Busca os projetos do Supabase
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

  // Abre o modal para adicionar projeto
  const handleOpen = () => {
    setNewProjectName('');
    setNewProjectDescription('');
    setOpen(true);
  };

  // Fecha o modal
  const handleClose = () => {
    setOpen(false);
  };

  // Função para adicionar um novo projeto via Supabase
  const handleAddProject = async () => {
    if (!newProjectName.trim()) {
      // Nome é obrigatório
      return;
    }
    setAdding(true);
    const { error } = await supabase
      .from('projects')
      .insert([{ name: newProjectName, description: newProjectDescription }]);
    if (error) {
      console.error('Erro ao adicionar projeto:', error);
    } else {
      // Atualiza a lista de projetos após a inserção
      const updatedProjects = await getProjects();
      setProjects(updatedProjects);
      handleClose();
    }
    setAdding(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Projetos</Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Adicionar Projeto
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : projects.length > 0 ? (
          <List>
            {projects.map((project) => (
              <ListItem
                key={project.id}
                button
                component={Link}
                to={`/projeto/${project.id}`}
              >
                <ListItemText primary={project.name} secondary={project.description} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1">Nenhum projeto encontrado.</Typography>
        )}
      </Paper>

      {/* Modal para adicionar projeto */}
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
