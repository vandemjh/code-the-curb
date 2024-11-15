import {
  ThemeProvider
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { MapPin } from 'lucide-react';
import React, { useState } from 'react';
import { darkTheme } from '../util/theme';

const bounds = {
  topLeft: { lat: 38.934819, lng: -77.174734 },
  bottomRight: { lat: 38.825924, lng: -77.031768 },
};

const dims = {
  width: 3077,
  height: 2830
}

const LocationPicker = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const mapWidth = dims.width / 10;
  const mapHeight = dims.height / 10;

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

  const coordinatesToPixel = (lat, lng) => {
    const latRange = bounds.topLeft.lat - bounds.bottomRight.lat;
    const lngRange = bounds.bottomRight.lng - bounds.topLeft.lng;

    const y = ((bounds.topLeft.lat - lat) / latRange) * mapHeight;
    const x = ((lng - bounds.topLeft.lng) / lngRange) * mapWidth;

    return { x, y };
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
      <Card sx={{ width: 'fit-content', padding: 2 }}>
        <Typography variant="h6" component="div" sx={{ marginBottom: 1 }}>
          Location Picker
        </Typography>
        <CardContent>
          <Box
            sx={{
              position: 'relative',
              cursor: 'crosshair',
              border: '1px solid',
              borderColor: 'grey.300',
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
              onLoad={(e) => console.log({w: e.width, h: e.height})}
              alt="Map"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {selectedPoint && (
              <IconButton
                sx={{
                  position: 'absolute',
                  left: selectedPoint.x,
                  top: selectedPoint.y,
                  transform: 'translate(-50%, -50%)',
                  color: 'red',
                }}
              >
                <MapPin size={24} fill="red" color="black" />
              </IconButton>
            )}
          </Box>

          {selectedPoint && (
            <Box sx={{ marginTop: 2, fontSize: '0.875rem' }}>
              <Typography variant="body2" fontWeight="bold">
                Selected Location:
              </Typography>
              <Typography variant="body2">
                Latitude: {selectedPoint.lat}°
              </Typography>
              <Typography variant="body2">
                Longitude: {selectedPoint.lng}°
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default LocationPicker;
