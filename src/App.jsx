import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Projetos from './pages/Projetos';
import Perfil from './pages/Perfil';
import ConversaIA from './pages/ConversaIA';
import ProjectDetail from './pages/ProjectDetail';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/projeto/:projectId" element={<ProjectDetail />} />
        <Route path="/" element={<ConversaIA />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
