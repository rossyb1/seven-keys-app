// Seven Keys Database TypeScript Types

export type User = {
  id: string;
  email: string;
  phone: string | null;
  full_name: string;
  photo_url: string | null;
  tier: 'blue' | 'silver' | 'gold' | 'black';
  points_balance: number;
  preferred_cities: string[];
  invite_code_used: string | null;
  created_at: string;
};

export type Venue = {
  id: string;
  name: string;
  city: string;
  type: 'restaurant' | 'beach_club' | 'nightclub' | 'event';
  vibe_tags: string[];
  description: string | null;
  photos: string[];
  location: string | null;
  location_url: string | null;
  operating_hours: Record<string, string> | null;
  requires_deposit: boolean;
  minimum_spend: number | null;
  family_friendly: boolean;
  whatsapp_contact: string | null;
  contact_name: string | null;
  status: 'active' | 'paused';
};

export type Booking = {
  id: string;
  user_id: string;
  venue_id: string;
  status: 'draft' | 'pending' | 'counter_offer' | 'awaiting_info' | 'confirmed' | 'deposit_pending' | 'deposit_confirmed' | 'modified' | 'completed' | 'no_show' | 'cancelled' | 'rejected' | 'escalated';
  booking_date: string;
  booking_time: string;
  party_size: number;
  table_preference: string | null;
  special_requests: string | null;
  deposit_required: boolean;
  deposit_confirmed: boolean;
  minimum_spend: number | null;
  final_spend: number | null;
  points_earned: number;
  no_show: boolean;
  is_urgent: boolean;
  created_at: string;
  confirmed_at: string | null;
};

export type InviteCode = {
  id: string;
  code: string;
  status: 'unused' | 'used';
  created_at: string;
};

export type WaitlistEntry = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  instagram_handle: string | null;
  cities: string[];
  source: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};
