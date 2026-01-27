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
};

export const getVenueGallery = (venueName: string): any[] | null => {
  return venueGallery[venueName] || null;
};

export default venueGallery;
