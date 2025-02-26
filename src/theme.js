// import { createTheme } from '@mui/material/styles';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#131034',
//       contrastText: '#fff',
//     },
//     secondary: {
//       main: '#ff4081',
//     },
//     background: {
//       default: '#f5f5f5',
//     },
//   },
//   typography: {
//     fontFamily: "'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif",
//   },
//   components: {
//     MuiCssBaseline: {
//       styleOverrides: {
//         body: {
//           backgroundColor: '#f5f5f5',
//           margin: 0,
//           padding: 0,
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           boxShadow: 'none',
//           border: '1px solid #ccc',
//           borderRadius: '8px',

//         },
//       },
//     },
//     MuiBox: {
//       styleOverrides: {
//         root: {
//           boxShadow: 'none',
//           border: '1px solid #ccc',
//           borderRadius: '8px',
//           backgroundColor: '#f5f5f5',
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           boxShadow: 'none',
//           // border: '1px solid #ccc',
//           // borderRadius: '8px',
//           backgroundColor: '#14103480',
//         },
//       },
//     },
//     MuiAppBar: {
//       styleOverrides: {
//         root: {
//           borderRadius: '0', // Bordas retas
//           border: 'none',    // Sem bordas
//           boxShadow: '0px 2px 4px rgba(0,0,0,0.2)', // Sombra padrão
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none',
//           fontWeight: 500,
//           boxShadow: 'none',
//           '&:hover': {
//             backgroundColor: '#535f6b',
//           },
//         },
//       },
//     },
//   },
// });

// export default theme;


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
          background: "url('/images/bg-imgage.jpg') no-repeat center center fixed",
          backgroundSize: 'cover',
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
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundColor: '#14103480',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: '0',
          border: 'none',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#535f6b',
          },
        },
      },
    },
  },
});

export default theme;
