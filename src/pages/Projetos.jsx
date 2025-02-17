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

