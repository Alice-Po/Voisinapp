import { createTheme } from '@mui/material/styles';

// Design tokens definition
const designTokens = {
  colors: {
    brown: {
      main: '#543F2E',
      light: '#A78464'
    },
    navy: {
      main: '#203142'
    },
    blue: {
      main: '#2E61D9'
    },
    grey: {
      100: '#F0F2F5',
      200: '#E4E6EB',
      500: '#65676B'
    },
    white: '#FFFFFF',
    black: '#050505',
    opacity: {
      light: 'rgba(0, 0, 0, 0.04)',
      hover: 'rgba(255, 255, 255, 0.1)'
    }
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 20
  },
  sizes: {
    minButtonWidth: 100,
    maxImageHeight: 200
  },
  radius: {
    none: 0,
    button: 20,
    card: 12
  }
};

const theme = createTheme({
  palette: {
    primary: {
      main: designTokens.colors.brown.main,
      light: designTokens.colors.brown.light,
      contrastText: designTokens.colors.white
    },
    secondary: {
      main: designTokens.colors.navy.main,
      contrastText: designTokens.colors.white
    },
    background: {
      default: designTokens.colors.grey[100],
      paper: designTokens.colors.white
    },
    chat: {
      outgoing: designTokens.colors.blue.main,
      incoming: designTokens.colors.grey[200],
      text: {
        outgoing: designTokens.colors.white,
        incoming: designTokens.colors.black
      }
    }
  },
  radius: {
    none: designTokens.radius.none,
    button: designTokens.radius.button,
    card: designTokens.radius.card
  },
  components: {
    RaImageField: {
      styleOverrides: {
        image: {
          width: '100%',
          margin: designTokens.radius.none,
          maxHeight: designTokens.sizes.maxImageHeight,
          objectFit: 'cover'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: designTokens.radius.button,
          padding: `${designTokens.spacing.small}px ${designTokens.spacing.medium}px`,
          minWidth: designTokens.sizes.minButtonWidth
        }
      }
    },
    MuiCard: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          marginBottom: designTokens.radius.none,
          borderRadius: designTokens.radius.none
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: designTokens.colors.grey[500]
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: designTokens.colors.grey[500],
          '&:hover': {
            backgroundColor: designTokens.colors.opacity.light
          }
        }
      }
    },
    RaLocalesMenuButton: {
      styleOverrides: {
        root: {
          '& .MuiButton-root': {
            color: designTokens.colors.white,
            borderColor: designTokens.colors.white,
            '&:hover': {
              borderColor: designTokens.colors.white,
              backgroundColor: designTokens.colors.opacity.hover
            }
          },
          '& .MuiSvgIcon-root': {
            color: designTokens.colors.white
          },
          '& .MuiSelect-select': {
            color: designTokens.colors.white
          },
          '& .MuiMenu-paper': {
            backgroundColor: designTokens.colors.brown.main,
            color: designTokens.colors.white
          },
          '& .MuiMenuItem-root': {
            color: designTokens.colors.white,
            '&:hover': {
              backgroundColor: designTokens.colors.opacity.hover
            }
          }
        }
      }
    }
  }
});

export default theme;
