// Venue image mapping - React Native requires static imports
export const venueImages: Record<string, any> = {
  // Restaurants
  'ling-ling': require('../Images/lingling.png'),
  'nobu': require('../Images/nobu.png'),
  'hakkasan': require('../Images/hakkasan.png'),
  'gigi-rigolatto': require('../Images/Gigi-Rigolatto.png'),
  'urla': require('../Images/urla.png'),
  'gal': require('../Images/gal.png'),
  'coucou': require('../Images/gal.png'), // Use gal as placeholder if no coucou image
  'verde-four-seasons': require('../Images/verde-dubai.png'),
  'carbone': require('../Images/carbone.png'),
  'tattu': require('../Images/tattu-rest.png'),
  
  // Beach Clubs
  'verde-beach': require('../Images/verdebeach.png'),
  'nobu-beach': require('../Images/nobubeach-1.jpg'),
  'be-beach': require('../Images/bebeach-1.webp'),
  'surfclub': require('../Images/surfclub-1.jpg'),
  'drift': require('../Images/drift-1.jpg'),
  'tattu-skypool': require('../Images/tattu-skypool.png'),
};

export const getVenueImage = (venueId: string): any => {
  return venueImages[venueId] || null;
};
