import {
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  Stack,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftRight,
  ArrowRight,
  CircleArrowLeft,
  CircleArrowRight,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { darkTheme } from '../util/theme';
import LocationPicker from './LocationPicker';
import TimePicker from './TimePicker';
import DayPicker from './DayPicker';
import {
  getApiData,
  getClosestBlockfaceId,
  predict,
} from '../service/predict.service';
import Chart from './Chart';

const buttonTexts = ['Start', 'Next', 'Next', 'Submit', 'Done!'];

const ParkingForm = () => {
  const [isOneWay, setIsOneWay] = useState(false);
  const [pickerFromPoint, setPickerFromPoint] = useState(null);
  const [pickerToPoint, setPickerToPoint] = useState(null);
  const [selectedFromTime, setSelectedFromTime] = useState(null);
  const [selectedToTime, setSelectedToTime] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [result, setResult] = useState(null);
  const [fromBlock, setFromBlock] = useState(null);
  const [toBlock, setToBlock] = useState(null);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleModeChange = (_, newMode) => {
    if (newMode !== null) {
      setIsOneWay(newMode === 'one-way');
    }
  };

  useEffect(() => {
    getApiData().then((d) => setApiData(d));
  }, []);

  const handleNext = (e) => {
    e.preventDefault();
    setDirection(1);
    if (buttonTexts[step] === 'Submit') {
      const fromBlock = getClosestBlockfaceId(
        apiData,
        pickerFromPoint.lat,
        pickerFromPoint.long,
      );
      setFromBlock(fromBlock);
      const toBlock = getClosestBlockfaceId(
        apiData,
        pickerToPoint.lat,
        pickerToPoint.long,
      );
      setToBlock(toBlock);

      const req = {
        isOneWay,
        fromBlock,
        toBlock,
        pickerFromPoint,
        pickerToPoint,
        selectedFromTime,
        selectedToTime,
        selectedDay,
      };

      console.log('req', req);

      Promise.all([
        predict({
          block_id: fromBlock,
          day: selectedDay,
        }),
        predict({
          block_id: toBlock,
          day: selectedDay,
        }),
      ])
        .then((i) => {
          const res = {
            from: i[0],
            to: i[1],
          };
          setResult(res);
        })
        .catch((e) => console.error(e));
    }
    const adder = isOneWay && step === 0 ? 2 : 1;
    setStep((prev) => prev + adder);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: '0%',
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  const imageVariants = {
    initial: {
      width: '10em',
      height: 'auto',
    },
    animate: {
      width: step > 0 ? '5em' : '10em',
      height: 'auto',
    },
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper
        elevation={24}
        sx={{
          mx: 'auto',
          p: 4,
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1em',
        }}
      >
        <motion.div
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          variants={imageVariants}
          initial="initial"
          animate="animate"
        >
          <img
            src="arlicon.png"
            alt="icon"
            className="arlicon"
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
        </motion.div>
        {step === 0 && (
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
        )}
        <Card sx={{ width: 'fit-content', padding: 2, borderRadius: '12' }}>
          <CardContent>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {step === 0 && (
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
                )}
                {step === 1 && (
                  <Stack
                    sx={{ display: 'flex', alignItems: 'center', gap: '1em' }}
                  >
                    <Typography variant="h5" align="center">
                      Coming from
                    </Typography>
                    <LocationPicker
                      selectedPoint={pickerFromPoint}
                      setSelectedPoint={setPickerFromPoint}
                    />
                    <TimePicker onTimeChange={setSelectedFromTime} />
                  </Stack>
                )}
                {step === 2 && (
                  <Stack
                    sx={{ display: 'flex', alignItems: 'center', gap: '1em' }}
                  >
                    <Typography variant="h5" align="center">
                      Going to
                    </Typography>
                    <LocationPicker
                      selectedPoint={pickerToPoint}
                      setSelectedPoint={setPickerToPoint}
                    />
                    <TimePicker onTimeChange={setSelectedToTime} />
                  </Stack>
                )}
                {step === 3 && (
                  <Stack
                    sx={{ display: 'flex', alignItems: 'center', gap: '1em' }}
                  >
                    <Typography variant="h5" align="center">
                      On what day?
                    </Typography>
                    <DayPicker onDayChange={setSelectedDay} />
                  </Stack>
                )}
                {step === 4 && (
                  <Stack
                    sx={{ display: 'flex', alignItems: 'center', gap: '1em' }}
                  >
                    <Typography variant="h5" align="center">
                      Results from {fromBlock} at {selectedFromTime} to{' '}
                      {toBlock} at {selectedToTime}
                    </Typography>

                    <Chart fromData={result?.from} toData={result?.to} />
                  </Stack>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
        <Box
          component="form"
          onSubmit={handleNext}
          sx={{
            width: '20em',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5em',
          }}
        >
          {step < buttonTexts.length - 1 && (
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
          )}
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
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default ParkingForm;
