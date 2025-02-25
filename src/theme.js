import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#131034',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: "'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'main',
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: '0', // Remove bordas arredondadas
          border: 'none',    // Remove bordas
          '&:hover': {
            backgroundColor: 'inherit', // Impede o efeito de hover
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: '#535f6b',
          },
        },
      },
    },
  },
});

export default theme;