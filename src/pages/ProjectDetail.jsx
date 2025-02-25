// src/pages/ProjectDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  Link as MuiLink,
  MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfs, setPdfs] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [structures, setStructures] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showSavedCard, setShowSavedCard] = useState(false);

  // Opções para o seletor de medida
  const measureOptions = ["m³", "m²", "m", "cm", "Outros"];

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
        setPdfs(data.pdfs || []);
        // Inicializa cada estrutura com campo customUnit vazio, se não existir
        const initStructures = (data.structures || []).map(s => ({ ...s, customUnit: s.customUnit || '' }));
        setStructures(initStructures);
      }
      setLoading(false);
    }
    fetchProject();
  }, [projectId]);

  const handleUploadPdf = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setPdfLoading(true);
    const filePath = `pdfs/${projectId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, file);
    if (uploadError) {
      console.error('Erro ao fazer upload do PDF:', uploadError);
      setSnackbar({ open: true, message: 'Erro ao fazer upload do PDF', severity: 'error' });
      setPdfLoading(false);
      return;
    }
    // Corrigindo o acesso ao public URL
    const { data, error: urlError } = supabase.storage
      .from('pdfs')
      .getPublicUrl(filePath);
    if (urlError) {
      console.error('Erro ao obter URL pública:', urlError);
      setSnackbar({ open: true, message: 'Erro ao obter URL pública do PDF', severity: 'error' });
      setPdfLoading(false);
      return;
    }
    const newPdf = { url: data.publicUrl, name: file.name }; // usa data.publicUrl
    const updatedPdfs = [...pdfs, newPdf];
    setPdfs(updatedPdfs);
    const { error: updateError } = await supabase
      .from('projects')
      .update({ pdfs: updatedPdfs })
      .eq('id', projectId);
    if (updateError) {
      console.error('Erro ao atualizar PDFs no projeto:', updateError);
      setSnackbar({ open: true, message: 'Erro ao atualizar PDFs no projeto', severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'PDF carregado com sucesso!', severity: 'success' });
    }
    setPdfLoading(false);
  };

  // Manipulação das estruturas
  const handleAddStructure = () => {
    setStructures([...structures, { name: '', unit: '', customUnit: '' }]);
  };

  const handleStructureChange = (index, field, value) => {
    const newStructures = structures.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setStructures(newStructures);
  };

  const handleDeleteStructure = (index) => {
    const newStructures = structures.filter((_, i) => i !== index);
    setStructures(newStructures);
  };

  const handleSaveStructures = async () => {
    const { error } = await supabase
      .from('projects')
      .update({ structures })
      .eq('id', projectId);
    if (error) {
      console.error('Erro ao atualizar estruturas:', error);
      setSnackbar({ open: true, message: 'Erro ao salvar estruturas', severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'Estruturas salvas com sucesso!', severity: 'success' });
      setShowSavedCard(true);
    }
  };

  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este projeto?');
    if (!confirmDelete) return;
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    if (error) {
      console.error('Erro ao excluir projeto:', error);
      setSnackbar({ open: true, message: 'Erro ao excluir projeto', severity: 'error' });
    } else {
      navigate('/projetos');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
      {/* Cabeçalho e exclusão do projeto */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{project.name}</Typography>
          <Button variant="outlined" color="error" onClick={handleDeleteProject} startIcon={<DeleteIcon />}>
            Excluir Projeto
          </Button>
        </Box>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {project.description}
        </Typography>
      </Paper>

      {/* Seção para upload de PDFs */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Upload de PDF
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Button variant="contained" component="label" disabled={pdfLoading}>
            {pdfLoading ? 'Carregando PDF...' : 'Selecionar PDF'}
            <input type="file" hidden accept="application/pdf" onChange={handleUploadPdf} />
          </Button>
          {pdfLoading && <CircularProgress size={24} />}
        </Box>
        {pdfs.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">PDFs enviados:</Typography>
            <List>
              {pdfs.map((pdf, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={pdf.name}
                    secondary={
                      <>
                        <MuiLink href={pdf.url} target="_blank" rel="noopener noreferrer">
                          Abrir em nova aba
                        </MuiLink>
                        {' | '}
                        <Button variant="text" onClick={() => setSelectedPdf(pdf.url)}>
                          Visualizar
                        </Button>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            {selectedPdf && (
              <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
                <Typography variant="subtitle1">Pré-visualização do PDF:</Typography>
                <iframe src={selectedPdf} title="Visualização do PDF" width="100%" height="400px" />
                <Button variant="text" onClick={() => setSelectedPdf(null)} sx={{ mt: 1 }}>
                  Fechar Visualização
                </Button>
              </Paper>
            )}
          </Box>
        )}
      </Paper>

      {/* Seção para inserir e salvar estruturas */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Estruturas e Medidas
        </Typography>
        {!showSavedCard ? (
          <>
            {structures.map((structure, index) => (
              <Box key={index} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
                <TextField
                  label="Nome da Estrutura"
                  variant="outlined"
                  value={structure.name}
                  onChange={(e) => handleStructureChange(index, 'name', e.target.value)}
                />
                <TextField
                  select
                  label="Medida"
                  variant="outlined"
                  value={structure.unit}
                  onChange={(e) => handleStructureChange(index, 'unit', e.target.value)}
                  sx={{ minWidth: 120 }}
                >
                  {measureOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                {structure.unit === "Outros" && (
                  <TextField
                    label="Medida personalizada"
                    variant="outlined"
                    value={structure.customUnit || ''}
                    onChange={(e) => handleStructureChange(index, 'customUnit', e.target.value)}
                  />
                )}
                <IconButton color="error" onClick={() => handleDeleteStructure(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Button variant="outlined" onClick={handleAddStructure}>
                Adicionar Estrutura
              </Button>
              <Button variant="contained" onClick={handleSaveStructures}>
                Salvar Estruturas
              </Button>
            </Box>
          </>
        ) : (
          <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h5" gutterBottom>
              Estruturas Salvas
            </Typography>
            <List>
              {structures.map((structure, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={structure.name}
                    secondary={structure.unit === 'Outros' ? structure.customUnit : structure.unit}
                  />
                </ListItem>
              ))}
            </List>
            <Button variant="contained" onClick={() => setShowSavedCard(false)}>
              Editar Estruturas
            </Button>
          </Paper>
        )}
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ProjectDetail;
