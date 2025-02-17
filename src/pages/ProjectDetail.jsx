// src/pages/ProjectDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Container, Paper, Typography, CircularProgress } from '@mui/material';

function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Erro ao buscar o projeto:', error);
      } else {
        setProject(data);
      }
      setLoading(false);
    }
    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <Container sx={{ mt: 10, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!project) {
    return (
      <Container sx={{ mt: 10 }}>
        <Typography variant="h5">Projeto não encontrado.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 10 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {project.name}
        </Typography>
        <Typography variant="body1">
          {project.description}
        </Typography>
        {/* Aqui você pode adicionar outras funcionalidades ou informações do projeto */}
      </Paper>
    </Container>
  );
}

export default ProjectDetail;
