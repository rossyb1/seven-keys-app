import { getVenueImage } from './venueImages';

export interface Venue {
  id: string;
  name: string;
  type: 'Restaurant' | 'Beach Club' | 'Nightclub' | 'Event';
  location: string;
  description: string;
  vibes: string[];
  familyFriendly: boolean;
  minSpendWeekday: number;
  minSpendWeekend: number;
  hours: string;
  image?: any;
}

export const VENUES: Venue[] = [
  // RESTAURANTS
  {
    id: 'ling-ling',
    name: 'Ling Ling',
    type: 'Restaurant',
    location: 'DIFC',
    description: 'Contemporary Asian dining experience with stunning city views. Known for innovative cocktails and vibrant atmosphere.',
    vibes: ['Upscale', 'Date Night', 'Business'],
    familyFriendly: true,
    minSpendWeekday: 800,
    minSpendWeekend: 1200,
    hours: '6:00 PM - 2:00 AM',
    image: getVenueImage('ling-ling'),
  },
  {
    id: 'nobu',
    name: 'Nobu',
    type: 'Restaurant',
    location: 'Atlantis',
    description: 'World-renowned Japanese restaurant by Chef Nobu Matsuhisa. Exceptional sushi and signature black cod miso.',
    vibes: ['Upscale', 'Date Night', 'Celebration'],
    familyFriendly: true,
    minSpendWeekday: 1000,
    minSpendWeekend: 1500,
    hours: '7:00 PM - 11:30 PM',
    image: getVenueImage('nobu'),
  },
  {
    id: 'hakkasan',
    name: 'Hakkasan',
    type: 'Restaurant',
    location: 'Atlantis The Palm, Crescent Rd, Dubai',
    description: 'Michelin-starred Cantonese cuisine in an elegant setting. Modern Chinese dining with traditional techniques.',
    vibes: ['Upscale', 'Date Night', 'Business'],
    familyFriendly: true,
    minSpendWeekday: 900,
    minSpendWeekend: 1400,
    hours: '6:00 PM - 11:00 PM',
    image: getVenueImage('hakkasan'),
  },
  {
    id: 'gigi-rigolatto',
    name: 'Gigi Rigolatto',
    type: 'Restaurant',
    location: 'Dubai Mall',
    description: 'Authentic Italian trattoria with wood-fired pizzas and handmade pasta. Casual yet sophisticated atmosphere.',
    vibes: ['Relaxed', 'Family', 'Date Night'],
    familyFriendly: true,
    minSpendWeekday: 600,
    minSpendWeekend: 900,
    hours: '12:00 PM - 11:00 PM',
    image: getVenueImage('gigi-rigolatto'),
  },
  {
    id: 'urla',
    name: 'Urla',
    type: 'Restaurant',
    location: 'City Walk',
    description: 'Modern Turkish cuisine with a contemporary twist. Beautiful terrace dining and exceptional mezze selection.',
    vibes: ['Relaxed', 'Date Night', 'Family'],
    familyFriendly: true,
    minSpendWeekday: 700,
    minSpendWeekend: 1000,
    hours: '12:00 PM - 12:00 AM',
    image: getVenueImage('urla'),
  },
  {
    id: 'gal',
    name: 'Gal',
    type: 'Restaurant',
    location: 'DIFC',
    description: 'Mediterranean flavors with a modern approach. Fresh seafood, grilled meats, and an extensive wine selection.',
    vibes: ['Upscale', 'Date Night', 'Business'],
    familyFriendly: true,
    minSpendWeekday: 850,
    minSpendWeekend: 1300,
    hours: '6:00 PM - 1:00 AM',
    image: getVenueImage('gal'),
  },
  {
    id: 'coucou',
    name: 'Coucou',
    type: 'Restaurant',
    location: 'DIFC',
    description: 'French bistro with classic Parisian charm. Authentic French cuisine and an impressive wine cellar.',
    vibes: ['Upscale', 'Date Night', 'Romantic'],
    familyFriendly: true,
    minSpendWeekday: 750,
    minSpendWeekend: 1100,
    hours: '6:00 PM - 12:00 AM',
    image: getVenueImage('coucou'),
  },
  {
    id: 'verde-four-seasons',
    name: 'Verde Four Seasons',
    type: 'Restaurant',
    location: 'Four Seasons',
    description: 'Refined Italian dining with panoramic views. Handcrafted pasta and premium ingredients in an elegant setting.',
    vibes: ['Upscale', 'Date Night', 'Celebration'],
    familyFriendly: true,
    minSpendWeekday: 950,
    minSpendWeekend: 1450,
    hours: '7:00 PM - 11:30 PM',
    image: getVenueImage('verde-four-seasons'),
  },
  {
    id: 'carbone',
    name: 'Carbone',
    type: 'Restaurant',
    location: 'DIFC',
    description: 'New York-style Italian-American dining. Bold flavors, retro ambiance, and tableside service.',
    vibes: ['Upscale', 'Party', 'Celebration'],
    familyFriendly: true,
    minSpendWeekday: 1000,
    minSpendWeekend: 1500,
    hours: '6:00 PM - 1:00 AM',
    image: getVenueImage('carbone'),
  },
  {
    id: 'tattu',
    name: 'Tattu',
    type: 'Restaurant',
    location: 'DIFC',
    description: 'Modern Chinese restaurant with theatrical presentation. Contemporary design meets traditional flavors.',
    vibes: ['Upscale', 'Date Night', 'Celebration'],
    familyFriendly: true,
    minSpendWeekday: 900,
    minSpendWeekend: 1400,
    hours: '6:00 PM - 12:00 AM',
    image: getVenueImage('tattu'),
  },
  // BEACH CLUBS
  {
    id: 'verde-beach',
    name: 'Verde Beach',
    type: 'Beach Club',
    location: 'Four Seasons',
    description: 'Exclusive beachfront experience with infinity pool and Mediterranean cuisine. Perfect for day-to-night transitions.',
    vibes: ['Relaxed', 'Party', 'Family'],
    familyFriendly: true,
    minSpendWeekday: 1200,
    minSpendWeekend: 2000,
    hours: '10:00 AM - 12:00 AM',
    image: getVenueImage('verde-beach'),
  },
  {
    id: 'nobu-beach',
    name: 'Nobu by the Beach',
    type: 'Beach Club',
    location: 'Atlantis',
    description: 'Beachside dining with Nobu\'s signature Japanese-Peruvian fusion. Stunning ocean views and pool access.',
    vibes: ['Upscale', 'Relaxed', 'Date Night'],
    familyFriendly: true,
    minSpendWeekday: 1500,
    minSpendWeekend: 2500,
    hours: '11:00 AM - 11:00 PM',
    image: getVenueImage('nobu-beach'),
  },
  {
    id: 'be-beach',
    name: 'Be Beach',
    type: 'Beach Club',
    location: 'W Dubai',
    description: 'Vibrant beach club with DJ sets and pool parties. Mediterranean-inspired menu and premium cocktails.',
    vibes: ['Party', 'Relaxed', 'Celebration'],
    familyFriendly: false,
    minSpendWeekday: 1000,
    minSpendWeekend: 1800,
    hours: '11:00 AM - 1:00 AM',
    image: getVenueImage('be-beach'),
  },
  {
    id: 'surfclub',
    name: 'Surfclub',
    type: 'Beach Club',
    location: 'Palm Jumeirah',
    description: 'Laid-back beach vibes with surf-inspired design. Fresh seafood, craft cocktails, and live music.',
    vibes: ['Relaxed', 'Family', 'Date Night'],
    familyFriendly: true,
    minSpendWeekday: 800,
    minSpendWeekend: 1400,
    hours: '10:00 AM - 11:00 PM',
    image: getVenueImage('surfclub'),
  },
  {
    id: 'drift',
    name: 'Drift',
    type: 'Beach Club',
    location: 'One&Only',
    description: 'Luxury beachfront destination with private cabanas. Sophisticated dining and sunset views.',
    vibes: ['Upscale', 'Relaxed', 'Date Night'],
    familyFriendly: true,
    minSpendWeekday: 1800,
    minSpendWeekend: 3000,
    hours: '10:00 AM - 12:00 AM',
    image: getVenueImage('drift'),
  },
  {
    id: 'tattu-skypool',
    name: 'Tattu Skypool',
    type: 'Beach Club',
    location: 'DIFC',
    description: 'Rooftop pool and lounge with Asian-inspired cuisine. Stunning city skyline views and vibrant atmosphere.',
    vibes: ['Party', 'Upscale', 'Celebration'],
    familyFriendly: false,
    minSpendWeekday: 1200,
    minSpendWeekend: 2000,
    hours: '12:00 PM - 2:00 AM',
    image: getVenueImage('tattu-skypool'),
  },
];

// Helper functions
export function getVenuesByType(type: Venue['type']): Venue[] {
  return VENUES.filter(venue => venue.type === type);
}

export function getVenueById(id: string): Venue | undefined {
  return VENUES.find(venue => venue.id === id);
}

export function getAllVenues(): Venue[] {
  return VENUES;
}

export function getVenuesByLocation(location: string): Venue[] {
  return VENUES.filter(venue => venue.location === location);
}

export function searchVenues(query: string): Venue[] {
  const lowerQuery = query.toLowerCase();
  return VENUES.filter(venue =>
    venue.name.toLowerCase().includes(lowerQuery) ||
    venue.location.toLowerCase().includes(lowerQuery) ||
    venue.type.toLowerCase().includes(lowerQuery) ||
    venue.vibes.some(vibe => vibe.toLowerCase().includes(lowerQuery))
  );
}
