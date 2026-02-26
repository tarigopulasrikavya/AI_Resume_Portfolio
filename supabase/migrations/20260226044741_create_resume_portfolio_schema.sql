/*
  # AI Resume & Portfolio Builder Schema

  ## Overview
  This migration creates the complete database schema for an AI-powered resume and portfolio builder application.

  ## New Tables
  
  ### 1. `profiles`
  User profile information including:
  - `id` (uuid, primary key) - References auth.users
  - `full_name` (text) - User's full name
  - `email` (text) - Contact email
  - `phone` (text) - Contact phone number
  - `location` (text) - City, State/Country
  - `title` (text) - Professional title/headline
  - `bio` (text) - Professional summary/bio
  - `website` (text) - Personal website URL
  - `linkedin` (text) - LinkedIn profile URL
  - `github` (text) - GitHub profile URL
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `work_experience`
  Work history entries:
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles
  - `company` (text) - Company name
  - `position` (text) - Job title
  - `location` (text) - Job location
  - `start_date` (date) - Start date
  - `end_date` (date, nullable) - End date (null for current)
  - `description` (text) - Job description and achievements
  - `is_current` (boolean) - Whether this is current position
  - `display_order` (integer) - Order in resume
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `education`
  Educational background:
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles
  - `institution` (text) - School/university name
  - `degree` (text) - Degree type (BS, MS, PhD, etc.)
  - `field_of_study` (text) - Major/field
  - `location` (text) - Institution location
  - `start_date` (date) - Start date
  - `end_date` (date, nullable) - End date
  - `gpa` (text, nullable) - GPA if included
  - `description` (text) - Additional details, honors
  - `display_order` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `skills`
  User skills organized by category:
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles
  - `name` (text) - Skill name
  - `category` (text) - Category (e.g., "Programming", "Design")
  - `proficiency` (text) - Proficiency level (Beginner, Intermediate, Advanced, Expert)
  - `display_order` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. `projects`
  Portfolio projects:
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles
  - `title` (text) - Project title
  - `description` (text) - Project description
  - `technologies` (text[]) - Array of technologies used
  - `url` (text, nullable) - Live project URL
  - `github_url` (text, nullable) - GitHub repository URL
  - `image_url` (text, nullable) - Project screenshot/image
  - `start_date` (date, nullable)
  - `end_date` (date, nullable)
  - `is_featured` (boolean) - Whether to feature prominently
  - `display_order` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. `resume_settings`
  User preferences for resume display:
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References profiles
  - `theme` (text) - Color theme preference
  - `font` (text) - Font preference
  - `section_order` (jsonb) - Custom section ordering
  - `show_photo` (boolean) - Whether to show profile photo
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  
  All tables have Row Level Security (RLS) enabled with the following policies:
  - Users can view only their own data
  - Users can insert their own data
  - Users can update their own data
  - Users can delete their own data
  - All policies require authentication
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  location text DEFAULT '',
  title text DEFAULT '',
  bio text DEFAULT '',
  website text DEFAULT '',
  linkedin text DEFAULT '',
  github text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Create work_experience table
CREATE TABLE IF NOT EXISTS work_experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company text NOT NULL DEFAULT '',
  position text NOT NULL DEFAULT '',
  location text DEFAULT '',
  start_date date,
  end_date date,
  description text DEFAULT '',
  is_current boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own work experience"
  ON work_experience FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own work experience"
  ON work_experience FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own work experience"
  ON work_experience FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own work experience"
  ON work_experience FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  institution text NOT NULL DEFAULT '',
  degree text NOT NULL DEFAULT '',
  field_of_study text DEFAULT '',
  location text DEFAULT '',
  start_date date,
  end_date date,
  gpa text DEFAULT '',
  description text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own education"
  ON education FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own education"
  ON education FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own education"
  ON education FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own education"
  ON education FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  category text DEFAULT 'General',
  proficiency text DEFAULT 'Intermediate',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skills"
  ON skills FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON skills FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  technologies text[] DEFAULT '{}',
  url text DEFAULT '',
  github_url text DEFAULT '',
  image_url text DEFAULT '',
  start_date date,
  end_date date,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create resume_settings table
CREATE TABLE IF NOT EXISTS resume_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  theme text DEFAULT 'professional',
  font text DEFAULT 'inter',
  section_order jsonb DEFAULT '["experience", "education", "skills", "projects"]'::jsonb,
  show_photo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resume_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resume settings"
  ON resume_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resume settings"
  ON resume_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resume settings"
  ON resume_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resume settings"
  ON resume_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS work_experience_user_id_idx ON work_experience(user_id);
CREATE INDEX IF NOT EXISTS education_user_id_idx ON education(user_id);
CREATE INDEX IF NOT EXISTS skills_user_id_idx ON skills(user_id);
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
CREATE INDEX IF NOT EXISTS resume_settings_user_id_idx ON resume_settings(user_id);