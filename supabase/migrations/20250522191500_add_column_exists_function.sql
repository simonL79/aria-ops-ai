
-- Create a function to safely check if a column exists in a table
CREATE OR REPLACE FUNCTION public.column_exists(p_table_name TEXT, p_column_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  column_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = p_table_name
      AND column_name = p_column_name
  ) INTO column_exists;
  
  RETURN column_exists;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.column_exists TO authenticated;
GRANT EXECUTE ON FUNCTION public.column_exists TO anon;
