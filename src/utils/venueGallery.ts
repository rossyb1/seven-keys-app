// Venue gallery images - multiple images per venue for swipeable hero
export const venueGallery: Record<string, any[]> = {
  'Bebeach': [
    require('../../Images/bebeach-1.webp'),
    require('../../Images/bebeach-2.webp'),
    require('../../Images/bebeach-3.webp'),
    require('../../Images/bebeach-4.webp'),
  ],
  'Drift': [
    require('../../Images/drift-1.jpg'),
    require('../../Images/drift-2.webp'),
    require('../../Images/drift-3.jpg'),
  ],
  'Nikki Beach': [
    require('../../Images/nikkibeach-1.jpg'),
    require('../../Images/nikkibeach-2.jpg'),
    require('../../Images/nikkibeach-3.jpg'),
    require('../../Images/nikkibeach-4.jpg'),
  ],
  'Nobu Beach': [
    require('../../Images/nobubeach-1.png'),
    require('../../Images/nobubeach-2.jpg'),
    require('../../Images/nobubeach-3.jpg'),
    require('../../Images/nobubeach-4.webp'),
    require('../../Images/nobubeach-5.jpg'),
  ],
  'Surf Club': [
    require('../../Images/surfclub-4.jpg'),
    require('../../Images/surfclub-1.jpg'),
    require('../../Images/surfclub-2.jpg'),
    require('../../Images/surfclub-3.jpg'),
  ],
  'Tattu Skypool': [
    require('../../Images/tattu-3.jpg'),
    require('../../Images/tattu-1.webp'),
    require('../../Images/tattu-2.webp'),
    require('../../Images/tattu-4.jpg'),
  ],
  'Verde Beach': [
    require('../../Images/verdebeach-1.jpg'),
    require('../../Images/verdebeach-2.jpg'),
    require('../../Images/verdebeach-3.jpg'),
    require('../../Images/verdebeach-4.jpg'),
  ],
  'Carbone': [
    require('../../Images/carbone-gallery-1.jpg'),
    require('../../Images/carbone-gallery-2.jpg'),
    require('../../Images/carbone-gallery-3.jpg'),
    require('../../Images/carbone-gallery-4.jpg'),
  ],
};

export const getVenueGallery = (venueName: string): any[] | null => {
  return venueGallery[venueName] || null;
};

export default venueGallery;
