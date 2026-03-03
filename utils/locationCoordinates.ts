export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address: string;
}

const LOCATION_MAP: Record<string, LocationCoordinates> = {
  'Golden Farms Ltd': {
    latitude: 6.5244,
    longitude: 3.3792,
    address: '123 Palm Oil Street, Ikeja, Lagos, Nigeria',
  },
  'Mama Grace': {
    latitude: 6.335,
    longitude: 5.6037,
    address: '45 Market Road, Benin City, Edo State, Nigeria',
  },
  'Green Valley Farms': {
    latitude: 7.3775,
    longitude: 3.947,
    address: '78 Farm Estate, Ibadan, Oyo State, Nigeria',
  },
  'Niger Delta Oils': {
    latitude: 4.8156,
    longitude: 7.0498,
    address: '12 Industrial Layout, Port Harcourt, Rivers State, Nigeria',
  },
  'Premium Oils Co': {
    latitude: 9.0765,
    longitude: 7.3986,
    address: '56 Business District, Abuja, FCT, Nigeria',
  },
};

const DEFAULT_LOCATION: LocationCoordinates = {
  latitude: 6.5244,
  longitude: 3.3792,
  address: 'Location not available',
};

export function getLocationCoordinates(sellerName: string, address: string): LocationCoordinates {
  return (
    LOCATION_MAP[sellerName] || {
      ...DEFAULT_LOCATION,
      address: address || DEFAULT_LOCATION.address,
    }
  );
}
