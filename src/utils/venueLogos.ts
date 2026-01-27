// Venue logo images
export const venueLogos: Record<string, any> = {
  'Bebeach': require('../../Images/logo-bebeach.jpg'),
  'Drift': require('../../Images/logo-drift.png'),
  'Nikki Beach': require('../../Images/logo-nikkibeach.png'),
  'Nobu Beach': require('../../Images/logo-nobubeach.png'),
};

export const getVenueLogo = (venueName: string): any | null => {
  return venueLogos[venueName] || null;
};

export default venueLogos;
