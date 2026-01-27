// Venue logo images
export const venueLogos: Record<string, any> = {
  'Bebeach': require('../../Images/logo-bebeach.jpg'),
  'Drift': require('../../Images/logo-drift.png'),
  'Nikki Beach': require('../../Images/logo-nikkibeach.png'),
  'Nobu Beach': require('../../Images/logo-nobubeach.jpg'),
  'Surf Club': require('../../Images/logo-surfclub.jpg'),
  'Tattu Skypool': require('../../Images/logo-tattu.png'),
  'Verde Beach': require('../../Images/logo-verdebeach.png'),
};

export const getVenueLogo = (venueName: string): any | null => {
  return venueLogos[venueName] || null;
};

export default venueLogos;
