import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const EventMap = ({ events, center }) => {
  const [selected, setSelected] = useState(null);
  const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={{ height: '400px', width: '100%' }}
                 center={center || { lat: 20.5937, lng: 78.9629 }} zoom={5}>
        {events.map(event => (
          <Marker key={event.id}
                  position={{ lat: event.latitude, lng: event.longitude }}
                  onClick={() => setSelected(event)} />
        ))}
        {selected && (
          <InfoWindow position={{ lat: selected.latitude, lng: selected.longitude }}
                      onCloseClick={() => setSelected(null)}>
            <div>
              <h3>{selected.title}</h3>
              <p>{selected.location}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};