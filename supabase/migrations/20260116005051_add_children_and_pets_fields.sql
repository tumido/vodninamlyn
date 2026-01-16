-- Add children_count and pets_count columns to rsvps table
ALTER TABLE public.rsvps
ADD COLUMN children_count INTEGER DEFAULT 0 CHECK (children_count >= 0 AND children_count <= 99),
ADD COLUMN pets_count INTEGER DEFAULT 0 CHECK (pets_count >= 0 AND pets_count <= 99);

-- Update the rsvp_submissions view to include the new columns
DROP VIEW IF EXISTS public.rsvp_submissions;

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
  r.children_count AS "childrenCount",
  r.pets_count AS "petsCount",
  r.message,
  (r.primary_rsvp_id IS NULL) AS is_primary
FROM public.rsvps r
LEFT JOIN public.rsvps p ON p.id = COALESCE(r.primary_rsvp_id, r.id)
WHERE p.primary_rsvp_id IS NULL
ORDER BY
  COALESCE(r.primary_rsvp_id, r.id) DESC,  -- Group by primary RSVP
  (r.primary_rsvp_id IS NULL) DESC,        -- Primary guest first within each group
  r.created_at ASC;                        -- Then by creation time within group

-- Update the submit_rsvp function to accept children_count and pets_count
DROP FUNCTION IF EXISTS public.submit_rsvp(TEXT[], TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.submit_rsvp(
  names TEXT[],
  attending TEXT,
  accommodation TEXT DEFAULT NULL,
  "drinkChoice" TEXT DEFAULT NULL,
  "customDrink" TEXT DEFAULT NULL,
  "dietaryRestrictions" TEXT DEFAULT NULL,
  "childrenCount" INTEGER DEFAULT 0,
  "petsCount" INTEGER DEFAULT 0,
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
    children_count,
    pets_count,
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
    "childrenCount",
    "petsCount",
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
        children_count,
        pets_count,
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
        "childrenCount",
        "petsCount",
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
COMMENT ON COLUMN public.rsvps.children_count IS 'Number of children attending (0-99)';
COMMENT ON COLUMN public.rsvps.pets_count IS 'Number of pets attending (0-99)';
