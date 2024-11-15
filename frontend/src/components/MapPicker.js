import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, Box } from '@mui/material';
import { MapPin } from 'lucide-react';

const LocationPicker = ({ 
  topLeftBounds = { lat: 90, lng: -180 },
  bottomRightBounds = { lat: -90, lng: 180 }
}) => {
  const [selectedPoint, setSelectedPoint] = useState(null);

  const mapWidth = 300;
  const mapHeight = 200;
  const latRange = topLeftBounds.lat - bottomRightBounds.lat;
  const lngRange = bottomRightBounds.lng - topLeftBounds.lng;

  const pixelToCoordinates = (x, y) => {
    const lat = topLeftBounds.lat - (y / mapHeight * latRange);
    const lng = topLeftBounds.lng + (x / mapWidth * lngRange);
    return {
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6))
    };
  };

  const coordinatesToPixel = (lat, lng) => {
    const x = ((lng - topLeftBounds.lng) / lngRange) * mapWidth;
    const y = ((topLeftBounds.lat - lat) / latRange) * mapHeight;
    return { x, y };
  };

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const coordinates = pixelToCoordinates(x, y);
    setSelectedPoint({ x, y, ...coordinates });
  };


  return (
    <Card sx={{ width: 'fit-content', padding: 2 }}>
      <CardHeader
        title={<Typography variant="h6">Location Picker</Typography>}
        subheader={
          <Typography variant="body2" color="textSecondary">
            Coverage: {topLeftBounds.lat}°N to {bottomRightBounds.lat}°N,{' '}
            {topLeftBounds.lng}°E to {bottomRightBounds.lng}°E
          </Typography>
        }
      />
      <CardContent>
        <Box
          sx={{
            position: 'relative',
            cursor: 'crosshair',
            border: '1px solid #e0e0e0',
            backgroundColor: '#f5f5f5',
            width: mapWidth,
            height: mapHeight
          }}
          onClick={handleClick}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundImage: 'url(./map.png)',
              backgroundSize: 'cover',
            }}
          />
          {selectedPoint && (
            <Box
              sx={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                left: selectedPoint.x,
                top: selectedPoint.y
              }}
            >
              <MapPin color="red" size={24} />
            </Box>
          )}
        </Box>

        {selectedPoint && (
          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight="medium">Selected Location:</Typography>
            <Typography variant="body2">Latitude: {selectedPoint.lat}°</Typography>
            <Typography variant="body2">Longitude: {selectedPoint.lng}°</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationPicker;
