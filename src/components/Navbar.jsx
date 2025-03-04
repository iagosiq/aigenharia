// Navbar


import React, { useState, useEffect, useCallback } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Box } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArticleIcon from '@mui/icons-material/Article';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const routeToValue = {
    '/conversa-ia': 0,
    '/projetos': 1,
    '/perfil': 2
  };

  const [value, setValue] = useState(routeToValue[location.pathname] ?? -1);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setValue(routeToValue[location.pathname] ?? -1);
  }, [location.pathname]);

  if (!user) return null;

  // Componente IconWrapper corrigido
  const IconWrapper = ({ icon }) => (
    <Box sx={{
      bgcolor: 'rgba(246, 246, 239, 0.73)',
      borderRadius: '16px',
      p: 1.5,
      margin: '0 8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {icon}
    </Box>
  );

  // Return dentro da função Navbar
  return (
    <Paper sx={{ 
      borderTop: '1px solid rgba(0, 0, 0, 0.12)',
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      paddingTop: 2,
      paddingBottom: 1,
      bgcolor: 'transparent',
      backdropFilter: 'blur(5px)',
      zIndex: 9999,
    }}>
      <BottomNavigation
        value={value}
        showLabels
        sx={{
          bgcolor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            flex: 1,
            minWidth: 'auto',
            padding: '8px 0'
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            mt: 0.5
          }
        }}
      >
        <BottomNavigationAction
          label="Chat"
          icon={<IconWrapper icon={<ChatBubbleOutlineIcon sx={{ fontSize: 28 }} />} />}
          onClick={() => navigate('/conversa-ia')}
        />
        <BottomNavigationAction
          label="Projetos"
          icon={<IconWrapper icon={<DashboardIcon sx={{ fontSize: 28 }} />} />}
          onClick={() => navigate('/projetos')}
        />
        <BottomNavigationAction
          label="Perfil"
          icon={<IconWrapper icon={<PersonOutlineIcon sx={{ fontSize: 28 }} />} />}
          onClick={() => navigate('/perfil')}
        />
        <BottomNavigationAction
          label="Notícias"
          icon={<IconWrapper icon={<ArticleIcon sx={{ fontSize: 28 }} />} />}
          onClick={() => alert('Em desenvolvimento')}
        />
        <BottomNavigationAction
          label="Sair"
          icon={<IconWrapper icon={<LogoutIcon sx={{ fontSize: 28 }} />} />}
          onClick={handleLogout}
        />
      </BottomNavigation>
    </Paper>
  );
}

export default Navbar;