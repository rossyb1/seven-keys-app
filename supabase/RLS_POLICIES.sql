-- ============================================================================
-- ROW LEVEL SECURITY POLICIES FOR MISSING TABLES
-- Run this in Supabase SQL Editor IMMEDIATELY
-- ============================================================================

-- USERS TABLE RLS
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Service role can create users (handled by signup flow)
CREATE POLICY "Service role can create users"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- BOOKINGS TABLE RLS
-- ============================================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create bookings for themselves
CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own bookings (for cancellations)
CREATE POLICY "Users can delete own bookings"
  ON bookings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- VENUES TABLE RLS (Public read, admin write)
-- ============================================================================
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- Anyone (even unauthenticated) can view active venues
CREATE POLICY "Anyone can view active venues"
  ON venues FOR SELECT
  USING (status = 'active');

-- Only service role can insert/update/delete venues
-- (This is handled by admin panel or direct Supabase access)

-- ============================================================================
-- INVITE_CODES TABLE RLS
-- ============================================================================
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can check if an unused invite code exists (for validation)
CREATE POLICY "Anyone can validate unused codes"
  ON invite_codes FOR SELECT
  USING (status = 'unused');

-- Authenticated users can mark codes as used
CREATE POLICY "Authenticated users can mark codes used"
  ON invite_codes FOR UPDATE
  USING (
    auth.uid() IS NOT NULL 
    AND status = 'unused'
  );

-- ============================================================================
-- POINTS_TRANSACTIONS TABLE RLS
-- ============================================================================
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own point transactions
CREATE POLICY "Users can view own transactions"
  ON points_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can create point transactions
-- (Prevents users from giving themselves points)

-- ============================================================================
-- WAITLIST TABLE RLS
-- ============================================================================
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can submit to waitlist
CREATE POLICY "Anyone can join waitlist"
  ON waitlist FOR INSERT
  WITH CHECK (true);

-- Only admins can view waitlist (service role bypass)
CREATE POLICY "Users cannot view waitlist"
  ON waitlist FOR SELECT
  USING (false);

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- After running this, verify with:
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
