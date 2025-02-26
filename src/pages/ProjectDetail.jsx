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
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Estados gerais
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Para PDFs e estruturas, agora organizados por categorias (abas)
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Outros estados
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
        // Se existir o campo categories, use-o; caso contrário, crie uma aba padrão "Geral"
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          setCategories([{ name: "Geral", pdfs: data.pdfs || [], structures: data.structures || [] }]);
        }
      }
      setLoading(false);
    }
    fetchProject();
  }, [projectId]);

  // Atualiza a categoria ativa dentro do array de categorias
  const updateActiveCategory = (updatedCategory) => {
    const newCategories = categories.map((cat, idx) => (idx === activeTab ? updatedCategory : cat));
    setCategories(newCategories);
  };

  const handleUploadPdf = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setPdfLoading(true);
    // FilePath: relativo ao bucket "pdfs", sem prefixo duplicado
    const filePath = `${projectId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, file);
    if (uploadError) {
      console.error('Erro ao fazer upload do PDF:', uploadError);
      setSnackbar({ open: true, message: 'Erro ao fazer upload do PDF', severity: 'error' });
      setPdfLoading(false);
      return;
    }
    // Obter URL pública do arquivo
    const { data, error: urlError } = supabase.storage
      .from('pdfs')
      .getPublicUrl(filePath);
    if (urlError) {
      console.error('Erro ao obter URL pública:', urlError);
      setSnackbar({ open: true, message: 'Erro ao obter URL pública do PDF', severity: 'error' });
      setPdfLoading(false);
      return;
    }
    const newPdf = { url: data.publicUrl, name: file.name, filePath };
    // Atualiza a categoria ativa com o novo PDF
    const currentCategory = { ...categories[activeTab] };
    const updatedPdfs = [...(currentCategory.pdfs || []), newPdf];
    currentCategory.pdfs = updatedPdfs;
    updateActiveCategory(currentCategory);

    // Atualiza o projeto no banco com o novo array de categorias
    const { error: updateError } = await supabase
      .from('projects')
      .update({ categories })
      .eq('id', projectId);
    if (updateError) {
      console.error('Erro ao atualizar PDFs no projeto:', updateError);
      setSnackbar({ open: true, message: 'Erro ao atualizar PDFs no projeto', severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'PDF carregado com sucesso!', severity: 'success' });
    }
    setPdfLoading(false);
  };

  const handleDeletePdf = async (index) => {
    const currentCategory = { ...categories[activeTab] };
    const pdfToDelete = currentCategory.pdfs[index];
    const { error: removeError } = await supabase.storage
      .from('pdfs')
      .remove([pdfToDelete.filePath]);
    if (removeError) {
      console.error('Erro ao excluir PDF do storage:', removeError);
      setSnackbar({ open: true, message: 'Erro ao excluir PDF do storage', severity: 'error' });
      return;
    }
    const updatedPdfs = currentCategory.pdfs.filter((_, i) => i !== index);
    currentCategory.pdfs = updatedPdfs;
    updateActiveCategory(currentCategory);
    const { error: updateError } = await supabase
      .from('projects')
      .update({ categories })
      .eq('id', projectId);
    if (updateError) {
      console.error('Erro ao atualizar PDFs após exclusão:', updateError);
      setSnackbar({ open: true, message: 'Erro ao atualizar PDFs após exclusão', severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'PDF excluído com sucesso!', severity: 'success' });
    }
  };

  // Manipulação das estruturas na aba ativa
  const handleAddStructure = () => {
    const currentCategory = { ...categories[activeTab] };
    currentCategory.structures = [...(currentCategory.structures || []), { name: '', unit: '', customUnit: '' }];
    updateActiveCategory(currentCategory);
  };

  const handleStructureChange = (index, field, value) => {
    const currentCategory = { ...categories[activeTab] };
    currentCategory.structures = currentCategory.structures.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    updateActiveCategory(currentCategory);
  };

  const handleDeleteStructure = (index) => {
    const currentCategory = { ...categories[activeTab] };
    currentCategory.structures = currentCategory.structures.filter((_, i) => i !== index);
    updateActiveCategory(currentCategory);
  };

  const handleSaveStructures = async () => {
    const { error } = await supabase
      .from('projects')
      .update({ categories })
      .eq('id', projectId);
    if (error) {
      console.error('Erro ao atualizar estruturas:', error);
      setSnackbar({ open: true, message: 'Erro ao salvar estruturas', severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'Estruturas salvas com sucesso!', severity: 'success' });
      setShowSavedCard(true);
    }
  };

  // Abas: adicionar nova aba, editar nome da aba e excluir aba
  const handleAddTab = () => {
    const newCategory = { name: 'Nova Aba', pdfs: [], structures: [] };
    setCategories([...categories, newCategory]);
    setActiveTab(categories.length);
  };

  const handleTabNameChange = (e, idx) => {
    const updatedCategory = { ...categories[idx], name: e.target.value };
    const newCategories = categories.map((cat, i) => (i === idx ? updatedCategory : cat));
    setCategories(newCategories);
  };

  const handleDeleteTab = async (idx) => {
    if (categories.length === 1) {
      setSnackbar({ open: true, message: 'Não é possível excluir a única aba.', severity: 'warning' });
      return;
    }
    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta aba? Todos os dados nela serão perdidos.');
    if (!confirmDelete) return;
    const newCategories = categories.filter((_, i) => i !== idx);
    setCategories(newCategories);
    // Ajusta a aba ativa, se necessário
    if (activeTab >= newCategories.length) {
      setActiveTab(newCategories.length - 1);
    }
    // Atualiza o projeto no banco
    const { error } = await supabase
      .from('projects')
      .update({ categories: newCategories })
      .eq('id', projectId);
    if (error) {
      console.error('Erro ao excluir a aba:', error);
      setSnackbar({ open: true, message: 'Erro ao excluir a aba', severity: 'error' });
    } else {
      setSnackbar({ open: true, message: 'Aba excluída com sucesso!', severity: 'success' });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedPdf(null);
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
      <Paper sx={{ p: 4, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{project.name}</Typography>
          <Button variant="outlined" color="error" onClick={handleDeleteProject} startIcon={<DeleteIcon />}>
            Excluir Projeto
          </Button>
        </Box>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {project.description}
        </Typography>
      </Paper>

      {/* Abas de categoria */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ '& .MuiTabs-indicator': { display: 'none' } }}
          >
            {categories.map((cat, idx) => (
              <Tab
                key={idx}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      value={cat.name}
                      onChange={(e) => handleTabNameChange(e, idx)}
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                    />
                    {categories.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleDeleteTab(idx); }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
          <Button variant="text" onClick={handleAddTab}>Adicionar Aba</Button>
        </Box>
      </Paper>

      {/* Conteúdo da aba ativa: Upload de PDFs */}
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
        {categories[activeTab].pdfs && categories[activeTab].pdfs.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">PDFs enviados:</Typography>
            <List>
              {categories[activeTab].pdfs.map((pdf, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePdf(index)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
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

      {/* Conteúdo da aba ativa: Gerenciamento de Estruturas */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Estruturas e Medidas
        </Typography>
        {!showSavedCard ? (
          <>
            {categories[activeTab].structures && categories[activeTab].structures.map((structure, index) => (
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
              {categories[activeTab].structures && categories[activeTab].structures.map((structure, index) => (
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
