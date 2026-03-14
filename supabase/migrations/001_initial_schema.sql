-- RegWatch Initial Schema
-- Creates the core tables for profiles, compliance_items, reminders, and compliance_rules

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
-- Stores business profile information collected during onboarding
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  business_type TEXT CHECK (business_type IN ('sole_trader', 'partnership', 'company', 'trust', 'cooperative')),
  state TEXT CHECK (state IN ('NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT')),
  industry TEXT CHECK (industry IN (
    'retail', 'hospitality', 'construction', 'professional_services',
    'healthcare', 'education', 'technology', 'agriculture',
    'manufacturing', 'transport', 'finance', 'real_estate', 'other'
  )),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance items table
-- Stores user's tracked compliance obligations
CREATE TABLE IF NOT EXISTS compliance_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('once', 'weekly', 'fortnightly', 'monthly', 'quarterly', 'annually')),
  category TEXT NOT NULL CHECK (category IN (
    'taxation', 'employment', 'safety', 'environmental',
    'consumer', 'financial', 'licensing', 'privacy', 'other'
  )),
  is_custom BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders table
-- Tracks when reminders should be sent for compliance items
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES compliance_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_date DATE NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  type TEXT NOT NULL DEFAULT 'email' CHECK (type IN ('email', 'push')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance rules seed table
-- Pre-populated with Australian regulatory deadlines
CREATE TABLE IF NOT EXISTS compliance_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'taxation', 'employment', 'safety', 'environmental',
    'consumer', 'financial', 'licensing', 'privacy', 'other'
  )),
  frequency TEXT NOT NULL CHECK (frequency IN ('once', 'weekly', 'fortnightly', 'monthly', 'quarterly', 'annually')),
  business_types TEXT[] NOT NULL DEFAULT '{}',
  states TEXT[] DEFAULT '{}',
  industries TEXT[] DEFAULT '{}',
  default_due_date TEXT,
  authority TEXT,
  reference_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_compliance_items_user_id ON compliance_items(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_items_due_date ON compliance_items(due_date);
CREATE INDEX IF NOT EXISTS idx_compliance_items_completed ON compliance_items(completed);
CREATE INDEX IF NOT EXISTS idx_reminders_item_id ON reminders(item_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_reminder_date ON reminders(reminder_date);
CREATE INDEX IF NOT EXISTS idx_reminders_sent ON reminders(sent);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_items_updated_at
  BEFORE UPDATE ON compliance_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
