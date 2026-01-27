const venueImages: Record<string, any> = {
  'Ling Ling': require('../../Images/lingling.png'),
  'Carbone': require('../../Images/carbone.png'),
  'Zuma': require('../../Images/lingling.png'), // use placeholder for now
  'Nikki Beach': require('../../Images/nikkibeach-1.jpg'),
  'Hakkasan': require('../../Images/hakkasan.png'),
  'Nobu Beach': require('../../Images/nobubeach-1.png'),
  'Drift': require('../../Images/drift-1.jpg'),
  'Surf Club': require('../../Images/surfclub-1.jpg'),
  'Tattu Skypool': require('../../Images/tattu-1.webp'),
  'Tattu Restaurant': require('../../Images/tattu-rest.png'),
  'Verde Beach': require('../../Images/verdebeach-1.jpg'),
  'Verde Dubai': require('../../Images/verde-dubai.png'),
  'Gal': require('../../Images/gal.png'),
  'Urla': require('../../Images/urla.png'),
  'Hobu': require('../../Images/nobu.png'), // using nobu.png as placeholder since hobu.png doesn't exist
  'Bebeach': require('../../Images/bebeach-1.webp'),
  'Gigi Rigolatto': require('../../Images/Gigi-Rigolatto.png'),
};

export const getVenueImage = (venueName: string) => {
  return venueImages[venueName] || null;
};

export default venueImages;
