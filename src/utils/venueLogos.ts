// Venue logo images
export const venueLogos: Record<string, any> = {
  'Bebeach': require('../../Images/logo-bebeach.jpg'),
  // Add more venue logos here
};

export const getVenueLogo = (venueName: string): any | null => {
  return venueLogos[venueName] || null;
};

export default venueLogos;
