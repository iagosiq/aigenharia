// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ConversaIA from './pages/ConversaIA';
import Projetos from './pages/Projetos';
import Perfil from './pages/Perfil';
import ProjectDetail from './pages/ProjectDetail'; // novo componente
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/projeto/:projectId" element={<ProjectDetail />} /> {/* Rota dinâmica */}
        <Route path="/" element={<ConversaIA />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

