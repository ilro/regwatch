-- RegWatch Row Level Security Policies
-- Ensures users can only access their own data

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_rules ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- Compliance items policies
-- Users can view their own compliance items
CREATE POLICY "Users can view own compliance items"
  ON compliance_items FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own compliance items
CREATE POLICY "Users can insert own compliance items"
  ON compliance_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own compliance items
CREATE POLICY "Users can update own compliance items"
  ON compliance_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own compliance items
CREATE POLICY "Users can delete own compliance items"
  ON compliance_items FOR DELETE
  USING (auth.uid() = user_id);

-- Reminders policies
-- Users can view their own reminders
CREATE POLICY "Users can view own reminders"
  ON reminders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own reminders
CREATE POLICY "Users can insert own reminders"
  ON reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reminders
CREATE POLICY "Users can update own reminders"
  ON reminders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reminders
CREATE POLICY "Users can delete own reminders"
  ON reminders FOR DELETE
  USING (auth.uid() = user_id);

-- Compliance rules policies
-- All authenticated users can view compliance rules (read-only seed data)
CREATE POLICY "Authenticated users can view compliance rules"
  ON compliance_rules FOR SELECT
  TO authenticated
  USING (TRUE);

-- No insert/update/delete for compliance rules (managed by migrations only)
