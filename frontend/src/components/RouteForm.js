import {
  Box,
  Button,
  Paper,
  Stack,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { ArrowRight, ArrowLeftRight, CircleArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { darkTheme } from '../util/theme';
import LocationPicker from './LocationPicker';

const buttonTexts = ['Find Parking', 'Next', 'Next'];

const ParkingForm = () => {
  const [isOneWay, setIsOneWay] = useState(false);
  const [pickerOnePoint, setPickerOnePoint] = useState(null);
  const [pickerTwoPoint, setPickerTwoPoint] = useState(null);
  const [step, setStep] = useState(0);

  const handleModeChange = (_, newMode) => {
    if (newMode !== null) {
      setIsOneWay(newMode === 'one-way');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper
        elevation={24}
        sx={{
          mx: 'auto',
          p: 4,
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
        }}
      >
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
        {step === 0 && (
          <Stack spacing={4}>
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
                <ArrowRight size={18} style={{ marginRight: 8 }} />
                One way
              </ToggleButton>
              <ToggleButton value="two-way">
                <ArrowLeftRight size={18} style={{ marginRight: 8 }} />
                Two way
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        )}
        {step === 1 && (
          <LocationPicker
            selectedPoint={pickerOnePoint}
            setSelectedPoint={setPickerOnePoint}
          />
        )}
        {step === 2 && (
          <LocationPicker
            selectedPoint={pickerTwoPoint}
            setSelectedPoint={setPickerTwoPoint}
          />
        )}
        {step === 3 && <p>3</p>}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
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
              endIcon={<CircleArrowRight size={20} />}
            >
              {buttonTexts[step]}
            </Button>
            <div>
        <h3>Selected Points:</h3>
        <p>Picker 1: {JSON.stringify(pickerOnePoint)}</p>
        <p>Picker 2: {JSON.stringify(pickerTwoPoint)}</p>
      </div>
          </Stack>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default ParkingForm;
