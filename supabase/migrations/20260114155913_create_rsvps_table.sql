-- Create RSVP table for wedding guest responses
-- Each guest gets their own row, with additional guests referencing the primary submission
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Guest information
  name TEXT NOT NULL CHECK (LENGTH(name) >= 2),

  -- Reference to primary submission (NULL for primary guest, UUID for additional guests)
  primary_rsvp_id UUID REFERENCES public.rsvps(id) ON DELETE CASCADE,

  -- Attendance (only stored on primary record)
  attending TEXT CHECK (attending IN ('yes', 'no')),

  -- Accommodation (only stored on primary record, required if attending = 'yes')
  accommodation TEXT CHECK (
    accommodation IS NULL OR
    accommodation IN ('roof', 'own-tent', 'no-sleep')
  ),

  -- Drink preferences (only stored on primary record, required if attending = 'yes')
  drink_choice TEXT CHECK (
    drink_choice IS NULL OR
    drink_choice IN ('pivo', 'vino', 'nealko', 'other')
  ),

  -- Custom drink specification (only stored on primary record, required if drink_choice = 'other')
  custom_drink TEXT CHECK (
    custom_drink IS NULL OR
    (LENGTH(custom_drink) > 0 AND LENGTH(custom_drink) <= 100)
  ),

  -- Dietary restrictions (only stored on primary record, optional)
  dietary_restrictions TEXT CHECK (
    dietary_restrictions IS NULL OR
    LENGTH(dietary_restrictions) <= 500
  ),

  -- General message (only stored on primary record, optional)
  message TEXT CHECK (
    message IS NULL OR
    LENGTH(message) <= 1000
  ),

  -- Ensure primary records have attending filled, and additional guests don't
  CONSTRAINT primary_record_has_attending CHECK (
    (primary_rsvp_id IS NULL AND attending IS NOT NULL) OR
    (primary_rsvp_id IS NOT NULL AND attending IS NULL)
  ),

  -- Ensure accommodation and drink_choice are filled when attending = 'yes'
  CONSTRAINT attending_fields_required CHECK (
    primary_rsvp_id IS NOT NULL OR -- Skip for additional guests
    attending = 'no' OR
    (attending = 'yes' AND accommodation IS NOT NULL AND drink_choice IS NOT NULL)
  ),

  -- Ensure custom_drink is filled when drink_choice = 'other'
  CONSTRAINT custom_drink_required CHECK (
    drink_choice != 'other' OR
    (drink_choice = 'other' AND custom_drink IS NOT NULL AND LENGTH(TRIM(custom_drink)) > 0)
  ),

  -- Ensure additional guests don't have response fields
  CONSTRAINT additional_guest_no_responses CHECK (
    primary_rsvp_id IS NULL OR
    (accommodation IS NULL AND drink_choice IS NULL AND custom_drink IS NULL
     AND dietary_restrictions IS NULL AND message IS NULL)
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

-- Create a view to easily get primary submissions with their additional guests
CREATE VIEW public.rsvp_submissions
WITH (security_invoker = true)
AS
SELECT
  p.id,
  p.created_at,
  p.name AS primary_name,
  p.attending,
  p.accommodation,
  p.drink_choice,
  p.custom_drink,
  p.dietary_restrictions,
  p.message,
  COALESCE(
    json_agg(
      json_build_object('id', a.id, 'name', a.name)
      ORDER BY a.created_at
    ) FILTER (WHERE a.id IS NOT NULL),
    '[]'::json
  ) AS additional_guests
FROM public.rsvps p
LEFT JOIN public.rsvps a ON a.primary_rsvp_id = p.id
WHERE p.primary_rsvp_id IS NULL
GROUP BY p.id, p.created_at, p.name, p.attending,
         p.accommodation, p.drink_choice, p.custom_drink,
         p.dietary_restrictions, p.message;

-- Create function to submit RSVP with multiple names
-- This function takes the form data and creates one row per name,
-- with the first name being the primary record and others referencing it
CREATE OR REPLACE FUNCTION public.submit_rsvp(
  p_names TEXT[],
  p_attending TEXT,
  p_accommodation TEXT DEFAULT NULL,
  p_drink_choice TEXT DEFAULT NULL,
  p_custom_drink TEXT DEFAULT NULL,
  p_dietary_restrictions TEXT DEFAULT NULL,
  p_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_primary_id UUID;
  v_name TEXT;
BEGIN
  -- Validate that we have at least one name
  IF array_length(p_names, 1) IS NULL OR array_length(p_names, 1) < 1 THEN
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
    p_names[1],
    NULL,
    p_attending,
    p_accommodation,
    p_drink_choice,
    p_custom_drink,
    p_dietary_restrictions,
    p_message
  )
  RETURNING id INTO v_primary_id;

  -- Insert additional guest records (if any)
  IF array_length(p_names, 1) > 1 THEN
    FOR i IN 2..array_length(p_names, 1) LOOP
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
        p_names[i],
        v_primary_id,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
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
COMMENT ON TABLE public.rsvps IS 'Wedding RSVP responses - each guest has their own row, with additional guests referencing the primary submission';
COMMENT ON COLUMN public.rsvps.primary_rsvp_id IS 'NULL for primary guest, references primary guest ID for additional guests in the same submission';
COMMENT ON VIEW public.rsvp_submissions IS 'View of primary RSVP submissions with their additional guests aggregated';
COMMENT ON FUNCTION public.submit_rsvp IS 'Submit an RSVP with multiple names. Creates one primary record and additional guest records as needed. Returns the primary record ID.';
