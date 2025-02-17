// // src/pages/Projetos.jsx
// import React from 'react';
// import { Container, Paper, Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';

// function Projetos() {
//   const projetos = [
//     { id: 1, nome: "Projeto 1", descricao: "Descrição do projeto 1" },
//     { id: 2, nome: "Projeto 2", descricao: "Descrição do projeto 2" },
//   ];

//   return (
//     <Container maxWidth="md" sx={{ mt: 10 }}>
//       <Paper elevation={3} sx={{ p: 4 }}>
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//           <Typography variant="h4">Projetos</Typography>
//           <Button variant="contained" color="primary">
//             Adicionar Projeto
//           </Button>
//         </Box>
//         <List>
//           {projetos.map((projeto) => (
//             <ListItem key={projeto.id} button>
//               <ListItemText primary={projeto.nome} secondary={projeto.descricao} />
//             </ListItem>
//           ))}
//         </List>
//       </Paper>
//     </Container>
//   );
// }

// export default Projetos;


import { useEffect, useState } from 'react';
import { getProjects } from '../supabaseClient';



getProjects().then(data => console.log('Projetos:', data)).catch(err => console.error('Erro:', err));


function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Adicionado estado de carregamento

  

  useEffect(() => {
    async function fetchData() {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      } finally {
        setLoading(false); // Finaliza o carregamento independentemente do resultado
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Meus Projetos</h1>

      {loading ? (
        <p>Carregando projetos...</p>
      ) : projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum projeto encontrado.</p>
      )}
    </div>
  );
}

export default Projects;

