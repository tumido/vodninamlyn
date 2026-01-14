-- Create RSVP table for wedding guest responses
-- Each guest gets their own row with duplicated form data.
-- Additional guests reference the primary submission via primary_rsvp_id.
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Guest information
  name TEXT NOT NULL CHECK (LENGTH(name) >= 2),

  -- Reference to primary submission (NULL for primary guest, UUID for additional guests)
  primary_rsvp_id UUID REFERENCES public.rsvps(id) ON DELETE CASCADE,

  -- Attendance
  attending TEXT NOT NULL CHECK (attending IN ('yes', 'no')),

  -- Accommodation (required if attending = 'yes')
  accommodation TEXT CHECK (
    accommodation IS NULL OR
    accommodation IN ('roof', 'own-tent', 'no-sleep')
  ),

  -- Drink preferences (required if attending = 'yes')
  drink_choice TEXT CHECK (
    drink_choice IS NULL OR
    drink_choice IN ('pivo', 'vino', 'nealko', 'other')
  ),

  -- Custom drink specification (required if drink_choice = 'other')
  custom_drink TEXT CHECK (
    custom_drink IS NULL OR
    (LENGTH(custom_drink) > 0 AND LENGTH(custom_drink) <= 100)
  ),

  -- Dietary restrictions (optional)
  dietary_restrictions TEXT CHECK (
    dietary_restrictions IS NULL OR
    LENGTH(dietary_restrictions) <= 500
  ),

  -- General message (optional)
  message TEXT CHECK (
    message IS NULL OR
    LENGTH(message) <= 1000
  ),

  -- Ensure accommodation and drink_choice are filled when attending = 'yes'
  CONSTRAINT attending_fields_required CHECK (
    attending = 'no' OR
    (attending = 'yes' AND accommodation IS NOT NULL AND drink_choice IS NOT NULL)
  ),

  -- Ensure custom_drink is filled when drink_choice = 'other'
  CONSTRAINT custom_drink_required CHECK (
    drink_choice != 'other' OR
    (drink_choice = 'other' AND custom_drink IS NOT NULL AND LENGTH(TRIM(custom_drink)) > 0)
  )
);

-- Create index on created_at for sorting
CREATE INDEX idx_rsvps_created_at ON public.rsvps (created_at DESC);

-- Create index on attending for filtering
CREATE INDEX idx_rsvps_attending ON public.rsvps (attending) WHERE attending IS NOT NULL;

-- Create index on primary_rsvp_id for efficient lookups of guest groups
CREATE INDEX idx_rsvps_primary_id ON public.rsvps (primary_rsvp_id) WHERE primary_rsvp_id IS NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (submit RSVP)
CREATE POLICY "Allow public RSVP submissions"
  ON public.rsvps
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy to allow only authenticated users to view RSVPs
-- (You can adjust this based on your authentication setup)
CREATE POLICY "Allow authenticated users to view RSVPs"
  ON public.rsvps
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete RSVPs
CREATE POLICY "Allow authenticated users to delete RSVPs"
  ON public.rsvps
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to update RSVPs
CREATE POLICY "Allow authenticated users to update RSVPs"
  ON public.rsvps
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.rsvps
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create a view to show each attendee as a separate row
-- Primary attendees and additional guests all get their own row,
-- with all attributes now stored directly on each record
CREATE VIEW public.rsvp_submissions
WITH (security_invoker = true)
AS
SELECT
  r.id AS attendee_id,
  r.name AS attendee_name,
  r.created_at,
  COALESCE(r.primary_rsvp_id, r.id) AS primary_rsvp_id,
  p.name AS primary_name,
  r.attending,
  r.accommodation,
  r.drink_choice AS "drinkChoice",
  r.custom_drink AS "customDrink",
  r.dietary_restrictions AS "dietaryRestrictions",
  r.message,
  (r.primary_rsvp_id IS NULL) AS is_primary
FROM public.rsvps r
LEFT JOIN public.rsvps p ON p.id = COALESCE(r.primary_rsvp_id, r.id)
WHERE p.primary_rsvp_id IS NULL
ORDER BY
  COALESCE(r.primary_rsvp_id, r.id) DESC,  -- Group by primary RSVP
  (r.primary_rsvp_id IS NULL) DESC,        -- Primary guest first within each group
  r.created_at ASC;                        -- Then by creation time within group

-- Create function to submit RSVP with multiple names
-- This function takes the form data and creates one row per name,
-- with the first name being the primary record and others referencing it.
-- All rows contain the same form data (attending, accommodation, preferences, etc.)
CREATE OR REPLACE FUNCTION public.submit_rsvp(
  names TEXT[],
  attending TEXT,
  accommodation TEXT DEFAULT NULL,
  "drinkChoice" TEXT DEFAULT NULL,
  "customDrink" TEXT DEFAULT NULL,
  "dietaryRestrictions" TEXT DEFAULT NULL,
  message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_primary_id UUID;
  v_name TEXT;
BEGIN
  -- Validate that we have at least one name
  IF array_length(names, 1) IS NULL OR array_length(names, 1) < 1 THEN
    RAISE EXCEPTION 'At least one name is required';
  END IF;

  -- Insert the primary record (first name in the array)
  INSERT INTO public.rsvps (
    name,
    primary_rsvp_id,
    attending,
    accommodation,
    drink_choice,
    custom_drink,
    dietary_restrictions,
    message
  )
  VALUES (
    names[1],
    NULL,
    attending,
    accommodation,
    "drinkChoice",
    "customDrink",
    "dietaryRestrictions",
    message
  )
  RETURNING id INTO v_primary_id;

  -- Insert additional guest records (if any)
  -- Copy all values from the primary record to additional guests
  IF array_length(names, 1) > 1 THEN
    FOR i IN 2..array_length(names, 1) LOOP
      INSERT INTO public.rsvps (
        name,
        primary_rsvp_id,
        attending,
        accommodation,
        drink_choice,
        custom_drink,
        dietary_restrictions,
        message
      )
      VALUES (
        names[i],
        v_primary_id,
        attending,
        accommodation,
        "drinkChoice",
        "customDrink",
        "dietaryRestrictions",
        message
      );
    END LOOP;
  END IF;

  -- Return the primary record ID
  RETURN v_primary_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- Grant execute permission to public (anon users)
GRANT EXECUTE ON FUNCTION public.submit_rsvp TO anon;

-- Add comments
COMMENT ON TABLE public.rsvps IS 'Wedding RSVP responses - each guest has their own row with duplicate form data. Additional guests reference the primary submission via primary_rsvp_id.';
COMMENT ON COLUMN public.rsvps.primary_rsvp_id IS 'NULL for primary guest, references primary guest ID for additional guests in the same submission';
COMMENT ON VIEW public.rsvp_submissions IS 'View showing each attendee as a separate row. Includes attendee_id, attendee_name, primary_rsvp_id (pointer to primary), and is_primary flag.';
COMMENT ON FUNCTION public.submit_rsvp IS 'Submit an RSVP with multiple names. Creates one primary record and additional guest records with duplicated form data. Returns the primary record ID.';
