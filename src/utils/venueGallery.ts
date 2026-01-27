// Venue gallery images - multiple images per venue for swipeable hero
export const venueGallery: Record<string, any[]> = {
  'Bebeach': [
    require('../../Images/bebeach-1.webp'),
    require('../../Images/bebeach-2.webp'),
    require('../../Images/bebeach-3.webp'),
    require('../../Images/bebeach-4.webp'),
  ],
  // Add more venues with galleries here
};

export const getVenueGallery = (venueName: string): any[] | null => {
  return venueGallery[venueName] || null;
};

export default venueGallery;
