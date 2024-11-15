import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { ArrowRight, MapPin, Navigation } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { darkTheme } from '../util/theme';

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
          <Stack spacing={4} sx={{ alignItems: 'center' }}>
            <img src="arlicon.png" alt="icon" className="arlicon" />
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
          </Stack>

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

          <AnimatePresence mode="popLayout">
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                {!isOneWay && (
                  <motion.div
                    key="fromLocation"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <TextField
                      fullWidth
                      placeholder="From location..."
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                      variant="outlined"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <MapPin
                              size={18}
                              style={{ marginRight: 8, opacity: 0.7 }}
                            />
                          ),
                        },
                      }}
                    />
                  </motion.div>
                )}

                <motion.div
                  layout
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <TextField
                    key="toLocation"
                    fullWidth
                    placeholder="To location..."
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    variant="outlined"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <Navigation
                            size={18}
                            style={{ marginRight: 8, opacity: 0.7 }}
                          />
                        ),
                      },
                    }}
                  />
                  <Button
                    fullWidth
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
                </motion.div>
              </Stack>
            </Box>
          </AnimatePresence>
        </Stack>
      </Paper>
    </ThemeProvider>
  );
};

export default ParkingForm;
