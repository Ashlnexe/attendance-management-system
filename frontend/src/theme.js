import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e0e0e0', // Grey 300
      light: '#ffffff',
      dark: '#9e9e9e',
      contrastText: '#000000',
    },
    secondary: {
      main: '#34d399', // Emerald 400
      light: '#6ee7b7',
      dark: '#059669',
      contrastText: '#0f172a',
    },
    error: {
      main: '#fb7185', // Rose 400
      light: '#fca5a5',
      dark: '#e11d48',
    },
    warning: {
      main: '#fbbf24', // Amber 400
      light: '#fde68a',
      dark: '#d97706',
    },
    background: {
      default: '#000000', // Black
      paper: '#121212', // Dark Grey
    },
    text: {
      primary: '#ffffff',
      secondary: '#a6a6a6',
    },
    divider: '#2c2c2c',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          border: '1px solid #334155', // Slate 700 border
        },
      },
    },
  },
});

export default theme;
