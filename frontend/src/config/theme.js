import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#543F2E',
      light: '#A78464',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#203142',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F0F2F5'
    },
    chat: {
      outgoing: '#2E61D9',
      incoming: '#E4E6EB',
      text: {
        outgoing: '#FFFFFF',
        incoming: '#050505'
      }
    }
  },
  components: {
    RaImageField: {
      styleOverrides: {
        image: {
          width: '100%',
          margin: 0,
          maxHeight: 200,
          objectFit: 'cover'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: 20,
          padding: '8px 16px',
          minWidth: 100
        }
      }
    },
    MuiCard: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          marginBottom: 0,
          borderRadius: 0
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#65676B'
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#65676B',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }
      }
    }
  }
});

export default theme;
