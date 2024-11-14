import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Box,
  ThemeProvider,
  createTheme,
  alpha,
} from '@mui/material';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';

// Create custom dark theme
const darkTheme = createTheme({
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

const ParkingForm = () => {
  const [isOneWay, setIsOneWay] = useState(false);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const handleModeChange = (_, newMode) => {
    if (newMode !== null) {
      setIsOneWay(newMode === 'one-way');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      type: isOneWay ? 'one-way' : 'two-way',
      from: fromLocation,
      to: toLocation,
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper
        elevation={24}
        sx={{
          maxWidth: 400,
          mx: 'auto',
          p: 4,
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
        }}
      >
        <Stack spacing={4}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Arlipark
          </Typography>

          <ToggleButtonGroup
            value={isOneWay ? 'one-way' : 'two-way'}
            exclusive
            onChange={handleModeChange}
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 500,
              },
            }}
          >
            <ToggleButton value="one-way">
              <Navigation size={18} style={{ marginRight: 8 }} />
              One way
            </ToggleButton>
            <ToggleButton value="two-way">
              <MapPin size={18} style={{ marginRight: 8 }} />
              Two way
            </ToggleButton>
          </ToggleButtonGroup>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {!isOneWay && (
                <TextField
                  fullWidth
                  placeholder="From location..."
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <MapPin
                        size={18}
                        style={{ marginRight: 8, opacity: 0.7 }}
                      />
                    ),
                  }}
                />
              )}
              <TextField
                fullWidth
                placeholder="To location..."
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Navigation
                      size={18}
                      style={{ marginRight: 8, opacity: 0.7 }}
                    />
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2563eb, #1d4ed8)',
                  },
                }}
                endIcon={<ArrowRight size={20} />}
              >
                Find Parking
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </ThemeProvider>
  );
};

export default ParkingForm;
