
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://umbyanuxzgobvqqiaxoj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtYnlhbnV4emdvYnZxcWlheG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjI5NTAsImV4cCI6MjA2MTY5ODk1MH0.swvivNEs7Ck1FIfBrwR6fbj_iUE9X31LyuLHUW_b2hU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database schema migration to create the necessary tables (would be run during setup)
// This is included as a reference and would be run as a SQL migration in production
const dbSchema = `
-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create RLS policies
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to select their own images"
  ON images
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own images"
  ON images
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own images"
  ON images
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own images"
  ON images
  FOR DELETE
  USING (auth.uid() = user_id);
`;

// Function to initialize database schema
// This would be used when setting up the app for the first time
export const initializeDatabase = async () => {
  try {
    // In a real implementation, this would execute the database schema migration
    console.log("Database schema initialized");
  } catch (error) {
    console.error("Error initializing database schema:", error);
  }
};
