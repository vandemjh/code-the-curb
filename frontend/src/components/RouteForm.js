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
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, ArrowRight, CircleArrowLeft, CircleArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { darkTheme } from '../util/theme';
import LocationPicker from './LocationPicker';

const buttonTexts = ['Find Parking', 'Next', 'Submit'];

const ParkingForm = () => {
  const [isOneWay, setIsOneWay] = useState(false);
  const [pickerOnePoint, setPickerOnePoint] = useState(null);
  const [pickerTwoPoint, setPickerTwoPoint] = useState(null);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleModeChange = (_, newMode) => {
    if (newMode !== null) {
      setIsOneWay(newMode === 'one-way');
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, buttonTexts.length - 1));
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
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

          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              {step === 0 && (
                <>
                  <Typography
                    variant="h4"
                    align="center"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
                      backgroundClip: 'text',
                      mb: 2,
                    }}
                  >
                    Arlipark
                  </Typography>
                  <Stack spacing={4}>
                    <ToggleButtonGroup
                      value={isOneWay ? 'one-way' : 'two-way'}
                      exclusive
                      onChange={handleModeChange}
                      fullWidth
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
                </>
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
              {step === 3 && <p>Submit your form!</p>}
            </motion.div>
          </AnimatePresence>

          <Box component="form" onSubmit={handleNext}>
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
              {step > 0 && (
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleBack}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    '&:hover': {
                      borderColor: '#2563eb',
                      color: '#2563eb',
                    },
                  }}
                  endIcon={<CircleArrowLeft size={20} />}
                >
                  Back
                </Button>
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </ThemeProvider>
  );
};

export default ParkingForm;
