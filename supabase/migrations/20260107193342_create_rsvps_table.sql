-- Create RSVPs table for wedding website
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  -- Guest information
  name TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Attendance
  attending TEXT NOT NULL CHECK (attending IN ('ano', 'ne')),

  -- Plus one
  plus_one BOOLEAN DEFAULT FALSE NOT NULL,
  plus_one_name TEXT,

  -- Meal preferences (only if attending)
  meal_preference TEXT CHECK (meal_preference IN ('maso', 'ryba', 'vegetarian', 'vegan')),

  -- Additional information
  dietary_restrictions TEXT,
  message TEXT,

  -- Constraints
  CONSTRAINT plus_one_name_required_if_plus_one CHECK (
    (plus_one = FALSE) OR (plus_one = TRUE AND plus_one_name IS NOT NULL AND plus_one_name != '')
  ),
  CONSTRAINT meal_required_if_attending CHECK (
    (attending = 'ne') OR (attending = 'ano' AND meal_preference IS NOT NULL)
  )
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps(attending);

-- Add comments for documentation
COMMENT ON TABLE rsvps IS 'Wedding RSVP submissions from guests';
COMMENT ON COLUMN rsvps.attending IS 'Guest attendance: ano (yes) or ne (no)';
COMMENT ON COLUMN rsvps.meal_preference IS 'Meal choice: maso (meat), ryba (fish), vegetarian, vegan';