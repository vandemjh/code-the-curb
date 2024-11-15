import { ThemeProvider } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { MapPin } from 'lucide-react';
import React, { useState } from 'react';
import { darkTheme } from '../util/theme';

const bounds = {
  topLeft: { lat: 38.934819, lng: -77.174734 },
  bottomRight: { lat: 38.825924, lng: -77.031768 },
};

const dims = {
  width: 3077,
  height: 2830,
};

const scale = 5;

const LocationPicker = ({ selectedPoint, setSelectedPoint }) => {
  const [isDragging, setIsDragging] = useState(false);

  const mapWidth = dims.width / scale;
  const mapHeight = dims.height / scale;

  const pixelToCoordinates = (x, y) => {
    const latRange = bounds.topLeft.lat - bounds.bottomRight.lat;
    const lngRange = bounds.bottomRight.lng - bounds.topLeft.lng;

    const lat = bounds.topLeft.lat - (y / mapHeight) * latRange;
    const lng = bounds.topLeft.lng + (x / mapWidth) * lngRange;

    return {
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
    };
  };

  const handleClick = (e) => {
    if (isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const coordinates = pixelToCoordinates(x, y);
    setSelectedPoint({ x, y, ...coordinates });
  };

  const handleMouseDown = () => {
    setIsDragging(false);
  };

  const handleMouseMove = () => {
    setIsDragging(true);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          position: 'relative',
          cursor: 'crosshair',
          overflow: 'hidden',
          width: mapWidth,
          height: mapHeight,
        }}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <img
          src="map.png"
          alt="Map"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {selectedPoint && (
          <IconButton
            sx={{
              position: 'absolute',
              left: selectedPoint.x,
              top: selectedPoint.y,
              transform: 'translate(-53%, -80%)',
              color: 'red',
            }}
          >
            <MapPin size={24} fill="red" color="black" />
          </IconButton>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default LocationPicker;
