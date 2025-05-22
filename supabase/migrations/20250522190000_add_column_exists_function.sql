
-- Add a function to check if a column exists in a table
CREATE OR REPLACE FUNCTION public.column_exists(table_name text, column_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  column_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = $1
      AND column_name = $2
  ) INTO column_exists;
  
  RETURN column_exists;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.column_exists TO anon;
GRANT EXECUTE ON FUNCTION public.column_exists TO authenticated;
GRANT EXECUTE ON FUNCTION public.column_exists TO service_role;
