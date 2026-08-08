// src/components/map/MapWrapper.jsx
import React from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { GoogleMap } from 'googlemaps-react-primitives';

const MapWrapper = ({ 
  children, 
  center, 
  zoom, 
  style, 
  onBoundsChanged,
  onZoomChanged,
  onClick,
  ...props 
}) => {
  const renderLoadingStatus = (status) => {
    switch (status) {
      case Status.LOADING:
        return <div className="map-loading">Loading map...</div>;
      case Status.FAILURE:
        return <div className="map-error">Failed to load map</div>;
      case Status.SUCCESS:
        return null;
    }
  };

  return (
    <Wrapper 
      apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      render={renderLoadingStatus}
      libraries={["geometry", "places"]}
    >
      <GoogleMap
        center={center}
        zoom={zoom}
        style={style || { width: '100%', height: '100%' }}
        onBoundsChanged={onBoundsChanged}
        onZoomChanged={onZoomChanged}
        onClick={onClick}
        {...props}
      >
        {children}
      </GoogleMap>
    </Wrapper>
  );
};

export default MapWrapper;