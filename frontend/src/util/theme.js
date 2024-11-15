import { createTheme, alpha } from '@mui/material';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      paper: '#1e293b',
      default: '#0f172a',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: alpha('#1e293b', 0.4),
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#3b82f6',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#2563eb',
            },
          },
        },
      },
    },
  },
});
