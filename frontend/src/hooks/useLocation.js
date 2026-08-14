import { useState, useEffect } from 'react';
import locationService from '../services/location/locationService';

export const useLocation = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    locationService.getCurrentLocation().then(setLocation);
  }, []);

  return location;
};

export default useLocation;
