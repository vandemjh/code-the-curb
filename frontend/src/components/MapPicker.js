import React, { useState, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
} from '@mui/material';
import { MapPin } from 'lucide-react';

const hw = {
  width: 3077,
  height: 2830,
}

const LocationPicker = ({
  topLeftBounds = { lat: 90, lng: -180 },
  bottomRightBounds = { lat: -90, lng: 180 },
}) => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [zoom, setZoom] = useState(0.2);
  const [imageDimensions, setImageDimensions] = useState({
    width: hw.width / 10,
    height: hw.height / 10,
  });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const lastMousePosition = useRef({ x: 0, y: 0 });

  const latRange = topLeftBounds.lat - bottomRightBounds.lat;
  const lngRange = bottomRightBounds.lng - topLeftBounds.lng;

  const pixelToCoordinates = (x, y) => {
    const lat =
      topLeftBounds.lat -
      ((y - offset.y) / (imageDimensions.height * zoom)) * latRange;
    const lng =
      topLeftBounds.lng +
      ((x - offset.x) / (imageDimensions.width * zoom)) * lngRange;
    return {
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
    };
  };

  const handleClick = (e) => {
    if (dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / zoom;
    const y = (e.clientY - rect.top - offset.y) / zoom;
    const coordinates = pixelToCoordinates(x, y);
    setSelectedPoint({ x, y, ...coordinates });
  };

  const handleZoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 0.2, 4));
  const handleZoomOut = () =>
    setZoom((prevZoom) => Math.max(prevZoom - 0.2, 0.2));

  const handleMouseDown = (e) => {
    setDragging(true);
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastMousePosition.current.x;
    const dy = e.clientY - lastMousePosition.current.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <Card sx={{ width: 'fit-content', padding: 2 }}>
      <pre>{JSON.stringify({ zoom, offset })}</pre>
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
        <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
          <Button variant="contained" onClick={handleZoomIn}>
            Zoom In
          </Button>
          <Button variant="contained" onClick={handleZoomOut}>
            Zoom Out
          </Button>
        </Stack>
        <Box
          sx={{
            position: 'relative',
            cursor: dragging ? 'grabbing' : 'grab',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
            width: imageDimensions.width,
            height: imageDimensions.height,
          }}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setDragging(false)}
        >
          <Box
            component="img"
            src="./map.png"
            sx={{
              position: 'absolute',
              transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${
                offset.y / zoom
              }px)`,
              transformOrigin: 'top left',
              pointerEvents: 'none',
            }}
          />
          {selectedPoint && (
            <Box
              sx={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                left: selectedPoint.x * zoom + offset.x,
                top: selectedPoint.y * zoom + offset.y,
              }}
            >
              <MapPin size={24} fill="red" />
            </Box>
          )}
        </Box>

        {selectedPoint && (
          <Box mt={2}>
            <Typography variant="subtitle1" fontWeight="medium">
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
  );
};

export default LocationPicker;
